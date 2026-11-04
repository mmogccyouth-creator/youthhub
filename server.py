from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
import base64
from http.cookies import CookieError, SimpleCookie
from decimal import Decimal, InvalidOperation
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen

try:
    import psycopg
    from psycopg.rows import dict_row
except ImportError:
    psycopg = None
    dict_row = None

APP_DIR = Path(__file__).resolve().parent
ROOT_DIR = APP_DIR
DATABASE_URL = os.environ.get('DATABASE_URL', '').strip()
DATABASE_PATH = os.environ.get('DATABASE_PATH', '').strip()
DB_FILE = (
    Path(DATABASE_PATH).expanduser()
    if DATABASE_PATH
    else APP_DIR / 'mmogcc_youth.db'
)
PAYSTACK_API_URL = 'https://api.paystack.co'
PAYMENT_CURRENCY = 'GHS'
ADMIN_SESSION_COOKIE = 'mmogcc_admin_session'
MEMBER_SESSION_COOKIE = 'mmogcc_member_session'
ADMIN_SESSION_MAX_AGE = 8 * 60 * 60
MEMBER_SESSION_MAX_AGE = 30 * 24 * 60 * 60
MEMBER_PASSWORD_ITERATIONS = 310_000


class DatabaseConnection:
    def __init__(self, connection, is_postgres):
        self.connection = connection
        self.is_postgres = is_postgres
        self.write_transaction = False

    def execute(self, query, parameters=()):
        if self.is_postgres:
            query = query.replace('?', '%s')
            if self.write_transaction and query.strip() == 'SELECT payload FROM app_state WHERE id = 1':
                query += ' FOR UPDATE'
        return self.connection.execute(query, parameters)

    def commit(self):
        self.connection.commit()
        self.write_transaction = False

    def rollback(self):
        self.connection.rollback()
        self.write_transaction = False

    def close(self):
        self.connection.close()


def get_connection():
    if DATABASE_URL:
        if psycopg is None:
            raise RuntimeError('PostgreSQL support is unavailable. Install the psycopg dependency.')
        connection = psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
            connect_timeout=10,
        )
        return DatabaseConnection(connection, is_postgres=True)

    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row
    return DatabaseConnection(connection, is_postgres=False)


def begin_write(conn):
    conn.execute('BEGIN' if conn.is_postgres else 'BEGIN IMMEDIATE')
    conn.write_transaction = True


def database_errors():
    errors = [sqlite3.Error]
    if psycopg is not None:
        errors.append(psycopg.Error)
    return tuple(errors)


def payment_matches(payment, data, reference):
    customer = data.get('customer')
    return (
        data.get('status') == 'success'
        and data.get('reference') == reference
        and data.get('amount') == payment['amount']
        and data.get('currency') == payment['currency']
        and isinstance(customer, dict)
        and str(customer.get('email', '')).strip().lower() == payment['member_email']
    )


DEFAULT_STATE = {
    'events': [
        {
            'title': 'MMOGCC YOUTH Clean-Up Drive',
            'date': '2026-11-14',
            'venue': 'MMOGCC YOUTH Community Park',
            'category': 'Outreach',
            'description': 'Join us for a neighborhood cleanup and MMOGCC YOUTH awareness campaign.',
            'poster': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
            'capacity': 40,
        },
        {
            'title': 'MMOGCC YOUTH Leadership & Public Speaking Workshop',
            'date': '2026-11-21',
            'venue': 'MMOGCC YOUTH Center',
            'category': 'Workshop',
            'description': 'An interactive session on confidence-building, public speaking, and service leadership.',
            'poster': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
            'capacity': 30,
        },
        {
            'title': 'MMOGCC YOUTH Career Mentorship Meetup',
            'date': '2026-12-05',
            'venue': 'MMOGCC YOUTH Innovation Hub',
            'category': 'Training',
            'description': 'Connect with mentors and learn practical career pathways for young adults within MMOGCC YOUTH.',
            'poster': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
            'capacity': 24,
        },
    ],
    'gallery': [
        {
            'title': 'MMOGCC YOUTH Training Session',
            'category': 'Training',
            'image': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        },
        {
            'title': 'MMOGCC YOUTH Outreach Mission',
            'category': 'Outreach',
            'image': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
        },
        {
            'title': 'MMOGCC YOUTH Creative Workshop',
            'category': 'Workshop',
            'image': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        },
        {
            'title': 'MMOGCC YOUTH Talent Showcase Night',
            'category': 'Social',
            'image': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
        },
    ],
    'members': [
        {
            'name': 'Sarah Mantey',
            'role': 'MMOGCC YOUTH Program Lead',
            'engagement': '96%',
            'status': 'Active',
        },
        {
            'name': 'James Owusu',
            'role': 'MMOGCC YOUTH Volunteer Coordinator',
            'engagement': '89%',
            'status': 'Active',
        },
        {
            'name': 'Amina Salifu',
            'role': 'MMOGCC YOUTH Media & Outreach',
            'engagement': '83%',
            'status': 'Pending',
        },
        {
            'name': 'Daniel Koduah',
            'role': 'MMOGCC YOUTH Mentor',
            'engagement': '74%',
            'status': 'Review',
        },
    ],
    'announcements': [
        {
            'title': 'MMOGCC YOUTH council meeting rescheduled',
            'summary': 'The MMOGCC YOUTH council meeting has moved to Thursday at 4:00 PM to allow wider participation across the organization.',
            'tone': 'Update',
        },
        {
            'title': 'Volunteer recruitment open',
            'summary': 'Applications for MMOGCC YOUTH outreach volunteers are now open for the next community drive.',
            'tone': 'Call to action',
        },
        {
            'title': 'Scholarship opportunity shared',
            'summary': 'A new scholarship support desk is available for members seeking career guidance and formation support within MMOGCC YOUTH.',
            'tone': 'Support',
        },
    ],
    'executives': [
        {
            'name': 'Grace Wiafe',
            'role': 'MMOGCC YOUTH Chair',
            'focus': 'Leadership',
            'quote': 'Empowering every MMOGCC YOUTH member to lead with faith and purpose.',
            'initials': 'GW',
        },
        {
            'name': 'Kevin Tetteh',
            'role': 'MMOGCC YOUTH Programs Director',
            'focus': 'Impact',
            'quote': 'Strong programs create lasting transformation in our MMOGCC YOUTH community.',
            'initials': 'KT',
        },
        {
            'name': 'Lilian Mensah',
            'role': 'MMOGCC YOUTH Community Relations Lead',
            'focus': 'Engagement',
            'quote': 'Every voice deserves a seat at the table in MMOGCC YOUTH.',
            'initials': 'LM',
        },
    ],
    'activities': [],
    'eventRegistrations': [],
    'memberAccounts': [],
    'volunteerShifts': [],
    'shiftSignups': [],
    'interestGroups': [
        {'id': 'worship', 'name': 'Worship & Music', 'description': 'Use music and prayer to bring the community together.'},
        {'id': 'outreach', 'name': 'Outreach & Service', 'description': 'Turn compassion into practical care for our neighbors.'},
        {'id': 'media', 'name': 'Media & Creative Arts', 'description': 'Tell the story of youth life through design, photos, and video.'},
        {'id': 'formation', 'name': 'Faith & Formation', 'description': 'Grow in faith through reflection, discussion, and shared learning.'},
        {'id': 'leadership', 'name': 'Leadership & Mentorship', 'description': 'Build confidence and help other young people find their path.'},
        {'id': 'sports', 'name': 'Sports & Fellowship', 'description': 'Build friendships through games, movement, and friendly competition.'},
    ],
    'groupInterestRequests': [],
    'prayerRequests': [],
    'photoSubmissions': [],
    'serviceLogs': [],
    'milestones': [],
    'spotlight': None,
}


