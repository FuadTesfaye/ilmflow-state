import { db, sqlite, initializeDatabaseSchema } from './index';
import * as schema from './schema';

export async function seedDatabase() {
  initializeDatabaseSchema();

  // Clear existing records to ensure fresh idempotent seed
  sqlite.exec(`
    DELETE FROM audit_logs;
    DELETE FROM attendance_records;
    DELETE FROM certificates;
    DELETE FROM announcements;
    DELETE FROM grade_appeals;
    DELETE FROM grading_records;
    DELETE FROM manual_submissions;
    DELETE FROM grading_rubrics;
    DELETE FROM attempt_answers;
    DELETE FROM test_attempts;
    DELETE FROM test_snapshots;
    DELETE FROM tests;
    DELETE FROM questions;
    DELETE FROM competition_rounds;
    DELETE FROM competitions;
    DELETE FROM submission_answers;
    DELETE FROM form_submissions;
    DELETE FROM form_fields;
    DELETE FROM form_versions;
    DELETE FROM forms;
    DELETE FROM discount_codes;
    DELETE FROM waitlist_entries;
    DELETE FROM registration_days;
    DELETE FROM registrations;
    DELETE FROM ticket_tiers;
    DELETE FROM sessions;
    DELETE FROM speakers;
    DELETE FROM event_days;
    DELETE FROM events;
    DELETE FROM users;
  `);

  console.log('Seeding users across RBAC roles...');
  await db.insert(schema.users).values([
    {
      id: 'usr-superadmin',
      name: 'Sheikh Dr. Tariq Al-Hashimi',
      email: 'superadmin@ilmflow.org',
      role: 'superadmin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: 'Grand Chancellor of Academic Affairs',
      phone: '+966 50 111 2233',
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'usr-admin',
      name: 'Ustadha Fatima Al-Zahra',
      email: 'admin@ilmflow.org',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      title: 'Executive Director of Academic Operations',
      phone: '+971 50 123 4567',
      status: 'active',
      createdAt: '2026-01-05T00:00:00Z'
    },
    {
      id: 'usr-judge',
      name: 'Dr. Sheikh Ahmad Al-Mansoor',
      email: 'judge@ilmflow.org',
      role: 'judge',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: 'Chief Judge, Ten Qira’at Authority & Sanad Holder',
      phone: '+966 54 888 1234',
      status: 'active',
      createdAt: '2026-01-10T00:00:00Z'
    },
    {
      id: 'usr-staff',
      name: 'Bilal Qureshi',
      email: 'staff@ilmflow.org',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      title: 'Chief Gate Marshal & Arrival Lead',
      phone: '+44 7700 900077',
      status: 'active',
      createdAt: '2026-02-01T00:00:00Z'
    },
    {
      id: 'usr-participant',
      name: 'Zayd Al-Ansari',
      email: 'zayd.ansari@gmail.com',
      role: 'participant',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      title: 'Registered Competitor & Delegate',
      phone: '+1 416 555 0192',
      status: 'active',
      createdAt: '2026-03-01T00:00:00Z'
    }
  ]);

  console.log('Seeding speakers...');
  await db.insert(schema.speakers).values([
    {
      id: 'spk-1',
      name: 'Shaykh Dr. Abdur-Rahman Al-Badr',
      title: 'Professor of Hadith & Usul al-Fiqh',
      organization: 'Islamic University of Madinah',
      bio: 'Renowned international authority in comparative Hadith methodologies with over 25 published peer-reviewed works.',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      featured: true,
      socialLinks: JSON.stringify({ twitter: '@albadr_hadith', website: 'https://albadr.org' })
    },
    {
      id: 'spk-2',
      name: 'Qari Muhammad Tariq Al-Azhari',
      title: 'Chief Reciter & Grand Muqri',
      organization: 'Al-Azhar University, Cairo',
      bio: 'Holder of an unbroken Sanad chain in the Ten Qira’at through Shatibiyyah and Tayyibah, judge in multiple international Quran competitions.',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      featured: true,
      socialLinks: JSON.stringify({ youtube: 'tariq_recitations' })
    },
    {
      id: 'spk-3',
      name: 'Dr. Maryam bint Sultan',
      title: 'Director of Islamic Manuscript Studies',
      organization: 'Cambridge Muslim College',
      bio: 'Specialist in classical Arabic linguistic structures, historical Seerah codices, and Islamic epistemology in the modern world.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      featured: true,
      socialLinks: JSON.stringify({ website: 'https://cambridgemuslimcollege.ac.uk' })
    }
  ]);

  console.log('Seeding flagship events & multi-day breakdown...');
  await db.insert(schema.events).values([
    {
      id: 'evt-summit-2026',
      name: 'The Global Quran & Sunnah Summit 2026',
      slug: 'global-quran-sunnah-summit-2026',
      description: 'The premier international convocation of senior Hadith authorities, certified Ten Qira’at reciters, and international competitors. Three days of rigorous academic discourse and live adjudication at the Cultural Palace in Al-Madinah Al-Munawwarah.',
      shortDescription: 'Preserving Sacred Knowledge in the Modern Era: Tradition, Scholarship & Living Practice.',
      type: 'CONFERENCE',
      status: 'REGISTRATION_OPEN',
      coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1600',
      startDate: '2026-11-14T08:30:00Z',
      endDate: '2026-11-16T21:00:00Z',
      timezone: 'GMT+3 (Madinah Time)',
      venueName: 'The Grand Al-Mihrab Conference Palace',
      venueAddress: 'King Abdullah Cultural District, Al-Madinah Al-Munawwarah',
      onlineUrl: 'https://stream.ilmflow.org/summit2026',
      capacity: 1200,
      registeredCount: 1114,
      waitlistCount: 86,
      ageRestrictions: 'All ages welcome (Dedicated family & crèche facilities)',
      genderCategory: 'segregated-halls',
      languages: JSON.stringify(['Arabic', 'English', 'Urdu']),
      formId: 'form-summit-standard',
      featured: true,
      createdBy: 'usr-admin',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-09-27T00:00:00Z'
    },
    {
      id: 'evt-seerah-conf-2026',
      name: 'The Prophetic Character: Seerah & Leadership Intensive',
      slug: 'international-seerah-intensive-2026',
      description: 'A two-day systematic deep dive into the diplomatic, moral, and strategic model of the Messenger of Allah ﷺ with practical leadership workshops.',
      shortDescription: 'Examining the Makkan and Madinan epochs for modern leaders.',
      type: 'WORKSHOP',
      status: 'REGISTRATION_OPEN',
      coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1600',
      startDate: '2026-12-05T09:00:00Z',
      endDate: '2026-12-06T18:00:00Z',
      timezone: 'GMT (London Time)',
      venueName: 'The Queen Elizabeth Hall',
      venueAddress: 'Southbank Centre, Belvedere Rd, London, United Kingdom',
      capacity: 650,
      registeredCount: 412,
      waitlistCount: 0,
      ageRestrictions: 'Ages 16 and above',
      genderCategory: 'all',
      languages: JSON.stringify(['English', 'Arabic']),
      featured: false,
      createdBy: 'usr-admin',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-09-27T00:00:00Z'
    }
  ]);

  console.log('Seeding event days...');
  await db.insert(schema.eventDays).values([
    {
      id: 'day-summit-1',
      eventId: 'evt-summit-2026',
      date: '2026-11-14',
      dayNumber: 1,
      title: 'Day 1: The Living Sanad & Science of Recitation',
      capacity: 1200,
      registeredCount: 1114,
      registrationOpen: true
    },
    {
      id: 'day-summit-2',
      eventId: 'evt-summit-2026',
      date: '2026-11-15',
      dayNumber: 2,
      title: 'Day 2: Hadith Verification & Historical Isnads',
      capacity: 1200,
      registeredCount: 1045,
      registrationOpen: true
    },
    {
      id: 'day-summit-3',
      eventId: 'evt-summit-2026',
      date: '2026-11-16',
      dayNumber: 3,
      title: 'Day 3: Grand Adjudication, Awards & Laureate Assembly',
      capacity: 1200,
      registeredCount: 1180,
      registrationOpen: true
    }
  ]);

  console.log('Seeding schedule sessions synchronized with Salah...');
  await db.insert(schema.sessions).values([
    {
      id: 'sch-1',
      eventId: 'evt-summit-2026',
      eventDayId: 'day-summit-1',
      title: 'Fajr Congregational Prayer & Morning Adhkar Gathering',
      description: 'Communal prayer led by international reciters with reflective supplications.',
      startsAt: '05:08 AM',
      endsAt: '06:00 AM',
      location: 'Grand Sanctuary Musalla',
      isPrayerBreak: true,
      prayerName: 'Fajr',
      isPublished: true
    },
    {
      id: 'sch-2',
      eventId: 'evt-summit-2026',
      eventDayId: 'day-summit-1',
      speakerId: 'spk-1',
      title: 'Opening Plenary: The Living Chain of Recitation Across Centuries',
      description: 'Keynote lecture on the preservation of vocal nuance through continuous human transmission.',
      startsAt: '08:30 AM',
      endsAt: '10:00 AM',
      location: 'Imam Malik Main Auditorium',
      isPrayerBreak: false,
      isPublished: true
    },
    {
      id: 'sch-3',
      eventId: 'evt-summit-2026',
      eventDayId: 'day-summit-1',
      title: 'Dhuhr Prayer & Communal Sunnah Luncheon',
      startsAt: '12:14 PM',
      endsAt: '01:45 PM',
      location: 'Musalla & Courtyard',
      isPrayerBreak: true,
      prayerName: 'Dhuhr',
      isPublished: true
    },
    {
      id: 'sch-4',
      eventId: 'evt-summit-2026',
      eventDayId: 'day-summit-1',
      speakerId: 'spk-2',
      title: 'Grand Reciters Showcase: Ten Qira’at Demonstrations',
      startsAt: '02:00 PM',
      endsAt: '03:30 PM',
      location: 'Imam Malik Main Auditorium',
      isPrayerBreak: false,
      isPublished: true
    },
    {
      id: 'sch-5',
      eventId: 'evt-summit-2026',
      eventDayId: 'day-summit-1',
      title: 'Asr Prayer & Adjudication Intermission',
      startsAt: '03:38 PM',
      endsAt: '04:15 PM',
      location: 'Grand Sanctuary Musalla',
      isPrayerBreak: true,
      prayerName: 'Asr',
      isPublished: true
    }
  ]);

  console.log('Seeding ticket tiers & discount codes...');
  await db.insert(schema.ticketTiers).values([
    {
      id: 'tkt-tier-general',
      eventId: 'evt-summit-2026',
      name: 'Musalla General Assembly Pass',
      price: 0,
      currency: 'USD',
      description: 'Complimentary pass with open seating in ground floor sanctuary musalla and exhibition pavilion.',
      capacity: 900,
      registeredCount: 840,
      features: JSON.stringify([
        'Full 3-Day Auditorium Access',
        'Official Printed Delegate Folder & Program',
        'Cryptographic QR Attendance Badge',
        'Complimentary Zamzam & Dates Refreshments'
      ]),
      available: true
    },
    {
      id: 'tkt-tier-academic',
      eventId: 'evt-summit-2026',
      name: 'Mezzanine Scholarly Pass',
      price: 45,
      currency: 'USD',
      description: 'For students of sacred knowledge, researchers, and accredited teachers.',
      capacity: 250,
      registeredCount: 234,
      features: JSON.stringify([
        'All General Assembly Privileges',
        'Reserved Front Rows in Imam Malik Hall',
        'Printed Conference Proceedings Compendium',
        'Scholar Luncheon & Research Roundtable',
        'Expedited VIP Check-In Gate'
      ]),
      available: true
    },
    {
      id: 'tkt-tier-patron',
      eventId: 'evt-summit-2026',
      name: 'Royal Majlis Patron Pass',
      price: 150,
      currency: 'USD',
      description: 'Endowment benefactor pass directly sponsoring 3 full-time Hifdh students.',
      capacity: 50,
      registeredCount: 40,
      features: JSON.stringify([
        'VIP Majlis Suite & Private Scholar Audience',
        'Limited-Edition Calligraphy Portfolio Print',
        'Complimentary Banquet Access with Grand Muqris',
        'Permanent Waqf Registry Certificate'
      ]),
      available: true
    }
  ]);

  await db.insert(schema.discountCodes).values([
    {
      id: 'dsc-early10',
      eventId: 'evt-summit-2026',
      code: 'EARLY10',
      type: 'PERCENTAGE',
      value: 10,
      minDaysRequired: 1,
      maxUses: 200,
      currentUses: 45,
      active: true
    },
    {
      id: 'dsc-multiday',
      eventId: 'evt-summit-2026',
      code: 'MULTIDAY',
      type: 'PERCENTAGE',
      value: 15,
      minDaysRequired: 3,
      maxUses: 100,
      currentUses: 28,
      active: true
    }
  ]);

  console.log('Seeding form builder definitions & conditional rules...');
  await db.insert(schema.forms).values([
    {
      id: 'form-summit-standard',
      eventId: 'evt-summit-2026',
      title: 'Official Delegate Registration Form',
      description: 'Standard demographic and Islamic studies background questionnaire.',
      category: 'event_registration',
      currentVersion: 1,
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z'
    }
  ]);

  await db.insert(schema.formVersions).values([
    {
      id: 'fv-summit-v1',
      formId: 'form-summit-standard',
      versionNumber: 1,
      isPublished: true,
      publishedAt: '2026-02-01T00:00:00Z'
    }
  ]);

  await db.insert(schema.formFields).values([
    {
      id: 'fld-1',
      formVersionId: 'fv-summit-v1',
      fieldKey: 'f_full_name',
      type: 'text',
      label: 'Full Legal Name',
      placeholder: 'As appearing on national passport or ID',
      required: true,
      orderIndex: 1,
      width: 'half'
    },
    {
      id: 'fld-2',
      formVersionId: 'fv-summit-v1',
      fieldKey: 'f_email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'delegate@example.com',
      required: true,
      orderIndex: 2,
      width: 'half'
    },
    {
      id: 'fld-3',
      formVersionId: 'fv-summit-v1',
      fieldKey: 'f_age',
      type: 'number',
      label: 'Age in Years',
      placeholder: 'e.g. 24',
      required: true,
      orderIndex: 3,
      width: 'half'
    },
    {
      id: 'fld-4',
      formVersionId: 'fv-summit-v1',
      fieldKey: 'guardian_name',
      type: 'text',
      label: 'Parent or Legal Guardian Name',
      placeholder: 'Required for delegates under 18 years',
      required: false,
      conditionalRules: JSON.stringify({ fieldKey: 'f_age', operator: 'less_than', value: 18, action: 'show' }),
      orderIndex: 4,
      width: 'full'
    },
    {
      id: 'fld-5',
      formVersionId: 'fv-summit-v1',
      fieldKey: 'f_quran_level',
      type: 'select',
      label: 'Quran Memorization Level',
      required: true,
      options: JSON.stringify([
        { label: 'Complete Quran Hafidh (30 Juz)', value: 'hafidh_full' },
        { label: '15 Consecutive Juz', value: 'juz_15' },
        { label: 'Juz Amma (Juz 30)', value: 'juz_30' },
        { label: 'Active Quran Student', value: 'student' }
      ]),
      orderIndex: 5,
      width: 'full'
    }
  ]);

  console.log('Seeding competitions, rounds, tests, and question bank...');
  await db.insert(schema.competitions).values([
    {
      id: 'comp-hadith-mastery',
      eventId: 'evt-summit-2026',
      slug: 'imam-bukhari-hadith-mastery-tournament',
      title: 'The Imam Al-Bukhari Hadith Mastery Grand Tournament',
      arabicTitle: 'المُسَابَقَةُ الكُبْرَى فِي حِفْظِ وَفَهْمِ صَحِيحِ البُخَارِيِّ وَمُصْطَلَحِ الحَدِيثِ',
      category: 'hadith-mastery',
      format: 'online-quiz',
      description: 'An international academic challenge testing precision in Sahih Hadith texts, chains of narration (Isnads), biographical evaluation of narrators (Rijal), and core principles of Usul al-Hadith.',
      rules: JSON.stringify([
        'Complete within 20 minutes timed window.',
        'Negative marking: -1 for incorrect, 0 for unanswered.',
        'Anti-cheating tab monitor active: 3 tab switches flag attempt for review.'
      ]),
      eligibility: 'Open worldwide to participants ages 16 and above.',
      startDate: '2026-10-10T12:00:00Z',
      endDate: '2026-10-25T20:00:00Z',
      registrationDeadline: '2026-10-08T23:59:59Z',
      winnerAnnouncementDate: '2026-11-01',
      maxParticipants: 1000,
      enrolledCount: 842,
      scoringMethod: 'automatic',
      coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      prizes: JSON.stringify([
        { rank: 1, title: 'Grand Laureate of Hadith', award: '$5,000 USD + Full Umrah Pilgrimage + Gold Medallion' },
        { rank: 2, title: 'First Runner-Up', award: '$3,000 USD + Classical 30-Volume Islamic Library' },
        { rank: 3, title: 'Second Runner-Up', award: '$1,500 USD + Research Tablet with Shamela Suite' }
      ]),
      status: 'LIVE'
    },
    {
      id: 'comp-quran-hifdh',
      eventId: 'evt-summit-2026',
      slug: 'international-quran-hifdh-tarteel-award',
      title: 'The Grand International Holy Quran & Tarteel Award',
      arabicTitle: 'جَائِزَةُ القُرْآنِ الكَرِيمِ الدَّوْلِيَّةِ لِلْحِفْظِ وَالتَّرْتِيلِ وَحُسْنِ الأَدَاءِ',
      category: 'quran-memorization',
      format: 'quran-recitation',
      description: 'Global competition for pristine Quran memorization with master-level Tajweed articulation, vocal purity, and rhythmic elegance evaluated across a certified 100-point rubric.',
      rules: JSON.stringify([
        'Record unedited recitation of Surah Al-Isra (Ayat 78-85).',
        'No digital autotune, artificial reverb, or pitch enhancement.',
        'Blinded evaluation by certified Ten Qira’at Muqri’een.'
      ]),
      eligibility: 'Category A: Complete Quran. Category B: 15 Juz. Category C: Juz Amma.',
      startDate: '2026-10-01T00:00:00Z',
      endDate: '2026-11-01T23:59:59Z',
      registrationDeadline: '2026-10-15T23:59:59Z',
      winnerAnnouncementDate: '2026-11-15',
      maxParticipants: 500,
      enrolledCount: 388,
      scoringMethod: 'rubric-manual',
      coverImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      prizes: JSON.stringify([
        { rank: 1, title: 'Gold Medalist & Sultan al-Qurra', award: '$10,000 USD + Master Ijazah Endorsement + Honorary Gold Robe' },
        { rank: 2, title: 'Silver Laureate', award: '$6,000 USD + Handcrafted Damascus Quran Stand' },
        { rank: 3, title: 'Bronze Laureate', award: '$3,500 USD + Commemorative Silver Coin' }
      ]),
      status: 'LIVE'
    }
  ]);

  console.log('Seeding competition rounds & questions...');
  await db.insert(schema.competitionRounds).values([
    {
      id: 'rnd-hadith-1',
      competitionId: 'comp-hadith-mastery',
      roundNumber: 1,
      title: 'Round 1: Preliminary Knowledge & Terminology Examination',
      type: 'quiz',
      passingScore: 70,
      timeLimitMinutes: 15,
      advancementRule: 'TOP_PERCENTAGE',
      orderIndex: 1
    },
    {
      id: 'rnd-quran-1',
      competitionId: 'comp-quran-hifdh',
      roundNumber: 1,
      title: 'Round 1: Audio Submission & Rubric Review (Surah Al-Isra, Ayah 78-85)',
      type: 'audio_submission',
      passingScore: 80,
      advancementRule: 'MINIMUM_SCORE',
      orderIndex: 1
    }
  ]);

  await db.insert(schema.questions).values([
    {
      id: 'q-hadith-1',
      questionText: 'Which monumental collection of Hadith was authored by Imam Abu ‘Abdillah Muhammad ibn Isma‘il, containing exclusively rigorously authenticated (Sahih) narrations with continuous Isnads?',
      arabicText: 'مَا هُوَ الكِتَابُ الصَّحِيحُ الأَجَلُّ الَّذِي أَلَّفَهُ الإِمَامُ مُحَمَّدُ بْنُ إِسْمَاعِيلَ البُخَارِيُّ رَحِمَهُ اللَّهُ؟',
      type: 'multiple-choice',
      marks: 5,
      negativeMarks: 1,
      category: 'hadith-mastery',
      difficulty: 'beginner',
      timeLimitSeconds: 60,
      explanation: 'Sahih al-Bukhari is unanimously recognized by the consensus of Ahl al-Sunnah as the most authentic book after the Noble Quran. Imam al-Bukhari spent 16 years compiling it from over 600,000 narrations.',
      sourceReference: 'Muqaddimah Ibn al-Salah, Fath al-Bari',
      hadithCollection: 'Sahih al-Bukhari',
      hadithNumber: 'Preface',
      bookReference: 'Kitab Bad’ al-Wahy',
      options: JSON.stringify([
        { id: 'opt-1a', text: 'Sahih al-Bukhari (Al-Jami‘ al-Musnad al-Sahih)', arabicText: 'صحيح البخاري (الجامع المسند الصحيح)' },
        { id: 'opt-1b', text: 'Al-Muwatta of Imam Malik', arabicText: 'موطأ الإمام مالك' },
        { id: 'opt-1c', text: 'Sunan Abi Dawud', arabicText: 'سنن أبي داود' },
        { id: 'opt-1d', text: 'Musnad Ahmad ibn Hanbal', arabicText: 'مسند أحمد بن حنبل' }
      ]),
      correctAnswer: 'opt-1a',
      isArchived: false
    },
    {
      id: 'q-hadith-2',
      questionText: 'In the terminology of Mustalah al-Hadith, what is the classification of a Hadith narrated by so many independent chains at each level of the transmission that collusion upon a lie is logically impossible?',
      arabicText: 'مَا هُوَ الحَدِيثُ الَّذِي رَوَاهُ جَمْعٌ عَنْ جَمْعٍ تَحِيلُ العَادَةُ تَوَاطُؤَهُمْ عَلَى الكَذِبِ مِنْ أَوَّلِ السَّنَدِ إِلَى مُنْتَهَاهُ؟',
      type: 'multiple-choice',
      marks: 5,
      negativeMarks: 1,
      category: 'hadith-mastery',
      difficulty: 'intermediate',
      timeLimitSeconds: 45,
      explanation: 'The Mutawatir (المتواتر) narration imparts definitive, certain knowledge (Al-‘Ilm al-Yaqini) and is not subject to singular biographical critique because its authenticity is absolute.',
      sourceReference: 'Nukhbat al-Fikar fi Mustalah Ahl al-Athar (Ibn Hajar al-‘Asqalani)',
      bookReference: 'Khatimat al-Mustalah',
      options: JSON.stringify([
        { id: 'opt-2a', text: 'Mutawatir (المتواتر)', arabicText: 'المتواتر' },
        { id: 'opt-2b', text: 'Ahad - Mashhur (الآحاد المشهور)', arabicText: 'الآحاد المشهور' },
        { id: 'opt-2c', text: '‘Aziz (العزيز)', arabicText: 'العزيز' },
        { id: 'opt-2d', text: 'Gharib (الغريب)', arabicText: 'الغريب' }
      ]),
      correctAnswer: 'opt-2a',
      isArchived: false
    },
    {
      id: 'q-hadith-3',
      questionText: 'Which famous Sahabi narrated the foundational Hadith: "Actions are but by intentions, and every person will have only that which he intended"?',
      arabicText: 'مَنِ الصَّحَابِيُّ الجَلِيلُ الَّذِي رَوَى عَنْ رَسُولِ اللَّهِ ﷺ حَدِيثَ: (إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ)؟',
      type: 'multiple-choice',
      marks: 5,
      negativeMarks: 1,
      category: 'hadith-mastery',
      difficulty: 'beginner',
      timeLimitSeconds: 45,
      explanation: 'Umar ibn al-Khattab (رضي الله عنه) stood upon the Minbar in Madinah and narrated this Hadith. It is the opening narration in Sahih al-Bukhari.',
      sourceReference: 'Sahih al-Bukhari, Hadith 1',
      hadithCollection: 'Sahih al-Bukhari',
      hadithNumber: '1',
      bookReference: 'Kitab Bad’ al-Wahy',
      options: JSON.stringify([
        { id: 'opt-3a', text: 'Umar ibn al-Khattab (رضي الله عنه)', arabicText: 'عمر بن الخطاب رضي الله عنه' },
        { id: 'opt-3b', text: 'Abu Hurairah (رضي الله عنه)', arabicText: 'أبو هريرة رضي الله عنه' },
        { id: 'opt-3c', text: 'Anas ibn Malik (رضي الله عنه)', arabicText: 'أنس بن مالك رضي الله عنه' },
        { id: 'opt-3d', text: '‘Abdullah ibn ‘Umar (رضي الله عنهما)', arabicText: 'عبد الله بن عمر رضي الله عنهما' }
      ]),
      correctAnswer: 'opt-3a',
      isArchived: false
    }
  ]);

  console.log('Seeding tests & snapshots...');
  await db.insert(schema.tests).values([
    {
      id: 'tst-hadith-r1',
      roundId: 'rnd-hadith-1',
      name: 'Sahih Bukhari Knowledge Assessment - Round 1',
      description: 'Official qualifying test with negative marking and anti-cheat telemetry.',
      durationMinutes: 15,
      passingScore: 70,
      maxAttempts: 1,
      randomizeQuestions: true,
      randomizeAnswers: true,
      status: 'OPEN'
    }
  ]);

  await db.insert(schema.testSnapshots).values([
    {
      id: 'snp-hadith-v1',
      testId: 'tst-hadith-r1',
      versionNumber: 1,
      questionsFrozen: JSON.stringify(['q-hadith-1', 'q-hadith-2', 'q-hadith-3']),
      createdAt: '2026-10-10T12:00:00Z'
    }
  ]);

  console.log('Seeding grading rubrics for Quran adjudication...');
  await db.insert(schema.gradingRubrics).values([
    {
      id: 'rub-quran-100',
      roundId: 'rnd-quran-1',
      name: 'International 100-Point Qira’at & Tajweed Rubric',
      criteria: JSON.stringify([
        { id: 'tajweed', name: 'Tajweed Rules & Characteristics', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation, omission, or stumble.', maxScore: 30 },
        { id: 'makharij', name: 'Articulation Points (Makharij)', description: 'Pristine phoneme clarity and throat letter distinction.', maxScore: 20 },
        { id: 'voice', name: 'Vocal Quality & Melody', description: 'Natural resonance and melodic cadence honoring Tarteel.', maxScore: 10 },
        { id: 'overall', name: 'Adab & Waqf / Ibtida', description: 'Respecting Quranic thematic pauses and reverence.', maxScore: 10 }
      ]),
      totalMaxScore: 100
    }
  ]);

  console.log('Seeding sample manual submissions for judges...');
  await db.insert(schema.manualSubmissions).values([
    {
      id: 'sub-quran-01',
      competitionId: 'comp-quran-hifdh',
      roundId: 'rnd-quran-1',
      participantId: 'usr-participant',
      participantName: 'Zayd Al-Ansari',
      participantEmail: 'zayd.ansari@gmail.com',
      type: 'audio',
      title: 'Surah Al-Isra (Ayat 78–85) - Riwayah Hafs ‘an ‘Asim',
      audioUrl: 'https://cdn.islamicnetwork.com/quran/audio-surah/128/ar.alafasy/17.mp3',
      surahInfo: JSON.stringify({
        surahName: 'Al-Isra',
        surahNumber: 17,
        ayahStart: 78,
        ayahEnd: 85,
        qiraatStyle: 'Hafs ‘an ‘Asim (حفص عن عاصم)'
      }),
      status: 'pending_review',
      assignedGraderId: 'usr-judge',
      submittedAt: '2026-10-12T14:30:00Z'
    }
  ]);

  console.log('Seeding initial registrations & QR tokens...');
  await db.insert(schema.registrations).values([
    {
      id: 'reg-001',
      eventId: 'evt-summit-2026',
      ticketTierId: 'tkt-tier-general',
      userId: 'usr-participant',
      participantName: 'Zayd Al-Ansari',
      participantEmail: 'zayd.ansari@gmail.com',
      participantPhone: '+1 416 555 0192',
      status: 'approved',
      ticketNumber: 'TKT-1448-8842',
      qrToken: 'QR-ILM-1448-8842-SEC-A',
      registeredAt: '2026-09-20T10:15:00Z',
      formAnswers: JSON.stringify({
        f_full_name: 'Zayd Al-Ansari',
        f_email: 'zayd.ansari@gmail.com',
        f_age: 24,
        f_quran_level: 'hafidh_full'
      }),
      totalAmount: 0
    }
  ]);

  console.log('Seeding verified certificates...');
  await db.insert(schema.certificates).values([
    {
      id: 'cert-001',
      certificateNumber: 'CERT-ILM-2026-8842',
      recipientName: 'Zayd Al-Ansari',
      recipientEmail: 'zayd.ansari@gmail.com',
      eventTitle: 'The Global Quran & Sunnah Summit 2026',
      competitionTitle: 'International Hadith Mastery Preliminary Tournament',
      awardType: 'MERIT',
      issueDate: 'November 16, 2026',
      verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrCodeUrl: 'https://ilmflow.org/certificates/verify?id=CERT-ILM-2026-8842',
      issuerName: 'Shaykh Dr. Abdur-Rahman Al-Badr',
      issuerTitle: 'Grand Academic Registrar & Isnad Chairman'
    }
  ]);

  console.log('Seeding announcements & broadcast alerts...');
  await db.insert(schema.announcements).values([
    {
      id: 'anc-01',
      title: 'Welcome to the Global Quran & Sunnah Summit 2026',
      arabicTitle: 'مرحبًا بكم في المؤتمر العالمي للقرآن والسنة النبوية',
      content: 'Official gate credentials and lanyard badges are now downloadable in your Delegate Portal.',
      category: 'urgent',
      author: 'Academic Secretariat',
      isPinned: true,
      createdAt: '2026-09-27T08:00:00Z'
    },
    {
      id: 'anc-02',
      title: 'Hadith Mastery Qualifying Round Opens October 10',
      arabicTitle: 'بدء الجولة التأهيلية لمسابقة إتقان صحيح البخاري',
      content: 'All registered participants may access the proctored test environment from 12:00 PM Madinah time.',
      category: 'competition',
      author: 'Tournament Committee',
      isPinned: false,
      createdAt: '2026-09-27T09:30:00Z'
    }
  ]);

  console.log('Database seeding successfully completed!');
}

// Execute seeding if run directly
if ((import.meta as { main?: boolean }).main || (typeof process !== 'undefined' && process.argv[1]?.includes('seed'))) {
  seedDatabase().then(() => {
    console.log('Seed script finished.');
    process.exit(0);
  });
}
