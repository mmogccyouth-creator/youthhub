const STORAGE_KEYS = {
  events: 'youthManagementEvents',
  gallery: 'youthManagementGallery',
  announcements: 'youthManagementAnnouncements',
  executives: 'youthManagementExecutives',
};
const IMPACT_QUEST_STORAGE_KEY = 'mmogccYouthImpactQuest';

const defaultImpactMissions = [
  { id: 'gathering', number: '01', title: 'Show up for one another', detail: 'Join a youth gathering and make room for a new connection.' },
  { id: 'service', number: '02', title: 'Put care into action', detail: 'Take part in an outreach or community service activity.' },
  { id: 'invite', number: '03', title: 'Bring someone along', detail: 'Invite a friend to share in a youth activity or conversation.' },
];
const defaultInterestGroups = [
  { id: 'worship', name: 'Worship & Music', description: 'Use music and prayer to bring the community together.' },
  { id: 'outreach', name: 'Outreach & Service', description: 'Turn compassion into practical care for our neighbors.' },
  { id: 'media', name: 'Media & Creative Arts', description: 'Tell the story of youth life through design, photos, and video.' },
  { id: 'formation', name: 'Faith & Formation', description: 'Grow in faith through reflection, discussion, and shared learning.' },
  { id: 'leadership', name: 'Leadership & Mentorship', description: 'Build confidence and help other young people find their path.' },
  { id: 'sports', name: 'Sports & Fellowship', description: 'Build friendships through games, movement, and friendly competition.' },
];

const defaultMembers = [
  { name: 'Sarah Mantey', role: 'MMOGCC YOUTH Program Lead', engagement: '96%', status: 'Active' },
  { name: 'James Owusu', role: 'MMOGCC YOUTH Volunteer Coordinator', engagement: '89%', status: 'Active' },
  { name: 'Amina Salifu', role: 'MMOGCC YOUTH Media & Outreach', engagement: '83%', status: 'Pending' },
  { name: 'Daniel Koduah', role: 'MMOGCC YOUTH Mentor', engagement: '74%', status: 'Review' },
];
const defaultAnnouncements = [
  {
    title: 'MMOGCC YOUTH council meeting rescheduled',
    summary: 'The MMOGCC YOUTH council meeting has moved to Thursday at 4:00 PM to allow wider participation across the organization.',
    tone: 'Update',
  },
  {
    title: 'Volunteer recruitment open',
    summary: 'Applications for MMOGCC YOUTH outreach volunteers are now open for the next community drive.',
    tone: 'Call to action',
  },
  {
    title: 'Scholarship opportunity shared',
    summary: 'A new scholarship support desk is available for members seeking career guidance and formation support within MMOGCC YOUTH.',
    tone: 'Support',
  },
];

const defaultTasks = [
  { title: 'Confirm youth outreach venue', due: 'Today', state: 'Ready' },
  { title: 'Finalize volunteer shift list', due: 'Tomorrow', state: 'Pending' },
  { title: 'Review event registration forms', due: 'Friday', state: 'Pending' },
];

const defaultEvents = [
  {
    title: 'MMOGCC YOUTH Clean-Up Drive',
    date: '2026-11-14',
    venue: 'MMOGCC YOUTH Community Park',
    category: 'Outreach',
    description: 'Join us for a neighborhood cleanup and MMOGCC YOUTH awareness campaign.',
    poster: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    capacity: 40,
  },
  {
    title: 'MMOGCC YOUTH Leadership & Public Speaking Workshop',
    date: '2026-11-21',
    venue: 'MMOGCC YOUTH Center',
    category: 'Workshop',
    description: 'An interactive session on confidence-building, public speaking, and service leadership.',
    poster: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    capacity: 30,
  },
  {
    title: 'MMOGCC YOUTH Career Mentorship Meetup',
    date: '2026-12-05',
    venue: 'MMOGCC YOUTH Innovation Hub',
    category: 'Training',
    description: 'Connect with mentors and learn practical career pathways for young adults within MMOGCC YOUTH.',
    poster: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    capacity: 24,
  },
];

const defaultGallery = [
  {
    title: 'MMOGCC YOUTH Training Session',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'MMOGCC YOUTH Outreach Mission',
    category: 'Outreach',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'MMOGCC YOUTH Creative Workshop',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'MMOGCC YOUTH Talent Showcase Night',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  },
];

const defaultExecutives = [
  {
    name: 'Grace Wiafe',
    role: 'MMOGCC YOUTH Chair',
    focus: 'Leadership',
    quote: 'Empowering every MMOGCC YOUTH member to lead with faith and purpose.',
    initials: 'GW',
  },
  {
    name: 'Kevin Tetteh',
    role: 'MMOGCC YOUTH Programs Director',
    focus: 'Impact',
    quote: 'Strong programs create lasting transformation in our MMOGCC YOUTH community.',
    initials: 'KT',
  },
  {
    name: 'Lilian Mensah',
    role: 'MMOGCC YOUTH Community Relations Lead',
    focus: 'Engagement',
    quote: 'Every voice deserves a seat at the table in MMOGCC YOUTH.',
    initials: 'LM',
  },
];

const APP_STORAGE_VERSION = 'mmogcc-youth-hub-v2026-09-08';

localStorage.removeItem('youthManagementMembers');
localStorage.removeItem('mmogccYouthHubMemberSession');
localStorage.removeItem('mmogccYouthHubActivityLog');
localStorage.removeItem('mmogccYouthHubAdminSession');
localStorage.removeItem('mmogccYouthHubAdminPassword');

if (localStorage.getItem('mmogccYouthHubVersion') !== APP_STORAGE_VERSION) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(defaultEvents));
  localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(defaultGallery));
  localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(defaultAnnouncements));
  localStorage.setItem('mmogccYouthHubVersion', APP_STORAGE_VERSION);
}
function escapeCalendarText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}
function downloadEventReminder(index) {
  const event = state.events[index];
  if (!event) {
    return;
  }
  const startDate = event.date.replace(/-/g, '');
  const endDate = new Date(`${event.date}T00:00:00`);
  endDate.setDate(endDate.getDate() + 1);
  const endDateText = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MMOGCC Youth Hub//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@mmogcc-youth-hub`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDateText}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(event.description)}`,
    `LOCATION:${escapeCalendarText(event.venue)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeCalendarText(`Tomorrow: ${event.title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blobUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'youth-event'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

function renderEventTicketQr(token) {
  const qrTarget = document.getElementById('eventTicketQr');
  qrTarget.replaceChildren();
  if (typeof window.QRCode !== 'function') {
    return false;
  }
  new window.QRCode(qrTarget, {
    text: `MMOGCC-CHECKIN:${token}`,
    width: 176,
    height: 176,
    correctLevel: window.QRCode.CorrectLevel.M,
  });
  return true;
}

function shareEventReminder(index, channel) {
  const event = state.events[index];
  if (!event) {
    return;
  }
  const message = `${event.title}\n${formatDate(event.date)} · ${event.venue}\n${event.description}\nAdd it to your calendar from the MMOGCC YOUTH Hub.`;
  if (channel === 'email') {
    window.location.href = `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(message)}`;
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
}
async function postCommunityForm(form, path, feedback, data, successText) {
  feedback.textContent = 'Sending…';
  feedback.classList.remove('error');
  try {
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Your request could not be sent.');
    }
    form.reset();
    feedback.textContent = successText;
  } catch (error) {
    feedback.textContent = error.message || 'The app server is needed to submit this form.';
    feedback.classList.add('error');
  }
}
async function compressCommunityPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8_000_000) {
    throw new Error('Choose a JPEG, PNG, or WebP photo under 8 MB.');
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const image = canvas.toDataURL('image/jpeg', 0.74);
  if (image.length > 1_400_000) {
    throw new Error('This photo is still too large. Choose a smaller image.');
  }
  return image;
}
function bindCommunityForms() {
  const prayerForm = document.getElementById('prayerRequestForm');
  prayerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(prayerForm);
    void postCommunityForm(
      prayerForm,
      '/api/prayer-requests',
      document.getElementById('prayerRequestFeedback'),
      { name: values.get('name').trim(), message: values.get('message').trim() },
      'Your request was sent privately to the youth administrators.'
    );
  });
  const interestForm = document.getElementById('groupInterestForm');
  interestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(interestForm);
    void postCommunityForm(
      interestForm,
      '/api/group-interests',
      document.getElementById('groupInterestFeedback'),
      { name: values.get('name').trim(), email: values.get('email').trim(), groupId: values.get('groupId') },
      'Thanks. An administrator will follow up about the group.'
    );
  });
  const photoForm = document.getElementById('photoSubmissionForm');
  photoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(photoForm);
    const file = values.get('photo');
    const feedback = document.getElementById('photoSubmissionFeedback');
    const submitButton = photoForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    feedback.textContent = 'Preparing your photo…';
    feedback.classList.remove('error');
    try {
      const image = await compressCommunityPhoto(file);
      await postCommunityForm(
        photoForm,
        '/api/photos/submit',
        feedback,
        { title: values.get('title').trim(), category: values.get('category'), image },
        'Photo submitted. It will appear in the gallery after review.'
      );
    } catch (error) {
      feedback.textContent = error.message || 'The photo could not be prepared.';
      feedback.classList.add('error');
    } finally {
      submitButton.disabled = false;
    }
  });
  const serviceForm = document.getElementById('serviceLogForm');
  serviceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(serviceForm);
    const member = state.members.find((item) => (item.email || item.name) === values.get('memberEmail'));
    if (!member) {
      return;
    }
    state.serviceLogs.unshift({
      memberName: member.name,
      memberEmail: member.email || '',
      activity: values.get('activity').trim(),
      date: values.get('date'),
      hours: Number(values.get('hours')),
    });
    void syncStateWithServer();
    serviceForm.reset();
    renderAdminCommunityTools();
  });
  const spotlightForm = document.getElementById('spotlightForm');
  spotlightForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(spotlightForm);
    state.spotlight = {
      name: values.get('name').trim(),
      role: values.get('role').trim(),
      story: values.get('story').trim(),
    };
    void syncStateWithServer();
    spotlightForm.reset();
    renderCommunityHighlights();
  });
  const milestoneForm = document.getElementById('milestoneForm');
  milestoneForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(milestoneForm);
    state.milestones.unshift({
      name: values.get('name').trim(),
      type: values.get('type'),
      message: values.get('message').trim(),
      createdAt: new Date().toISOString(),
    });
    void syncStateWithServer();
    milestoneForm.reset();
    renderCommunityHighlights();
  });

  const shiftForm = document.getElementById('volunteerShiftSignupForm');
  shiftForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(shiftForm);
    const feedback = document.getElementById('volunteerShiftFeedback');
    feedback.textContent = 'Joining shift…';
    feedback.classList.remove('error');
    try {
      const response = await fetch('/api/shifts/signup', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: values.get('shiftId'),
          name: state.currentMember?.name || values.get('name').trim(),
          email: state.currentMember?.email || values.get('email').trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Could not join this shift.');
      }
      const shiftId = values.get('shiftId');
      if (result.status === 'booked') {
        state.shiftSignupCounts[shiftId] = Number(state.shiftSignupCounts[shiftId] || 0) + 1;
      }
      if (state.role === 'member') {
        state.memberShiftSignups.unshift({ shiftTitle: result.shiftTitle, status: result.status });
      }
      feedback.textContent = result.status === 'waitlisted'
        ? 'This shift is full. You have been added to the waitlist.'
        : 'You are signed up for this shift.';
      renderVolunteerShifts();
      renderMemberAccountActivity();
    } catch (error) {
      feedback.textContent = error.message || 'Could not join this shift.';
      feedback.classList.add('error');
    }
  });

  const adminShiftForm = document.getElementById('volunteerShiftForm');
  adminShiftForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(adminShiftForm);
    state.volunteerShifts.unshift({
      id: crypto.randomUUID(),
      title: values.get('title').trim(),
      eventTitle: values.get('eventTitle').trim(),
      capacity: Number(values.get('capacity')),
    });
    void syncStateWithServer();
    adminShiftForm.reset();
    renderVolunteerShifts();
    renderAdminCommunityTools();
  });

  document.getElementById('checkinTokenForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const token = new FormData(event.currentTarget).get('token');
    void submitCheckinToken(token);
  });
  document.getElementById('startCheckinScanBtn').addEventListener('click', startCheckinCamera);
  document.getElementById('stopCheckinScanBtn').addEventListener('click', () => {
    stopCheckinCamera();
    document.getElementById('checkinFeedback').textContent = 'Camera stopped.';
  });
}
function handleCommunityReviewClick(event) {
  const prayerButton = event.target.closest('[data-review-prayer]');
  if (prayerButton) {
    const request = state.prayerRequests[Number(prayerButton.dataset.reviewPrayer)];
    if (request) {
      request.status = 'Reviewed';
      void syncStateWithServer();
      renderAdminCommunityTools();
    }
    return;
  }
  const photoButton = event.target.closest('[data-review-photo]');
  if (!photoButton) {
    return;
  }
  const index = Number(photoButton.dataset.index);
  const [submission] = state.photoSubmissions.splice(index, 1);
  if (!submission) {
    return;
  }
  if (photoButton.dataset.reviewPhoto === 'approve') {
    state.gallery.unshift({ title: submission.title, category: submission.category, image: submission.image });
    saveGallery();
  } else {
    void syncStateWithServer();
  }
  renderDashboardContent();
}

