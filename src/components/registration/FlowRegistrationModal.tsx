'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, RegistrationRecord } from '../../types';
import {
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Shield,
  Download,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlowRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  preselectedTicketId?: string;
}

export const FlowRegistrationModal: React.FC<FlowRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  preselectedTicketId
}) => {
  const { registerForEvent, currentUser } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    preselectedTicketId || event.tickets[0]?.id || ''
  );

  const [formData, setFormData] = useState<Record<string, unknown>>({
    f_full_name: currentUser.name !== 'Prospective Guest' ? currentUser.name : '',
    f_email: currentUser.email !== 'guest@ilmflow.org' ? currentUser.email : '',
    f_phone: currentUser.phone || '',
    f_age: 24,
    f_gender: 'Brothers',
    f_dietary: 'standard',
    guardian_name: '',
    guardian_phone: '',
    guardian_relationship: 'Parent / Legal Guardian',
    guardian_agreed: false,
    terms_agreed: false
  });

  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);

  if (!isOpen) return null;

  const selectedTier = event.tickets.find((t) => t.id === selectedTicketId) || event.tickets[0];

  const handleInputChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isMinor = Number(formData.f_age) < 18;

  const handleCompleteRegistration = () => {
    const record = registerForEvent({
      eventId: event.id,
      ticketTierId: selectedTicketId,
      participantName: (formData.f_full_name as string) || currentUser.name,
      participantEmail: (formData.f_email as string) || currentUser.email,
      participantPhone: (formData.f_phone as string) || '+1 555 000 0000',
      formAnswers: formData
    });

    setConfirmedRecord(record);
    setCurrentStep(5);

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff']
      });
    } catch {}
  };

  const steps = [
    { number: 1, title: 'Profile' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Ticket' },
    { number: 4, title: 'Review' }
  ];

  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / event.capacity) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white border border-stone-200 shadow-sm text-stone-900 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-6 border-b border-stone-200 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-stone-900 tracking-tight">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-stone-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-stone-400" />
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-stone-400" />
                  {event.venueName}
                </span>
              </div>
            </div>

            {/* Capacity Status */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-left sm:text-right shrink-0">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500 block">Tickets Sold</span>
              <span className="text-lg font-semibold text-stone-900 block mt-1">
                {event.registeredCount} / {event.capacity}
              </span>
              <div className="w-full sm:w-28 bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-stone-900 h-full rounded-full"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
              {steps.map((step) => {
                const isActive = currentStep === step.number;
                const isPassed = currentStep > step.number;
                return (
                  <div key={step.number} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        isPassed
                          ? 'bg-stone-900 text-white'
                          : isActive
                          ? 'bg-stone-200 text-stone-900'
                          : 'bg-stone-50 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isPassed ? <Check size={12} /> : step.number}
                    </div>
                    <span
                      className={`text-sm hidden md:inline font-medium ${
                        isActive
                          ? 'text-stone-900'
                          : isPassed
                          ? 'text-stone-900'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Attendee Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-lg font-semibold text-stone-900">
                  Step 1: Profile Information
                </h4>
                <p className="text-sm text-stone-500 mt-1">
                  Enter your details for registration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.f_full_name as string}
                    onChange={(e) => handleInputChange('f_full_name', e.target.value)}
                    placeholder="e.g. Tariq Ibn Ziyad"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.f_email as string}
                    onChange={(e) => handleInputChange('f_email', e.target.value)}
                    placeholder="tariq@example.com"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.f_phone as string}
                    onChange={(e) => handleInputChange('f_phone', e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={Number(formData.f_age)}
                    onChange={(e) => handleInputChange('f_age', Number(e.target.value))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                  {isMinor && (
                    <span className="text-xs text-amber-600 mt-1.5 block font-medium">
                      Under 18: Guardian consent required in next step.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Seating Preference *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Brothers', 'Sisters'].map((gender) => (
                    <label
                      key={gender}
                      className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.f_gender === gender
                          ? 'bg-stone-50 border-stone-900 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="f_gender"
                        checked={formData.f_gender === gender}
                        onChange={() => handleInputChange('f_gender', gender)}
                        className="text-stone-900 focus:ring-stone-900"
                      />
                      <span className="text-sm font-medium">{gender} Section</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Custom Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-lg font-semibold text-stone-900">
                  Step 2: Additional Details
                </h4>
                <p className="text-sm text-stone-500 mt-1">
                  Please provide dietary preferences and other needs.
                </p>
              </div>

              {isMinor && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <Shield size={16} />
                    <span>Guardian Consent (Under 18)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1.5">Guardian Name *</label>
                      <input
                        type="text"
                        value={formData.guardian_name as string}
                        onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                        className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1.5">Guardian Phone *</label>
                      <input
                        type="tel"
                        value={formData.guardian_phone as string}
                        onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                        className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-amber-900 cursor-pointer pt-2 font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.guardian_agreed)}
                      onChange={(e) => handleInputChange('guardian_agreed', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span>I confirm parent/guardian approval for participation.</span>
                  </label>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Dietary Requirements
                  </label>
                  <select
                    value={formData.f_dietary as string}
                    onChange={(e) => handleInputChange('f_dietary', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white"
                  >
                    <option value="standard">Standard Halal</option>
                    <option value="vegan">Vegetarian / Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="nut-free">Nut Allergy Safe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Accessibility Needs
                  </label>
                  <textarea
                    rows={3}
                    value={(formData.f_special_needs as string) || ''}
                    onChange={(e) => handleInputChange('f_special_needs', e.target.value)}
                    placeholder="Any special accommodations required..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pass Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-lg font-semibold text-stone-900">
                  Step 3: Select Ticket
                </h4>
                <p className="text-sm text-stone-500 mt-1">
                  Choose your registration tier.
                </p>
              </div>

              <div className="space-y-4">
                {event.tickets.map((ticket) => {
                  const isSelected = selectedTicketId === ticket.id;
                  const remaining = ticket.capacity - ticket.registeredCount;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-50 border-stone-900'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="ticketTier"
                            checked={isSelected}
                            onChange={() => setSelectedTicketId(ticket.id)}
                            className="text-stone-900 focus:ring-stone-900"
                          />
                          <h5 className="text-sm font-semibold text-stone-900">{ticket.name}</h5>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-stone-900">
                            {ticket.price === 0 ? 'Free' : `$${ticket.price} ${ticket.currency}`}
                          </span>
                          <span className="text-xs text-stone-500 block mt-0.5">
                            {remaining} remaining
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-stone-600 mt-2">{ticket.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-200">
                        {ticket.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                            <Check size={14} className="text-stone-900 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h4 className="text-lg font-semibold text-stone-900">
                  Step 4: Review Registration
                </h4>
                <p className="text-sm text-stone-500 mt-1">
                  Please verify your details before finalizing.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-stone-200">
                  <span className="text-stone-500">Event:</span>
                  <span className="font-medium text-stone-900 text-right">{event.title}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-stone-200">
                  <span className="text-stone-500">Attendee Name:</span>
                  <span className="text-stone-900 font-medium">{formData.f_full_name as string}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-stone-200">
                  <span className="text-stone-500">Ticket Tier:</span>
                  <span className="text-stone-900 font-medium">
                    {selectedTier?.name} — {selectedTier?.price === 0 ? 'Free' : `$${selectedTier?.price}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="text-stone-900 text-right">{event.venueName}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-900 block">Terms & Conditions</span>
                <p className="text-sm text-stone-600 leading-relaxed">
                  By completing this registration, you agree to follow the event's guidelines and code of conduct.
                </p>
                <label className="flex items-start gap-3 text-sm text-stone-900 cursor-pointer pt-2 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.terms_agreed)}
                    onChange={(e) => handleInputChange('terms_agreed', e.target.checked)}
                    className="text-stone-900 focus:ring-stone-900 mt-0.5 rounded"
                  />
                  <span>
                    I confirm that the details provided are accurate and I agree to the terms.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Ticket */}
          {currentStep === 5 && confirmedRecord && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-stone-900 tracking-tight">
                  Registration Complete
                </h3>
                <p className="text-stone-500 mt-2">
                  Your ticket has been issued. Present this at the check-in desk.
                </p>
              </div>

              {/* Clean Ticket Card */}
              <div className="max-w-sm mx-auto rounded-xl bg-white border border-stone-200 shadow-sm p-6 text-left relative overflow-hidden mt-8">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <span className="font-semibold text-stone-900 tracking-tight">
                    EVENT TICKET
                  </span>
                  <span className="text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    CONFIRMED
                  </span>
                </div>

                <div className="py-5 space-y-4">
                  <h4 className="text-base font-medium text-stone-900">{confirmedRecord.eventTitle}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-stone-500 block">Name</span>
                      <span className="font-medium text-stone-900 mt-1 block">{confirmedRecord.participantName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-stone-500 block">Tier</span>
                      <span className="font-medium text-stone-900 mt-1 block">{confirmedRecord.ticketTierName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-stone-500 block">Ticket #</span>
                      <span className="font-mono text-stone-600 mt-1 block">{confirmedRecord.ticketNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-stone-500 block">Date</span>
                      <span className="text-stone-600 mt-1 block">{confirmedRecord.eventDate}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-stone-300 pt-5 flex flex-col items-center justify-center gap-2">
                   <div className="w-24 h-24 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200">
                     <span className="text-xs text-stone-400">QR CODE</span>
                   </div>
                   <span className="font-mono text-xs text-stone-500 tracking-wider">
                     {confirmedRecord.ticketNumber}
                   </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Download size={16} />
                  <span>Download Ticket</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {currentStep < 5 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0 rounded-b-xl">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !formData.f_full_name) {
                    alert('Please provide your full name.');
                    return;
                  }
                  if (currentStep === 2 && isMinor && !formData.guardian_agreed) {
                    alert('Parental or guardian approval is required for attendees under 18.');
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                disabled={!formData.terms_agreed}
                onClick={handleCompleteRegistration}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.terms_agreed
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>Complete Registration</span>
                <CheckCircle size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
