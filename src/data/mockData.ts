import {
  EventItem,
  CompetitionItem,
  CompetitionQuestion,
  RegistrationForm,
  CertificateItem,
  RegistrationRecord,
  AnnouncementItem,
  SystemUser,
  ManualSubmission
} from '../types';

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'user-superadmin',
    name: 'Sheikh Grand Mufti Tariq Al-Hashimi',
    email: 'superadmin@ilmflow.org',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Board Chairman & Chief Executive Trustee',
    phone: '+971 4 999 0001'
  },
  {
    id: 'user-admin',
    name: 'Ustadha Fatima Al-Zahra',
    email: 'admin@ilmflow.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    title: 'Executive Director of Academic Affairs',
    phone: '+971 50 123 4567'
  },
  {
    id: 'user-judge',
    name: 'Dr. Sheikh Ahmad Al-Mansoor',
    email: 'judge@ilmflow.org',
    role: 'judge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Senior Judge, Ten Qira’at Scholar & Hafidh',
    phone: '+966 54 888 1234'
  },
  {
    id: 'user-staff',
    name: 'Bilal Qureshi',
    email: 'bilal@ilmflow.org',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    title: 'Head Gate Marshal & Registration Staff',
    phone: '+44 7700 900077'
  },
  {
    id: 'user-participant',
    name: 'Zayd Al-Ansari',
    email: 'zayd.ansari@gmail.com',
    role: 'participant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'Registered Competitor & Attendee',
    phone: '+1 416 555 0192'
  },
  {
    id: 'user-parent',
    name: 'Umm Maryam Al-Khatib',
    email: 'parent@ilmflow.org',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: 'Family Guardian & Waqf Sponsor',
    phone: '+1 647 555 0188',
    guardianOf: ['user-participant']
  },
  {
    id: 'user-visitor',
    name: 'Guest Visitor',
    email: 'guest@ilmflow.org',
    role: 'visitor',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    title: 'Prospective Attendee'
  }
];

export const INITIAL_SPEAKERS = [
  {
    id: 'spk-1',
    name: 'Shaykh Dr. Abdur-Rahman Al-Badr',
    title: 'Professor of Hadith & Usul al-Fiqh',
    organization: 'Islamic University of Madinah',
    bio: 'Renowned authority in comparative Hadith methodologies and classical Islamic jurisprudence with over 25 published scholarly works.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    featured: true
  },
  {
    id: 'spk-2',
    name: 'Qari Muhammad Tariq Al-Azhari',
    title: 'Chief Reciter & Grand Muqri',
    organization: 'Al-Azhar University, Cairo',
    bio: 'Holder of authentic Ijazah in the Ten Qira’at through Shatibiyyah and Tayyibah, judge in multiple international Holy Quran awards.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    featured: true
  },
  {
    id: 'spk-3',
    name: 'Dr. Maryam bint Sultan',
    title: 'Director of Islamic Manuscript Studies',
    organization: 'Cambridge Muslim College',
    bio: 'Specialist in classical Arabic linguistic structures, historical Seerah manuscripts, and ethical pedagogy in the contemporary world.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    featured: true
  },
  {
    id: 'spk-4',
    name: 'Ustadh Zafar Khan',
    title: 'Master Calligrapher & Historian',
    organization: 'Istanbul Research Centre for Islamic History & Art',
    bio: 'Master of Thuluth and Diwani scripts, recipient of the IRCICA Gold Medal for traditional Islamic illumination and calligraphy.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    featured: false
  }
];