let checkinStream = null;
let checkinScanActive = false;

async function submitCheckinToken(rawToken) {
  const feedback = document.getElementById('checkinFeedback');
  const token = rawToken.trim().replace(/^MMOGCC-CHECKIN:/, '');
  feedback.textContent = 'Checking pass…';
  feedback.classList.remove('error');
  try {
    const response = await fetch('/api/events/checkin', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Check-in could not be completed.');
    }
    feedback.textContent = `${result.name} checked in for ${result.eventTitle}.`;
    document.getElementById('checkinTokenForm').reset();
    await hydrateStateFromServer();
    renderDashboardContent();
  } catch (error) {
    feedback.textContent = error.message || 'Check-in could not be completed.';
    feedback.classList.add('error');
  }
}

function stopCheckinCamera() {
  checkinScanActive = false;
  checkinStream?.getTracks().forEach((track) => track.stop());
  checkinStream = null;
  const video = document.getElementById('checkinCameraPreview');
  video.srcObject = null;
  video.classList.add('hidden');
}

async function scanCheckinFrame(detector, video) {
  if (!checkinScanActive) {
    return;
  }
  try {
    const codes = await detector.detect(video);
    if (codes.length) {
      stopCheckinCamera();
      await submitCheckinToken(codes[0].rawValue);
      return;
    }
  } catch {
    stopCheckinCamera();
    document.getElementById('checkinFeedback').textContent = 'Could not read that QR code. Enter the token manually.';
    return;
  }
  requestAnimationFrame(() => scanCheckinFrame(detector, video));
}

async function startCheckinCamera() {
  const feedback = document.getElementById('checkinFeedback');
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
    feedback.textContent = 'Camera scanning is not supported in this browser. Enter the token manually.';
    return;
  }
  try {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    checkinStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = document.getElementById('checkinCameraPreview');
    video.srcObject = checkinStream;
    video.classList.remove('hidden');
    await video.play();
    checkinScanActive = true;
    feedback.textContent = 'Point the camera at an attendee pass.';
    requestAnimationFrame(() => scanCheckinFrame(detector, video));
  } catch {
    stopCheckinCamera();
    feedback.textContent = 'Camera access was unavailable. Enter the token manually.';
  }
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

const state = {
  events: loadFromStorage(STORAGE_KEYS.events, defaultEvents),
  gallery: loadFromStorage(STORAGE_KEYS.gallery, defaultGallery),
  members: defaultMembers.map((member) => ({ ...member })),
  announcements: loadFromStorage(STORAGE_KEYS.announcements, defaultAnnouncements),
  executives: loadFromStorage(STORAGE_KEYS.executives, defaultExecutives),
  activities: [],
  eventRegistrations: [],
  eventRegistrationCounts: [],
  memberRegistrations: [],
  memberServiceLogs: [],
  memberShiftSignups: [],
  volunteerShifts: [],
  shiftSignups: [],
  shiftSignupCounts: {},
  completedImpactMissions: loadFromStorage(IMPACT_QUEST_STORAGE_KEY, []),
  interestGroups: defaultInterestGroups.map((group) => ({ ...group })),
  groupInterestRequests: [],
  prayerRequests: [],
  photoSubmissions: [],
  serviceLogs: [],
  milestones: [],
  spotlight: null,
  pendingEventIndex: null,
  activeView: 'admin',
  activeFilter: 'all',
  calendarDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  role: 'guest',
  currentMember: null,
  pendingDuesCheckout: null,
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(state.events));
  syncStateWithServer();
}

function saveGallery() {
  localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(state.gallery));
  syncStateWithServer();
}

function saveMembers() {
  if (state.role === 'admin') {
    void syncStateWithServer();
  }
}

function saveAnnouncements() {
  localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(state.announcements));
  syncStateWithServer();
}

function saveExecutives() {
  localStorage.setItem(STORAGE_KEYS.executives, JSON.stringify(state.executives));
  syncStateWithServer();
}

function saveActivities() {
  if (state.role === 'admin') {
    void syncStateWithServer();
  }
}

async function hydrateStateFromServer() {
  try {
    const [sessionResponse, memberSessionResponse] = await Promise.all([
      fetch('/api/admin/session', { cache: 'no-store', credentials: 'same-origin' }),
      fetch('/api/members/session', { cache: 'no-store', credentials: 'same-origin' }),
    ]);
    const adminSession = sessionResponse.ok && (await sessionResponse.json()).authenticated;
    const memberSession = memberSessionResponse.ok ? await memberSessionResponse.json() : {};
    state.role = adminSession ? 'admin' : memberSession.authenticated ? 'member' : 'guest';
    state.currentMember = state.role === 'member' ? memberSession.member : null;

    const response = await fetch('/api/state', {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (!response.ok) {
      state.role = 'guest';
      state.members = defaultMembers.map((member) => ({ ...member }));
      state.activities = [];
      console.error(`App state request failed with HTTP ${response.status}.`);
      return;
    }

    const serverState = await response.json();
    if (!serverState || typeof serverState !== 'object') {
      return;
    }

    const keys = [
      'events', 'gallery', 'announcements', 'executives', 'interestGroups', 'groupInterestRequests',
      'prayerRequests', 'photoSubmissions', 'serviceLogs', 'milestones', 'volunteerShifts',
    ];
    keys.forEach((key) => {
      if (Array.isArray(serverState[key])) {
        state[key] = serverState[key];
      }
    });

    state.members = state.role === 'admin' && Array.isArray(serverState.members)
      ? serverState.members
      : defaultMembers.map((member) => ({ ...member }));
    state.activities = state.role === 'admin' && Array.isArray(serverState.activities)
      ? serverState.activities
      : [];
    state.eventRegistrations = state.role === 'admin' && Array.isArray(serverState.eventRegistrations)
      ? serverState.eventRegistrations
      : [];
    state.memberRegistrations = Array.isArray(serverState.memberRegistrations)
      ? serverState.memberRegistrations
      : [];
    state.memberServiceLogs = Array.isArray(serverState.memberServiceLogs)
      ? serverState.memberServiceLogs
      : [];
    state.memberShiftSignups = Array.isArray(serverState.memberShiftSignups)
      ? serverState.memberShiftSignups
      : [];
    state.shiftSignups = state.role === 'admin' && Array.isArray(serverState.shiftSignups)
      ? serverState.shiftSignups
      : [];
    state.shiftSignupCounts = serverState.shiftSignupCounts && typeof serverState.shiftSignupCounts === 'object'
      ? serverState.shiftSignupCounts
      : {};
    if (state.role === 'member' && serverState.currentMember) {
      state.currentMember = serverState.currentMember;
    }
    state.eventRegistrationCounts = Array.isArray(serverState.eventRegistrationCounts)
      ? serverState.eventRegistrationCounts
      : [];
    state.spotlight = serverState.spotlight && typeof serverState.spotlight === 'object'
      ? serverState.spotlight
      : null;
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(state.events));
    localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(state.gallery));
    localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(state.announcements));
    localStorage.setItem(STORAGE_KEYS.executives, JSON.stringify(state.executives));
  } catch (error) {
    state.role = 'guest';
    state.currentMember = null;
    state.members = defaultMembers.map((member) => ({ ...member }));
    state.activities = [];
    console.error('Could not load state from the app server; showing public demo data.', error);
  }
}

async function syncStateWithServer() {
  if (state.role !== 'admin') {
    return;
  }

  try {
    const response = await fetch('/api/state', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: state.events,
        gallery: state.gallery,
        members: state.members,
        announcements: state.announcements,
        executives: state.executives,
        activities: state.activities,
        interestGroups: state.interestGroups,
        groupInterestRequests: state.groupInterestRequests,
        prayerRequests: state.prayerRequests,
        photoSubmissions: state.photoSubmissions,
        serviceLogs: state.serviceLogs,
        milestones: state.milestones,
        spotlight: state.spotlight,
        volunteerShifts: state.volunteerShifts,
      }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'The server could not save your changes.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Administrator sign-in')) {
      state.role = 'guest';
      state.members = defaultMembers.map((member) => ({ ...member }));
      state.activities = [];
      updateAuthUI();
      renderDashboardContent();
    }
    alert(error.message || 'The server could not save your changes.');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderStats() {
  document.getElementById('statMembers').textContent = state.members.length;
  document.getElementById('statEvents').textContent = state.events.length;
  document.getElementById('statGallery').textContent = state.gallery.length;
  document.getElementById('statExecutives').textContent = state.executives.length;
}

