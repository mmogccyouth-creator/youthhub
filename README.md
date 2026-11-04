# Youth Management Hub

A lightweight, static youth management web app for showcasing:

- Admin dashboard
- Member dashboard
- Event publishing
- Gallery uploads
- Executive profiles

## Run locally

Run the app through its Python server (required for payments and persistent server state):

```bash
python server.py
```

Then visit `http://localhost:8000`.

## Admin access and member privacy

Admin access is verified by the server. Set both variables before starting the app; do not store these values in browser storage or source files:

```powershell
$env:ADMIN_PASSWORD = "a-unique-password-at-least-12-characters"
$env:ADMIN_SESSION_SECRET = (python -c "import secrets; print(secrets.token_urlsafe(48))")
python server.py
```

For deployment, set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Railway's service variables. Use a unique password of at least 12 characters and a stable, randomly generated session secret of at least 32 characters. Keep the session secret unchanged between deployments; changing it signs out all administrators. Admin sessions use an HTTP-only, same-site cookie and expire after eight hours.

Only a signed-in administrator can read or update member records, activity logs, event attendee details, prayer requests, group-interest requests, pending photo submissions, and service-hour logs. Public registration and community submissions remain available and are saved by the server; anonymous state responses omit private collections while exposing event registration counts, approved gallery photos, and consented public highlights. The app also clears older browser-stored copies of member records on load.

New member registrations create an account with a password of at least 12 characters. Passwords are stored as PBKDF2-SHA256 hashes with per-account salts; member sessions use an HTTP-only cookie signed with `ADMIN_SESSION_SECRET`. Admin-added member records do not have a member login until the person completes the registration flow. There is no password-reset email flow yet. Event registration remains open to visitors, but signed-in members can see and cancel their own bookings and retrieve a fresh check-in pass. QR camera scanning requires browser camera support and permission; manual token entry is available as a fallback.

## Paystack dues payments

Set the Paystack **secret** key as a server environment variable before starting the app. Do not put the secret key in `script.js` or other browser files.

PowerShell:

```powershell
$env:PAYSTACK_SECRET_KEY = "sk_test_your_secret_key"
python server.py
```

Configure `PAYSTACK_SECRET_KEY` in Railway's service variables when deployed. The dues form collects the member's name, email, and amount in GHS; the server generates and displays the payment reference before the member continues to Paystack's hosted checkout. The email is required by Paystack. The server records a payment only after Paystack confirms the matching reference, amount, currency, and member email, either through transaction verification or the signed webhook. Use a Paystack test secret key to test before switching to a live key.

For reliable payment updates when a member closes checkout before returning to the app, configure the Paystack webhook URL as `https://<your-app-domain>/api/payments/webhook`. The endpoint verifies Paystack's signature before recording a successful charge.

## Deploy on Railway

The included Dockerfile runs the frontend and Python API together. Railway PostgreSQL is recommended for persistent production storage; SQLite is available for local development.

1. Create a Railway project and deploy this repository using the included Dockerfile.
2. Add a Railway PostgreSQL service and set `DATABASE_URL` using its private connection URL.
3. Add these service variables in Railway:
   - `ADMIN_PASSWORD`: a unique password of at least 12 characters.
   - `ADMIN_SESSION_SECRET`: a stable random secret of at least 32 characters.
   - `PAYSTACK_SECRET_KEY`: optional; required only to accept dues payments.
4. Deploy the service. The server creates its PostgreSQL tables and initial public content on startup.
5. Set the Paystack webhook URL to `https://<your-railway-domain>/api/payments/webhook`.

Do not commit database URLs or secrets. Railway's filesystem is not persistent unless a volume is attached, so use PostgreSQL for production data. Existing SQLite data is not copied automatically; migrate any records you need before switching members to the new deployment.

## Features

- Switch between admin and member dashboard views
- Publish events with custom details and poster placeholders
- Let visitors register for events and prevent duplicate registrations by email; administrators can review attendee lists
- Browse events in a month calendar and download calendar reminders with a one-day alert
- Set event capacities, waitlist additional RSVPs, and automatically promote the next person when a confirmed booking is cancelled
- Issue QR check-in passes, scan or enter tokens as an administrator, and export attendance and service-hour reports
- Manage volunteer shifts, capacity, signups, and waitlists from the admin dashboard
- Let members securely sign in to view their own registrations, shifts, and service hours
- Share event details through prefilled email or WhatsApp messages
- Add gallery images with captions and categories
- Accept member photo submissions into an administrator approval queue before publishing them
- Collect private prayer requests and interest-group signups for administrator follow-up
- Record member attendance and volunteer service hours in the admin dashboard
- Publish member spotlights and community milestones after confirming permission
- Browse executive profiles and community highlights
- Server state and dues payments are stored in PostgreSQL on Railway or SQLite during local development
- Browser `localStorage` provides local demo state when the server API is unavailable

Event reminders can be downloaded or shared by the member. Automatic email or WhatsApp delivery is not enabled; it requires a messaging provider account, credentials, and a scheduled delivery service.
