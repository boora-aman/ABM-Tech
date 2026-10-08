/* ==========================================================================
   ABM CRM — the Android app that ships with the Custom CRM.

   Every claim on the page comes from the app's own README and the marketing
   pack built alongside it (abm-crm-mobile/dist/marketing). Nothing here is a
   feature the app does not have, and the limits are stated as plainly as the
   features: a call-recording app that oversells its audio quality is one that
   gets uninstalled after the first bad recording.

   Free of imports on purpose, like the other content modules.
   ========================================================================== */

/** The build offered for download. Bump all four together when a new APK ships. */
export const apk = {
  version: "1.6.1",
  versionCode: 11,
  /** Bytes, from the file itself. */
  size: 51_012_489,
  sha256: "621dff2ada1d2642fa0c9e1db771a9946e73d0dab017c318ac8349d0f1346a23",
  package: "com.abmtech.crm",
  /** minSdk 26. */
  minAndroid: "8.0",
  /* Served by nginx on the VPS, not from git or the Next.js public folder.
     A 49 MB binary in the repository is 49 MB more in every clone for every
     version ever shipped. Override per environment if the file moves. */
  url: process.env.NEXT_PUBLIC_CRM_APK_URL || "/downloads/abm-crm-1.6.1.apk",
};

export const apkSizeLabel = `${(apk.size / 1024 / 1024).toFixed(1)} MB`;

/** Real screens from the app on a Redmi Note 10S, with no customer data in them. */
export type Screen = { src: string; alt: string; caption: string };

export const screens: Record<string, Screen> = {
  createMenu: {
    src: "/crm/create-menu.webp",
    alt: "ABM CRM Android app: the Create menu with Lead, Deal, Task, Event, Contact and Organization",
    caption: "One button creates anything",
  },
  newLead: {
    src: "/crm/new-lead.webp",
    alt: "ABM CRM Android app: the New lead form with name, mobile, email, organization and lead source",
    caption: "New lead, with where it came from",
  },
  newTask: {
    src: "/crm/new-task.webp",
    alt: "ABM CRM Android app: the New task form with status, priority, assignee and due date shortcuts",
    caption: "Tasks with an owner and a deadline",
  },
  newEvent: {
    src: "/crm/new-event.webp",
    alt: "ABM CRM Android app: the New event form for a meeting or site visit with time and location",
    caption: "Meetings and site visits on the calendar",
  },
  callTracking: {
    src: "/crm/call-tracking.webp",
    alt: "ABM CRM Android app: call tracking settings with call log access, call recording and microphone source",
    caption: "Call logging and recording, switched on once",
  },
};

export const hero = {
  label: "ABM CRM · Android app",
  title: "Calls log themselves.",
  titleAccent: "Follow-ups don't slip.",
  lead:
    "The Android app that comes with every ABM Custom CRM. Leads, calls, recordings, WhatsApp and site visits on each rep's phone — and a clear view, for the manager, of what actually happened today.",
};

/** Problem → what the app does about it. */
export const shifts = [
  {
    before: "Leads live in WhatsApp chats and nobody can find last week's.",
    after: "Every lead is in the CRM, with Call and WhatsApp one tap away.",
  },
  {
    before: "Nobody knows which calls happened, or what was said.",
    after: "Calls log themselves against the lead, with the recording attached.",
  },
  {
    before: "The follow-up promised on Tuesday is forgotten by Thursday.",
    after: "After every call the app asks for the outcome and offers a follow-up task.",
  },
];

export type Feature = {
  key: string;
  title: string;
  body: string;
  points: string[];
  screen?: keyof typeof screens;
};