function renderMemberTable() {
  const tbody = document.getElementById('memberTable');
  const isAdmin = state.role === 'admin';
  const searchInput = document.getElementById('memberSearchInput');
  const statusFilter = document.getElementById('memberStatusFilter');

  const searchTerm = (searchInput?.value || '').trim().toLowerCase();
  const selectedStatus = statusFilter?.value || 'all';

  const filteredMembers = state.members
    .map((member, index) => ({ member, index }))
    .filter(({ member, index }) => {
      const matchesSearch =
        !searchTerm ||
        [member.name, member.role, member.email, member.location, member.status]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(searchTerm));

      const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

  tbody.innerHTML = filteredMembers.length
    ? filteredMembers
        .map(
          ({ member, index }) => `
        <tr>
          <td>${escapeHTML(member.name)}</td>
          <td>${escapeHTML(member.role)}</td>
          <td>${escapeHTML(member.engagement)}</td>
          <td>${escapeHTML(member.age || '-')}</td>
          <td>${escapeHTML(member.dayBornGroup || '-')}</td>
          <td><span class="status-pill ${escapeHTML(String(member.status || '').toLowerCase())}">${escapeHTML(member.status)}</span></td>
          ${
            isAdmin
              ? `<td><div class="card-actions compact-actions"><button type="button" class="delete-btn" data-delete-type="member" data-index="${index}">Delete</button></div></td>`
              : ''
          }
        </tr>
      `
        )
        .join('')
    : `
      <tr>
        <td colspan="${isAdmin ? '7' : '6'}" style="text-align: center; color: var(--muted); padding: 20px;">
          No members match your current search or filter.
        </td>
      </tr>
    `;

  const tableHead = document.querySelector('#memberTable')?.closest('table')?.querySelector('thead tr');
  if (tableHead) {
    const actionHeader = tableHead.querySelector('th[data-action-header]');
    if (isAdmin && !actionHeader) {
      const header = document.createElement('th');
      header.dataset.actionHeader = 'true';
      header.textContent = 'Action';
      tableHead.appendChild(header);
    }

    if (!isAdmin && actionHeader) {
      actionHeader.remove();
    }
  }
}

function renderActivityRecords() {
  const recordsList = document.getElementById('activityRecordsList');
  if (!recordsList) {
    return;
  }

  const sortedActivities = [...state.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  recordsList.innerHTML = sortedActivities.length
    ? sortedActivities
        .map(
          (activity) => `
            <div class="activity-record">
              <div>
                <strong>${escapeHTML(activity.memberName)}</strong>
                <p>${escapeHTML(activity.action)}</p>
              </div>
              <div class="activity-meta">
                <span>${escapeHTML(activity.email)}</span>
                <small>${new Date(activity.timestamp).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</small>
              </div>
            </div>
          `
        )
        .join('')
    : '<p class="chart-empty">No member activity records yet.</p>';
}

function renderMemberInsightsChart() {
  const chartContainer = document.getElementById('memberInsightsChart');
  if (!chartContainer) {
    return;
  }

  const getCounts = (key, fallbackLabel = 'Unknown') => {
    const counts = {};
    state.members.forEach((member) => {
      const value = member[key] || fallbackLabel;
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  };

  const ageGroups = [
    { label: '15-19', predicate: (age) => age >= 15 && age <= 19 },
    { label: '20-24', predicate: (age) => age >= 20 && age <= 24 },
    { label: '25-29', predicate: (age) => age >= 25 && age <= 29 },
    { label: '30-34', predicate: (age) => age >= 30 && age <= 34 },
    { label: '35+', predicate: (age) => age >= 35 },
  ];

  const counts = {
    status: getCounts('status', 'Unknown'),
    employmentStatus: getCounts('employmentStatus', 'Unknown'),
    dayBornGroup: getCounts('dayBornGroup', 'Unknown'),
    ageGroups: ageGroups
      .map((group) => ({
        label: group.label,
        value: state.members.filter((member) => {
          const age = Number(member.age || 0);
          return !Number.isNaN(age) && group.predicate(age);
        }).length,
      }))
      .filter((group) => group.value > 0),
  };

  const chartSections = [
    { title: 'Status', data: counts.status },
    { title: 'Employment status', data: counts.employmentStatus },
    { title: 'Day born group', data: counts.dayBornGroup },
    { title: 'Age groups', data: counts.ageGroups },
  ];

  const maxForSection = (data) => Math.max(...data.map((item) => item.value), 1);

  chartContainer.innerHTML = chartSections
    .map(({ title, data }) => {
      if (!data || data.length === 0) {
        return `
          <div class="chart-block">
            <h4>${title}</h4>
            <p class="chart-empty">No data yet</p>
          </div>
        `;
      }

      const maxValue = maxForSection(data);

      return `
        <div class="chart-block">
          <h4>${title}</h4>
          <div class="chart-bars">
            ${data
              .map(
                (item) => `
                  <div class="chart-row">
                    <span class="chart-label">${escapeHTML(item.label)}</span>
                    <div class="chart-track">
                      <span class="chart-fill" style="width: ${(item.value / maxValue) * 100}%"></span>
                    </div>
                    <span class="chart-value">${item.value}</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderTaskList() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = defaultTasks
    .map(
      (task) => `
        <li class="task-item">
          <div>
            <strong>${task.title}</strong>
            <small>${task.due}</small>
          </div>
          <span class="status-pill ${task.state === 'Ready' ? 'active' : 'pending'}">${task.state}</span>
        </li>
      `
    )
    .join('');
}

function renderImpactQuest() {
  const missionList = document.getElementById('impactMissions');
  if (!missionList) {
    return;
  }

  const completedMissions = Array.isArray(state.completedImpactMissions)
    ? state.completedImpactMissions
    : [];
  const completedCount = defaultImpactMissions.filter((mission) => completedMissions.includes(mission.id)).length;
  const progress = Math.round((completedCount / defaultImpactMissions.length) * 100);
  const progressRing = document.getElementById('impactProgressRing');
  progressRing.style.setProperty('--quest-progress', `${progress}%`);
  progressRing.setAttribute('aria-label', `${completedCount} of ${defaultImpactMissions.length} actions completed`);
  document.getElementById('impactProgressCount').textContent = String(completedCount);

  const questComplete = completedCount === defaultImpactMissions.length;
  document.getElementById('impactMilestoneTitle').textContent = questComplete
    ? 'You made a difference.'
    : completedCount > 0
      ? 'You’re building momentum.'
      : 'Your first step starts here';
  document.getElementById('impactMilestoneText').textContent = questComplete
    ? 'Every act of service helps our community grow. Your badge is ready.'
    : 'Complete all three actions to earn the Community Spark badge.';
  document.getElementById('impactBadge').classList.toggle('earned', questComplete);

  missionList.innerHTML = defaultImpactMissions.map((mission) => {
    const isComplete = completedMissions.includes(mission.id);
    return `
      <article class="impact-mission${isComplete ? ' is-complete' : ''}">
        <span class="impact-mission-number">${mission.number}</span>
        <div class="impact-mission-copy">
          <h3>${mission.title}</h3>
          <p>${mission.detail}</p>
        </div>
        <button class="impact-mission-toggle" type="button" data-impact-mission="${mission.id}" aria-pressed="${isComplete}">
          ${isComplete ? 'Completed' : 'Mark complete'}
        </button>
      </article>
    `;
  }).join('');
}

function bindImpactQuest() {
  const missionList = document.getElementById('impactMissions');
  if (!missionList) {
    return;
  }

  missionList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-impact-mission]');
    if (!button) {
      return;
    }

    const missionId = button.dataset.impactMission;
    const completedMissions = Array.isArray(state.completedImpactMissions)
      ? state.completedImpactMissions
      : [];
    state.completedImpactMissions = completedMissions.includes(missionId)
      ? completedMissions.filter((completedId) => completedId !== missionId)
      : [...completedMissions, missionId];
    localStorage.setItem(IMPACT_QUEST_STORAGE_KEY, JSON.stringify(state.completedImpactMissions));
    renderImpactQuest();
  });
}

function renderAnnouncements() {
  const announcementsList = document.getElementById('announcementsList');
  announcementsList.innerHTML = state.announcements
    .map(
      (item) => `
        <article class="announcement-card">
          <span class="announcement-tag">${item.tone}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `
    )
    .join('');
}

function renderMemberEvents() {
  const memberEvents = document.getElementById('memberEvents');
  const bookedCount = document.getElementById('memberBookedCount');
  const registrations = state.role === 'member' ? state.memberRegistrations : [];
  const upcomingRegistrations = registrations
    .filter((registration) => registration.eventDate >= new Date().toISOString().slice(0, 10))
    .slice(0, 4);
  if (bookedCount) {
    bookedCount.textContent = `${registrations.filter((registration) => registration.status === 'registered').length} booked`;
  }
  memberEvents.innerHTML = upcomingRegistrations.length
    ? upcomingRegistrations.map((registration) => `
        <div class="event-shell">
          <div>
            <strong>${escapeHTML(registration.eventTitle)}</strong>
            <small>${formatDate(registration.eventDate)} · ${escapeHTML(registration.eventVenue)}</small>
          </div>
          <span class="event-pill">${registration.status === 'waitlisted' ? 'Waitlist' : 'Booked'}</span>
        </div>
      `
    ).join('')
    : '<p class="empty-state">Sign in to see your upcoming event bookings.</p>';
}

function renderEvents() {
  const eventsGrid = document.getElementById('eventsGrid');
  eventsGrid.innerHTML = state.events
    .map(
      (event, index) => `
        <article class="event-card">
          <div class="poster" style="background-image: url('${escapeHTML(event.poster)}')"></div>
          <div class="event-info">
            <div class="meta">
              <span>${escapeHTML(event.category)}</span>
              <span>${escapeHTML(formatDate(event.date))}</span>
            </div>
            <h3>${escapeHTML(event.title)}</h3>
            <p>${escapeHTML(event.venue)}</p>
            <p style="margin-top: 10px;">${escapeHTML(event.description)}</p>
            <p class="event-attendee-count">${getEventAttendeeCount(event)} registered</p>
            <p class="event-capacity-count">${getEventWaitlistCount(event)} waitlisted · ${Number(event.capacity) > 0 ? `${getEventAttendeeCount(event)} / ${Number(event.capacity)} places` : 'No capacity limit'}</p>
            ${
              state.role === 'admin'
                ? `<div class="event-attendee-list"><strong>Attendees</strong>${renderEventAttendees(event)}</div><div class="card-actions compact-actions"><button type="button" class="delete-btn" data-delete-type="event" data-index="${index}">Delete</button></div>`
                : `<div class="event-actions"><button type="button" class="primary-btn small" data-register-event-index="${index}">Register</button><button type="button" class="calendar-add-btn" data-add-calendar-index="${index}" title="Download an event reminder">Add reminder</button><button type="button" class="calendar-add-btn" data-share-event-email="${index}" title="Share event by email">Email</button><button type="button" class="calendar-add-btn" data-share-event-whatsapp="${index}" title="Share event on WhatsApp">WhatsApp</button></div>`
            }
          </div>
        </article>
      `
    )
    .join('');
  renderEventCalendar();
}

function renderEventCalendar() {
  const calendar = document.getElementById('eventCalendar');
  if (!calendar) {
    return;
  }

  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  document.getElementById('calendarMonthLabel').textContent = state.calendarDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const headings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = headings.map((heading) => `<div class="calendar-weekday" role="columnheader">${heading}</div>`);

  for (let index = 0; index < 42; index += 1) {
    const day = index - firstDay + 1;
    if (day < 1 || day > daysInMonth) {
      cells.push('<div class="calendar-day outside-month" role="gridcell" aria-hidden="true"></div>');
      continue;
    }
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = state.events
      .map((event, eventIndex) => ({ event, eventIndex }))
      .filter(({ event }) => event.date === date);
    cells.push(`
      <div class="calendar-day${dayEvents.length ? ' has-event' : ''}" role="gridcell">
        <span class="calendar-day-number">${day}</span>
        ${dayEvents.map(({ event, eventIndex }) => `
          <button class="calendar-event-link" type="button" data-calendar-event-index="${eventIndex}" title="${escapeHTML(event.title)}">
            ${escapeHTML(event.title)}
          </button>
        `).join('')}
      </div>
    `);
  }
  calendar.innerHTML = cells.join('');
}

function renderInterestGroups() {
  const groups = Array.isArray(state.interestGroups) ? state.interestGroups : defaultInterestGroups;
  const groupGrid = document.getElementById('interestGroupsGrid');
  const groupSelect = document.getElementById('interestGroupSelect');
  if (!groupGrid || !groupSelect) {
    return;
  }
  groupGrid.innerHTML = groups.map((group) => `
    <article class="interest-group-card">
      <span class="interest-group-mark">${escapeHTML(group.name.slice(0, 1))}</span>
      <h3>${escapeHTML(group.name)}</h3>
      <p>${escapeHTML(group.description)}</p>
    </article>
  `).join('');
  groupSelect.innerHTML = '<option value="">Choose a group</option>' + groups.map((group) => `
    <option value="${escapeHTML(group.id)}">${escapeHTML(group.name)}</option>
  `).join('');
}

function renderCommunityHighlights() {
  const spotlight = document.getElementById('memberSpotlight');
  const milestones = document.getElementById('milestoneList');
  if (spotlight) {
    spotlight.innerHTML = state.spotlight
      ? `<article class="spotlight-card"><span class="spotlight-initial">${escapeHTML(state.spotlight.name.slice(0, 1))}</span><div><h3>${escapeHTML(state.spotlight.name)}</h3><span class="spotlight-role">${escapeHTML(state.spotlight.role)}</span><p>${escapeHTML(state.spotlight.story)}</p></div></article>`
      : '<p class="empty-state">A youth member will be featured here soon.</p>';
  }
  if (milestones) {
    milestones.innerHTML = state.milestones.length
      ? state.milestones.slice(0, 6).map((milestone) => `
        <article class="milestone-item"><span class="milestone-dot"></span><div><span class="milestone-type">${escapeHTML(milestone.type)}</span><h3>${escapeHTML(milestone.name)}</h3><p>${escapeHTML(milestone.message)}</p></div></article>
      `).join('')
      : '<p class="empty-state">Community achievements will appear here.</p>';
  }
}

function renderAdminCommunityTools() {
  const memberSelect = document.getElementById('serviceMemberSelect');
  if (memberSelect) {
    const selectedMember = memberSelect.value;
    memberSelect.innerHTML = '<option value="">Choose a member</option>' + state.members.map((member) => {
      const key = member.email || member.name;
      return `<option value="${escapeHTML(key)}">${escapeHTML(member.name)}</option>`;
    }).join('');
    if ([...memberSelect.options].some((option) => option.value === selectedMember)) {
      memberSelect.value = selectedMember;
    }
  }

  const totalHours = state.serviceLogs.reduce((total, log) => total + Number(log.hours || 0), 0);
  const summary = document.getElementById('serviceHoursSummary');
  if (summary) {
    summary.innerHTML = `<strong>${totalHours.toFixed(1)}</strong><span>service hours recorded</span>`;
  }
  const logs = document.getElementById('serviceLogsList');
  if (logs) {
    logs.innerHTML = state.serviceLogs.length
      ? state.serviceLogs.slice(0, 12).map((log) => `
        <article class="admin-review-item"><div><strong>${escapeHTML(log.memberName)}</strong><p>${escapeHTML(log.activity)} · ${escapeHTML(formatDate(log.date))}</p></div><span class="review-status">${Number(log.hours).toFixed(1)} hrs</span></article>
      `).join('')
      : '<p class="empty-state">Attendance and service entries will appear here.</p>';
  }

  const prayerList = document.getElementById('prayerRequestsList');
  if (prayerList) {
    prayerList.innerHTML = state.prayerRequests.length
      ? state.prayerRequests.map((request, index) => `
        <article class="admin-review-item"><div><strong>${escapeHTML(request.name)} · ${escapeHTML(request.status || 'New')}</strong><p>${escapeHTML(request.message)}</p><small>${escapeHTML(new Date(request.submittedAt).toLocaleString())}</small></div><button class="chip-btn" type="button" data-review-prayer="${index}">${request.status === 'Reviewed' ? 'Reviewed' : 'Mark reviewed'}</button></article>
      `).join('')
      : '<p class="empty-state">No private requests have been submitted.</p>';
  }

  const groupRequests = document.getElementById('groupInterestRequestsList');
  if (groupRequests) {
    groupRequests.innerHTML = state.groupInterestRequests.length
      ? state.groupInterestRequests.map((request) => `
        <article class="admin-review-item"><div><strong>${escapeHTML(request.name)} · ${escapeHTML(request.groupName)}</strong><p>${escapeHTML(request.email)}</p></div><span class="review-status">New</span></article>
      `).join('')
      : '<p class="empty-state">No group interests yet.</p>';
  }

  const photoList = document.getElementById('photoSubmissionsList');
  if (photoList) {
    photoList.innerHTML = state.photoSubmissions.length
      ? state.photoSubmissions.map((submission, index) => `
        <article class="photo-review-item"><img src="${escapeHTML(submission.image)}" alt="${escapeHTML(submission.title)}"><div><strong>${escapeHTML(submission.title)}</strong><p>${escapeHTML(submission.category)} · ${escapeHTML(submission.status)}</p><div class="review-actions"><button class="primary-btn small" type="button" data-review-photo="approve" data-index="${index}">Approve</button><button class="secondary-btn small" type="button" data-review-photo="reject" data-index="${index}">Reject</button></div></div></article>
      `).join('')
      : '<p class="empty-state">No photos are waiting for review.</p>';
  }

  const shiftsList = document.getElementById('adminVolunteerShiftsList');
  if (shiftsList) {
    shiftsList.innerHTML = state.volunteerShifts.length
      ? state.volunteerShifts.map((shift) => {
        const signups = state.shiftSignups.filter((signup) => signup.shiftId === shift.id);
        const booked = signups.filter((signup) => signup.status === 'booked').length;
        return `<article class="admin-review-item"><div><strong>${escapeHTML(shift.title)}</strong><p>${escapeHTML(shift.eventTitle)}</p><small>${booked}/${Number(shift.capacity)} places</small><p>${signups.map((signup) => `${escapeHTML(signup.name)} (${escapeHTML(signup.status)})`).join(', ') || 'No signups yet'}</p></div></article>`;
      }).join('')
      : '<p class="empty-state">Create a shift for members to join.</p>';
  }
}

function renderVolunteerShifts() {
  const grid = document.getElementById('volunteerShiftsGrid');
  const select = document.getElementById('volunteerShiftSelect');
  if (!grid || !select) {
    return;
  }
  grid.innerHTML = state.volunteerShifts.length
    ? state.volunteerShifts.map((shift) => {
      const booked = Number(state.shiftSignupCounts[shift.id] || 0);
      const spotsLeft = Math.max(0, Number(shift.capacity) - booked);
      return `<article class="event-card shift-card"><div class="event-info"><div class="meta"><span>Volunteer shift</span><span>${spotsLeft ? `${spotsLeft} places left` : 'Waitlist open'}</span></div><h3>${escapeHTML(shift.title)}</h3><p>${escapeHTML(shift.eventTitle)}</p><p>${booked} / ${Number(shift.capacity)} places filled</p><button class="primary-btn small" type="button" data-select-shift="${escapeHTML(shift.id)}">${spotsLeft ? 'Choose this shift' : 'Join the waitlist'}</button></div></article>`;
    }).join('')
    : '<p class="empty-state">Volunteer shifts will be posted here.</p>';
  select.innerHTML = '<option value="">Choose a shift</option>' + state.volunteerShifts.map((shift) => {
    const booked = Number(state.shiftSignupCounts[shift.id] || 0);
    const spotsLeft = Math.max(0, Number(shift.capacity) - booked);
    return `<option value="${escapeHTML(shift.id)}">${escapeHTML(shift.title)} · ${spotsLeft ? `${spotsLeft} places left` : 'waitlist'}</option>`;
  }).join('');
  const form = document.getElementById('volunteerShiftSignupForm');
  if (state.currentMember && form) {
    form.elements.name.value = state.currentMember.name || '';
    form.elements.email.value = state.currentMember.email || '';
  }
}

function eventMatchesRegistration(event, registration) {
  return registration.eventTitle === event.title
    && registration.eventDate === event.date
    && registration.eventVenue === event.venue;
}

function getEventAttendeeCount(event) {
  const count = state.eventRegistrationCounts.find((registration) => eventMatchesRegistration(event, registration));
  return Number.isInteger(count?.attendeeCount) ? count.attendeeCount : 0;
}

function getEventWaitlistCount(event) {
  const count = state.eventRegistrationCounts.find((registration) => eventMatchesRegistration(event, registration));
  return Number.isInteger(count?.waitlistCount) ? count.waitlistCount : 0;
}

function renderEventAttendees(event) {
  const attendees = state.eventRegistrations.filter((registration) => eventMatchesRegistration(event, registration));
  return attendees.length
    ? `<ul>${attendees.map((attendee) => `<li><strong>${escapeHTML(attendee.name)}</strong> <span>${escapeHTML(attendee.email)} · ${escapeHTML(attendee.status || 'registered')}${attendee.checkedInAt ? ' · checked in' : ''}</span></li>`).join('')}</ul>`
    : '<p>No registrations yet.</p>';
}

function renderMemberAccountActivity() {
  const summary = document.getElementById('memberAccountSummary');
  if (!summary) {
    return;
  }
  summary.classList.toggle('hidden', state.role !== 'member');
  const totalHours = state.memberServiceLogs.reduce((total, log) => total + Number(log.hours || 0), 0);
  document.getElementById('memberServiceHoursTotal').textContent = `${totalHours.toFixed(1)} service hours`;
  document.getElementById('memberAccountEvents').innerHTML = state.memberRegistrations.length
    ? `<h4>My event registrations</h4>${state.memberRegistrations.map((registration, index) => `<article class="member-booking"><p>${escapeHTML(registration.eventTitle)} · ${escapeHTML(formatDate(registration.eventDate))} · ${escapeHTML(registration.status || 'registered')}${registration.checkedInAt ? ' · checked in' : ''}</p><div>${registration.status !== 'waitlisted' && registration.status !== 'cancelled' ? `<button type="button" class="calendar-add-btn" data-member-ticket="${index}">Show check-in pass</button>` : ''}${['registered', 'waitlisted', undefined].includes(registration.status) ? `<button type="button" class="calendar-add-btn" data-cancel-booking="${index}">Cancel booking</button>` : ''}</div></article>`).join('')}`
    : '<p>No event registrations yet.</p>';
  document.getElementById('memberAccountShifts').innerHTML = state.memberShiftSignups.length
    ? `<h4>My volunteer shifts</h4>${state.memberShiftSignups.map((signup) => `<p>${escapeHTML(signup.shiftTitle)} · ${escapeHTML(signup.status)}</p>`).join('')}`
    : '<p>No volunteer shifts joined yet.</p>';
}

function openEventRegistration(index) {
  const event = state.events[index];
  if (!event) {
    return;
  }
  state.pendingEventIndex = index;
  document.getElementById('eventRegistrationTitle').textContent = `Register for ${event.title}`;
  document.getElementById('eventRegistrationDetails').textContent = `${formatDate(event.date)} · ${event.venue}`;
  document.getElementById('eventRegistrationMessage').textContent = '';
  document.getElementById('eventRegistrationMessage').classList.remove('error');
  const form = document.getElementById('eventRegistrationForm');
  form.reset();
  form.classList.remove('hidden');
  if (state.currentMember) {
    form.elements.name.value = state.currentMember.name || '';
    form.elements.email.value = state.currentMember.email || '';
  }
  document.getElementById('eventTicketPanel').classList.add('hidden');
  document.getElementById('eventRegistrationModal').classList.remove('hidden');
}

async function showMemberEventTicket(registration) {
  const feedback = document.getElementById('memberLoginFeedback');
  try {
    const response = await fetch('/api/members/ticket', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Could not retrieve your check-in pass.');
    }
    document.getElementById('eventRegistrationTitle').textContent = registration.eventTitle;
    document.getElementById('eventRegistrationDetails').textContent = `${formatDate(registration.eventDate)} · ${registration.eventVenue}`;
    document.getElementById('eventRegistrationForm').classList.add('hidden');
    document.getElementById('eventTicketToken').textContent = result.checkinToken;
    document.getElementById('eventTicketPanel').classList.remove('hidden');
    renderEventTicketQr(result.checkinToken);
    document.getElementById('eventRegistrationModal').classList.remove('hidden');
  } catch (error) {
    if (feedback) {
      feedback.textContent = error.message || 'Could not retrieve your check-in pass.';
      feedback.classList.add('error');
    }
  }
}

async function cancelMemberBooking(registration) {
  const response = await fetch('/api/events/cancel', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Could not cancel this booking.');
  }
  await hydrateStateFromServer();
  renderDashboardContent();
  alert(result.waitlistedAttendeePromoted
    ? 'Your booking was cancelled. The next person on the waitlist was promoted.'
    : 'Your booking was cancelled.');
}

function handleMemberBookingAction(event) {
  const ticketButton = event.target.closest('[data-member-ticket]');
  const cancelButton = event.target.closest('[data-cancel-booking]');
  const button = ticketButton || cancelButton;
  if (!button || state.role !== 'member') {
    return;
  }
  const registration = state.memberRegistrations[Number(button.dataset.memberTicket ?? button.dataset.cancelBooking)];
  if (!registration) {
    return;
  }
  if (ticketButton) {
    void showMemberEventTicket(registration);
  } else {
    void cancelMemberBooking(registration).catch((error) => alert(error.message));
  }
}

function closeEventRegistration() {
  document.getElementById('eventRegistrationModal').classList.add('hidden');
  state.pendingEventIndex = null;
}

async function handleEventRegistrationSubmit(event) {
  event.preventDefault();
  const selectedEvent = state.events[state.pendingEventIndex];
  const message = document.getElementById('eventRegistrationMessage');
  const submitButton = document.getElementById('eventRegistrationSubmitBtn');
  if (!selectedEvent) {
    message.textContent = 'This event is no longer available.';
    message.classList.add('error');
    return;
  }

  const values = new FormData(event.target);
  submitButton.disabled = true;
  message.textContent = 'Submitting your registration…';
  message.classList.remove('error');
  try {
    const response = await fetch('/api/events/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        eventVenue: selectedEvent.venue,
        name: state.currentMember?.name || values.get('name').trim(),
        email: state.currentMember?.email || values.get('email').trim(),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Event registration could not be completed.');
    }

    const registration = {
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date,
      eventVenue: selectedEvent.venue,
      name: state.currentMember?.name || values.get('name').trim(),
      email: state.currentMember?.email || values.get('email').trim().toLowerCase(),
      status: result.status,
    };
    const existingCount = state.eventRegistrationCounts.find((item) => eventMatchesRegistration(selectedEvent, item));
    if (existingCount) {
      existingCount.attendeeCount = result.attendeeCount;
      existingCount.waitlistCount = result.waitlistPosition
        ? Math.max(existingCount.waitlistCount || 0, result.waitlistPosition)
        : existingCount.waitlistCount || 0;
    } else {
      state.eventRegistrationCounts.push({
        ...registration,
        attendeeCount: result.attendeeCount,
        waitlistCount: result.waitlistPosition || 0,
      });
    }
    if (state.role === 'admin') {
      state.eventRegistrations.push(registration);
    }
    if (state.role === 'member') {
      state.memberRegistrations.unshift(registration);
    }
    if (result.checkinToken) {
      const ticketPanel = document.getElementById('eventTicketPanel');
      document.getElementById('eventTicketToken').textContent = result.checkinToken;
      ticketPanel.classList.remove('hidden');
      renderEventTicketQr(result.checkinToken);
    }
    renderEvents();
    message.textContent = result.status === 'waitlisted'
      ? `This event is full. You are #${result.waitlistPosition} on the waitlist.`
      : 'You are confirmed. Keep your check-in pass for event day.';
    renderMemberEvents();
    renderMemberAccountActivity();
    event.target.reset();
  } catch (error) {
    message.textContent = error.message || 'Event registration could not be completed.';
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
  }

}

function renderGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const filteredGallery =
    state.activeFilter === 'all'
      ? state.gallery
      : state.gallery.filter((item) => item.category === state.activeFilter);

  galleryGrid.innerHTML = filteredGallery
    .map(
      (item, index) => `
        <article class="gallery-card" data-gallery-index="${index}">
          <div class="gallery-image" style="background-image: url('${item.image}')"></div>
          <div class="gallery-info">
            <h3>${item.title}</h3>
            <span class="caption-tag">${item.category}</span>
            ${
              state.role === 'admin'
                ? `<div class="card-actions compact-actions"><button type="button" class="delete-btn" data-delete-type="gallery" data-index="${index}">Delete</button></div>`
                : ''
            }
          </div>
        </article>
      `
    )
    .join('');
}

function renderExecutives() {
  const executivesGrid = document.getElementById('executivesGrid');
  executivesGrid.innerHTML = state.executives
    .map(
      (executive, index) => `
        <article class="executive-card">
          <div class="executive-photo">
            ${
              executive.image
                ? `<img src="${executive.image}" alt="${executive.name}">`
                : `<div class="executive-avatar">${executive.initials}</div>`
            }
          </div>
          <div class="executive-top">
            <div class="executive-info">
              <h3>${executive.name}</h3>
              <span class="role">${executive.role}</span>
            </div>
          </div>
          <p>${executive.quote}</p>
          <div class="executive-stats">
            <span>${executive.focus}</span>
            <span>Open</span>
          </div>
          ${
            state.role === 'admin'
              ? `<div class="card-actions compact-actions"><button type="button" class="delete-btn" data-delete-type="executive" data-index="${index}">Delete</button></div>`
              : ''
          }
        </article>
      `
    )
    .join('');
}

function switchDashboard(view) {
  state.activeView = view;
  document.querySelectorAll('.view-toggle').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  document.getElementById('adminDashboard').classList.toggle('active', view === 'admin');
  document.getElementById('memberDashboard').classList.toggle('active', view === 'member');
}

function setupDashboardButtons() {
  document.querySelectorAll('.view-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.view === 'member') {
        playDuesToggleSound();
      }

      if (button.dataset.view === 'admin' && state.role !== 'admin') {
        openLoginModal();
        return;
      }

      if (button.dataset.view === 'member' && state.role !== 'member') {
        openDuesPaymentModal();
        return;
      }

      switchDashboard(button.dataset.view);
      if (button.dataset.view === 'member') {
        openDuesPaymentModal();
      }
    });
  });

  document.getElementById('openDuesPaymentBtn').addEventListener('click', () => {
    playDuesToggleSound();
    openDuesPaymentModal();
  });
  document.getElementById('closeDuesPaymentModalBtn').addEventListener('click', closeDuesPaymentModal);
}