def ensure_storage():
    if not DATABASE_URL:
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    conn.execute(
        'CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id = 1), payload TEXT NOT NULL)'
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS dues_payments (
            reference TEXT PRIMARY KEY,
            member_name TEXT NOT NULL,
            member_email TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            status TEXT NOT NULL,
            paid_at TEXT
        )
        '''
    )
    row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
    if row is None:
        conn.execute(
            'INSERT INTO app_state(id, payload) VALUES (1, ?) ON CONFLICT(id) DO NOTHING',
            (json.dumps(DEFAULT_STATE),),
        )
    conn.commit()
    conn.close()


def load_state():
    conn = get_connection()
    row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
    conn.close()

    if row is None:
        return json.loads(json.dumps(DEFAULT_STATE))

    try:
        stored_state = json.loads(row['payload'])
    except Exception:
        return json.loads(json.dumps(DEFAULT_STATE))

    state = json.loads(json.dumps(DEFAULT_STATE))
    if isinstance(stored_state, dict):
        state.update(stored_state)
    for event in state.get('events', []):
        if isinstance(event, dict) and not isinstance(event.get('capacity'), int):
            event['capacity'] = 40
    return state


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def end_headers(self):
        if urlsplit(self.path).path in ('/', '/index.html', '/styles.css'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_GET(self):
        parsed = urlsplit(self.path)
        path = parsed.path

        if self._is_private_database_path(path):
            self.send_error(404)
            return

        if path == '/api/health':
            self._send_json(200, {'status': 'ok'})
            return

        if path == '/api/admin/session':
            self._send_json(200, {'authenticated': self._is_admin_authenticated()})
            return

        if path == '/api/members/session':
            email = self._get_member_email()
            member = next(
                (item for item in load_state().get('members', [])
                 if str(item.get('email', '')).strip().lower() == email),
                None,
            ) if email else None
            self._send_json(200, {'authenticated': member is not None, 'member': member})
            return

        if path == '/api/state':
            state = load_state()
            registrations = state.get('eventRegistrations', [])
            event_counts = {}
            if isinstance(registrations, list):
                for registration in registrations:
                    if not isinstance(registration, dict):
                        continue
                    title = registration.get('eventTitle')
                    date = registration.get('eventDate')
                    venue = registration.get('eventVenue')
                    if not all(isinstance(value, str) for value in (title, date, venue)):
                        continue
                    key = (
                        title,
                        date,
                        venue,
                    )
                    bucket = event_counts.setdefault(key, {'attendeeCount': 0, 'waitlistCount': 0})
                    status = registration.get('status', 'registered')
                    if status == 'waitlisted':
                        bucket['waitlistCount'] += 1
                    elif status == 'registered':
                        bucket['attendeeCount'] += 1
            state['eventRegistrationCounts'] = [
                {
                    'eventTitle': key[0],
                    'eventDate': key[1],
                    'eventVenue': key[2],
                    **counts,
                }
                for key, counts in event_counts.items()
            ]
            state['shiftSignupCounts'] = {
                shift.get('id'): sum(
                    1 for signup in state.get('shiftSignups', [])
                    if signup.get('shiftId') == shift.get('id') and signup.get('status') == 'booked'
                )
                for shift in state.get('volunteerShifts', [])
                if isinstance(shift, dict)
            }
            if not self._is_admin_authenticated():
                member_email = self._get_member_email()
                if member_email:
                    state['currentMember'] = next(
                        (member for member in state.get('members', [])
                         if str(member.get('email', '')).strip().lower() == member_email),
                        None,
                    )
                    state['memberRegistrations'] = [
                        {
                            **registration,
                            'hasCheckinPass': bool(registration.get('checkinTokenHash')),
                            'checkinTokenHash': None,
                        }
                        for registration in registrations
                        if str(registration.get('email', '')).strip().lower() == member_email
                    ]
                    state['memberServiceLogs'] = [
                        record for record in state.get('serviceLogs', [])
                        if str(record.get('memberEmail', '')).strip().lower() == member_email
                    ]
                    state['memberShiftSignups'] = [
                        signup for signup in state.get('shiftSignups', [])
                        if str(signup.get('email', '')).strip().lower() == member_email
                    ]
                for private_key in (
                    'members', 'activities', 'eventRegistrations', 'groupInterestRequests',
                    'prayerRequests', 'photoSubmissions', 'serviceLogs', 'shiftSignups',
                ):
                    state.pop(private_key, None)
            state.pop('memberAccounts', None)
            self._send_json(200, state)
            return

        if path == '/':
            self.path = '/index.html'

        return super().do_GET()

    def do_HEAD(self):
        path = urlsplit(self.path).path
        if self._is_private_database_path(path):
            self.send_error(404)
            return
        return super().do_HEAD()

    def do_POST(self):
        parsed = urlsplit(self.path)
        path = parsed.path

        if path == '/api/admin/login':
            self._handle_admin_login()
            return

        if path == '/api/admin/logout':
            self._handle_admin_logout()
            return

        if path == '/api/members/login':
            self._handle_member_login()
            return

        if path == '/api/members/logout':
            self._handle_member_logout()
            return

        if path == '/api/members/register':
            self._handle_member_registration()
            return

        if path == '/api/events/register':
            self._handle_event_registration()
            return

        if path == '/api/events/checkin':
            self._handle_event_checkin()
            return

        if path == '/api/events/cancel':
            self._handle_event_cancel()
            return

        if path == '/api/members/ticket':
            self._handle_member_ticket()
            return

        if path == '/api/shifts/signup':
            self._handle_shift_signup()
            return

        if path == '/api/prayer-requests':
            self._handle_prayer_request()
            return

        if path == '/api/group-interests':
            self._handle_group_interest()
            return

        if path == '/api/photos/submit':
            self._handle_photo_submission()
            return

        if path == '/api/state':
            self._handle_save_state()
            return

        if path == '/api/payments/initialize':
            self._handle_payment_initialize()
            return

        if path == '/api/payments/verify':
            self._handle_payment_verify()
            return

        if path == '/api/payments/webhook':
            self._handle_payment_webhook()
            return

        self._send_json(404, {'error': 'Not found.'})

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def log_message(self, format, *args):
        return

    def _is_private_database_path(self, path):
        filename = Path(unquote(path)).name
        database_names = {DB_FILE.name, 'mmogcc_youth.db'}
        return any(
            filename == name or filename.startswith(f'{name}-')
            for name in database_names
        )

    def _handle_save_state(self):
        if not self._require_admin():
            return

        payload = self._read_json_body(max_length=10_000_000)
        if payload is None:
            return

        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            current_state = (
                stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            )
            for key in (
                'events', 'gallery', 'members', 'announcements', 'executives', 'activities',
                'interestGroups', 'groupInterestRequests', 'prayerRequests', 'photoSubmissions',
                'serviceLogs', 'milestones', 'spotlight', 'volunteerShifts',
            ):
                if key in payload:
                    current_state[key] = payload[key]
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(current_state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Your changes could not be saved. Please try again.'})
            return
        finally:
            conn.close()
        self._send_json(200, {'status': 'saved'})

    def _append_public_state_record(self, collection, record, duplicate_fields=()):
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            state = stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            records = state.setdefault(collection, [])
            if not isinstance(records, list):
                records = []
                state[collection] = records
            if duplicate_fields and any(
                isinstance(existing, dict)
                and all(
                    str(existing.get(field, '')).strip().lower() == str(record.get(field, '')).strip().lower()
                    for field in duplicate_fields
                )
                for existing in records
            ):
                conn.rollback()
                self._send_json(409, {'error': 'This request has already been received.'})
                return
            records.insert(0, record)
            del records[500:]
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Your request could not be saved. Please try again.'})
            return
        finally:
            conn.close()
        self._send_json(201, {'status': 'received'})

    def _handle_prayer_request(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        name = payload.get('name', '')
        message = payload.get('message')
        if (
            not isinstance(name, str) or len(name.strip()) > 120
            or not isinstance(message, str) or not message.strip() or len(message.strip()) > 2000
        ):
            self._send_json(400, {'error': 'Please enter a prayer request under 2,000 characters.'})
            return
        self._append_public_state_record('prayerRequests', {
            'name': name.strip() or 'Anonymous',
            'message': message.strip(),
            'status': 'New',
            'submittedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        })

    def _handle_group_interest(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        name = payload.get('name')
        email = payload.get('email')
        group_id = payload.get('groupId')
        if (
            not isinstance(name, str) or not name.strip() or len(name.strip()) > 120
            or not isinstance(email, str) or len(email.strip()) > 254
            or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip())
            or not isinstance(group_id, str) or len(group_id) > 40
        ):
            self._send_json(400, {'error': 'Enter a valid name, email, and interest group.'})
            return
        state = load_state()
        group = next((item for item in state.get('interestGroups', []) if item.get('id') == group_id), None)
        if not group:
            self._send_json(400, {'error': 'Choose an available interest group.'})
            return
        self._append_public_state_record('groupInterestRequests', {
            'name': name.strip(),
            'email': email.strip().lower(),
            'groupId': group_id,
            'groupName': group['name'],
            'submittedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        }, duplicate_fields=('email', 'groupId'))

    def _handle_photo_submission(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        payload = self._read_json_body(max_length=1_500_000)
        if payload is None:
            return
        title = payload.get('title')
        category = payload.get('category')
        image = payload.get('image')
        allowed_categories = ('Training', 'Outreach', 'Workshop', 'Social')
        data_url = re.fullmatch(r'data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})', image or '') if isinstance(image, str) else None
        if (
            not isinstance(title, str) or not title.strip() or len(title.strip()) > 120
            or category not in allowed_categories
            or not data_url or len(image) > 1_400_000
        ):
            self._send_json(400, {'error': 'Choose a caption, category, and a compressed JPEG, PNG, or WebP photo under 1 MB.'})
            return
        try:
            image_bytes = base64.b64decode(data_url.group(2), validate=True)
        except (ValueError, base64.binascii.Error):
            self._send_json(400, {'error': 'The photo file is invalid.'})
            return
        valid_signature = (
            (data_url.group(1) == 'jpeg' and image_bytes.startswith(b'\xff\xd8\xff'))
            or (data_url.group(1) == 'png' and image_bytes.startswith(b'\x89PNG\r\n\x1a\n'))
            or (data_url.group(1) == 'webp' and image_bytes.startswith(b'RIFF') and image_bytes[8:12] == b'WEBP')
        )
        if not valid_signature or len(image_bytes) > 1_000_000:
            self._send_json(400, {'error': 'The photo must be a valid image under 1 MB.'})
            return
        self._append_public_state_record('photoSubmissions', {
            'id': secrets.token_hex(12),
            'title': title.strip(),
            'category': category,
            'image': image,
            'status': 'Pending',
            'submittedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        })

    def _admin_credentials(self):
        password = os.environ.get('ADMIN_PASSWORD', '').strip()
        session_secret = os.environ.get('ADMIN_SESSION_SECRET', '').strip()
        if len(password) < 12 or len(session_secret) < 32:
            return None, None
        return password, session_secret.encode('utf-8')

    def _request_is_same_origin(self):
        origin = self.headers.get('Origin', '')
        parsed_origin = urlsplit(origin)
        forwarded_proto = self.headers.get('X-Forwarded-Proto', '').split(',')[0].strip().lower()
        expected_scheme = 'https' if forwarded_proto == 'https' else 'http'
        host = self.headers.get('Host', '').strip().lower()
        return (
            parsed_origin.scheme == expected_scheme
            and parsed_origin.netloc.lower() == host
            and not parsed_origin.path
            and not parsed_origin.query
            and not parsed_origin.fragment
        )

    def _admin_session_signature(self, expires_at, password, secret):
        message = f'admin:{expires_at}:{password}'.encode('utf-8')
        return hmac.new(secret, message, hashlib.sha256).hexdigest()

    def _member_session_secret(self):
        secret = os.environ.get('ADMIN_SESSION_SECRET', '').strip().encode('utf-8')
        return secret if len(secret) >= 32 else None

    def _member_session_signature(self, expires_at, email, secret):
        message = f'member:{expires_at}:{email}'.encode('utf-8')
        return hmac.new(secret, message, hashlib.sha256).hexdigest()

    def _get_member_email(self):
        secret = self._member_session_secret()
        if secret is None:
            return None
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
        except CookieError:
            return None
        morsel = cookie.get(MEMBER_SESSION_COOKIE)
        if morsel is None:
            return None
        try:
            expiry_text, encoded_email, signature = morsel.value.split('.', 2)
            expires_at = int(expiry_text)
            email = bytes.fromhex(encoded_email).decode('utf-8')
        except (ValueError, UnicodeDecodeError, base64.binascii.Error):
            return None
        if (
            expires_at <= int(time.time())
            or expires_at > int(time.time()) + MEMBER_SESSION_MAX_AGE
            or not re.fullmatch(r'[a-f0-9]{64}', signature)
            or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email)
        ):
            return None
        expected = self._member_session_signature(expires_at, email, secret)
        if not hmac.compare_digest(signature, expected):
            return None
        accounts = load_state().get('memberAccounts', [])
        return email if any(account.get('email') == email for account in accounts) else None

    def _member_session_cookie(self, email, clear=False):
        forwarded_proto = self.headers.get('X-Forwarded-Proto', '').split(',')[0].strip().lower()
        if clear:
            cookie = f'{MEMBER_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
        else:
            expires_at = int(time.time()) + MEMBER_SESSION_MAX_AGE
            encoded_email = email.encode('utf-8').hex()
            signature = self._member_session_signature(expires_at, email, self._member_session_secret())
            token = f'{expires_at}.{encoded_email}.{signature}'
            cookie = f'{MEMBER_SESSION_COOKIE}={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age={MEMBER_SESSION_MAX_AGE}'
        if forwarded_proto == 'https':
            cookie += '; Secure'
        return cookie

    def _handle_member_login(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        if self._member_session_secret() is None:
            self._send_json(503, {'error': 'Member sign-in is not configured.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        email = payload.get('email')
        password = payload.get('password')
        if (
            not isinstance(email, str) or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip())
            or not isinstance(password, str) or len(password) > 128
        ):
            self._send_json(400, {'error': 'Enter your email and password.'})
            return
        email = email.strip().lower()
        accounts = load_state().get('memberAccounts', [])
        account = next((item for item in accounts if item.get('email') == email), None)
        actual_hash = hashlib.pbkdf2_hmac(
            'sha256', password.encode('utf-8'),
            bytes.fromhex(account['salt']) if account else b'\0' * 16,
            MEMBER_PASSWORD_ITERATIONS,
        ).hex()
        expected_hash = account.get('passwordHash', '0' * 64) if account else '0' * 64
        if not hmac.compare_digest(actual_hash, expected_hash):
            self._send_json(401, {'error': 'Email or password is incorrect.'})
            return
        member = next(
            (item for item in load_state().get('members', []) if item.get('email') == email),
            None,
        )
        if member is None:
            self._send_json(401, {'error': 'Member account is unavailable. Contact an administrator.'})
            return
        self._send_json(200, {'status': 'ok', 'member': member}, {'Set-Cookie': self._member_session_cookie(email)})

    def _handle_member_logout(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        self._send_json(200, {'status': 'ok'}, {'Set-Cookie': self._member_session_cookie('', clear=True)})

    def _is_admin_authenticated(self):
        password, secret = self._admin_credentials()
        if password is None or secret is None:
            return False

        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
        except CookieError:
            return False
        morsel = cookie.get(ADMIN_SESSION_COOKIE)
        if morsel is None:
            return False

        try:
            expiry_text, signature = morsel.value.split('.', 1)
            expires_at = int(expiry_text)
        except (ValueError, TypeError):
            return False
        if (
            not re.fullmatch(r'[a-f0-9]{64}', signature)
            or expires_at <= int(time.time())
            or expires_at > int(time.time()) + ADMIN_SESSION_MAX_AGE
        ):
            return False
        expected = self._admin_session_signature(expires_at, password, secret)
        return hmac.compare_digest(signature, expected)

    def _require_admin(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return False
        if not self._is_admin_authenticated():
            self._send_json(401, {'error': 'Administrator sign-in is required.'})
            return False
        return True

    def _handle_admin_login(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return

        password_configured, secret = self._admin_credentials()
        if password_configured is None or secret is None:
            self._send_json(
                503,
                {'error': 'Admin sign-in is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.'},
            )
            return

        payload = self._read_json_body()
        if payload is None:
            return
        username = payload.get('username')
        password = payload.get('password')
        if not isinstance(username, str) or not isinstance(password, str):
            self._send_json(400, {'error': 'Enter a valid username and password.'})
            return
        username_bytes = username.strip().lower().encode('utf-8')
        if not hmac.compare_digest(username_bytes, b'admin') or not hmac.compare_digest(
            password.encode('utf-8'), password_configured.encode('utf-8')
        ):
            self._send_json(401, {'error': 'Invalid login details.'})
            return

        expires_at = int(time.time()) + ADMIN_SESSION_MAX_AGE
        token = f'{expires_at}.{self._admin_session_signature(expires_at, password_configured, secret)}'
        forwarded_proto = self.headers.get('X-Forwarded-Proto', '').split(',')[0].strip().lower()
        cookie = (
            f'{ADMIN_SESSION_COOKIE}={token}; HttpOnly; SameSite=Lax; Path=/; '
            f'Max-Age={ADMIN_SESSION_MAX_AGE}'
        )
        if forwarded_proto == 'https':
            cookie += '; Secure'
        self._send_json(200, {'status': 'ok'}, {'Set-Cookie': cookie})

    def _handle_admin_logout(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return

        forwarded_proto = self.headers.get('X-Forwarded-Proto', '').split(',')[0].strip().lower()
        cookie = f'{ADMIN_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
        if forwarded_proto == 'https':
            cookie += '; Secure'
        self._send_json(200, {'status': 'ok'}, {'Set-Cookie': cookie})

    def _handle_member_registration(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return

        payload = self._read_json_body()
        if payload is None:
            return

        fields = {
            'name': 120,
            'email': 254,
            'role': 120,
            'dob': 10,
            'age': 3,
            'dayBornGroup': 12,
            'location': 120,
            'employmentStatus': 24,
            'employmentDetail': 120,
            'contact': 40,
            'emergencyContact': 40,
        }
        member = {}
        for field, max_length in fields.items():
            value = payload.get(field, '')
            if not isinstance(value, str) or len(value.strip()) > max_length:
                self._send_json(400, {'error': 'Please check the registration details and try again.'})
                return
            member[field] = value.strip()

        password = payload.get('password')
        if not isinstance(password, str) or len(password) < 12 or len(password) > 128:
            self._send_json(400, {'error': 'Choose an account password with at least 12 characters.'})
            return

        if (
            not member['name']
            or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', member['email'])
            or not member['role']
            or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', member['dob'])
            or not re.fullmatch(r'\d{1,3}', member['age'])
            or not 1 <= int(member['age']) <= 120
            or member['dayBornGroup'] not in (
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            )
            or not member['location']
            or member['employmentStatus'] not in ('Employed', 'Self-employed', 'Student', 'Unemployed')
            or not member['contact']
            or not member['emergencyContact']
            or (
                member['employmentStatus'] in ('Employed', 'Self-employed', 'Student')
                and not member['employmentDetail']
            )
        ):
            self._send_json(400, {'error': 'Please complete all required registration fields.'})
            return

        member.update({'engagement': 'New', 'status': 'Pending'})
        member['email'] = member['email'].lower()
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            state = stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            members = state.setdefault('members', [])
            if any(
                isinstance(existing, dict)
                and str(existing.get('email', '')).strip().lower() == member['email']
                for existing in members
            ):
                conn.rollback()
                self._send_json(409, {'error': 'This email address is already registered.'})
                return
            members.insert(0, member)
            salt = secrets.token_bytes(16)
            password_hash = hashlib.pbkdf2_hmac(
                'sha256', password.encode('utf-8'), salt, MEMBER_PASSWORD_ITERATIONS
            ).hex()
            state.setdefault('memberAccounts', []).append({
                'email': member['email'],
                'salt': salt.hex(),
                'passwordHash': password_hash,
                'createdAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            })
            state.setdefault('activities', []).insert(
                0,
                {
                    'memberName': member['name'],
                    'email': member['email'],
                    'action': 'Signed up',
                    'details': 'New membership registration completed.',
                    'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                },
            )
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Registration could not be saved. Please try again.'})
            return
        finally:
            conn.close()
        self._send_json(201, {'status': 'registered', 'member': member}, {
            'Set-Cookie': self._member_session_cookie(member['email']),
        })

    def _event_registration_key(self, title, date, venue):
        identity = '\0'.join((str(title), str(date), str(venue)))
        return hashlib.sha256(identity.encode('utf-8')).hexdigest()

    def _handle_event_registration(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return

        payload = self._read_json_body()
        if payload is None:
            return

        title = payload.get('eventTitle')
        date = payload.get('eventDate')
        venue = payload.get('eventVenue')
        name = payload.get('name')
        email = payload.get('email')
        if (
            not isinstance(title, str) or not title.strip() or len(title.strip()) > 160
            or not isinstance(date, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date)
            or not isinstance(venue, str) or not venue.strip() or len(venue.strip()) > 160
            or not isinstance(name, str) or not name.strip() or len(name.strip()) > 120
            or not isinstance(email, str) or len(email.strip()) > 254
            or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip())
        ):
            self._send_json(400, {'error': 'Please enter a valid name and email address.'})
            return

        title, venue, name = title.strip(), venue.strip(), name.strip()
        email = email.strip().lower()
        member_session_email = self._get_member_email()
        if member_session_email:
            authenticated_member = next(
                (item for item in load_state().get('members', [])
                 if str(item.get('email', '')).strip().lower() == member_session_email),
                None,
            )
            if authenticated_member:
                email = member_session_email
                name = authenticated_member.get('name', name)
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            state = stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            matching_event = next((
                item for item in state.get('events', [])
                if isinstance(item, dict)
                and item.get('title') == title
                and item.get('date') == date
                and item.get('venue') == venue
            ), None)
            if not matching_event:
                conn.rollback()
                self._send_json(404, {'error': 'This event is no longer available.'})
                return

            registrations = state.setdefault('eventRegistrations', [])
            if not isinstance(registrations, list):
                registrations = []
                state['eventRegistrations'] = registrations
            event_key = self._event_registration_key(title, date, venue)
            if any(
                isinstance(item, dict)
                and self._event_registration_key(
                    item.get('eventTitle', ''),
                    item.get('eventDate', ''),
                    item.get('eventVenue', ''),
                ) == event_key
                and str(item.get('email', '')).strip().lower() == email
                for item in registrations
            ):
                conn.rollback()
                self._send_json(409, {'error': 'This email is already registered for the event.'})
                return

            capacity = matching_event.get('capacity', 40)
            confirmed_count = sum(
                1 for item in registrations
                if isinstance(item, dict)
                and self._event_registration_key(
                    item.get('eventTitle', ''), item.get('eventDate', ''), item.get('eventVenue', '')
                ) == event_key
                and item.get('status', 'registered') == 'registered'
            )
            is_waitlisted = isinstance(capacity, int) and capacity > 0 and confirmed_count >= capacity
            checkin_token = secrets.token_urlsafe(24)
            registration = {
                'eventTitle': title,
                'eventDate': date,
                'eventVenue': venue,
                'name': name,
                'email': email,
                'registeredAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                'status': 'waitlisted' if is_waitlisted else 'registered',
                'checkinTokenHash': hashlib.sha256(checkin_token.encode('ascii')).hexdigest() if checkin_token else None,
            }
            registrations.append(registration)
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Event registration could not be saved. Please try again.'})
            return
        finally:
            conn.close()
        self._send_json(201, {
            'status': 'waitlisted' if is_waitlisted else 'registered',
            'checkinToken': checkin_token,
            'attendeeCount': sum(
                1 for item in registrations
                if isinstance(item, dict)
                and self._event_registration_key(
                    item.get('eventTitle', ''),
                    item.get('eventDate', ''),
                    item.get('eventVenue', ''),
                ) == event_key
                and item.get('status', 'registered') == 'registered'
            ),
            'waitlistPosition': sum(
                1 for item in registrations
                if isinstance(item, dict)
                and self._event_registration_key(
                    item.get('eventTitle', ''), item.get('eventDate', ''), item.get('eventVenue', '')
                ) == event_key
                and item.get('status') == 'waitlisted'
            ) if is_waitlisted else None,
        })

    def _handle_event_checkin(self):
        if not self._require_admin():
            return
        payload = self._read_json_body()
        if payload is None:
            return
        token = payload.get('token')
        if not isinstance(token, str) or not re.fullmatch(r'[A-Za-z0-9_-]{20,80}', token):
            self._send_json(400, {'error': 'Scan a valid event check-in QR code.'})
            return
        token_hash = hashlib.sha256(token.encode('ascii')).hexdigest()
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            state = stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            registration = next((item for item in state.get('eventRegistrations', [])
                                 if isinstance(item, dict) and item.get('checkinTokenHash') == token_hash), None)
            if not registration:
                conn.rollback()
                self._send_json(404, {'error': 'That check-in pass was not found.'})
                return
            if registration.get('status') != 'registered':
                conn.rollback()
                self._send_json(409, {'error': 'This attendee is not confirmed for the event.'})
                return
            if registration.get('checkedInAt'):
                conn.rollback()
                self._send_json(409, {'error': f"{registration['name']} has already checked in."})
                return
            registration['checkedInAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            state.setdefault('activities', []).insert(0, {
                'memberName': registration['name'],
                'email': registration['email'],
                'action': 'Checked in',
                'details': registration['eventTitle'],
                'timestamp': registration['checkedInAt'],
            })
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Check-in could not be saved.'})
            return
        finally:
            conn.close()
        self._send_json(200, {
            'status': 'checked-in',
            'name': registration['name'],
            'eventTitle': registration['eventTitle'],
        })

    def _handle_event_cancel(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        title, date, venue = payload.get('eventTitle'), payload.get('eventDate'), payload.get('eventVenue')
        member_email = self._get_member_email()
        is_admin = self._is_admin_authenticated()
        if not member_email and not is_admin:
            self._send_json(401, {'error': 'Member sign-in is required to cancel a booking.'})
            return
        email = member_email or payload.get('email')
        if (
            not isinstance(title, str) or not title.strip()
            or not isinstance(date, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date)
            or not isinstance(venue, str) or not venue.strip()
            or not isinstance(email, str) or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip())
        ):
            self._send_json(400, {'error': 'Choose a valid event registration to cancel.'})
            return
        event_key = self._event_registration_key(title.strip(), date, venue.strip())
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            state = json.loads(row['payload']) if row else json.loads(json.dumps(DEFAULT_STATE))
            registrations = state.get('eventRegistrations', [])
            registration = next((item for item in registrations
                                 if isinstance(item, dict)
                                 and item.get('email') == email.strip().lower()
                                 and item.get('status', 'registered') in ('registered', 'waitlisted')
                                 and self._event_registration_key(
                                     item.get('eventTitle', ''), item.get('eventDate', ''), item.get('eventVenue', '')
                                 ) == event_key), None)
            if not registration:
                conn.rollback()
                self._send_json(404, {'error': 'An active booking for this event was not found.'})
                return
            if registration.get('checkedInAt'):
                conn.rollback()
                self._send_json(409, {'error': 'This attendee has already checked in.'})
                return
            previous_status = registration.get('status', 'registered')
            registration['status'] = 'cancelled'
            registration['cancelledAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            promoted = None
            if previous_status == 'registered':
                promoted = next((item for item in registrations
                                 if isinstance(item, dict)
                                 and item.get('status') == 'waitlisted'
                                 and self._event_registration_key(
                                     item.get('eventTitle', ''), item.get('eventDate', ''), item.get('eventVenue', '')
                                 ) == event_key), None)
                if promoted:
                    promoted['status'] = 'registered'
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'The booking could not be cancelled.'})
            return
        finally:
            conn.close()
        self._send_json(200, {'status': 'cancelled', 'waitlistedAttendeePromoted': promoted is not None})

    def _handle_member_ticket(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        email = self._get_member_email()
        if not email:
            self._send_json(401, {'error': 'Member sign-in is required to retrieve a check-in pass.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        title, date, venue = payload.get('eventTitle'), payload.get('eventDate'), payload.get('eventVenue')
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            state = json.loads(row['payload']) if row else json.loads(json.dumps(DEFAULT_STATE))
            registration = next((item for item in state.get('eventRegistrations', [])
                                 if isinstance(item, dict) and item.get('email') == email
                                 and item.get('eventTitle') == title and item.get('eventDate') == date
                                 and item.get('eventVenue') == venue and item.get('status', 'registered') == 'registered'), None)
            if not registration:
                conn.rollback()
                self._send_json(404, {'error': 'A confirmed event booking was not found.'})
                return
            token = secrets.token_urlsafe(24)
            registration['checkinTokenHash'] = hashlib.sha256(token.encode('ascii')).hexdigest()
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'The check-in pass could not be created.'})
            return
        finally:
            conn.close()
        self._send_json(200, {'checkinToken': token})

    def _handle_shift_signup(self):
        if not self._request_is_same_origin():
            self._send_json(403, {'error': 'Request origin is not allowed.'})
            return
        payload = self._read_json_body()
        if payload is None:
            return
        shift_id = payload.get('shiftId')
        email = payload.get('email')
        name = payload.get('name')
        member_email = self._get_member_email()
        state = load_state()
        if member_email:
            email = member_email
            member = next((item for item in state.get('members', []) if item.get('email') == email), None)
            name = member.get('name') if member else name
        if (
            not isinstance(shift_id, str) or len(shift_id) > 60
            or not isinstance(email, str) or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip())
            or not isinstance(name, str) or not name.strip() or len(name.strip()) > 120
        ):
            self._send_json(400, {'error': 'Enter your name and email to join this shift.'})
            return
        shift = next((item for item in state.get('volunteerShifts', []) if item.get('id') == shift_id), None)
        if not shift:
            self._send_json(404, {'error': 'This volunteer shift is no longer available.'})
            return
        conn = get_connection()
        try:
            begin_write(conn)
            row = conn.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
            stored_state = json.loads(row['payload']) if row else None
            state = stored_state if isinstance(stored_state, dict) else json.loads(json.dumps(DEFAULT_STATE))
            current_shift = next(
                (item for item in state.get('volunteerShifts', []) if item.get('id') == shift_id),
                None,
            )
            if not current_shift:
                conn.rollback()
                self._send_json(404, {'error': 'This volunteer shift is no longer available.'})
                return
            signups = state.setdefault('shiftSignups', [])
            normalized_email = email.strip().lower()
            if any(item.get('shiftId') == shift_id and item.get('email') == normalized_email for item in signups):
                conn.rollback()
                self._send_json(409, {'error': 'You already joined this shift.'})
                return
            booked = sum(1 for item in signups if item.get('shiftId') == shift_id and item.get('status') == 'booked')
            status = 'waitlisted' if booked >= int(current_shift.get('capacity', 1)) else 'booked'
            signups.insert(0, {
                'shiftId': shift_id,
                'shiftTitle': shift.get('title'),
                'name': name.strip(),
                'email': normalized_email,
                'status': status,
                'signedUpAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            })
            conn.execute(
                'INSERT INTO app_state(id, payload) VALUES (1, ?) '
                'ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
                (json.dumps(state),),
            )
            conn.commit()
        except (*database_errors(), json.JSONDecodeError, TypeError):
            conn.rollback()
            self._send_json(500, {'error': 'Shift signup could not be saved.'})
            return
        finally:
            conn.close()
        self._send_json(201, {'status': status, 'shiftTitle': shift.get('title')})

    def _read_json_body(self, max_length=16384):
        try:
            length = int(self.headers.get('Content-Length', '0') or 0)
        except ValueError:
            self._send_json(400, {'error': 'Invalid request body.'})
            return None

        if length <= 0 or length > max_length:
            self._send_json(400, {'error': 'Invalid request body.'})
            return None

        try:
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {'error': 'Invalid JSON request body.'})
            return None

        if not isinstance(payload, dict):
            self._send_json(400, {'error': 'Invalid request body.'})
            return None

        return payload

    def _paystack_request(self, endpoint, payload=None):
        secret_key = os.environ.get('PAYSTACK_SECRET_KEY', '').strip()
        if not secret_key:
            raise RuntimeError('Paystack payments are not configured. Set PAYSTACK_SECRET_KEY.')

        body = json.dumps(payload).encode('utf-8') if payload is not None else None
        request = Request(
            f'{PAYSTACK_API_URL}{endpoint}',
            data=body,
            headers={
                'Authorization': f'Bearer {secret_key}',
                'Content-Type': 'application/json',
            },
            method='POST' if payload is not None else 'GET',
        )
        try:
            with urlopen(request, timeout=15) as response:
                result = json.loads(response.read().decode('utf-8'))
        except HTTPError as error:
            raise RuntimeError('Paystack could not process the payment request.') from error
        except URLError as error:
            raise RuntimeError('Could not connect to Paystack. Please try again.') from error
        except (TimeoutError, json.JSONDecodeError, UnicodeDecodeError) as error:
            raise RuntimeError('Paystack returned an invalid or delayed response.') from error

        if not isinstance(result, dict) or not result.get('status'):
            message = result.get('message') if isinstance(result, dict) else None
            raise RuntimeError(message or 'Paystack could not process the payment request.')

        data = result.get('data')
        if not isinstance(data, dict):
            raise RuntimeError('Paystack returned an invalid payment response.')
        return data

    def _handle_payment_initialize(self):
        payload = self._read_json_body()
        if payload is None:
            return

        name = payload.get('name')
        email = payload.get('email')
        raw_amount = payload.get('amount')
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 120:
            self._send_json(400, {'error': 'Enter a valid member name.'})
            return
        if not isinstance(email, str) or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email.strip()):
            self._send_json(400, {'error': 'Enter a valid member email address.'})
            return

        if not isinstance(raw_amount, str) or not re.fullmatch(r'\d{1,12}(?:\.\d{1,2})?', raw_amount.strip()):
            self._send_json(400, {'error': 'Enter a valid payment amount.'})
            return

        try:
            amount_major = Decimal(raw_amount.strip())
        except InvalidOperation:
            self._send_json(400, {'error': 'Enter a valid payment amount.'})
            return

        if amount_major <= 0:
            self._send_json(400, {'error': 'Amount must be greater than zero.'})
            return
        amount_minor = int(amount_major * 100)

        reference = f'MMOGCC-{secrets.token_hex(12)}'
        member_name = name.strip()
        member_email = email.strip().lower()
        conn = get_connection()
        conn.execute(
            '''
            INSERT INTO dues_payments(reference, member_name, member_email, amount, currency, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
            ''',
            (reference, member_name, member_email, amount_minor, PAYMENT_CURRENCY),
        )
        conn.commit()
        conn.close()

        forwarded_proto = self.headers.get('X-Forwarded-Proto', '').split(',')[0].strip().lower()
        scheme = 'https' if forwarded_proto == 'https' else 'http'
        host = self.headers.get('Host', 'localhost')
        if not re.fullmatch(r'[A-Za-z0-9.-]+(?::\d{1,5})?', host):
            host = 'localhost'
        callback_url = f'{scheme}://{host}/'
        try:
            data = self._paystack_request(
                '/transaction/initialize',
                {
                    'email': member_email,
                    'amount': amount_minor,
                    'currency': PAYMENT_CURRENCY,
                    'reference': reference,
                    'callback_url': callback_url,
                    'metadata': {
                        'custom_fields': [
                            {'display_name': 'Member name', 'variable_name': 'member_name', 'value': member_name},
                            {'display_name': 'Payment type', 'variable_name': 'payment_type', 'value': 'Youth dues'},
                        ]
                    },
                },
            )
        except RuntimeError as error:
            self._send_json(503 if 'not configured' in str(error) else 502, {'error': str(error)})
            return

        authorization_url = data.get('authorization_url')
        if not isinstance(authorization_url, str) or not authorization_url.startswith('https://'):
            self._send_json(502, {'error': 'Paystack did not return a valid checkout link.'})
            return

        self._send_json(200, {'authorizationUrl': authorization_url, 'reference': reference})

    def _handle_payment_verify(self):
        payload = self._read_json_body()
        if payload is None:
            return

        reference = payload.get('reference')
        if not isinstance(reference, str) or not re.fullmatch(r'MMOGCC-[a-f0-9]{24}', reference):
            self._send_json(400, {'error': 'Invalid payment reference.'})
            return

        conn = get_connection()
        payment = conn.execute(
            'SELECT * FROM dues_payments WHERE reference = ?',
            (reference,),
        ).fetchone()
        if payment is None:
            conn.close()
            self._send_json(404, {'error': 'Payment reference was not found.'})
            return

        if payment['status'] == 'paid':
            conn.close()
            self._send_json(200, self._payment_receipt(payment))
            return

        try:
            data = self._paystack_request(f'/transaction/verify/{reference}')
        except RuntimeError as error:
            conn.close()
            self._send_json(503 if 'not configured' in str(error) else 502, {'error': str(error)})
            return

        if not payment_matches(payment, data, reference):
            conn.close()
            self._send_json(409, {'error': 'Payment has not been confirmed. If you were charged, contact the youth team with your reference.'})
            return

        self._mark_payment_paid(conn, reference, data.get('paid_at'))
        payment = conn.execute(
            'SELECT * FROM dues_payments WHERE reference = ?',
            (reference,),
        ).fetchone()
        conn.close()
        self._send_json(200, self._payment_receipt(payment))

    def _handle_payment_webhook(self):
        secret_key = os.environ.get('PAYSTACK_SECRET_KEY', '').strip()
        if not secret_key:
            self._send_json(503, {'error': 'Paystack payments are not configured.'})
            return

        try:
            length = int(self.headers.get('Content-Length', '0') or 0)
        except ValueError:
            self._send_json(400, {'error': 'Invalid webhook request.'})
            return
        if length <= 0 or length > 16384:
            self._send_json(400, {'error': 'Invalid webhook request.'})
            return

        raw_body = self.rfile.read(length)
        signature = self.headers.get('x-paystack-signature', '')
        expected_signature = hmac.new(
            secret_key.encode('utf-8'),
            raw_body,
            hashlib.sha512,
        ).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            self._send_json(401, {'error': 'Invalid webhook signature.'})
            return

        try:
            event = json.loads(raw_body.decode('utf-8'))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {'error': 'Invalid webhook JSON.'})
            return

        if not isinstance(event, dict) or event.get('event') != 'charge.success':
            self._send_json(200, {'status': 'ignored'})
            return

        data = event.get('data')
        reference = data.get('reference') if isinstance(data, dict) else None
        if not isinstance(reference, str) or not re.fullmatch(r'MMOGCC-[a-f0-9]{24}', reference):
            self._send_json(200, {'status': 'ignored'})
            return

        conn = get_connection()
        payment = conn.execute(
            'SELECT * FROM dues_payments WHERE reference = ?',
            (reference,),
        ).fetchone()
        if payment is None or payment['status'] == 'paid':
            conn.close()
            self._send_json(200, {'status': 'ignored'})
            return
        if not payment_matches(payment, data, reference):
            conn.close()
            self._send_json(400, {'error': 'Webhook payment details did not match the pending payment.'})
            return

        self._mark_payment_paid(conn, reference, data.get('paid_at'))
        conn.close()
        self._send_json(200, {'status': 'ok'})

    def _mark_payment_paid(self, conn, reference, paid_at):
        conn.execute(
            "UPDATE dues_payments SET status = 'paid', paid_at = ? WHERE reference = ?",
            (paid_at, reference),
        )
        conn.commit()

    def _payment_receipt(self, payment):
        return {
            'status': payment['status'],
            'reference': payment['reference'],
            'memberName': payment['member_name'],
            'amount': payment['amount'] / 100,
            'currency': payment['currency'],
            'paidAt': payment['paid_at'],
        }

    def _send_json(self, status_code, payload, headers=None):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        for name, value in (headers or {}).items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    ensure_storage()
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', '8000'))
    server = ThreadingHTTPServer((host, port), AppHandler)
    print(f'MMOGCC YOUTH backend running on http://{host}:{port}')
    server.serve_forever()
