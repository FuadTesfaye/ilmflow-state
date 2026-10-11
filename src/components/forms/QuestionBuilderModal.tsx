'use client';

import React, { useState, useEffect } from 'react';
import { CompetitionCategory, CompetitionItem, CompetitionQuestion, QuestionOption, QuestionType } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  Timer,
  Check,
  X
} from 'lucide-react';

interface QuestionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    question: Omit<CompetitionQuestion, 'id'>,
    targetCompetitionId?: string,
    targetRoundId?: string
  ) => void;
  initialQuestion?: CompetitionQuestion | null;
  competitions?: CompetitionItem[];
  defaultCategory?: CompetitionCategory;
  defaultCompetitionId?: string;
}

export const QuestionBuilderModal: React.FC<QuestionBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
  competitions = [],
  defaultCategory = 'hadith-mastery',
  defaultCompetitionId = 'bank'
}) => {
  const [questionText, setQuestionText] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [category, setCategory] = useState<CompetitionCategory>(defaultCategory);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [marks, setMarks] = useState<number>(5);
  const [negativeMarks, setNegativeMarks] = useState<number>(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(60);
  const [sourceReference, setSourceReference] = useState('');
  const [explanation, setExplanation] = useState('');

  // Options & Answer Key
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'opt_1', text: '', arabicText: '' },
    { id: 'opt_2', text: '', arabicText: '' },
    { id: 'opt_3', text: '', arabicText: '' },
    { id: 'opt_4', text: '', arabicText: '' }
  ]);
  const [selectedCorrectSingle, setSelectedCorrectSingle] = useState<string>('opt_1');
  const [selectedCorrectMulti, setSelectedCorrectMulti] = useState<string[]>(['opt_1']);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');

  // Competition Assignment
  const [targetCompetitionId, setTargetCompetitionId] = useState<string>('bank');
  const [targetRoundId, setTargetRoundId] = useState<string>('');

  // Sync state when modal opens or initialQuestion changes
  useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion.questionText);
      setArabicText(initialQuestion.arabicText || '');
      setQuestionType(initialQuestion.type);
      setCategory(initialQuestion.category);
      setDifficulty(initialQuestion.difficulty);
      setMarks(initialQuestion.marks);
      setNegativeMarks(initialQuestion.negativeMarks || 0);
      setTimeLimitSeconds(initialQuestion.timeLimitSeconds || 60);
      setSourceReference(initialQuestion.sourceReference || '');
      setExplanation(initialQuestion.explanation || '');

      if (initialQuestion.options && initialQuestion.options.length > 0) {
        setOptions(initialQuestion.options);
      }
      if (Array.isArray(initialQuestion.correctAnswer)) {
        setSelectedCorrectMulti(initialQuestion.correctAnswer);
      } else if (typeof initialQuestion.correctAnswer === 'string') {
        setSelectedCorrectSingle(initialQuestion.correctAnswer);
        setFillBlankAnswer(initialQuestion.correctAnswer);
      }
    } else {
      // Reset form
      setQuestionText('');
      setArabicText('');
      setQuestionType('multiple-choice');
      setCategory(defaultCategory);
      setDifficulty('intermediate');
      setMarks(5);
      setNegativeMarks(0);
      setTimeLimitSeconds(60);
      setSourceReference('');
      setExplanation('');
      setOptions([
        { id: 'opt_1', text: '', arabicText: '' },
        { id: 'opt_2', text: '', arabicText: '' },
        { id: 'opt_3', text: '', arabicText: '' },
        { id: 'opt_4', text: '', arabicText: '' }
      ]);
      setSelectedCorrectSingle('opt_1');
      setSelectedCorrectMulti(['opt_1']);
      setFillBlankAnswer('');
      const initialComp = defaultCompetitionId || 'bank';
      setTargetCompetitionId(initialComp);
      const comp = competitions.find((c) => c.id === initialComp);
      setTargetRoundId(comp?.rounds?.[0]?.id || '');
    }
  }, [initialQuestion, isOpen, defaultCategory, defaultCompetitionId, competitions]);

  // Adjust options template when QuestionType changes
  const handleTypeChange = (newType: QuestionType) => {
    setQuestionType(newType);
    if (newType === 'true-false') {
      const tfOptions: QuestionOption[] = [
        { id: 'opt_true', text: 'True / Authentic', arabicText: 'صحيح' },
        { id: 'opt_false', text: 'False / Incorrect', arabicText: 'خطأ' }
      ];
      setOptions(tfOptions);
      setSelectedCorrectSingle('opt_true');
    } else if (newType === 'multiple-choice' || newType === 'multiple-select') {
      if (options.length < 2 || options[0]?.id === 'opt_true') {
        setOptions([
          { id: `opt_${Date.now()}_1`, text: '', arabicText: '' },
          { id: `opt_${Date.now()}_2`, text: '', arabicText: '' },
          { id: `opt_${Date.now()}_3`, text: '', arabicText: '' },
          { id: `opt_${Date.now()}_4`, text: '', arabicText: '' }
        ]);
        setSelectedCorrectSingle(`opt_${Date.now()}_1`);
        setSelectedCorrectMulti([`opt_${Date.now()}_1`]);
      }
    }
  };

  const handleAddOption = () => {
    const newId = `opt_${Date.now()}`;
    setOptions((prev) => [...prev, { id: newId, text: '', arabicText: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
    if (selectedCorrectSingle === id) {
      setSelectedCorrectSingle(options.find((o) => o.id !== id)?.id || '');
    }
    setSelectedCorrectMulti((prev) => prev.filter((oId) => oId !== id));
  };

  const handleUpdateOption = (id: string, text: string, arabicText?: string) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, text, ...(arabicText !== undefined ? { arabicText } : {}) } : o
      )
    );
  };

  const handleToggleMultiChoice = (id: string) => {
    setSelectedCorrectMulti((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one correct
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    let finalCorrectAnswer: string | string[] = selectedCorrectSingle;
    if (questionType === 'multiple-select') {
      finalCorrectAnswer = selectedCorrectMulti;
    } else if (questionType === 'fill-blank') {
      finalCorrectAnswer = fillBlankAnswer.trim();
    } else if (questionType === 'true-false') {
      finalCorrectAnswer = selectedCorrectSingle;
    }

    // Filter out completely empty options for multiple choice
    const cleanedOptions =
      questionType === 'fill-blank'
        ? undefined
        : options.map((opt, idx) => ({
            ...opt,
            text: opt.text.trim() || `Choice ${idx + 1}`
          }));

    const questionPayload: Omit<CompetitionQuestion, 'id'> = {
      questionText: questionText.trim(),
      arabicText: arabicText.trim() || undefined,
      type: questionType,
      category,
      difficulty,
      marks: Number(marks) || 5,
      negativeMarks: Number(negativeMarks) || 0,
      timeLimitSeconds: Number(timeLimitSeconds) || 60,
      sourceReference: sourceReference.trim() || 'Canonical Islamic Sources',
      explanation:
        explanation.trim() ||
        'Verified against authentic source materials and canonical commentaries.',
      options: cleanedOptions,
      correctAnswer: finalCorrectAnswer
    };

    onSave(
      questionPayload,
      targetCompetitionId !== 'bank' ? targetCompetitionId : undefined,
      targetRoundId || undefined
    );

    onClose();
  };

  const selectedComp = competitions.find((c) => c.id === targetCompetitionId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0" onClose={onClose}>
        <div className="p-6 border-b border-stone-200 bg-linear-to-r from-emerald-900 to-teal-950 text-white relative">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Interactive Assessment Authoring</span>
          </div>
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            {initialQuestion ? 'Edit Examination Question' : 'Create Question & Choices Form'}
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-100/80 mt-1">
            Author bilingual questions with custom options, designated correct answers, marks, and scholarly proof.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-stone-900">
          {/* Question Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Question Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'multiple-choice', label: 'Single Choice', desc: '1 Correct Answer' },
                { type: 'multiple-select', label: 'Multi-Select', desc: 'Multiple Answers' },
                { type: 'true-false', label: 'True / False', desc: 'صحيح / خطأ' },
                { type: 'fill-blank', label: 'Fill in Blank', desc: 'Exact text match' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => handleTypeChange(item.type as QuestionType)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    questionType === item.type
                      ? 'border-[#135B3E] bg-emerald-50/70 ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        questionType === item.type ? 'text-[#135B3E]' : 'text-stone-800'
                      }`}
                    >
                      {item.label}
                    </span>
                    {questionType === item.type && (
                      <CheckCircle2 size={13} className="text-[#135B3E]" />
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bilingual Prompt */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Question Prompt (English) *</span>
                <span className="text-[11px] text-stone-400 font-normal">Required</span>
              </label>
              <textarea
                rows={2}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g. Which companion transmitted the Hadith of Jibreel explaining Islam, Iman, and Ihsan?"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm text-stone-900 outline-none focus:border-[#135B3E] focus:ring-2 focus:ring-emerald-600/10 placeholder:text-stone-400 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Arabic Matn (نص السؤال باللغة العربية)</span>
                <span className="text-[11px] text-emerald-700 font-medium">Bilingual Arabic Font</span>
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={arabicText}
                onChange={(e) => setArabicText(e.target.value)}
                placeholder="من هو الصحابي الجليل الذي روى حديث جبريل عليه السلام المشهور في بيان أركان الدين؟"
                className="w-full p-3 rounded-xl border border-stone-200 text-base font-arabic text-stone-900 outline-none focus:border-[#135B3E] focus:ring-2 focus:ring-emerald-600/10 placeholder:text-stone-400 bg-emerald-50/20 text-right leading-relaxed"
              />
            </div>
          </div>

          {/* Dynamic Choices / Options Section */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  2. Choices &amp; Answer Key
                </label>
                <p className="text-[11px] text-stone-500">
                  {questionType === 'multiple-choice'
                    ? 'Click the radio button beside the correct choice to mark it as the answer key.'
                    : questionType === 'multiple-select'
                    ? 'Check all options that apply as correct answers.'
                    : questionType === 'true-false'
                    ? 'Select whether the statement is True or False.'
                    : 'Provide the exact answer string required for full marks.'}
                </p>
              </div>

              {(questionType === 'multiple-choice' || questionType === 'multiple-select') && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="gap-1.5 text-xs text-emerald-800 hover:text-emerald-900 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Choice</span>
                </Button>
              )}
            </div>

            {/* If Fill in Blank */}
            {questionType === 'fill-blank' ? (
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <label className="text-xs font-semibold text-stone-700">
                  Accepted Correct Answer Key *
                </label>
                <Input
                  required
                  value={fillBlankAnswer}
                  onChange={(e) => setFillBlankAnswer(e.target.value)}
                  placeholder="e.g. Umar ibn al-Khattab (عمر بن الخطاب)"
                  className="bg-white text-sm"
                />
                <span className="text-[11px] text-stone-500 block">
                  Participants will be graded on exact case-insensitive match.
                </span>
              </div>
            ) : (
              /* Choices list */
              <div className="space-y-2.5">
                {options.map((opt, idx) => {
                  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                  const isCorrect =
                    questionType === 'multiple-select'
                      ? selectedCorrectMulti.includes(opt.id)
                      : selectedCorrectSingle === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center gap-3 ${
                        isCorrect
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Selector control */}
                        {questionType === 'multiple-select' ? (
                          <input
                            type="checkbox"
                            checked={isCorrect}
                            onChange={() => handleToggleMultiChoice(opt.id)}
                            className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                            title="Mark as correct answer"
                          />
                        ) : (
                          <input
                            type="radio"
                            name="correctAnswerOption"
                            checked={isCorrect}
                            onChange={() => setSelectedCorrectSingle(opt.id)}
                            className="w-4 h-4 accent-emerald-700 cursor-pointer"
                            title="Mark as correct answer"
                          />
                        )}

                        <span
                          className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {letters[idx] || idx + 1}
                        </span>

                        {isCorrect && (
                          <Badge variant="success" className="text-[10px] py-0 px-1.5 h-5">
                            Correct
                          </Badge>
                        )}
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input
                          value={opt.text}
                          onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                          placeholder={`Option ${letters[idx] || idx + 1} English text...`}
                          className="text-xs h-9 bg-white"
                          required={questionType !== 'true-false'}
                        />
                        <Input
                          value={opt.arabicText || ''}
                          dir="rtl"
                          onChange={(e) =>
                            handleUpdateOption(opt.id, opt.text, e.target.value)
                          }
                          placeholder="النص باللغة العربية (اختياري)"
                          className="text-xs h-9 font-arabic text-right bg-white"
                        />
                      </div>

                      {/* Delete Option button (if multiple choice and > 2 options) */}
                      {questionType !== 'true-false' && options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(opt.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors self-end sm:self-center cursor-pointer"
                          title="Remove choice"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Metadata: Category, Difficulty, Marks, Time Limit */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              3. Classification &amp; Scoring Rubric
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CompetitionCategory)}
                  className="w-full h-9 rounded-lg border border-stone-200 bg-white px-2.5 text-xs text-stone-800 outline-none focus:border-[#135B3E]"
                >
                  <option value="hadith-mastery">Hadith Mastery</option>
                  <option value="quran-memorization">Quran Memorization</option>
                  <option value="quran-recitation">Quran Recitation</option>
                  <option value="seerah-knowledge">Prophetic Seerah</option>
                  <option value="islamic-quiz">General Islamic Studies</option>
                  <option value="arabic-language">Arabic Language</option>
                  <option value="essay-writing">Islamic Scholarly Essay</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-stone-200 bg-white px-2.5 text-xs text-stone-800 outline-none focus:border-[#135B3E]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced (Sanad level)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Marks Awarded</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Timer (Seconds)</label>
                <Input
                  type="number"
                  min="10"
                  max="600"
                  value={timeLimitSeconds}
                  onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Scholarly Commentary & Source Reference */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Canonical Source Reference</label>
              <Input
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="e.g. Sahih Muslim (Hadith 8) / Al-Arba'in an-Nawawiyyah"
                className="h-9 text-xs bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Scholarly Commentary / Proof</label>
              <Input
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Proof explanation displayed upon test review..."
                className="h-9 text-xs bg-white"
              />
            </div>
          </div>

          {/* Assignment Destination */}
          <div className="pt-2 border-t border-stone-100 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#135B3E]" />
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Destination: Bank or Competition Round
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] text-stone-600 block font-medium">Assign To Tournament</span>
                <select
                  value={targetCompetitionId}
                  onChange={(e) => {
                    setTargetCompetitionId(e.target.value);
                    const comp = competitions.find((c) => c.id === e.target.value);
                    if (comp?.rounds?.[0]) {
                      setTargetRoundId(comp.rounds[0].id);
                    }
                  }}
                  className="w-full h-9 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs text-stone-800 outline-none focus:border-[#135B3E]"
                >
                  <option value="bank">Central Question Bank (Available for all tests)</option>
                  {competitions.map((c) => (
                    <option key={c.id} value={c.id}>
                      🏆 {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {selectedComp && (
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-600 block font-medium">Tournament Round</span>
                  <select
                    value={targetRoundId}
                    onChange={(e) => setTargetRoundId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs text-stone-800 outline-none focus:border-[#135B3E]"
                  >
                    {selectedComp.rounds.map((r) => (
                      <option key={r.id} value={r.id}>
                        Round {r.roundNumber}: {r.title} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#135B3E] hover:bg-[#0e4831] text-white gap-1.5">
              <Check size={15} />
              <span>{initialQuestion ? 'Save Updates' : 'Save Question to Bank & Round'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