export const features: Feature[] = [
  {
    key: "calls",
    title: "Calls that log themselves",
    body:
      "The phone's call log syncs to the CRM and each call is linked to its lead, deal or contact by number — type, duration and status included. Reps don't type anything for it to happen.",
    points: [
      "Synced in the background about every 15 minutes, and whenever the app opens",
      "By default only numbers already in the CRM are logged — a rep's personal calls stay off it",
      "After the call: Interested, Call back, Not interested… with an optional follow-up task",
    ],
    screen: "callTracking",
  },
  {
    key: "recordings",
    title: "Call recordings on the lead",
    body:
      "The app records calls itself and uploads each recording to its call log, where it plays in the app and in the CRM in the browser. Recordings made by the phone's own dialer are picked up too.",
    points: [
      "Switched on once per phone, from Settings → Call tracking",
      "Uploaded, then deleted from the phone",
      "Recordings of calls with numbers not in the CRM are deleted after 3 days",
    ],
  },
  {
    key: "whatsapp",
    title: "WhatsApp, call and email in one tap",
    body:
      "Every lead and deal has Call, WhatsApp, Email and Check in buttons, from the list and from the record. On the web side, WhatsApp runs as Click-to-Chat with templates or through the WhatsApp Business API.",
    points: [
      "Newest leads on the home screen with Call and Chat buttons",
      "Search by name, phone or email",
      "Builder or project tags show reps a “Talk as <builder>” reminder on the lead",
    ],
    screen: "createMenu",
  },
  {
    key: "visits",
    title: "Site visits with GPS and a photo",
    body:
      "A rep checks in at the site: location, address, notes and an optional photo go onto the lead or deal timeline. The manager sees where the visit happened, not just that one was claimed.",
    points: [
      "GPS position with accuracy",
      "Linked to the lead or deal being visited",
      "Counted per rep on the team dashboard",
    ],
  },
  {
    key: "followups",
    title: "Follow-ups that don't slip",
    body:
      "Tasks and events carry an assignee, status, priority, due time and location, and the phone reminds the rep before a task is due. A 14-day calendar strip sits on the home screen.",
    points: [
      "Quick due times: in 1 hour, in 3 hours, today 6 PM, tomorrow 10 AM",
      "Meetings, calls and site visits on one calendar",
      "Push notifications when something is assigned to you or you are mentioned",
    ],
    screen: "newTask",
  },
  {
    key: "dashboard",
    title: "A manager dashboard that counts",
    body:
      "For each rep: calls, connected calls, talk time, missed calls, leads touched, overdue tasks and site visits — today, yesterday, 7 days or 30. On the phone and on the web.",
    points: [
      "The lead pipeline at a glance",
      "The latest recordings, one tap to play",
      "The same numbers on the CRM's web dashboard",
    ],
  },
];

/** Smaller things worth knowing, shown as a list. */
export const extras = [
  "Works offline — notes, status changes, tasks, check-ins and call outcomes sync when the phone is back online",
  "Unsent forms are kept as drafts",
  "Light and dark mode",
  "Fingerprint, face or PIN app lock",
  "Two-step sign-in to your company's own CRM address",
  "Your company's name and logo — white-label",
];

/** What the web CRM behind the app does. */
export const webCrm = [
  "Leads and deals pipeline with your own statuses, as a list or a kanban board",
  "Contacts and organizations",
  "Campaign leads assigned automatically — round robin or load balancing, with per-rep limits — keeping campaign, ad set and ad attribution",
  "Email from the CRM with several sender accounts, and leads created from incoming email",
  "Call logs with recordings that play in the browser",
  "Notes, tasks, events and a calendar",
  "Site visits on the lead and deal timeline",
  "Team dashboard for managers",
];

export const steps = [
  {
    title: "Install the app",
    body: `Download the APK on the phone and install it. Android ${apk.minAndroid} or newer.`,
  },
  {
    title: "Connect to your CRM",
    body: "Enter your company's CRM address, then sign in with your CRM email and password.",
  },
  {
    title: "Switch on call tracking",
    body: "Settings → Call tracking: allow call log, phone and microphone, then turn on call recording.",
  },
];