function playDuesToggleSound() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    return;
  }

  const audioContext = new AudioContextConstructor();
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  const startTime = audioContext.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, startTime);
  oscillator.frequency.setValueAtTime(880, startTime + 0.09);
  volume.gain.setValueAtTime(0.0001, startTime);
  volume.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
  volume.gain.setValueAtTime(0.12, startTime + 0.1);
  volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);
  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.onended = () => audioContext.close();
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.29);
}

function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeFilter = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn === button);
      });
      renderGallery();
    });
  });
}

function handleEventFormSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const posterFile = form.get('poster');
  const title = form.get('title').trim();
  const date = form.get('date');
  const venue = form.get('venue').trim();
  const category = form.get('category');
  const description = form.get('description').trim();
  const capacity = Number(form.get('capacity') || 40);

  if (!title || !date || !venue || !description || !Number.isInteger(capacity) || capacity < 1 || capacity > 5000) {
    return;
  }

  const eventObject = {
    title,
    date,
    venue,
    category,
    description,
    capacity,
    poster:
      posterFile && posterFile.name
        ? 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
  };

  state.events.unshift(eventObject);
  saveEvents();
  renderEvents();
  renderStats();
  renderMemberEvents();
  event.target.reset();
}

function handleMemberFormSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const name = form.get('memberName').trim();
  const role = form.get('memberRole').trim();
  const status = form.get('memberStatus');

  if (!name || !role) {
    return;
  }

  state.members.unshift({
    name,
    role,
    engagement: 'New',
    status,
  });

  saveMembers();
  renderMemberTable();
  renderStats();
  event.target.reset();
}