export const INITIAL_FORMS: RegistrationForm[] = [
  {
    id: 'form-summit-standard',
    title: 'Flagship Summit Registration Form',
    description: 'Universal registration form with demographic criteria and minor protection logic.',
    createdAt: '2026-08-01',
    fields: [
      {
        id: 'f_full_name',
        type: 'text',
        label: 'Full Legal Name',
        placeholder: 'e.g. Tariq Ibn Ziyad',
        helpText: 'As you wish it to appear on your official event pass and certificate.',
        required: true
      },
      {
        id: 'f_email',
        type: 'email',
        label: 'Official Email Address',
        placeholder: 'tariq@example.com',
        helpText: 'Your digital pass and QR code ticket will be dispatched here.',
        required: true
      },
      {
        id: 'f_phone',
        type: 'phone',
        label: 'Contact Number (with Country Code)',
        placeholder: '+1 (555) 234-5678',
        required: true
      },
      {
        id: 'f_age',
        type: 'age',
        label: 'Age of Attendee',
        placeholder: 'e.g. 24',
        helpText: 'Attendees under 18 require parent or legal guardian details.',
        required: true
      },
      {
        id: 'f_gender',
        type: 'gender',
        label: 'Gender Category',
        helpText: 'Helps us coordinate segregated prayer halls and seating arrangements.',
        required: true
      },
      {
        id: 'f_guardian_consent',
        type: 'guardian-consent',
        label: 'Parent / Legal Guardian Consent',
        helpText: 'Required since attendee is under 18 years of age.',
        required: true,
        conditional: {
          fieldId: 'f_age',
          operator: 'less_than',
          value: 18
        }
      },
      {
        id: 'f_dietary',
        type: 'dropdown',
        label: 'Dietary & Halal Meal Requirements',
        required: false,
        options: [
          { label: 'Standard Halal Feast', value: 'standard' },
          { label: 'Halal Vegetarian / Vegan', value: 'vegan' },
          { label: 'Gluten-Free Halal', value: 'gluten-free' },
          { label: 'Nut Allergy Safe', value: 'nut-free' }
        ]
      },
      {
        id: 'f_special_needs',
        type: 'textarea',
        label: 'Accessibility or Accommodation Notes',
        placeholder: 'Wheelchair access, translation headset requirements, or elderly seating accommodations...',
        required: false
      }
    ]
  },
  {
    id: 'form-quran-competition',
    title: 'Quran Hifdh & Recitation Entry Form',
    description: 'Specific technical form capturing juz memorized, riwayah, and previous credentials.',
    createdAt: '2026-08-05',
    fields: [
      {
        id: 'f_quran_category',
        type: 'dropdown',
        label: 'Competition Category',
        required: true,
        options: [
          { label: 'Complete Quran (30 Juz) - Open Ages', value: 'full_30' },
          { label: '15 Consecutive Juz - Under 21', value: 'juz_15' },
          { label: 'Juz Amma (Juz 30) - Under 14', value: 'juz_30' },
          { label: 'Melodic Tarteel & Tajweed (Open)', value: 'tarteel' }
        ]
      },
      {
        id: 'f_qiraat_style',
        type: 'dropdown',
        label: 'Riwayah / Qira’at Tradition',
        required: true,
        options: [
          { label: 'Hafs ‘an ‘Asim (حفص عن عاصم)', value: 'hafs' },
          { label: 'Warsh ‘an Nafi’ (ورش عن نافع)', value: 'warsh' },
          { label: 'Qalun ‘an Nafi’ (قالون عن نافع)', value: 'qalun' },
          { label: 'Al-Duri ‘an Abi ‘Amr (الدوري عن أبي عمرو)', value: 'duri' }
        ]
      },
      {
        id: 'f_ijazah_held',
        type: 'radio',
        label: 'Do you hold a Sanad or Ijazah with Muttasil Isnad?',
        required: true,
        options: [
          { label: 'Yes, with verified Isnad', value: 'yes' },
          { label: 'No, in memorization training', value: 'no' }
        ]
      }
    ]
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-summit-2026',
    slug: 'global-quran-sunnah-summit-2026',
    title: 'The Global Quran & Sunnah Summit 2026',
    subtitle: 'Preserving Sacred Knowledge in the Modern Era: Tradition, Scholarship & Living Practice',
    description: 'The premier international gathering of Islamic scholars, memorizers, jurists, and researchers. Three days of rigorous discourse, Qira’at recitals, scholarly keynotes, and international networking in an atmosphere of solemn dignity.',
    category: 'conference',
    format: 'hybrid',
    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-11-14T08:30:00Z',
    endDate: '2026-11-16T21:00:00Z',
    timeZone: 'GMT+3 (Madinah Time)',
    venueName: 'The Grand Al-Mihrab Conference Palace',
    venueAddress: 'King Abdullah Cultural District, Al-Madinah Al-Munawwarah',
    onlineMeetingUrl: 'https://stream.ilmflow.org/summit2026',
    registrationDeadline: '2026-11-05T23:59:59Z',
    capacity: 1200,
    registeredCount: 1114,
    waitlistCount: 86,
    ageRestrictions: 'All ages welcome (Dedicated family & crèche facilities)',
    genderCategory: 'segregated-halls',
    languages: ['Arabic', 'English', 'Urdu'],
    speakers: INITIAL_SPEAKERS.slice(0, 3),
    formId: 'form-summit-standard',
    featured: true,
    status: 'upcoming',
    prayerTimes: {
      fajr: '05:08 AM',
      dhuhr: '12:14 PM',
      asr: '03:38 PM',
      maghrib: '06:05 PM',
      isha: '07:35 PM',
      nextPrayer: 'Asr',
      timeRemaining: '1h 24m'
    },
    schedule: [
      {
        id: 'sch-1',
        title: 'Fajr Congregational Prayer & Morning Adhkar Gathering',
        startTime: '05:08 AM',
        endTime: '06:00 AM',
        location: 'Grand Sanctuary Musalla',
        isPrayerBreak: true,
        prayerName: 'Fajr'
      },
      {
        id: 'sch-2',
        title: 'Opening Plenary: The Living Chain of Recitation Across Centuries',
        speaker: 'Shaykh Dr. Abdur-Rahman Al-Badr',
        startTime: '08:30 AM',
        endTime: '10:00 AM',
        location: 'Imam Malik Main Auditorium'
      },
      {
        id: 'sch-3',
        title: 'Panel Session: Classical Arabic Grammar as the Custodian of Meanings',
        speaker: 'Dr. Maryam bint Sultan',
        startTime: '10:30 AM',
        endTime: '12:00 PM',
        location: 'Ibn Khaldun Hall'
      },
      {
        id: 'sch-4',
        title: 'Dhuhr Prayer & Communal Sunnah Luncheon',
        startTime: '12:14 PM',
        endTime: '01:45 PM',
        location: 'Musalla & Courtyard',
        isPrayerBreak: true,
        prayerName: 'Dhuhr'
      },
      {
        id: 'sch-5',
        title: 'Grand Reciters Showcase: Ten Qira’at Demonstrations',
        speaker: 'Qari Muhammad Tariq Al-Azhari',
        startTime: '02:00 PM',
        endTime: '03:30 PM',
        location: 'Imam Malik Main Auditorium'
      },
      {
        id: 'sch-6',
        title: 'Asr Prayer & Contemplation Intermission',
        startTime: '03:38 PM',
        endTime: '04:15 PM',
        location: 'Grand Sanctuary Musalla',
        isPrayerBreak: true,
        prayerName: 'Asr'
      },
      {
        id: 'sch-7',
        title: 'Academic Papers & Manuscript Preservation Colloquium',
        speaker: 'Ustadh Zafar Khan',
        startTime: '04:30 PM',
        endTime: '06:00 PM',
        location: 'Al-Andalus Seminar Wing'
      }
    ],
    tickets: [
      {
        id: 'tkt-tier-general',
        name: 'General Assembly Pass',
        price: 0,
        currency: 'USD',
        description: 'Full complimentary entry to all open sessions, prayer halls, and exhibition booths.',
        features: [
          'Access to Main Auditorium and Live Streams',
          'Official Printed Delegate Folder & Pen',
          'Certificate of Attendance with Verification QR',
          'Complimentary Zamzam and Dates Station'
        ],
        capacity: 900,
        registeredCount: 840,
        available: true
      },
      {
        id: 'tkt-tier-academic',
        name: 'Scholarly & Delegate Access',
        price: 45,
        currency: 'USD',
        description: 'For students of sacred knowledge, researchers, and accredited teachers.',
        features: [
          'All General Assembly Benefits',
          'Reserved Front Rows in Imam Malik Hall',
          'Printed Conference Proceedings Compendium',
          'Access to Scholar Luncheon & Book Signing Lounge',
          'Expedited Gate Check-in'
        ],
        capacity: 250,
        registeredCount: 234,
        available: true
      },
      {
        id: 'tkt-tier-patron',
        name: 'Waqf Benefactor & VIP Pass',
        price: 150,
        currency: 'USD',
        description: 'Includes a tax-deductible endowment contribution supporting student sponsorships.',
        features: [
          'VIP Seating & Private Hospitality Suite',
          'Private Majlis audience with international scholars',
          'Limited-Edition Calligraphy Portfolio Print',
          'Direct Sponsorship of 3 Needy Hifdh Students'
        ],
        capacity: 50,
        registeredCount: 40,
        available: true
      }
    ]
  },
  {
    id: 'evt-seerah-conf-2026',
    slug: 'international-seerah-intensive-2026',
    title: 'The Prophetic Character: Seerah & Leadership Intensive',
    subtitle: 'A Two-Day Systematic Deep Dive into the Ethical Model of the Messenger of Allah ﷺ',
    description: 'An immersive examination of the Makkan and Madinan epochs, focusing on diplomatic governance, compassion towards creation, and psychological resilience.',
    category: 'workshop',
    format: 'in-person',
    coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-12-05T09:00:00Z',
    endDate: '2026-12-06T18:00:00Z',
    timeZone: 'GMT (London Time)',
    venueName: 'The Queen Elizabeth Hall',
    venueAddress: 'Southbank Centre, Belvedere Rd, London, United Kingdom',
    registrationDeadline: '2026-11-28T23:59:59Z',
    capacity: 650,
    registeredCount: 412,
    waitlistCount: 0,
    ageRestrictions: 'Ages 16 and above',
    genderCategory: 'all',
    languages: ['English', 'Arabic'],
    speakers: [INITIAL_SPEAKERS[0], INITIAL_SPEAKERS[2]],
    formId: 'form-summit-standard',
    featured: false,
    status: 'upcoming',
    prayerTimes: {
      fajr: '05:45 AM',
      dhuhr: '12:02 PM',
      asr: '02:15 PM',
      maghrib: '03:55 PM',
      isha: '05:30 PM',
      nextPrayer: 'Dhuhr',
      timeRemaining: '45m'
    },
    schedule: [
      {
        id: 'sch-s1',
        title: 'Session 1: The Makkan Crucible — Cultivating Unshakeable Tawheed',
        speaker: 'Dr. Maryam bint Sultan',
        startTime: '09:30 AM',
        endTime: '11:45 AM',
        location: 'Main Sanctuary'
      },
      {
        id: 'sch-s2',
        title: 'Dhuhr Prayer & Reflection',
        startTime: '12:02 PM',
        endTime: '01:00 PM',
        location: 'South Prayer Hall',
        isPrayerBreak: true,
        prayerName: 'Dhuhr'
      }
    ],
    tickets: [
      {
        id: 'tkt-seerah-std',
        name: 'Standard Registration',
        price: 25,
        currency: 'GBP',
        description: 'Complete weekend admission with syllabus folder and refreshments.',
        features: ['Full 2-Day Access', 'Course Workbook', 'Halal Refreshments'],
        capacity: 500,
        registeredCount: 360,
        available: true
      },
      {
        id: 'tkt-seerah-student',
        name: 'Full-Time Student Pass',
        price: 15,
        currency: 'GBP',
        description: 'Subsidized rate for university and madrasah students with valid ID.',
        features: ['Full 2-Day Access', 'Digital Course Materials'],
        capacity: 150,
        registeredCount: 52,
        available: true
      }
    ]
  },
  {
    id: 'evt-arabic-calligraphy-expo',
    slug: 'classical-arabic-arts-exhibition',
    title: 'The Sacred Pen: International Arabic Calligraphy & Illumination',
    subtitle: 'Exhibition of Classical Scripts, Live Masterclasses, and Historical Quran Folios',
    description: 'Celebrating 14 centuries of sacred scriptwriting. Featuring live demonstrations by master calligraphers, workshops on preparing traditional reed pens (Qalam) and soot ink, and an auction of museum-quality artwork.',
    category: 'workshop',
    format: 'in-person',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-10-20T10:00:00Z',
    endDate: '2026-10-22T19:00:00Z',
    timeZone: 'GMT+4 (Gulf Standard Time)',
    venueName: 'Sharjah Heritage Museum & Calligraphy Centre',
    venueAddress: 'Heritage Area, Heart of Sharjah, United Arab Emirates',
    registrationDeadline: '2026-10-15T23:59:59Z',
    capacity: 400,
    registeredCount: 395,
    waitlistCount: 24,
    ageRestrictions: 'Open to all ages',
    genderCategory: 'all',
    languages: ['Arabic', 'English'],
    speakers: [INITIAL_SPEAKERS[3]],
    formId: 'form-summit-standard',
    featured: false,
    status: 'upcoming',
    prayerTimes: {
      fajr: '04:55 AM',
      dhuhr: '12:10 PM',
      asr: '03:35 PM',
      maghrib: '06:00 PM',
      isha: '07:15 PM',
      nextPrayer: 'Maghrib',
      timeRemaining: '2h 10m'
    },
    schedule: [
      {
        id: 'sch-c1',
        title: 'Masterclass: The Mathematical Proportions of the Thuluth Script',
        speaker: 'Ustadh Zafar Khan',
        startTime: '10:30 AM',
        endTime: '01:00 PM',
        location: 'Studio A'
      }
    ],
    tickets: [
      {
        id: 'tkt-arts-free',
        name: 'Exhibition Admission',
        price: 0,
        currency: 'AED',
        description: 'Complimentary pass for public exhibition gallery viewing.',
        features: ['Gallery Access', 'Exhibition Guidebook'],
        capacity: 400,
        registeredCount: 395,
        available: true
      }
    ]
  },
  {
    id: 'evt-dua-kumayl',
    slug: 'weekly-dua-kumayl-dinner',
    title: 'Dua Kumayl & Weekly Community Dinner',
    subtitle: 'Congregational Supplication, Heartfelt Reflection, and Communal Dinner',
    description: 'Join us every Thursday evening for congregational Maghrib prayer followed by the recitation of Dua Kumayl and a communal hot dinner. Free admission for all families, youth, and elders.',
    category: 'community',
    format: 'in-person',
    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-10-23T17:30:00Z',
    endDate: '2026-10-23T20:30:00Z',
    timeZone: 'PST (Pacific Standard Time)',
    venueName: 'Balishira Resort & West Covina Sanctuary',
    venueAddress: '1505 W Garvey Ave N, West Covina, CA 91790',
    registrationDeadline: '2026-10-23T16:00:00Z',
    capacity: 500,
    registeredCount: 412,
    waitlistCount: 0,
    ageRestrictions: 'All ages welcome (Family-friendly)',
    genderCategory: 'all',
    languages: ['Arabic', 'English'],
    speakers: [INITIAL_SPEAKERS[1]],
    formId: 'form-summit-standard',
    featured: true,
    status: 'upcoming',
    prayerTimes: {
      fajr: '05:00 AM',
      dhuhr: '01:30 PM',
      asr: '04:30 PM',
      maghrib: '06:00 PM',
      isha: '08:00 PM',
      nextPrayer: 'Maghrib',
      timeRemaining: '25m'
    },
    schedule: [
      {
        id: 'sch-dk-1',
        title: 'Congregational Maghrib & Isha Prayers',
        startTime: '06:00 PM',
        endTime: '06:40 PM',
        location: 'Main Musalla'
      },
      {
        id: 'sch-dk-2',
        title: 'Recitation of Dua Kumayl & Spiritual Commentary',
        speaker: 'Shaykh Ahmad Al-Mansoor',
        startTime: '06:45 PM',
        endTime: '07:45 PM',
        location: 'Main Sanctuary'
      },
      {
        id: 'sch-dk-3',
        title: 'Community Dinner & Fellowship',
        startTime: '07:45 PM',
        endTime: '08:45 PM',
        location: 'Community Hall'
      }
    ],
    tickets: [
      {
        id: 'tkt-dk-free',
        name: 'Free Community RSVP',
        price: 0,
        currency: 'USD',
        description: 'Complimentary admission including dinner for individual or family.',
        features: ['Full Program Access', 'Complimentary Halal Dinner', 'Free Parking'],
        capacity: 500,
        registeredCount: 412,
        available: true
      }
    ]
  },
  {
    id: 'evt-dua-tawwasul',
    slug: 'weekly-dua-tawwasul-gathering',
    title: 'Dua Tawwasul & Spiritual Halaqa',
    subtitle: 'Mid-Week Spiritual Rejuvenation & Sacred Supplication Gathering',
    description: 'Weekly mid-week gathering every Tuesday at 5:30 PM featuring sacred remembrance, melodic recitation of Dua Tawwasul, and a short practical lesson in Islamic spirituality.',
    category: 'community',
    format: 'in-person',
    coverImage: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-10-21T17:30:00Z',
    endDate: '2026-10-21T19:30:00Z',
    timeZone: 'PST (Pacific Standard Time)',
    venueName: 'Convention City Bashundhara • Main Hall',
    venueAddress: 'Convention City, Bashundhara R/A, Dhaka',
    registrationDeadline: '2026-10-21T16:00:00Z',
    capacity: 400,
    registeredCount: 320,
    waitlistCount: 0,
    ageRestrictions: 'All ages welcome',
    genderCategory: 'all',
    languages: ['Arabic', 'English'],
    speakers: [INITIAL_SPEAKERS[0]],
    formId: 'form-summit-standard',
    featured: false,
    status: 'upcoming',
    prayerTimes: {
      fajr: '05:00 AM',
      dhuhr: '01:30 PM',
      asr: '04:30 PM',
      maghrib: '06:00 PM',
      isha: '08:00 PM',
      nextPrayer: 'Maghrib',
      timeRemaining: '30m'
    },
    schedule: [
      {
        id: 'sch-dt-1',
        title: 'Recitation of Dua Tawwasul & Ziyarat',
        startTime: '05:30 PM',
        endTime: '06:15 PM',
        location: 'Main Hall'
      }
    ],
    tickets: [
      {
        id: 'tkt-dt-free',
        name: 'Open Attendance Pass',
        price: 0,
        currency: 'USD',
        description: 'Free public entry for congregants and visitors.',
        features: ['Full Session Access', 'Tea & Dates Station'],
        capacity: 400,
        registeredCount: 320,
        available: true
      }
    ]
  },
  {
    id: 'evt-jumuah-assembly',
    slug: 'salat-al-jumuah-khutbah',
    title: "Salat al-Jumu'a & Weekly Khutbah",
    subtitle: 'Friday Congregational Assembly, Khutbah & Community Fellowship',
    description: "Weekly Friday congregational assembly. First call to prayer at 1:15 PM, Khutbah at 1:30 PM, followed by communal prayer and community fellowship. Simultaneous English translation available.",
    category: 'prayer',
    format: 'in-person',
    coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-10-24T13:00:00Z',
    endDate: '2026-10-24T14:30:00Z',
    timeZone: 'PST (Pacific Standard Time)',
    venueName: 'Convention City Bashundhara & West Covina Musalla',
    venueAddress: 'Main Musalla & Sanctuary Courtyard',
    registrationDeadline: '2026-10-24T12:00:00Z',
    capacity: 1500,
    registeredCount: 1280,
    waitlistCount: 0,
    ageRestrictions: 'Open to the entire family',
    genderCategory: 'segregated-halls',
    languages: ['Arabic', 'English'],
    speakers: [INITIAL_SPEAKERS[0]],
    formId: 'form-summit-standard',
    featured: false,
    status: 'upcoming',
    prayerTimes: {
      fajr: '05:00 AM',
      dhuhr: '01:30 PM',
      asr: '04:30 PM',
      maghrib: '06:00 PM',
      isha: '08:00 PM',
      nextPrayer: 'Dhuhr',
      timeRemaining: '15m'
    },
    schedule: [
      {
        id: 'sch-jum-1',
        title: "First Adhan & Pre-Khutbah Bayan",
        startTime: '01:15 PM',
        endTime: '01:30 PM',
        location: 'Main Sanctuary'
      },
      {
        id: 'sch-jum-2',
        title: "Arabic Khutbah & Congregational Salat",
        startTime: '01:30 PM',
        endTime: '02:00 PM',
        location: 'Main Sanctuary'
      }
    ],
    tickets: [
      {
        id: 'tkt-jum-free',
        name: 'General Congregant RSVP',
        price: 0,
        currency: 'USD',
        description: 'Complimentary admission for Jumu’ah prayer.',
        features: ['Main Sanctuary Seating', 'Free Parking Assistance'],
        capacity: 1500,
        registeredCount: 1280,
        available: true
      }
    ]
  }
];