/** The sideloading steps, in the order a phone actually asks for them. */
export const install = [
  "Open this page on the Android phone and tap Download.",
  "When the download finishes, open the file. Android asks to allow installs from this source — allow it for your browser, then go back.",
  "Tap Install, then Open.",
  `On Android 13 and newer, before turning on call recording: Settings → Apps → ABM CRM → ⋮ → Allow restricted settings. Android greys the switch out until you do, for any app installed outside the Play Store.`,
  "Turn off battery optimisation for the app (Settings → Apps → ABM CRM → Battery → No restrictions). On Xiaomi, Redmi, Oppo and Vivo phones, also allow Autostart — otherwise the phone stops the app in the background and calls stop syncing.",
];

/** What the app asks for, and the reason it needs it. */
export const permissions = [
  { name: "Call log and phone", why: "To log calls with leads, deals and contacts." },
  { name: "Microphone", why: "To record calls, when call recording is on." },
  {
    name: "Accessibility service",
    why: "Android only lets an app capture the microphone during a call through this. The service listens for calls; it does not read the screen.",
  },
  {
    name: "Files and media",
    why: "To find recordings made by the phone's own dialer. Xiaomi, Vivo and some other phones need all-files access for this.",
  },
  { name: "Location and camera", why: "For site-visit check-ins with a photo." },
  { name: "Notifications", why: "For assignments, mentions and task reminders." },
  { name: "Fingerprint or face", why: "Only if you turn on app lock." },
];

/** Exactly as written in the marketing pack, for the fine print. */
export const recordingNote =
  "Calls are recorded with the phone's microphone through an accessibility service you switch on once. On most phones both sides are clear on speaker; quality depends on the phone model. Tell your customers calls are recorded.";

export const faqs = [
  {
    q: "Is there an iPhone app?",
    a: "No. iOS does not let any app read the call log or record calls, and those are the two things this app exists for. The web CRM works on an iPhone in the browser.",
  },
  {
    q: "Can I use the app without the CRM?",
    a: "No. The app signs in to your company's ABM CRM and works with the leads, deals and calls stored there. It comes with every ABM Custom CRM — ask for a demo to see both together.",
  },
  {
    q: "How does call recording work, and are both sides clear?",
    a: "Android does not give apps the call audio itself, so the app records the phone's microphone during the call, through an accessibility service you switch on once. On speaker, both voices are clear on most phones; on the earpiece, some phones capture only your side. It depends on the brand and Android version, so test on your team's phones before rolling it out. The settings screen lets you pick the microphone source if the automatic choice misses a side.",
  },
  {
    q: "Is recording calls legal?",
    a: "Tell the people you call that the call is recorded. That is the honest thing to do and it is what the law expects in most places. The app does not announce it for you.",
  },
  {
    q: "Where is our data stored?",
    a: "On your company's CRM server. Recordings are uploaded to the call log in your CRM and then deleted from the phone. Recordings of calls with numbers that are not in the CRM are deleted from the phone after 3 days, without being uploaded.",
  },
  {
    q: "Will it log my reps' personal calls?",
    a: "Not by default. Only calls with numbers that belong to a lead, deal or contact in the CRM are logged. A manager can widen this in the CRM settings.",
  },
  {
    q: "Does it work without internet?",
    a: "Yes, for anything already opened on the phone. Notes, status changes, tasks, check-ins and call outcomes made offline are kept on the phone and sent when it reconnects. Forms you didn't finish are kept as drafts.",
  },
  {
    q: "Why isn't it on the Play Store, and is the APK safe to install?",
    a: `It is installed directly, as an APK, because the Play Store restricts the call-log and recording access the app is built around. Download it only from this page. To check the file, compare its SHA-256 with the one listed here: ${apk.sha256}.`,
  },
  {
    q: "Can it carry our own brand?",
    a: "Yes. The CRM is white-label — your company's name and logo — and the app shows the company it is connected to.",
  },
];

export const seo = {
  title: "ABM CRM Android App — Call Logging & Recording CRM",
  description:
    "Android CRM app with automatic call logging, call recording, one-tap WhatsApp, GPS site visits and a team dashboard. Comes with ABM Custom CRM.",
  keywords: [
    "crm app with call recording",
    "crm with automatic call logging",
    "sales crm android app india",
    "crm app for field sales",
    "real estate crm app",
    "frappe crm mobile app",
  ],
};