function updateSignupEmploymentDetailField() {
  const employmentStatusSelect = document.querySelector('[name="signupEmploymentStatus"]');
  const detailLabel = document.getElementById('signupEmploymentDetailLabel');
  const detailInput = document.getElementById('signupEmploymentDetail');
  const detailLabelText = document.getElementById('signupEmploymentDetailLabelText');
  const employmentStatus = employmentStatusSelect?.value || '';

  const detailConfig = {
    Student: {
      label: 'School name',
      placeholder: 'Enter the school name',
    },
    Employed: {
      label: 'Employer / workplace name',
      placeholder: 'Enter the company or workplace name',
    },
    'Self-employed': {
      label: 'Business / workplace name',
      placeholder: 'Enter the business or workplace name',
    },
  };

  const shouldShowDetail = ['Student', 'Employed', 'Self-employed'].includes(employmentStatus);

  detailLabel?.classList.toggle('hidden', !shouldShowDetail);
  detailInput.placeholder = detailConfig[employmentStatus]?.placeholder || 'Enter the school name';
  detailLabelText.textContent = detailConfig[employmentStatus]?.label || 'School name';

  if (!shouldShowDetail) {
    detailInput.value = '';
  }
}

async function handleMemberSignupSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const name = form.get('signupName').trim();
  const email = form.get('signupEmail').trim();
  const password = form.get('signupPassword')?.toString() || '';
  const role = form.get('signupRole').trim();
  const dob = form.get('signupDob')?.trim() || '';
  const age = form.get('signupAge')?.trim() || '';
  const dayBornGroup = form.get('signupDayBornGroup')?.trim() || '';
  const location = form.get('signupLocation')?.trim() || '';
  const employmentStatus = form.get('signupEmploymentStatus')?.trim() || '';
  const employmentDetail = form.get('signupEmploymentDetail')?.trim() || '';
  const contact = form.get('signupContact')?.trim() || '';
  const emergencyContact = form.get('signupEmergencyContact')?.trim() || '';

  const requiresEmploymentDetail = ['Student', 'Employed', 'Self-employed'].includes(employmentStatus);

  if (!name || !email || password.length < 12 || !role || !dob || !age || !dayBornGroup || !location || !employmentStatus || !contact || !emergencyContact || (requiresEmploymentDetail && !employmentDetail)) {
    alert('Please complete all signup fields before registering.');
    return;
  }

  try {
    const response = await fetch('/api/members/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        dob,
        age,
        dayBornGroup,
        location,
        employmentStatus,
        employmentDetail,
        contact,
        emergencyContact,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Your registration could not be completed.');
    }

    event.target.reset();
    closeSignupModal();
    await hydrateStateFromServer();
    updateAuthUI();
    alert('Your MMOGCC YOUTH membership signup has been received.');
  } catch (error) {
    alert(error.message || 'Your registration could not be completed. Please try again.');
  }
}