export const INITIAL_QUESTIONS: CompetitionQuestion[] = [
  {
    id: 'q-hadith-1',
    questionText: 'Which monumental collection of Hadith was authored by Imam Abu ‘Abdillah Muhammad ibn Isma‘il, containing exclusively rigorously authenticated (Sahih) narrations with continuous Isnads?',
    arabicText: 'مَا هُوَ الكِتَابُ الصَّحِيحُ الأَجَلُّ الَّذِي أَلَّفَهُ الإِمَامُ مُحَمَّدُ بْنُ إِسْمَاعِيلَ البُخَارِيُّ رَحِمَهُ اللَّهُ؟',
    type: 'multiple-choice',
    options: [
      { id: 'opt-1a', text: 'Sahih al-Bukhari (Al-Jami‘ al-Musnad al-Sahih)', arabicText: 'صحيح البخاري (الجامع المسند الصحيح)' },
      { id: 'opt-1b', text: 'Al-Muwatta of Imam Malik', arabicText: 'موطأ الإمام مالك' },
      { id: 'opt-1c', text: 'Sunan Abi Dawud', arabicText: 'سنن أبي داود' },
      { id: 'opt-1d', text: 'Musnad Ahmad ibn Hanbal', arabicText: 'مسند أحمد بن حنبل' }
    ],
    correctAnswer: 'opt-1a',
    explanation: 'Sahih al-Bukhari is unanimously recognized by the consensus of Ahl al-Sunnah as the most authentic book after the Noble Quran. Imam al-Bukhari spent 16 years compiling it from over 600,000 narrations.',
    marks: 5,
    negativeMarks: 1,
    category: 'hadith-mastery',
    difficulty: 'beginner',
    timeLimitSeconds: 60,
    sourceReference: 'Muqaddimah Ibn al-Salah, Fath al-Bari'
  },
  {
    id: 'q-hadith-2',
    questionText: 'In the science of Mustalah al-Hadith (Hadith Terminology), what is the term used for a narration that is traced directly back to the Prophet Muhammad ﷺ (words, actions, or tacit approvals)?',
    arabicText: 'مَا هُوَ الِاصْطِلَاحُ الحَدِيثِيُّ لِلْحَدِيثِ الَّذِي أُضِيفَ إِلَى النَّبِيِّ ﷺ قَوْلًا أَوْ فِعْلًا أَوْ تَقْرِيرًا؟',
    type: 'multiple-choice',
    options: [
      { id: 'opt-2a', text: 'Hadith Marfu‘ (مرفوع)', arabicText: 'الحديث المرفوع' },
      { id: 'opt-2b', text: 'Hadith Mawquf (موقوف - stopped at a Companion)', arabicText: 'الحديث الموقوف' },
      { id: 'opt-2c', text: 'Hadith Maqtu‘ (مقطوع - stopped at a Tabi‘i)', arabicText: 'الحديث المقطوع' },
      { id: 'opt-2d', text: 'Hadith Mu‘allaq (معلق)', arabicText: 'الحديث المعلق' }
    ],
    correctAnswer: 'opt-2a',
    explanation: 'A Marfu‘ narration is that which is attributed directly to the Messenger of Allah ﷺ. A Mawquf narration stops at a Sahabi, and a Maqtu‘ narration belongs to a Tabi‘i.',
    marks: 5,
    negativeMarks: 1,
    category: 'hadith-mastery',
    difficulty: 'intermediate',
    timeLimitSeconds: 60,
    sourceReference: 'Nukhbat al-Fikar by Al-Hafiz Ibn Hajar'
  },
  {
    id: 'q-hadith-3',
    questionText: 'Select all essential conditions required by classical scholars for a Hadith to be graded as "Sahih Li-Dhatihi" (Authentic in and of itself):',
    arabicText: 'اخْتَرِ الشُّرُوطَ الجَوْهَرِيَّةَ لِصِحَّةِ الحَدِيثِ لِذَاتِهِ عِنْدَ أَهْلِ الفَنِّ:',
    type: 'multiple-select',
    options: [
      { id: 'opt-3a', text: 'Continuity of the transmission chain (Ittisal al-Sanad)', arabicText: 'اتصال السند' },
      { id: 'opt-3b', text: 'Integrity & uprightness of every narrator (‘Adalah)', arabicText: 'عدالة الرواة' },
      { id: 'opt-3c', text: 'Precise accuracy & retention (Dabt)', arabicText: 'تمام الضبط' },
      { id: 'opt-3d', text: 'Freedom from irregularity (Shudhudh) and subtle hidden defects (‘Illah)', arabicText: 'السلامة من الشذوذ والعلة القادحة' },
      { id: 'opt-3e', text: 'The narrator must be an Arab by descent', arabicText: 'أن يكون الراوي عربياً' }
    ],
    correctAnswer: ['opt-3a', 'opt-3b', 'opt-3c', 'opt-3d'],
    explanation: 'The five universally accepted conditions of a Sahih Hadith according to Ibn al-Salah and Ibn Hajar are: 1) Ittisal al-Sanad, 2) ‘Adalah of narrators, 3) Complete Dabt, 4) Absence of Shudhudh, and 5) Absence of Qadih ‘Illah. Lineage or nationality has no bearing on uprightness.',
    marks: 10,
    negativeMarks: 2,
    category: 'hadith-mastery',
    difficulty: 'advanced',
    timeLimitSeconds: 90,
    sourceReference: 'Tadrib al-Rawi by Al-Suyuti'
  },
  {
    id: 'q-hadith-4',
    questionText: 'True or False: In the classification of Hadith, a "Mutawatir" narration yields definitive, certain knowledge (Qat‘i al-Thubut) that requires no individual scrutiny of each narrator.',
    arabicText: 'صَحِيحٌ أَمْ خَطَأٌ: الحَدِيثُ المُتَوَاتِرُ يُفِيدُ العِلْمَ اليَقِينِيَّ الضَّرُورِيَّ القَطْعِيَّ بِلَا حَاجَةٍ لِلْبَحْثِ فِي أَحْوَالِ رُوَاتِهِ؟',
    type: 'true-false',
    options: [
      { id: 'opt-4t', text: 'True (صحيح)', arabicText: 'صحيح' },
      { id: 'opt-4f', text: 'False (خطأ)', arabicText: 'خطأ' }
    ],
    correctAnswer: 'opt-4t',
    explanation: 'True. A Mutawatir narration is transmitted by such a large multitude in every generation that it is inconceivable they could have colluded upon a falsehood, thus imparting conclusive epistemological certitude.',
    marks: 5,
    negativeMarks: 1,
    category: 'hadith-mastery',
    difficulty: 'intermediate',
    timeLimitSeconds: 45,
    sourceReference: 'Al-Kifayah fi ‘Ilm al-Riwayah by Al-Khatib al-Baghdadi'
  },
  {
    id: 'q-seerah-1',
    questionText: 'In what year of the Hijrah did the historic Treaty of Hudaybiyyah (Sulh al-Hudaybiyyah) occur, which Allah designated in Surah al-Fath as a manifest victory ("Fathan Mubina")?',
    arabicText: 'فِي أَيِّ سَنَةٍ مِنَ الهِجْرَةِ النَّبَوِيَّةِ كَانَ صُلْحُ الحُدَيْبِيَةِ الَّذِي سَمَّاهُ اللَّهُ تَعَالَى فَتْحًا مُبِينًا؟',
    type: 'multiple-choice',
    options: [
      { id: 'opt-s1a', text: '6th Year of the Hijrah (6 AH)', arabicText: 'السنة السادسة للهجرة' },
      { id: 'opt-s1b', text: '2nd Year of the Hijrah (2 AH)', arabicText: 'السنة الثانية للهجرة' },
      { id: 'opt-s1c', text: '8th Year of the Hijrah (8 AH)', arabicText: 'السنة الثامنة للهجرة' },
      { id: 'opt-s1d', text: '10th Year of the Hijrah (10 AH)', arabicText: 'السنة العاشرة للهجرة' }
    ],
    correctAnswer: 'opt-s1a',
    explanation: 'The Treaty of Hudaybiyyah took place in Dhu al-Qi‘dah in the 6th year after the Hijrah. It established a 10-year cessation of hostilities that paved the way for peaceful propagation of Islam.',
    marks: 5,
    negativeMarks: 1,
    category: 'seerah-knowledge',
    difficulty: 'beginner',
    timeLimitSeconds: 45,
    sourceReference: 'Al-Raheeq Al-Makhtum (The Sealed Nectar)'
  },
  {
    id: 'q-seerah-2',
    questionText: 'Who was the noble Companion whom the Prophet ﷺ instructed to learn the Syriac and Hebrew scripts in Madinah, which he mastered in under three weeks to act as the official diplomatic scribe?',
    arabicText: 'مَنِ الصَّحَابِيُّ الجَلِيلُ الَّذِي أَمَرَهُ النَّبِيُّ ﷺ بِتَعَلُّمِ لُغَةِ اليَهُودِ وَالسُّرْيَانِيَّةِ فَأَتْقَنَهَا فِي بِضْعَةَ عَشَرَ يَوْمًا؟',
    type: 'multiple-choice',
    options: [
      { id: 'opt-s2a', text: 'Zayd ibn Thabit (رضي الله عنه)', arabicText: 'زيد بن ثابت رضي الله عنه' },
      { id: 'opt-s2b', text: '‘Abdullah ibn Mas‘ud (رضي الله عنه)', arabicText: 'عبد الله بن مسعود رضي الله عنه' },
      { id: 'opt-s2c', text: 'Mu‘adh ibn Jabal (رضي الله عنه)', arabicText: 'معاذ بن جبل رضي الله عنه' },
      { id: 'opt-s2d', text: 'Ubayy ibn Ka‘b (رضي الله عنه)', arabicText: 'أبي بن كعب رضي الله عنه' }
    ],
    correctAnswer: 'opt-s2a',
    explanation: 'Zayd ibn Thabit was an exceptional scribe of revelation and mastered Hebrew and Syriac in approximately 15 to 19 days at the command of the Prophet ﷺ.',
    marks: 5,
    negativeMarks: 1,
    category: 'seerah-knowledge',
    difficulty: 'intermediate',
    timeLimitSeconds: 45,
    sourceReference: 'Sunan al-Tirmidhi, Siyar A‘lam al-Nubala'
  },
  {
    id: 'q-quran-1',
    questionText: 'In the science of Tajweed, what is the term for the elongation of a vowel letter (Madd) when followed immediately by a Hamzah in the same word (such as جَاءَ or السَّمَاءِ)?',
    arabicText: 'مَا هُوَ حُكْمُ المَدِّ فِي كَلِمَةٍ وَاحِدَةٍ إِذَا جَاءَ بَعْدَ حَرْفِ المَدِّ هَمْزَةٌ مِثْلُ (جَاءَ) وَ(السَّمَاءِ)؟',
    type: 'multiple-choice',
    options: [
      { id: 'opt-q1a', text: 'Madd Muttasil (Connected Mandatory Oblong - المد المتصل الواجب)', arabicText: 'المد المتصل الواجب' },
      { id: 'opt-q1b', text: 'Madd Munfasil (Separated Permissible - المد المنفصل الجائز)', arabicText: 'المد المنفصل الجائز' },
      { id: 'opt-q1c', text: 'Madd Lazim (Compulsory - المد اللازم)', arabicText: 'المد اللازم الكلمي' },
      { id: 'opt-q1d', text: 'Madd Badal (Substitute - مد البدل)', arabicText: 'مد البدل' }
    ],
    correctAnswer: 'opt-q1a',
    explanation: 'Madd Muttasil occurs when the letter of Madd and the Hamzah are located within the identical word. In Hafs ‘an ‘Asim (via Shatibiyyah), it is lengthened by 4 or 5 vowel counts (Harakāt).',
    marks: 5,
    negativeMarks: 1,
    category: 'quran-recitation',
    difficulty: 'beginner',
    timeLimitSeconds: 45,
    sourceReference: 'Tuhfat al-Atfal, Al-Muqaddimah al-Jazariyyah'
  }
];

