'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, RegistrationRecord } from '../../types';
import { IslamicStarIcon } from '../common/IslamicPattern';
import {
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Download,
  Users,
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
  const { registerForEvent, getFormById, currentUser } = useApp();

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
        colors: ['#064e3b', '#9e782f', '#10b981', '#ffffff']
      });
    } catch {}
  };

  const steps = [
    { number: 1, title: 'Delegate Profile' },
    { number: 2, title: 'Sanctuary Protocol' },
    { number: 3, title: 'Pass Tier' },
    { number: 4, title: 'Review & Terms' }
  ];

  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / event.capacity) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-2xl text-[#111827] overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-[#e7e2d6] bg-[#faf8f5] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] hover:border-[#064e3b]/50 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="meta-tag text-[#064e3b] font-bold">
                OFFICIAL SANCTUARY ENROLLMENT
              </span>
              <h3 className="text-xl sm:text-2xl text-[#0f172a] font-bold mt-1 tracking-tight">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#6b7280] mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#9e782f]" />
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#9e782f]" />
                  {event.venueName}
                </span>
              </div>
            </div>

            {/* Capacity Status */}
            <div className="bg-[#ffffff] p-3 rounded-2xl border border-[#e7e2d6] text-left sm:text-right shrink-0 shadow-xs">
              <span className="meta-tag text-[#6b7280] block">SEATS ALLOCATED</span>
              <span className="font-display text-lg font-bold text-[#111827] block mt-0.5 tabular-nums">
                {event.registeredCount} / {event.capacity}{' '}
                <span className="text-[#064e3b] font-sans font-semibold text-xs">
                  ({percentFilled}%)
                </span>
              </span>
              <div className="w-28 bg-[#f4f0e6] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#e7e2d6]">
                <div
                  className="bg-[#064e3b] h-full rounded-full"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e7e2d6]">
              {steps.map((step) => {
                const isActive = currentStep === step.number;
                const isPassed = currentStep > step.number;
                return (
                  <div key={step.number} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isPassed
                          ? 'bg-[#064e3b] text-[#ffffff]'
                          : isActive
                          ? 'bg-[#9e782f] text-[#ffffff]'
                          : 'bg-[#faf8f5] text-[#6b7280] border border-[#e7e2d6]'
                      }`}
                    >
                      {isPassed ? <Check size={12} /> : step.number}
                    </div>
                    <span
                      className={`text-xs hidden md:inline font-medium ${
                        isActive
                          ? 'text-[#064e3b] font-bold'
                          : isPassed
                          ? 'text-[#111827]'
                          : 'text-[#6b7280]'
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* STEP 1: Attendee Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-[#e7e2d6] pb-3">
                <h4 className="font-display text-lg text-[#064e3b] font-bold">
                  Step 1: Delegate Identity &amp; Attendance Category
                </h4>
                <p className="text-xs text-[#6b7280]">
                  Legal credentials will be etched onto your verified gate admission lanyard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.f_full_name as string}
                    onChange={(e) => handleInputChange('f_full_name', e.target.value)}
                    placeholder="e.g. Tariq Ibn Ziyad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:bg-[#ffffff] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.f_email as string}
                    onChange={(e) => handleInputChange('f_email', e.target.value)}
                    placeholder="tariq@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:bg-[#ffffff] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.f_phone as string}
                    onChange={(e) => handleInputChange('f_phone', e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:bg-[#ffffff] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={Number(formData.f_age)}
                    onChange={(e) => handleInputChange('f_age', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:bg-[#ffffff] focus:outline-none transition-colors"
                  />
                  {isMinor && (
                    <span className="text-[10px] text-[#9e782f] mt-1 block font-medium">
                      Under 18 detected: Parental / Guardian consent will be required in Step 2.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Sanctuary Seating &amp; Prayer Hall Preference *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Brothers', 'Sisters'].map((gender) => (
                    <label
                      key={gender}
                      className={`p-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        formData.f_gender === gender
                          ? 'bg-[#f4f0e6] border-[#064e3b] text-[#111827] shadow-xs'
                          : 'bg-[#faf8f5] border-[#e7e2d6] text-[#6b7280]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="f_gender"
                        checked={formData.f_gender === gender}
                        onChange={() => handleInputChange('f_gender', gender)}
                        className="accent-[#064e3b]"
                      />
                      <span className="text-xs font-semibold">{gender} Sanctuary Hall</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Custom Form */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-[#e7e2d6] pb-3">
                <h4 className="font-display text-lg text-[#064e3b] font-bold">
                  Step 2: Dietary, Safeguarding &amp; Translation Protocol
                </h4>
                <p className="text-xs text-[#6b7280]">
                  Specific inquiries coordinated by the conference secretariat.
                </p>
              </div>

              {isMinor && (
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#9e782f]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#064e3b]">
                    <Shield size={16} />
                    <span>Parent / Legal Guardian Authorization (Under 18 Competitor)</span>
                  </div>
                  <p className="text-[11px] text-[#6b7280]">
                    In accordance with our Child Protection Charter, minor delegates require an authorized legal guardian on file.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#374151] mb-1 font-semibold">Guardian Full Name *</label>
                      <input
                        type="text"
                        value={formData.guardian_name as string}
                        onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                        placeholder="e.g. Maryam Al-Ansari"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#374151] mb-1 font-semibold">Guardian Emergency Contact *</label>
                      <input
                        type="tel"
                        value={formData.guardian_phone as string}
                        onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                        placeholder="+1 555 987 6543"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[#374151] cursor-pointer pt-1 font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.guardian_agreed)}
                      onChange={(e) => handleInputChange('guardian_agreed', e.target.checked)}
                      className="accent-[#064e3b]"
                    />
                    <span>I confirm parent/guardian approval for convocation participation.</span>
                  </label>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Halal Culinary &amp; Dietary Requirements
                  </label>
                  <select
                    value={formData.f_dietary as string}
                    onChange={(e) => handleInputChange('f_dietary', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                  >
                    <option value="standard">Standard Halal Feast</option>
                    <option value="vegan">Halal Vegetarian / Vegan</option>
                    <option value="gluten-free">Gluten-Free Halal</option>
                    <option value="nut-free">Nut Allergy Safe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#374151] mb-1 font-semibold">
                    Accessibility or Translation Needs
                  </label>
                  <textarea
                    rows={3}
                    value={(formData.f_special_needs as string) || ''}
                    onChange={(e) => handleInputChange('f_special_needs', e.target.value)}
                    placeholder="Simultaneous English/Arabic translation headset, elder seating, or wheelchair access..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pass Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#e7e2d6] pb-3">
                <h4 className="font-display text-lg text-[#064e3b] font-bold">
                  Step 3: Select Delegate Credential Tier
                </h4>
                <p className="text-xs text-[#6b7280]">
                  Real-time seat allocation ensures transparency across all sanctuary halls.
                </p>
              </div>

              <div className="space-y-3">
                {event.tickets.map((ticket) => {
                  const isSelected = selectedTicketId === ticket.id;
                  const remaining = ticket.capacity - ticket.registeredCount;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f4f0e6] border-[#064e3b] shadow-xs'
                          : 'bg-[#faf8f5] border-[#e7e2d6] hover:border-[#9e782f]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ticketTier"
                            checked={isSelected}
                            onChange={() => setSelectedTicketId(ticket.id)}
                            className="accent-[#064e3b]"
                          />
                          <h5 className="text-sm font-bold text-[#111827]">{ticket.name}</h5>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg font-bold text-[#064e3b]">
                            {ticket.price === 0 ? 'Complimentary' : `$${ticket.price} ${ticket.currency}`}
                          </span>
                          <span className="text-[10px] text-[#6b7280] block tabular-nums">
                            {remaining} spots remaining
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#6b7280] mt-2">{ticket.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#e7e2d6]">
                        {ticket.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[#374151]">
                            <Check size={13} className="text-[#064e3b] shrink-0 font-bold" />
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
            <div className="space-y-4">
              <div className="border-b border-[#e7e2d6] pb-3">
                <h4 className="font-display text-lg text-[#064e3b] font-bold">
                  Step 4: Review &amp; Sacred Sanctuary Adab
                </h4>
                <p className="text-xs text-[#6b7280]">
                  Verify registration credentials prior to digital pass issuance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#e7e2d6]">
                  <span className="text-[#6b7280]">Convocation:</span>
                  <span className="font-semibold text-[#111827] text-right">{event.title}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#e7e2d6]">
                  <span className="text-[#6b7280]">Delegate Name:</span>
                  <span className="text-[#111827] font-semibold">{formData.f_full_name as string}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#e7e2d6]">
                  <span className="text-[#6b7280]">Pass Tier:</span>
                  <span className="text-[#064e3b] font-bold">
                    {selectedTier?.name} — {selectedTier?.price === 0 ? 'Complimentary' : `$${selectedTier?.price}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Location:</span>
                  <span className="text-[#111827] text-right">{event.venueName}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4f0e6] border border-[#e7e2d6] space-y-2">
                <span className="meta-tag text-[#064e3b] font-bold block">SANCTUARY CODE OF ETIQUETTE</span>
                <p className="text-[11px] text-[#4b5563] leading-relaxed">
                  Delegates agree to maintain reverent decorum in the presence of the Holy Quran, observe modest dress codes, remain silent during recitation circles, and respect the prayer schedule by joining congregational Salah punctually.
                </p>
                <label className="flex items-start gap-2.5 text-xs text-[#111827] cursor-pointer pt-2 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.terms_agreed)}
                    onChange={(e) => handleInputChange('terms_agreed', e.target.checked)}
                    className="accent-[#064e3b] mt-0.5"
                  />
                  <span>
                    I confirm that the details provided are accurate and I agree to uphold the sanctuary rules and code of conduct.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Ticket */}
          {currentStep === 5 && confirmedRecord && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#064e3b] text-[#ffffff] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle size={28} />
              </div>

              <div>
                <span className="meta-tag text-[#064e3b] font-bold">
                  REGISTRATION COMPLETED • PASS ISSUED
                </span>
                <h3 className="font-display text-2xl text-[#111827] font-bold mt-1">
                  Credential Successfully Enrolled
                </h3>
                <p className="text-xs text-[#6b7280] mt-1">
                  Official badge record generated. Present barcode at arrival gate.
                </p>
              </div>

              {/* Luxury Boarding Pass Style Ticket */}
              <div className="max-w-md mx-auto rounded-3xl bg-[#ffffff] border-2 border-[#064e3b] shadow-xl p-6 text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#e7e2d6] pb-3">
                  <div className="flex items-center gap-2">
                    <IslamicStarIcon size={18} className="text-[#9e782f]" />
                    <span className="font-display text-sm text-[#064e3b] font-bold tracking-wider">
                      ILMFLOW SANCTUARY PASS
                    </span>
                  </div>
                  <span className="meta-tag text-[#064e3b] bg-[#f4f0e6] px-2.5 py-0.5 rounded-full font-bold">
                    APPROVED
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <h4 className="text-base font-bold text-[#111827]">{confirmedRecord.eventTitle}</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="meta-tag text-[#6b7280] block text-[9px]">DELEGATE NAME</span>
                      <span className="font-bold text-[#111827] text-sm">{confirmedRecord.participantName}</span>
                    </div>
                    <div>
                      <span className="meta-tag text-[#6b7280] block text-[9px]">PASS TIER</span>
                      <span className="font-semibold text-[#064e3b]">{confirmedRecord.ticketTierName}</span>
                    </div>
                    <div>
                      <span className="meta-tag text-[#6b7280] block text-[9px]">TICKET NUMBER</span>
                      <span className="font-mono text-xs text-[#111827] font-semibold">{confirmedRecord.ticketNumber}</span>
                    </div>
                    <div>
                      <span className="meta-tag text-[#6b7280] block text-[9px]">DATES</span>
                      <span className="text-xs text-[#4b5563]">{confirmedRecord.eventDate}</span>
                    </div>
                  </div>
                </div>

                {/* Barcode & QR */}
                <div className="border-t border-dashed border-[#d4ccbd] pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="h-8 flex items-center gap-0.5">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2].map((w, i) => (
                        <span
                          key={i}
                          style={{ width: `${w}px` }}
                          className="h-full bg-[#111827] inline-block opacity-85"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] text-[#6b7280] mt-1 tracking-widest font-semibold">
                      {confirmedRecord.ticketNumber}
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-lg bg-[#ffffff] border border-[#e7e2d6] p-1 flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-[#111827] p-0.5 grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className={`rounded-xs ${i % 2 === 0 ? 'bg-[#ffffff]' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-[#f4f0e6] border border-[#e7e2d6] text-xs font-semibold text-[#064e3b] hover:bg-[#e8e1d2] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Print Lanyard Pass</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {currentStep < 5 && (
          <div className="p-5 border-t border-[#e7e2d6] bg-[#faf8f5] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#6b7280] hover:text-[#111827] cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !formData.f_full_name) {
                    alert('Please provide your full legal name.');
                    return;
                  }
                  if (currentStep === 2 && isMinor && !formData.guardian_agreed) {
                    alert('Parental or guardian approval is required for minor attendees.');
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all cursor-pointer shadow-md"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                disabled={!formData.terms_agreed}
                onClick={handleCompleteRegistration}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                  formData.terms_agreed
                    ? 'bg-[#064e3b] text-[#ffffff] hover:bg-[#043c2e] cursor-pointer'
                    : 'bg-[#e7e2d6] text-[#6b7280] cursor-not-allowed'
                }`}
              >
                <span>Authorize &amp; Issue Pass</span>
                <CheckCircle size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
