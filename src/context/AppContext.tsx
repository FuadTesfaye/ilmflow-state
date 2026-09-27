'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventItem,
  CompetitionItem,
  CompetitionQuestion,
  RegistrationForm,
  CertificateItem,
  RegistrationRecord,
  AnnouncementItem,
  SystemUser,
  Role,
  QuizAttempt,
  ManualSubmission
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_COMPETITIONS,
  INITIAL_QUESTIONS,
  INITIAL_FORMS,
  INITIAL_REGISTRATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MANUAL_SUBMISSIONS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface AppContextType {
  currentUser: SystemUser;
  switchRole: (role: Role) => void;
  users: SystemUser[];
  
  // Events
  events: EventItem[];
  createEvent: (event: Omit<EventItem, 'id' | 'registeredCount' | 'waitlistCount'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  getEventById: (id: string) => EventItem | undefined;
  
  // Competitions
  competitions: CompetitionItem[];
  getCompetitionById: (id: string) => CompetitionItem | undefined;
  updateCompetition: (id: string, updates: Partial<CompetitionItem>) => void;
  
  // Question Bank
  questions: CompetitionQuestion[];
  addQuestion: (q: Omit<CompetitionQuestion, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<CompetitionQuestion>) => void;
  deleteQuestion: (id: string) => void;
  
  // Forms
  forms: RegistrationForm[];
  saveForm: (form: RegistrationForm) => void;
  getFormById: (id: string) => RegistrationForm | undefined;
  
  // Registrations & Tickets
  registrations: RegistrationRecord[];
  registerForEvent: (params: {
    eventId: string;
    ticketTierId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    formAnswers: Record<string, unknown>;
  }) => RegistrationRecord;
  updateRegistrationStatus: (id: string, status: RegistrationRecord['status']) => void;
  checkInAttendee: (ticketOrQrCode: string) => { success: boolean; message: string; record?: RegistrationRecord };
  
  // Quizzes & Tests
  quizAttempts: QuizAttempt[];
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id'>) => QuizAttempt;
  getAttempt: (competitionId: string, participantId: string) => QuizAttempt | undefined;
  
  // Manual Submissions (Quran audio & Essays)
  manualSubmissions: ManualSubmission[];
  submitManualWork: (sub: Omit<ManualSubmission, 'id' | 'submittedAt' | 'status'>) => ManualSubmission;
  gradeSubmission: (
    submissionId: string,
    judgeId: string,
    judgeName: string,
    criteriaScores: Record<string, number>,
    totalScore: number,
    comments: string
  ) => void;
  
  // Certificates
  certificates: CertificateItem[];
  issueCertificate: (cert: Omit<CertificateItem, 'id' | 'issueDate' | 'verificationHash'>) => CertificateItem;
  getCertificateByNumber: (certNumber: string) => CertificateItem | undefined;
  
  // Announcements
  announcements: AnnouncementItem[];
  addAnnouncement: (announcement: Omit<AnnouncementItem, 'id' | 'publishedAt'>) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toastOrTitle: Omit<ToastMessage, 'id'> | string, type?: ToastMessage['type'], description?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SystemUser>(INITIAL_USERS[2]); // Default to Participant Zayd Al-Ansari
  const [users] = useState<SystemUser[]>(INITIAL_USERS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [competitions, setCompetitions] = useState<CompetitionItem[]>(INITIAL_COMPETITIONS);
  const [questions, setQuestions] = useState<CompetitionQuestion[]>(INITIAL_QUESTIONS);
  const [forms, setForms] = useState<RegistrationForm[]>(INITIAL_FORMS);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(INITIAL_REGISTRATIONS);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [manualSubmissions, setManualSubmissions] = useState<ManualSubmission[]>(INITIAL_MANUAL_SUBMISSIONS);
  const [certificates, setCertificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedRegs = localStorage.getItem('ilm_registrations');
      if (savedRegs) setRegistrations(JSON.parse(savedRegs));

      const savedAttempts = localStorage.getItem('ilm_attempts');
      if (savedAttempts) setQuizAttempts(JSON.parse(savedAttempts));

      const savedSubmissions = localStorage.getItem('ilm_submissions');
      if (savedSubmissions) setManualSubmissions(JSON.parse(savedSubmissions));

      const savedCerts = localStorage.getItem('ilm_certificates');
      if (savedCerts) setCertificates(JSON.parse(savedCerts));

      const savedEvents = localStorage.getItem('ilm_events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedForms = localStorage.getItem('ilm_forms');
      if (savedForms) setForms(JSON.parse(savedForms));
    } catch {
      // LocalStorage might be unavailable in some private windows
    }
  }, []);

  const addToast = (
    toastOrTitle: Omit<ToastMessage, 'id'> | string,
    type: ToastMessage['type'] = 'info',
    description?: string
  ) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    let toastObj: ToastMessage;
    if (typeof toastOrTitle === 'string') {
      toastObj = { id, title: toastOrTitle, type, description };
    } else {
      toastObj = { ...toastOrTitle, id };
    }
    setToasts((prev) => [...prev, toastObj]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: Role) => {
    const matched = users.find((u) => u.role === role) || {
      id: `user-${role}`,
      name: role.toUpperCase(),
      email: `${role}@ilmflow.org`,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    setCurrentUser(matched);
    addToast({
      type: 'info',
      title: `Switched Persona to ${matched.name}`,
      description: `Active Role: ${matched.role.toUpperCase()} with contextual permissions.`
    });
  };

  // Events management
  const createEvent = (data: Omit<EventItem, 'id' | 'registeredCount' | 'waitlistCount'>) => {
    const newId = 'evt-' + Date.now();
    const newEvent: EventItem = {
      ...data,
      id: newId,
      registeredCount: 0,
      waitlistCount: 0
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    try {
      localStorage.setItem('ilm_events', JSON.stringify(updated));
    } catch {}
    addToast({
      type: 'success',
      title: 'Event Created Successfully',
      description: `"${newEvent.title}" is now published on the platform.`
    });
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    const updated = events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
    setEvents(updated);
    try {
      localStorage.setItem('ilm_events', JSON.stringify(updated));
    } catch {}
  };

  const getEventById = (id: string) => events.find((e) => e.id === id || e.slug === id);

  // Competitions
  const getCompetitionById = (id: string) =>
    competitions.find((c) => c.id === id || c.slug === id);

  const updateCompetition = (id: string, updates: Partial<CompetitionItem>) => {
    setCompetitions((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Questions
  const addQuestion = (q: Omit<CompetitionQuestion, 'id'>) => {
    const newQ: CompetitionQuestion = {
      ...q,
      id: 'q-' + Date.now()
    };
    setQuestions((prev) => [newQ, ...prev]);
    addToast({
      type: 'success',
      title: 'Question Added to Question Bank',
      description: `New question in category: ${q.category}`
    });
  };

  const updateQuestion = (id: string, updates: Partial<CompetitionQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    addToast({
      type: 'info',
      title: 'Question Removed',
      description: 'The question was removed from the question bank.'
    });
  };

  // Forms
  const saveForm = (form: RegistrationForm) => {
    const exists = forms.some((f) => f.id === form.id);
    const updated = exists ? forms.map((f) => (f.id === form.id ? form : f)) : [...forms, form];
    setForms(updated);
    try {
      localStorage.setItem('ilm_forms', JSON.stringify(updated));
    } catch {}
    addToast({
      type: 'success',
      title: 'Registration Form Saved',
      description: `"${form.title}" is saved with ${form.fields.length} dynamic fields.`
    });
  };

  const getFormById = (id: string) => forms.find((f) => f.id === id);

  // Registrations
  const registerForEvent = (params: {
    eventId: string;
    ticketTierId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    formAnswers: Record<string, unknown>;
  }) => {
    const event = events.find((e) => e.id === params.eventId);
    const tier = event?.tickets.find((t) => t.id === params.ticketTierId);
    const ticketSeq = (registrations.length + 1).toString().padStart(4, '0');
    const ticketNumber = `TKT-${event?.title.slice(0, 4).toUpperCase() || 'ILM'}-2026-${ticketSeq}`;
    const qrValue = `ILM-FLOW:${ticketNumber}:VERIFIED:${params.participantEmail}`;

    const newReg: RegistrationRecord = {
      id: 'reg-' + Date.now(),
      ticketNumber,
      eventId: params.eventId,
      eventTitle: event?.title || 'Islamic Gathering',
      eventDate: event ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Nov 2026',
      userId: currentUser.id,
      participantName: params.participantName,
      participantEmail: params.participantEmail,
      participantPhone: params.participantPhone,
      ticketTierId: params.ticketTierId,
      ticketTierName: tier?.name || 'General Access',
      status: 'approved',
      formAnswers: params.formAnswers,
      registeredAt: new Date().toISOString(),
      qrCodeValue: qrValue
    };

    const updatedRegs = [newReg, ...registrations];
    setRegistrations(updatedRegs);

    // Update event capacity count
    if (event) {
      const updatedEvents = events.map((e) => {
        if (e.id === params.eventId) {
          return {
            ...e,
            registeredCount: e.registeredCount + 1,
            tickets: e.tickets.map((t) =>
              t.id === params.ticketTierId ? { ...t, registeredCount: t.registeredCount + 1 } : t
            )
          };
        }
        return e;
      });
      setEvents(updatedEvents);
      try {
        localStorage.setItem('ilm_events', JSON.stringify(updatedEvents));
      } catch {}
    }

    try {
      localStorage.setItem('ilm_registrations', JSON.stringify(updatedRegs));
    } catch {}

    addToast({
      type: 'success',
      title: 'Registration Confirmed & Ticket Issued!',
      description: `Ticket #${ticketNumber} has been generated with verified QR code.`
    });

    return newReg;
  };

  const updateRegistrationStatus = (id: string, status: RegistrationRecord['status']) => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, status } : r));
    setRegistrations(updated);
    try {
      localStorage.setItem('ilm_registrations', JSON.stringify(updated));
    } catch {}
    addToast({
      type: 'info',
      title: 'Registration Status Updated',
      description: `Status changed to: ${status.replace('_', ' ').toUpperCase()}`
    });
  };

  const checkInAttendee = (ticketOrQrCode: string) => {
    const cleaned = ticketOrQrCode.trim().toUpperCase();
    const record = registrations.find(
      (r) =>
        r.ticketNumber.toUpperCase() === cleaned ||
        r.qrCodeValue.toUpperCase().includes(cleaned) ||
        r.id.toUpperCase() === cleaned
    );

    if (!record) {
      return {
        success: false,
        message: 'No matching ticket found. Please verify the ticket code or QR payload.'
      };
    }

    if (record.status === 'checked_in') {
      return {
        success: false,
        message: `Attendee ${record.participantName} was ALREADY checked in at ${record.checkedInAt ? new Date(record.checkedInAt).toLocaleTimeString() : 'an earlier gate'}.`,
        record
      };
    }

    const updated = registrations.map((r) =>
      r.id === record.id
        ? {
            ...r,
            status: 'checked_in' as const,
            checkedInAt: new Date().toISOString()
          }
        : r
    );

    setRegistrations(updated);
    try {
      localStorage.setItem('ilm_registrations', JSON.stringify(updated));
    } catch {}

    addToast({
      type: 'success',
      title: 'Attendee Checked In Successfully!',
      description: `Welcome, ${record.participantName}! (${record.ticketTierName})`
    });

    return {
      success: true,
      message: `Checked in successfully: ${record.participantName}`,
      record: { ...record, status: 'checked_in' as const, checkedInAt: new Date().toISOString() }
    };
  };

  // Quizzes
  const recordQuizAttempt = (attemptData: Omit<QuizAttempt, 'id'>) => {
    const id = 'att-' + Date.now();
    const newAttempt: QuizAttempt = { ...attemptData, id };
    const updated = [newAttempt, ...quizAttempts.filter((a) => !(a.competitionId === attemptData.competitionId && a.participantId === attemptData.participantId))];
    setQuizAttempts(updated);
    try {
      localStorage.setItem('ilm_attempts', JSON.stringify(updated));
    } catch {}

    // Auto issue certificate if passed with high distinction (>= 80%)
    if (newAttempt.percentage >= 80) {
      const comp = competitions.find((c) => c.id === attemptData.competitionId);
      const certSeq = Math.floor(1000 + Math.random() * 9000);
      const newCert: CertificateItem = {
        id: 'cert-' + Date.now(),
        certificateNumber: `CERT-ILM-2026-${certSeq}`,
        recipientName: attemptData.participantName,
        recipientEmail: currentUser.email,
        eventOrCompetitionTitle: comp?.title || 'Hadith Mastery Competition',
        type: newAttempt.percentage >= 90 ? 'winner' : 'excellence',
        score: newAttempt.score,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verificationHash: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        issuerTitle: 'Academic Evaluation & Competition Directorate',
        issuerSignatureName: comp?.judges[0]?.name || 'Shaykh Dr. Abdur-Rahman Al-Badr',
        organizationName: 'IlmFlow Global Islamic Council'
      };
      const updatedCerts = [newCert, ...certificates];
      setCertificates(updatedCerts);
      try {
        localStorage.setItem('ilm_certificates', JSON.stringify(updatedCerts));
      } catch {}
    }

    addToast({
      type: 'success',
      title: 'Test Completed & Auto-Graded!',
      description: `Your score: ${newAttempt.score}/${newAttempt.totalMarks} (${newAttempt.percentage}%). Detailed breakdown generated.`
    });

    return newAttempt;
  };

  const getAttempt = (competitionId: string, participantId: string) =>
    quizAttempts.find((a) => a.competitionId === competitionId && a.participantId === participantId);

  // Manual Submissions (Quran & Essay)
  const submitManualWork = (data: Omit<ManualSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: ManualSubmission = {
      ...data,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    };
    const updated = [newSub, ...manualSubmissions];
    setManualSubmissions(updated);
    try {
      localStorage.setItem('ilm_submissions', JSON.stringify(updated));
    } catch {}

    addToast({
      type: 'success',
      title: 'Submission Received for Judging',
      description: `Your ${data.type === 'audio' ? 'Quran Recitation Recording' : 'Essay Submission'} has been logged into the judges queue.`
    });

    return newSub;
  };

  const gradeSubmission = (
    submissionId: string,
    judgeId: string,
    judgeName: string,
    criteriaScores: Record<string, number>,
    totalScore: number,
    comments: string
  ) => {
    const updated = manualSubmissions.map((s) => {
      if (s.id === submissionId) {
        const newGrade = {
          judgeId,
          judgeName,
          criteriaScores,
          totalScore,
          comments,
          gradedAt: new Date().toISOString()
        };
        const existingGrades = s.grades || [];
        return {
          ...s,
          status: 'graded' as const,
          grades: [...existingGrades, newGrade],
          finalScore: totalScore
        };
      }
      return s;
    });

    setManualSubmissions(updated);
    try {
      localStorage.setItem('ilm_submissions', JSON.stringify(updated));
    } catch {}

    addToast({
      type: 'success',
      title: 'Rubric Grade Published!',
      description: `Assigned score of ${totalScore}/100. Feedback and rubric calculations have been recorded.`
    });
  };

  // Certificates
  const issueCertificate = (data: Omit<CertificateItem, 'id' | 'issueDate' | 'verificationHash'>) => {
    const certSeq = Math.floor(1000 + Math.random() * 9000);
    const hash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCert: CertificateItem = {
      ...data,
      id: 'cert-' + Date.now(),
      certificateNumber: data.certificateNumber || `CERT-ILM-2026-${certSeq}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verificationHash: hash
    };
    const updated = [newCert, ...certificates];
    setCertificates(updated);
    try {
      localStorage.setItem('ilm_certificates', JSON.stringify(updated));
    } catch {}

    addToast({
      type: 'success',
      title: 'Certificate Issued & Hash Generated',
      description: `Certificate #${newCert.certificateNumber} is now permanently verifiable.`
    });

    return newCert;
  };

  const getCertificateByNumber = (certNumber: string) => {
    const cleaned = certNumber.trim().toUpperCase();
    return certificates.find(
      (c) =>
        c.certificateNumber.toUpperCase() === cleaned ||
        c.verificationHash.toUpperCase() === cleaned ||
        c.id.toUpperCase() === cleaned
    );
  };

  // Announcements
  const addAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'publishedAt'>) => {
    const newAnc: AnnouncementItem = {
      ...data,
      id: 'anc-' + Date.now(),
      publishedAt: new Date().toISOString()
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addToast({
      type: 'info',
      title: 'Announcement Broadcasted',
      description: newAnc.title
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        users,
        events,
        createEvent,
        updateEvent,
        getEventById,
        competitions,
        getCompetitionById,
        updateCompetition,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        forms,
        saveForm,
        getFormById,
        registrations,
        registerForEvent,
        updateRegistrationStatus,
        checkInAttendee,
        quizAttempts,
        recordQuizAttempt,
        getAttempt,
        manualSubmissions,
        submitManualWork,
        gradeSubmission,
        certificates,
        issueCertificate,
        getCertificateByNumber,
        announcements,
        addAnnouncement,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