async function handleMemberLoginSubmit(event) {
  event.preventDefault();
  const feedback = document.getElementById('memberLoginFeedback');
  const values = new FormData(event.currentTarget);
  feedback.textContent = 'Signing in…';
  feedback.classList.remove('error');
  try {
    const response = await fetch('/api/members/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.get('email').trim(), password: values.get('password') }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Member sign-in failed.');
    }
    await hydrateStateFromServer();
    if (state.role !== 'member') {
      throw new Error('The server did not establish a member session.');
    }
    event.currentTarget.reset();
    feedback.textContent = '';
    updateAuthUI();
  } catch (error) {
    feedback.textContent = error.message || 'Member sign-in failed.';
    feedback.classList.add('error');
  }
}

function openDuesPaymentModal() {
  const modal = document.getElementById('duesPaymentModal');
  const form = document.getElementById('duesPaymentForm');
  const member = state.currentMember;
  state.pendingDuesCheckout = null;
  form.reset();
  form.elements.duesName.value = member?.name || '';
  form.elements.duesEmail.value = member?.email || '';
  const button = document.getElementById('duesPaymentButton');
  button.disabled = false;
  button.classList.remove('hidden');
  button.textContent = 'Generate payment reference';
  document.getElementById('retryDuesVerificationBtn').classList.add('hidden');
  setDuesPaymentMessage('');
  modal.classList.remove('hidden');
}

function closeDuesPaymentModal() {
  document.getElementById('duesPaymentModal').classList.add('hidden');
}

function setDuesPaymentMessage(message, isError = false) {
  const status = document.getElementById('duesPaymentMessage');
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle('error', isError);
}

async function readPaymentApiResponse(response, fallbackMessage) {
  const responseBody = await response.text();
  let result;

  try {
    result = JSON.parse(responseBody);
  } catch {
    throw new Error(
      `Payment server returned an unexpected response (HTTP ${response.status}). Run "python server.py" and open http://localhost:8000.`
    );
  }

  if (!response.ok) {
    throw new Error(result.error || fallbackMessage);
  }

  return result;
}

async function handleDuesPaymentSubmit(event) {
  event.preventDefault();
  if (state.pendingDuesCheckout) {
    window.location.assign(state.pendingDuesCheckout.authorizationUrl);
    return;
  }

  if (window.location.protocol === 'file:') {
    setDuesPaymentMessage(
      'Payments need the app server. Set PAYSTACK_SECRET_KEY, run "python server.py", then open http://localhost:8000.',
      true
    );
    return;
  }

  const form = new FormData(event.currentTarget);
  const name = form.get('duesName').trim();
  const email = form.get('duesEmail').trim();
  const amount = form.get('duesAmount');
  const button = document.getElementById('duesPaymentButton');
  button.disabled = true;
  setDuesPaymentMessage('Generating your payment reference…');

  try {
    const response = await fetch('/api/payments/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, amount }),
    });
    const result = await readPaymentApiResponse(response, 'Could not start your payment.');
    if (!result.reference || !result.authorizationUrl) {
      throw new Error('Payment server did not return a reference and checkout link.');
    }

    state.pendingDuesCheckout = result;
    document.getElementById('duesPaymentReference').value = result.reference;
    button.textContent = 'Continue to Paystack';
    setDuesPaymentMessage('Reference generated. Save it, then continue to secure checkout.');
  } catch (error) {
    setDuesPaymentMessage(error.message || 'Could not start your payment. Please try again.', true);
  } finally {
    button.disabled = false;
  }
}

async function verifyReturnedDuesPayment() {
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference') || params.get('trxref');
  if (!reference || !reference.startsWith('MMOGCC-')) {
    return;
  }

  openDuesPaymentModal();
  document.getElementById('duesPaymentReference').value = reference;
  if (await verifyDuesPaymentReference(reference)) {
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
  }
}

async function verifyDuesPaymentReference(reference) {
  setDuesPaymentMessage('Confirming your payment with Paystack…');
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    });
    const result = await readPaymentApiResponse(response, 'Your payment could not be confirmed.');

    const amount = Number(result.amount).toFixed(2);
    setDuesPaymentMessage(
      `Payment confirmed: ${result.currency} ${amount}. Reference: ${result.reference}.`
    );
    document.getElementById('duesPaymentForm').elements.duesAmount.value = amount;
    document.getElementById('duesPaymentForm').elements.duesName.value = result.memberName;
    document.getElementById('duesPaymentButton').classList.add('hidden');
    document.getElementById('retryDuesVerificationBtn').classList.add('hidden');
    return true;
  } catch (error) {
    setDuesPaymentMessage(error.message || 'Your payment could not be confirmed. Please try again.', true);
    document.getElementById('duesPaymentButton').classList.add('hidden');
    document.getElementById('retryDuesVerificationBtn').classList.remove('hidden');
    return false;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleGalleryFormSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const file = form.get('galleryImage');
  const caption = form.get('caption').trim();
  const category = form.get('category');

  if (!file || !file.name) {
    return;
  }

  const image = await readFileAsDataUrl(file);
  state.gallery.unshift({
    title: caption || 'New gallery item',
    category,
    image,
  });

  saveGallery();
  renderGallery();
  renderStats();
  event.target.reset();
}

async function handleExecutiveFormSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const file = form.get('executiveImage');
  const name = form.get('executiveName').trim();
  const role = form.get('executiveRole').trim();
  const focus = form.get('executiveFocus').trim();
  const quote = form.get('executiveQuote').trim();

  if (!file || !file.name || !name || !role || !focus || !quote) {
    return;
  }

  const image = await readFileAsDataUrl(file);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  state.executives.unshift({
    name,
    role,
    focus,
    quote,
    initials,
    image,
  });

  saveExecutives();
  renderExecutives();
  renderStats();
  event.target.reset();
}

function bindFormHandlers() {
  document.getElementById('eventForm').addEventListener('submit', handleEventFormSubmit);
  document.getElementById('eventRegistrationForm').addEventListener('submit', handleEventRegistrationSubmit);
  document.getElementById('closeEventRegistrationModalBtn').addEventListener('click', closeEventRegistration);
  document.getElementById('eventRegistrationModal').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closeEventRegistration();
    }
  });
  document.getElementById('galleryForm').addEventListener('submit', handleGalleryFormSubmit);
  document.getElementById('memberForm').addEventListener('submit', handleMemberFormSubmit);
  const duesPaymentForm = document.getElementById('duesPaymentForm');
  duesPaymentForm.addEventListener('submit', handleDuesPaymentSubmit);
  ['duesName', 'duesEmail', 'duesAmount'].forEach((fieldName) => {
    duesPaymentForm.elements[fieldName].addEventListener('input', () => {
      state.pendingDuesCheckout = null;
      document.getElementById('duesPaymentReference').value = '';
      document.getElementById('duesPaymentButton').textContent = 'Generate payment reference';
      document.getElementById('duesPaymentButton').classList.remove('hidden');
      document.getElementById('retryDuesVerificationBtn').classList.add('hidden');
    });
  });
  document.getElementById('retryDuesVerificationBtn').addEventListener('click', async () => {
    const reference = document.getElementById('duesPaymentReference').value;
    if (await verifyDuesPaymentReference(reference)) {
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
    }
  });
  document.getElementById('executiveForm').addEventListener('submit', handleExecutiveFormSubmit);
  bindCommunityForms();

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleMemberSignupSubmit);
  }

  const signupEmploymentStatus = document.querySelector('[name="signupEmploymentStatus"]');
  if (signupEmploymentStatus) {
    signupEmploymentStatus.addEventListener('change', updateSignupEmploymentDetailField);
    updateSignupEmploymentDetailField();
  }
}

function bindMemberOverviewControls() {
  const searchInput = document.getElementById('memberSearchInput');
  const statusFilter = document.getElementById('memberStatusFilter');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderMemberTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderMemberTable();
    });
  }
}