export const INITIAL_COMPETITIONS: CompetitionItem[] = [
  {
    id: 'comp-hadith-mastery',
    slug: 'imam-bukhari-hadith-mastery-tournament',
    title: 'The Imam Al-Bukhari Hadith Mastery Grand Tournament',
    arabicTitle: 'المُسَابَقَةُ الكُبْرَى فِي حِفْظِ وَفَهْمِ صَحِيحِ البُخَارِيِّ وَمُصْطَلَحِ الحَدِيثِ',
    category: 'hadith-mastery',
    format: 'online-quiz',
    description: 'An international academic challenge testing precision in Sahih Hadith texts, chains of narration (Isnads), biographical evaluation of narrators (Rijal), and core principles of Usul al-Hadith.',
    rules: [
      'Each participant must complete Round 1 within the 20-minute timed window.',
      'Negative marking is active: -1 mark for each incorrect answer; unanswered questions incur zero penalty.',
      'Auto-save is enabled on every response.',
      'Full-screen anti-cheating monitor tracks tab-switching. Three infractions lead to automatic disqualification.',
      'All qualifying participants scoring 75% or higher advance to the live semi-final oral round.'
    ],
    eligibility: 'Open worldwide to all participants ages 16 and above. No prior institutional affiliation required.',
    startDate: '2026-10-10T12:00:00Z',
    endDate: '2026-10-25T20:00:00Z',
    registrationDeadline: '2026-10-08T23:59:59Z',
    winnerAnnouncementDate: '2026-11-01',
    maxParticipants: 1000,
    enrolledCount: 842,
    scoringMethod: 'automatic',
    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    judges: [INITIAL_SPEAKERS[0]],
    prizes: [
      { rank: 1, title: 'Grand Laureate of Hadith', award: '$5,000 USD + Full Umrah Pilgrimage + Commemorative Gold Plaque' },
      { rank: 2, title: 'First Runner-Up', award: '$3,000 USD + Classical 30-Volume Islamic Library' },
      { rank: 3, title: 'Second Runner-Up', award: '$1,500 USD + Research Tablet with Shamela Suite' }
    ],
    rounds: [
      {
        id: 'round-1-bukhari',
        roundNumber: 1,
        title: 'Round 1: Preliminary Knowledge & Terminology Examination',
        type: 'quiz',
        timeLimitMinutes: 15,
        passingScore: 70,
        questionIds: ['q-hadith-1', 'q-hadith-2', 'q-hadith-3', 'q-hadith-4']
      }
    ]
  },
  {
    id: 'comp-quran-hifdh',
    slug: 'international-quran-hifdh-tarteel-award',
    title: 'The Grand International Holy Quran & Tarteel Award',
    arabicTitle: 'جَائِزَةُ القُرْآنِ الكَرِيمِ الدَّوْلِيَّةِ لِلْحِفْظِ وَالتَّرْتِيلِ وَحُسْنِ الأَدَاءِ',
    category: 'quran-memorization',
    format: 'quran-recitation',
    description: 'A global competition dedicated to the pristine memorization of the Book of Allah with master-level adherence to Tajweed rules, vocal purity, and rhythmic elegance.',
    rules: [
      'Participants record their audio recitation of the designated verses or upload high-fidelity audio/video.',
      'Audio must be unedited without artificial digital reverb, autotune, or pitch manipulation.',
      'A panel of certified Qira’at judges evaluates each submission against a rigorous 100-point rubric.',
      'Evaluations are blinded to avoid bias: judges assess solely on audio fidelity and articulation.'
    ],
    eligibility: 'Category A: Complete Quran (All ages). Category B: 15 Consecutive Juz (Under 21). Category C: Juz Amma (Under 14).',
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-01T23:59:59Z',
    registrationDeadline: '2026-10-15T23:59:59Z',
    winnerAnnouncementDate: '2026-11-15',
    maxParticipants: 500,
    enrolledCount: 388,
    scoringMethod: 'rubric-manual',
    coverImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    judges: [INITIAL_SPEAKERS[1], INITIAL_USERS[1] as unknown as (typeof INITIAL_SPEAKERS)[0]],
    prizes: [
      { rank: 1, title: 'Gold Medalist & Sultan al-Qurra', award: '$10,000 USD + Master Ijazah Endorsement + Honorary Gold Robe' },
      { rank: 2, title: 'Silver Laureate', award: '$6,000 USD + Handcrafted Damascus Quran Stand' },
      { rank: 3, title: 'Bronze Laureate', award: '$3,500 USD + Commemorative Silver Coin' }
    ],
    rounds: [
      {
        id: 'round-1-hifdh',
        roundNumber: 1,
        title: 'Round 1: Audio Submission & Rubric Review (Surah Al-Isra, Ayah 78-85)',
        type: 'audio_submission',
        passingScore: 80,
        rubric: [
          { id: 'rub-tajweed', name: 'Tajweed Rules & Characteristics (أحكام التجويد والصفات)', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah according to rules.', maxScore: 30 },
          { id: 'rub-memorization', name: 'Memorization & Fluency (الحفظ والإتقان وعدم التردد)', description: 'Absence of hesitation, stumbles, omissions, or self-corrections.', maxScore: 30 },
          { id: 'rub-makharij', name: 'Articulation Points (مخارج الحروف)', description: 'Pristine clarity in pronouncing difficult Arabic phonemes (Dad, Ayn, Ha, Qaf).', maxScore: 20 },
          { id: 'rub-voice', name: 'Vocal Beauty & Melodic Tones (جمال الصوت وحسن الأداء)', description: 'Natural resonance, pleasant cadence, and emotional connection to meanings.', maxScore: 10 },
          { id: 'rub-overall', name: 'Overall Impression & Adab (الانطباع العام والوقف والابتداء)', description: 'Proper starting and stopping points respecting Quranic thematic coherence.', maxScore: 10 }
        ]
      }
    ]
  },
  {
    id: 'comp-seerah-essay',
    slug: 'prophetic-ethics-contemporary-essay-prize',
    title: 'The Prophetic Diplomacy & Ethics Essay Prize',
    arabicTitle: 'مُسَابَقَةُ البُحُوثِ وَالمَقَالَاتِ فِي الأَخْلَاقِ وَالسِّيَاسَةِ النَّبَوِيَّةِ',
    category: 'essay-writing',
    format: 'written-essay',
    description: 'An international academic essay competition challenging scholars, students, and writers to explore the diplomatic covenants of the Prophet ﷺ and their application to contemporary international law.',
    rules: [
      'Original work between 2,500 and 4,000 words in either classical Arabic or academic English.',
      'Rigorous academic citation using Turabian or Chicago style for Hadith and primary sources.',
      'Submissions undergo automated plagiarism and AI-generation checks (threshold < 10%).',
      'Double-blind peer evaluation by the academic committee.'
    ],
    eligibility: 'Undergraduate and postgraduate students, madrasah graduates, and independent researchers.',
    startDate: '2026-09-15T00:00:00Z',
    endDate: '2026-11-20T23:59:59Z',
    registrationDeadline: '2026-11-01T23:59:59Z',
    winnerAnnouncementDate: '2026-12-01',
    maxParticipants: 300,
    enrolledCount: 164,
    scoringMethod: 'rubric-manual',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    featured: false,
    judges: [INITIAL_SPEAKERS[2]],
    prizes: [
      { rank: 1, title: 'Academic First Prize', award: '$4,000 USD + Peer-Reviewed Publication in the Journal of Islamic Thought' },
      { rank: 2, title: 'Academic Second Prize', award: '$2,500 USD + Academic Fellowship Stipend' },
      { rank: 3, title: 'Honorable Distinction', award: '$1,000 USD + Book Endowment' }
    ],
    rounds: [
      {
        id: 'round-1-essay',
        roundNumber: 1,
        title: 'Full Treatise Submission & Peer Grading',
        type: 'essay_submission',
        passingScore: 75,
        rubric: [
          { id: 'rub-content', name: 'Scholarly Depth & Primary Evidence', description: 'Accurate grounding in Quran, Hadith, and classical Seerah chronicles.', maxScore: 30 },
          { id: 'rub-structure', name: 'Logical Coherence & Architecture', description: 'Clear thesis, disciplined progression of arguments, and strong conclusions.', maxScore: 25 },
          { id: 'rub-originality', name: 'Contemporary Applicability & Originality', description: 'Fresh perspective addressing modern geopolitical and human rights dilemmas.', maxScore: 20 },
          { id: 'rub-language', name: 'Linguistic Eloquence & Style', description: 'Grammatical elegance, rich vocabulary, and academic precision.', maxScore: 15 },
          { id: 'rub-citations', name: 'Referencing & Bibliography Discipline', description: 'Consistent and honest attribution of all sources and citations.', maxScore: 10 }
        ]
      }
    ]
  }
];

export const INITIAL_MANUAL_SUBMISSIONS: ManualSubmission[] = [
  {
    id: 'sub-quran-001',
    competitionId: 'comp-quran-hifdh',
    roundId: 'round-1-hifdh',
    participantId: 'user-participant',
    participantName: 'Zayd Al-Ansari',
    participantEmail: 'zayd.ansari@gmail.com',
    type: 'audio',
    title: 'Surah Al-Isra (Verses 78–85) - Riwayah Hafs ‘an ‘Asim',
    surahInfo: {
      surahName: 'Al-Isra',
      surahNumber: 17,
      ayahStart: 78,
      ayahEnd: 85,
      qiraatStyle: 'Hafs ‘an ‘Asim'
    },
    audioUrl: 'https://cdn.islamicnetwork.com/quran/audio-surah/128/ar.alafasy/17.mp3',
    submittedAt: '2026-09-20T14:32:00Z',
    status: 'pending_review'
  },
  {
    id: 'sub-quran-002',
    competitionId: 'comp-quran-hifdh',
    roundId: 'round-1-hifdh',
    participantId: 'user-009',
    participantName: 'Bilal Ibn Rabah Al-Habashi',
    participantEmail: 'bilal.h@gmail.com',
    type: 'audio',
    title: 'Surah Al-Isra (Verses 78–85) - Warsh ‘an Nafi’',
    surahInfo: {
      surahName: 'Al-Isra',
      surahNumber: 17,
      ayahStart: 78,
      ayahEnd: 85,
      qiraatStyle: 'Warsh ‘an Nafi’'
    },
    audioUrl: 'https://cdn.islamicnetwork.com/quran/audio-surah/128/ar.alafasy/17.mp3',
    submittedAt: '2026-09-21T09:15:00Z',
    status: 'graded',
    grades: [
      {
        judgeId: 'user-judge',
        judgeName: 'Dr. Sheikh Ahmad Al-Mansoor',
        criteriaScores: {
          'rub-tajweed': 28,
          'rub-memorization': 29,
          'rub-makharij': 19,
          'rub-voice': 9,
          'rub-overall': 9
        },
        totalScore: 94,
        comments: 'MashaAllah, exceptional clarity in the articulation of the letters of Halq and outstanding steadiness in the Ghunnah. An exemplary recitation.',
        gradedAt: '2026-09-22T16:00:00Z'
      }
    ],
    finalScore: 94
  }
];

export const INITIAL_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'reg-001',
    ticketNumber: 'TKT-SUMMIT-2026-001',
    eventId: 'evt-summit-2026',
    eventTitle: 'The Global Quran & Sunnah Summit 2026',
    eventDate: 'Nov 14–16, 2026',
    userId: 'user-participant',
    participantName: 'Zayd Al-Ansari',
    participantEmail: 'zayd.ansari@gmail.com',
    participantPhone: '+1 416 555 0192',
    ticketTierId: 'tkt-tier-academic',
    ticketTierName: 'Scholarly & Delegate Access',
    status: 'approved',
    formAnswers: {
      f_full_name: 'Zayd Al-Ansari',
      f_email: 'zayd.ansari@gmail.com',
      f_phone: '+1 416 555 0192',
      f_age: 26,
      f_gender: 'Brothers',
      f_dietary: 'Standard Halal Feast'
    },
    registeredAt: '2026-09-12T11:20:00Z',
    qrCodeValue: 'ILM-FLOW:TKT-SUMMIT-2026-001:VERIFIED'
  },
  {
    id: 'reg-002',
    ticketNumber: 'TKT-SUMMIT-2026-002',
    eventId: 'evt-summit-2026',
    eventTitle: 'The Global Quran & Sunnah Summit 2026',
    eventDate: 'Nov 14–16, 2026',
    userId: 'user-sample-2',
    participantName: 'Amina Al-Fassi',
    participantEmail: 'amina.fassi@uni.edu',
    participantPhone: '+212 612 345678',
    ticketTierId: 'tkt-tier-general',
    ticketTierName: 'General Assembly Pass',
    status: 'approved',
    formAnswers: {
      f_full_name: 'Amina Al-Fassi',
      f_email: 'amina.fassi@uni.edu',
      f_age: 22,
      f_gender: 'Sisters'
    },
    registeredAt: '2026-09-14T15:45:00Z',
    qrCodeValue: 'ILM-FLOW:TKT-SUMMIT-2026-002:VERIFIED'
  }
];

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-8842',
    certificateNumber: 'CERT-ILM-2026-8842',
    recipientName: 'Zayd Al-Ansari',
    recipientEmail: 'zayd.ansari@gmail.com',
    eventOrCompetitionTitle: 'Imam Al-Bukhari Hadith Mastery Grand Tournament',
    type: 'excellence',
    rank: 1,
    score: 95,
    issueDate: 'September 24, 2026',
    verificationHash: 'e7f8b91c4a03628e932b1f8c859d042719a6b3ce',
    issuerTitle: 'Dean of Hadith Studies & Competition Board',
    issuerSignatureName: 'Shaykh Dr. Abdur-Rahman Al-Badr',
    organizationName: 'IlmFlow Global Islamic Council'
  },
  {
    id: 'cert-7721',
    certificateNumber: 'CERT-ILM-2026-7721',
    recipientName: 'Bilal Ibn Rabah Al-Habashi',
    recipientEmail: 'bilal.h@gmail.com',
    eventOrCompetitionTitle: 'Grand International Holy Quran & Tarteel Award',
    type: 'winner',
    rank: 1,
    score: 94,
    issueDate: 'September 22, 2026',
    verificationHash: '9a3d4f1082c57be4916a22f038d179cbe81234ac',
    issuerTitle: 'Grand Muqri of Egypt & Azharite Council',
    issuerSignatureName: 'Qari Muhammad Tariq Al-Azhari',
    organizationName: 'IlmFlow Global Islamic Council'
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'anc-1',
    title: 'Prayer Timings & Venue Etiquette for the Global Summit Released',
    arabicTitle: 'إِعْلَانُ مَوَاقِيتِ الصَّلَوَاتِ وَآدَابِ حُضُورِ المُؤْتَمَرِ الإِسْلَامِيِّ العَالَمِيِّ',
    content: 'All delegates are kindly requested to take their seats 10 minutes prior to plenary sessions. Congregation prayers (Jama’ah) will be held punctually at the Grand Sanctuary Musalla with dedicated ablution (Wudu) areas for brothers and sisters.',
    category: 'schedule',
    publishedAt: '2026-09-25T10:00:00Z',
    author: 'Secretariat General',
    isPinned: true
  },
  {
    id: 'anc-2',
    title: 'Official Hadith Question Bank Updated with Commentary References',
    arabicTitle: 'تَحْدِيثُ بَنْكِ أَسْئِلَةِ مُسَابَقَةِ الإِمَامِ البُخَارِيِّ مَعَ إِحَالَاتِ الشُّرُوحِ',
    content: 'Candidates in the Hadith Mastery Tournament can now review authentic scholarly citations from Fath al-Bari and Sharh Sahih Muslim within their participant dashboard review pane.',
    category: 'competition',
    publishedAt: '2026-09-23T14:30:00Z',
    author: 'Board of Judges',
    isPinned: false
  }
];