function handleDeleteItemClick(event) {
  const deleteButton = event.target.closest('[data-delete-type]');
  if (!deleteButton) {
    return;
  }

  const type = deleteButton.dataset.deleteType;
  const index = Number(deleteButton.dataset.index);

  if (Number.isNaN(index)) {
    return;
  }

  if (type === 'member') {
    state.members.splice(index, 1);
    saveMembers();
  }

  if (type === 'event') {
    state.events.splice(index, 1);
    saveEvents();
  }

  if (type === 'gallery') {
    state.gallery.splice(index, 1);
    saveGallery();
  }

  if (type === 'executive') {
    state.executives.splice(index, 1);
    saveExecutives();
  }

  renderDashboardContent();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEditForm(type, index) {
  const item = state[type]?.[index];
  if (!item) {
    return '';
  }

  if (type === 'member') {
    const employmentDetailLabel = item.employmentStatus === 'Student'
      ? 'School name'
      : item.employmentStatus === 'Employed'
        ? 'Employer / workplace name'
        : item.employmentStatus === 'Self-employed'
          ? 'Business / workplace name'
          : 'Employment detail';

    return `
      <div class="field-row">
        <label>
          Full name
          <input type="text" name="name" value="${escapeHtml(item.name || '')}" required />
        </label>
        <label>
          Role
          <input type="text" name="role" value="${escapeHtml(item.role || '')}" required />
        </label>
      </div>
      <div class="field-row">
        <label>
          Email
          <input type="email" name="email" value="${escapeHtml(item.email || '')}" />
        </label>
        <label>
          Status
          <select name="status">
            <option value="Active" ${item.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Review" ${item.status === 'Review' ? 'selected' : ''}>Review</option>
          </select>
        </label>
      </div>
      <div class="field-row">
        <label>
          Engagement
          <input type="text" name="engagement" value="${escapeHtml(item.engagement || '')}" required />
        </label>
        <label>
          Date of birth
          <input type="date" name="dob" value="${escapeHtml(item.dob || '')}" />
        </label>
      </div>
      <div class="field-row">
        <label>
          Age
          <input type="number" name="age" min="1" max="120" value="${escapeHtml(item.age || '')}" />
        </label>
        <label>
          Day born group
          <select name="dayBornGroup">
            <option value="" ${!item.dayBornGroup ? 'selected' : ''}>Select day born group</option>
            <option value="Monday" ${item.dayBornGroup === 'Monday' ? 'selected' : ''}>Monday</option>
            <option value="Tuesday" ${item.dayBornGroup === 'Tuesday' ? 'selected' : ''}>Tuesday</option>
            <option value="Wednesday" ${item.dayBornGroup === 'Wednesday' ? 'selected' : ''}>Wednesday</option>
            <option value="Thursday" ${item.dayBornGroup === 'Thursday' ? 'selected' : ''}>Thursday</option>
            <option value="Friday" ${item.dayBornGroup === 'Friday' ? 'selected' : ''}>Friday</option>
            <option value="Saturday" ${item.dayBornGroup === 'Saturday' ? 'selected' : ''}>Saturday</option>
            <option value="Sunday" ${item.dayBornGroup === 'Sunday' ? 'selected' : ''}>Sunday</option>
          </select>
        </label>
      </div>
      <div class="field-row">
        <label>
          Location
          <input type="text" name="location" value="${escapeHtml(item.location || '')}" />
        </label>
        <label>
          Employment status
          <select name="employmentStatus">
            <option value="" ${!item.employmentStatus ? 'selected' : ''}>Select employment status</option>
            <option value="Employed" ${item.employmentStatus === 'Employed' ? 'selected' : ''}>Employed</option>
            <option value="Self-employed" ${item.employmentStatus === 'Self-employed' ? 'selected' : ''}>Self-employed</option>
            <option value="Student" ${item.employmentStatus === 'Student' ? 'selected' : ''}>Student</option>
            <option value="Unemployed" ${item.employmentStatus === 'Unemployed' ? 'selected' : ''}>Unemployed</option>
          </select>
        </label>
      </div>
      <div class="field-row">
        <label>
          Employment detail
          <input type="text" name="employmentDetail" value="${escapeHtml(item.employmentDetail || '')}" placeholder="${escapeHtml(employmentDetailLabel)}" />
        </label>
        <label>
          Contact
          <input type="text" name="contact" value="${escapeHtml(item.contact || '')}" />
        </label>
      </div>
      <div class="field-row">
        <label>
          Emergency contact
          <input type="text" name="emergencyContact" value="${escapeHtml(item.emergencyContact || '')}" />
        </label>
      </div>
      <button type="submit" class="primary-btn">Save changes</button>
    `;
  }

  if (type === 'event') {
    return `
      <div class="field-row">
        <label>
          Event title
          <input type="text" name="title" value="${escapeHtml(item.title || '')}" required />
        </label>
        <label>
          Date
          <input type="date" name="date" value="${escapeHtml(item.date || '')}" required />
        </label>
      </div>
      <div class="field-row">
        <label>
          Venue
          <input type="text" name="venue" value="${escapeHtml(item.venue || '')}" required />
        </label>
        <label>
          Category
          <select name="category">
            <option value="Training" ${item.category === 'Training' ? 'selected' : ''}>Training</option>
            <option value="Outreach" ${item.category === 'Outreach' ? 'selected' : ''}>Outreach</option>
            <option value="Workshop" ${item.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
            <option value="Social" ${item.category === 'Social' ? 'selected' : ''}>Social</option>
          </select>
        </label>
      </div>
      <label>
        Description
        <textarea name="description" rows="4" required>${escapeHtml(item.description || '')}</textarea>
      </label>
      <label>
        Attendee capacity
        <input type="number" name="capacity" min="1" max="5000" value="${Number(item.capacity) || 40}" required />
      </label>
      <label>
        Update poster image
        <input type="file" name="poster" accept="image/*" />
      </label>
      <button type="submit" class="primary-btn">Save changes</button>
    `;
  }

  if (type === 'gallery') {
    return `
      <div class="field-row">
        <label>
          Title
          <input type="text" name="title" value="${escapeHtml(item.title || '')}" required />
        </label>
        <label>
          Category
          <select name="category">
            <option value="Training" ${item.category === 'Training' ? 'selected' : ''}>Training</option>
            <option value="Outreach" ${item.category === 'Outreach' ? 'selected' : ''}>Outreach</option>
            <option value="Workshop" ${item.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
            <option value="Social" ${item.category === 'Social' ? 'selected' : ''}>Social</option>
          </select>
        </label>
      </div>
      <label>
        Replace image
        <input type="file" name="image" accept="image/*" />
      </label>
      <button type="submit" class="primary-btn">Save changes</button>
    `;
  }

  if (type === 'executive') {
    return `
      <div class="field-row">
        <label>
          Executive name
          <input type="text" name="name" value="${escapeHtml(item.name || '')}" required />
        </label>
        <label>
          Role
          <input type="text" name="role" value="${escapeHtml(item.role || '')}" required />
        </label>
      </div>
      <div class="field-row">
        <label>
          Focus area
          <input type="text" name="focus" value="${escapeHtml(item.focus || '')}" required />
        </label>
        <label>
          Quote
          <input type="text" name="quote" value="${escapeHtml(item.quote || '')}" required />
        </label>
      </div>
      <label>
        Replace photo
        <input type="file" name="image" accept="image/*" />
      </label>
      <button type="submit" class="primary-btn">Save changes</button>
    `;
  }

  return '';
}

function openEditModal(type, index) {
  const editForm = document.getElementById('editForm');
  const editModal = document.getElementById('editModal');
  const editTitle = document.querySelector('#editModal h3');

  if (!editForm || !editModal || !editTitle) {
    return;
  }

  const titleMap = {
    member: 'Edit member',
    event: 'Edit event',
    gallery: 'Edit gallery item',
    executive: 'Edit executive',
  };

  editTitle.textContent = titleMap[type] || 'Edit record';
  editForm.dataset.editType = type;
  editForm.dataset.index = String(index);
  editForm.innerHTML = buildEditForm(type, index);
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');

  if (editModal) {
    editModal.classList.add('hidden');
  }

  if (editForm) {
    editForm.dataset.editType = '';
    editForm.dataset.index = '';
    editForm.innerHTML = '';
  }
}

function handleEditItemClick(event) {
  const editButton = event.target.closest('[data-edit-type]');
  if (!editButton) {
    return;
  }

  const type = editButton.dataset.editType;
  const index = Number(editButton.dataset.index);

  if (Number.isNaN(index)) {
    return;
  }

  openEditModal(type, index);
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const type = form.dataset.editType;
  const index = Number(form.dataset.index);

  if (!type || Number.isNaN(index)) {
    return;
  }

  const formData = new FormData(form);

  if (type === 'member') {
    const name = formData.get('name')?.toString().trim();
    const role = formData.get('role')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const engagement = formData.get('engagement')?.toString().trim();
    const status = formData.get('status')?.toString().trim();
    const employmentStatus = formData.get('employmentStatus')?.toString().trim() || '';
    const employmentDetail = formData.get('employmentDetail')?.toString().trim() || '';

    if (!name || !role || !engagement || !status) {
      alert('Please complete all required member fields before saving.');
      return;
    }

    if (['Student', 'Employed', 'Self-employed'].includes(employmentStatus) && !employmentDetail) {
      alert('Please enter the school or workplace name for the selected employment status.');
      return;
    }

    state.members[index] = {
      ...state.members[index],
      name,
      role,
      email: email || state.members[index].email || '',
      engagement,
      status,
      dob: formData.get('dob')?.toString().trim() || '',
      age: formData.get('age')?.toString().trim() || '',
      dayBornGroup: formData.get('dayBornGroup')?.toString().trim() || '',
      location: formData.get('location')?.toString().trim() || '',
      employmentStatus,
      employmentDetail,
      contact: formData.get('contact')?.toString().trim() || '',
      emergencyContact: formData.get('emergencyContact')?.toString().trim() || '',
    };

    saveMembers();
  }

  if (type === 'event') {
    const title = formData.get('title')?.toString().trim();
    const date = formData.get('date')?.toString().trim();
    const venue = formData.get('venue')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const posterFile = formData.get('poster');
    const capacity = Number(formData.get('capacity'));

    if (!title || !date || !venue || !category || !description || !Number.isInteger(capacity) || capacity < 1 || capacity > 5000) {
      alert('Please complete all event fields before saving.');
      return;
    }

    const updatedEvent = {
      ...state.events[index],
      title,
      date,
      venue,
      category,
      description,
      capacity,
    };

    if (posterFile && posterFile.name) {
      updatedEvent.poster = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80';
    }

    state.events[index] = updatedEvent;

    saveEvents();
  }

  if (type === 'gallery') {
    const title = formData.get('title')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    const imageFile = formData.get('image');

    if (!title || !category) {
      alert('Please complete both gallery fields before saving.');
      return;
    }

    const updatedGalleryItem = {
      ...state.gallery[index],
      title,
      category,
    };

    if (imageFile && imageFile.name) {
      updatedGalleryItem.image = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';
    }

    state.gallery[index] = updatedGalleryItem;

    saveGallery();
  }

  if (type === 'executive') {
    const name = formData.get('name')?.toString().trim();
    const role = formData.get('role')?.toString().trim();
    const focus = formData.get('focus')?.toString().trim();
    const quote = formData.get('quote')?.toString().trim();
    const imageFile = formData.get('image');

    if (!name || !role || !focus || !quote) {
      alert('Please complete all executive fields before saving.');
      return;
    }

    const updatedExecutive = {
      ...state.executives[index],
      name,
      role,
      focus,
      quote,
    };

    if (imageFile && imageFile.name) {
      updatedExecutive.image = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80';
    }

    state.executives[index] = updatedExecutive;

    saveExecutives();
  }

  closeEditModal();
  renderDashboardContent();
}

function bindDeleteHandlers() {
  document.addEventListener('click', handleDeleteItemClick);
  document.addEventListener('click', handleEditItemClick);

  const editCloseBtn = document.getElementById('closeEditModalBtn');
  if (editCloseBtn) {
    editCloseBtn.addEventListener('click', closeEditModal);
  }

  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', handleEditFormSubmit);
  }
}

function renderDashboardContent() {
  renderStats();
  renderImpactQuest();
  renderMemberTable();
  renderMemberInsightsChart();
  renderActivityRecords();
  renderTaskList();
  renderAnnouncements();
  renderMemberEvents();
  renderEvents();
  renderGallery();
  renderExecutives();
  renderInterestGroups();
  renderCommunityHighlights();
  renderAdminCommunityTools();
  renderMemberAccountActivity();
  renderVolunteerShifts();
  updateMemberDashboardProfile();
}

function updateMemberDashboardProfile() {
  const member = state.currentMember;
  const profileName = document.getElementById('memberProfileName');
  const profileId = document.getElementById('memberProfileId');
  const profileEmail = document.getElementById('memberProfileEmail');
  const profileRole = document.getElementById('memberProfileRole');
  const profileAttendance = document.getElementById('memberProfileAttendance');

  if (!member) {
    return;
  }

  if (profileName) profileName.textContent = member.name;
  if (profileId) profileId.textContent = `Member ID: ${member.email?.slice(0, 8).toUpperCase() || 'MMOGCC'}`;
  if (profileEmail) profileEmail.textContent = member.email || 'Not available';
  if (profileRole) profileRole.textContent = member.role || 'Member';
  if (profileAttendance) profileAttendance.textContent = member.engagement || 'New';
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminDashboard = document.getElementById('adminDashboard');
  const memberDashboard = document.getElementById('memberDashboard');
  const memberAccessSection = document.getElementById('memberAccessSection');
  const memberSignInPanel = document.getElementById('memberSignInPanel');

  if (state.role === 'admin') {
    memberAccessSection?.classList.add('hidden');
    document.body.classList.add('admin-mode');
    document.body.classList.remove('member-mode');
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    if (adminDashboard) {
      adminDashboard.classList.remove('hidden');
    }
    if (memberDashboard) {
      memberDashboard.classList.add('hidden');
    }
    switchDashboard('admin');
  } else if (state.role === 'member') {
    memberAccessSection?.classList.add('hidden');
    document.body.classList.remove('admin-mode');
    document.body.classList.add('member-mode');
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    if (adminDashboard) {
      adminDashboard.classList.add('hidden');
    }
    if (memberDashboard) {
      memberDashboard.classList.remove('hidden');
    }
    switchDashboard('member');
  } else {
    memberAccessSection?.classList.remove('hidden');
    document.body.classList.remove('admin-mode');
    document.body.classList.remove('member-mode');
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    if (adminDashboard) {
      adminDashboard.classList.add('hidden');
    }
    if (memberDashboard) {
      memberDashboard.classList.add('hidden');
    }
    switchDashboard('admin');
  }

  renderDashboardContent();
}

function openSignupModal() {
  document.getElementById('signupModal').classList.remove('hidden');
}

function closeSignupModal() {
  const signupModal = document.getElementById('signupModal');
  if (signupModal) {
    signupModal.classList.add('hidden');
  }
}

function openLoginModal() {
  document.getElementById('loginModal').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const username = form.get('username').trim().toLowerCase();
  const password = form.get('password');

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Admin sign-in failed.');
    }

    state.currentMember = null;
    await hydrateStateFromServer();
    if (state.role !== 'admin') {
      throw new Error('The server did not establish an administrator session.');
    }
    closeLoginModal();
    event.target.reset();
    updateAuthUI();
  } catch (error) {
    alert(error.message || 'Admin sign-in failed. Please try again.');
  }
}

function signInMember(member) {
  if (!member) {
    return;
  }

  state.currentMember = member;
  state.role = 'member';
  updateAuthUI();
}

async function handleLogout() {
  let logoutError = null;
  if (state.role === 'admin') {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        logoutError = 'The server could not end the administrator session.';
      }
    } catch {
      logoutError = 'Could not contact the server to end the administrator session.';
    }
  } else if (state.role === 'member') {
    try {
      const response = await fetch('/api/members/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        logoutError = 'The server could not end the member session.';
      }
    } catch {
      logoutError = 'Could not contact the server to end the member session.';
    }
  }

  state.role = 'guest';
  state.currentMember = null;
  state.members = defaultMembers.map((member) => ({ ...member }));
  state.activities = [];
  updateAuthUI();
  if (logoutError) {
    alert(logoutError);
  }
}

function bindAuthHandlers() {
  document.getElementById('loginBtn').addEventListener('click', openLoginModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeLoginModal);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
  document.getElementById('memberLoginForm').addEventListener('submit', handleMemberLoginSubmit);
  document.getElementById('openMemberSignupFromDashboard').addEventListener('click', openSignupModal);
}

function addChatMessage(targetId, role, text) {
  const messages = document.getElementById(targetId);
  if (!messages) {
    return;
  }

  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function getChatbotReply(question) {
  const query = question.toLowerCase();

  if (query.includes('register') || query.includes('signup') || query.includes('member')) {
    return 'To register, click “Join MMOGCC YOUTH” on the page, fill in the form, and click Register.';
  }

  if (query.includes('gallery') || query.includes('picture') || query.includes('slideshow')) {
    return 'Open the Gallery section and click any image to view it in the slideshow.';
  }

  if (query.includes('executive') || query.includes('leaders')) {
    return 'Visit the Executives section to view the leaders and their profiles in MMOGCC YOUTH.';
  }

  if (query.includes('event') || query.includes('upcoming')) {
    return 'Browse the Events section to see upcoming MMOGCC YOUTH activities and initiatives.';
  }

  if (query.includes('dashboard')) {
    return 'The admin dashboard is only available after an admin signs in with the correct login details.';
  }

  return 'I can help with registration, gallery, executives, events, and updates for MMOGCC YOUTH.';
}

async function handleChatbotSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chatbotInput');
  const message = input.value.trim();

  if (!message) {
    return;
  }

  addChatMessage('chatbotMessages', 'user', message);
  addChatMessage('chatbotMessages', 'bot', getChatbotReply(message));
  input.value = '';
}

function bindChatbotHandlers() {
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const closeBtn = document.getElementById('chatbotCloseBtn');
  const panel = document.getElementById('chatbotPanel');
  const form = document.getElementById('chatbotForm');
  const suggestions = document.querySelectorAll('.chatbot-suggestion');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', handleChatbotSubmit);
  }

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener('click', () => {
      const question = suggestion.dataset.question;
      if (!question) {
        return;
      }

      const input = document.getElementById('chatbotInput');
      if (input) {
        input.value = question;
      }

      addChatMessage('chatbotMessages', 'user', question);
      addChatMessage('chatbotMessages', 'bot', getChatbotReply(question));
    });
  });
}

function getFilteredGalleryItems() {
  return state.activeFilter === 'all'
    ? state.gallery
    : state.gallery.filter((item) => item.category === state.activeFilter);
}

function openGallerySlideshow(index) {
  const galleryItems = getFilteredGalleryItems();
  const slideshowModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryModalImage');
  const galleryTitle = document.getElementById('galleryModalTitle');
  const galleryCategory = document.getElementById('galleryModalCategory');
  const galleryCurrentIndex = document.getElementById('galleryCurrentIndex');
  const galleryTotalCount = document.getElementById('galleryTotalCount');

  if (!galleryItems.length || !galleryImage || !slideshowModal) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
  const currentItem = galleryItems[safeIndex];

  state.gallerySlideshowIndex = safeIndex;
  galleryImage.src = currentItem.image;
  galleryImage.alt = currentItem.title;
  galleryTitle.textContent = currentItem.title;
  galleryCategory.textContent = currentItem.category;
  galleryCurrentIndex.textContent = String(safeIndex + 1);
  galleryTotalCount.textContent = String(galleryItems.length);
  slideshowModal.classList.remove('hidden');
}

function closeGallerySlideshow() {
  const slideshowModal = document.getElementById('galleryModal');
  if (slideshowModal) {
    slideshowModal.classList.add('hidden');
  }
}

function moveGallerySlideshow(direction) {
  const galleryItems = getFilteredGalleryItems();
  if (!galleryItems.length) {
    return;
  }

  const nextIndex = Math.max(
    0,
    Math.min((state.gallerySlideshowIndex ?? 0) + direction, galleryItems.length - 1)
  );

  openGallerySlideshow(nextIndex);
}

function handleJoinMemberClick() {
  openSignupModal();
}

function exportMembersOverview() {
  const headers = [
    'Name',
    'Role',
    'Engagement',
    'Status',
    'Email',
    'Date of Birth',
    'Age',
    'Day Born Group',
    'Location',
    'Employment Status',
    'Employment Detail',
    'Contact',
    'Emergency Contact',
  ];

  const rows = state.members.map((member) => [
    member.name || '',
    member.role || '',
    member.engagement || '',
    member.status || '',
    member.email || '',
    member.dob || '',
    member.age || '',
    member.dayBornGroup || '',
    member.location || '',
    member.employmentStatus || '',
    member.employmentDetail || '',
    member.contact || '',
    member.emergencyContact || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'mmogcc-youth-members.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

function exportCommunityReports() {
  if (state.role !== 'admin') {
    return;
  }
  const rows = [
    ['Record type', 'Name', 'Email', 'Activity', 'Date', 'Status', 'Hours'],
    ...state.eventRegistrations.map((item) => [
      'Event RSVP', item.name, item.email, item.eventTitle, item.eventDate,
      item.checkedInAt ? 'checked in' : item.status || 'registered', '',
    ]),
    ...state.serviceLogs.map((item) => [
      'Service hours', item.memberName, item.memberEmail, item.activity, item.date, 'Recorded', item.hours,
    ]),
    ...state.shiftSignups.map((item) => [
      'Volunteer shift', item.name, item.email, item.shiftTitle, item.signedUpAt, item.status, '',
    ]),
  ];
  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blobUrl = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'mmogcc-youth-community-reports.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

function bindHomepageActions() {
  bindImpactQuest();

  const joinMemberBtn = document.getElementById('joinMemberBtn');
  if (joinMemberBtn) {
    joinMemberBtn.addEventListener('click', handleJoinMemberClick);
  }

  const closeSignupModalBtn = document.getElementById('closeSignupModalBtn');
  if (closeSignupModalBtn) {
    closeSignupModalBtn.addEventListener('click', closeSignupModal);
  }

  const closeGalleryModalBtn = document.getElementById('closeGalleryModalBtn');
  if (closeGalleryModalBtn) {
    closeGalleryModalBtn.addEventListener('click', closeGallerySlideshow);
  }

  const eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid) {
    eventsGrid.addEventListener('click', (event) => {
      const registerButton = event.target.closest('[data-register-event-index]');
      if (registerButton) {
        openEventRegistration(Number(registerButton.dataset.registerEventIndex));
      }
      const calendarButton = event.target.closest('[data-add-calendar-index]');
      if (calendarButton) {
        downloadEventReminder(Number(calendarButton.dataset.addCalendarIndex));
      }
      const emailButton = event.target.closest('[data-share-event-email]');
      if (emailButton) {
        shareEventReminder(Number(emailButton.dataset.shareEventEmail), 'email');
      }
      const whatsAppButton = event.target.closest('[data-share-event-whatsapp]');
      if (whatsAppButton) {
        shareEventReminder(Number(whatsAppButton.dataset.shareEventWhatsapp), 'whatsapp');
      }
    });
  }

  const eventCalendar = document.getElementById('eventCalendar');
  eventCalendar.addEventListener('click', (event) => {
    const calendarEvent = event.target.closest('[data-calendar-event-index]');
    if (calendarEvent) {
      openEventRegistration(Number(calendarEvent.dataset.calendarEventIndex));
    }
  });
  document.getElementById('volunteerShiftsGrid').addEventListener('click', (event) => {
    const shiftButton = event.target.closest('[data-select-shift]');
    if (shiftButton) {
      document.getElementById('volunteerShiftSelect').value = shiftButton.dataset.selectShift;
      document.getElementById('volunteerShiftSignupForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  document.getElementById('calendarPreviousBtn').addEventListener('click', () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
    renderEventCalendar();
  });
  document.getElementById('calendarNextBtn').addEventListener('click', () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
    renderEventCalendar();
  });
  document.addEventListener('click', handleCommunityReviewClick);
  document.addEventListener('click', handleMemberBookingAction);

  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => moveGallerySlideshow(-1));
  }

  const galleryNextBtn = document.getElementById('galleryNextBtn');
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => moveGallerySlideshow(1));
  }

  const exportMembersBtn = document.getElementById('exportMembersBtn');
  if (exportMembersBtn) {
    exportMembersBtn.addEventListener('click', exportMembersOverview);
  }
  const exportReportsBtn = document.getElementById('exportReportsBtn');
  if (exportReportsBtn) {
    exportReportsBtn.addEventListener('click', exportCommunityReports);
  }

  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.delete-btn');
      if (deleteButton) {
        return;
      }

      const galleryCard = event.target.closest('.gallery-card');
      if (!galleryCard) {
        return;
      }

      const galleryIndex = Number(galleryCard.dataset.galleryIndex);
      if (!Number.isNaN(galleryIndex)) {
        openGallerySlideshow(galleryIndex);
      }
    });
  }
}

function bindThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  if (!themeButtons.length) {
    return;
  }
  const availableThemes = new Set(['premium', 'dark']);

  const setTheme = (themeName) => {
    if (!availableThemes.has(themeName)) {
      themeName = 'premium';
    }

    document.body.classList.remove('theme-premium', 'theme-vibrant', 'theme-dark', 'theme-compact');
    document.body.classList.add(`theme-${themeName}`);

    const activeButton = document.querySelector(`.theme-btn[data-theme="${themeName}"]`);
    themeButtons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    localStorage.setItem('mmogccYouthTheme', themeName);
  };

  const savedTheme = localStorage.getItem('mmogccYouthTheme') || 'premium';
  setTheme(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset.theme || 'vibrant');
    });
  });
}

function setupScrollReveal() {
  if (
    !('IntersectionObserver' in window)
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const targets = document.querySelectorAll(
    'main > .section .container > :not(.dashboard-panel), main > .stats-section .container > *'
  );
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((target) => {
    const siblingIndex = Array.from(target.parentElement.children).indexOf(target);
    target.classList.add('scroll-reveal');
    target.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 4) * 90}ms`);
    observer.observe(target);
  });
}

async function init() {
  setupScrollReveal();
  await hydrateStateFromServer();
  setupDashboardButtons();
  setupFilterButtons();
  bindFormHandlers();
  bindDeleteHandlers();
  bindAuthHandlers();
  bindHomepageActions();
  bindChatbotHandlers();
  bindThemeSwitcher();
  bindMemberOverviewControls();
  renderDashboardContent();
  updateAuthUI();
  await verifyReturnedDuesPayment();
}

init();
