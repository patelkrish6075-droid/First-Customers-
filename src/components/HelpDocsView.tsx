import React, { useState } from 'react';
import { 
  HelpCircle, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Target,
  FlaskConical,
  BarChart3
} from 'lucide-react';
import { ActiveAppView } from '../types';

interface HelpDocsViewProps {
  setCurrentView: (view: ActiveAppView) => void;
}

export const HelpDocsView: React.FC<HelpDocsViewProps> = ({
  setCurrentView
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'loop' | 'bottlenecks' | 'mom_test' | 'experiments'>('loop');

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Methodology & Founder Handbook
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          The First Customers operational playbook for diagnosing traction constraints, testing willingness to pay, and running high-velocity experiments.
        </p>
      </div>

      {/* Topic Switcher */}
      <div className="flex overflow-x-auto gap-2 border-b border-stone-200 pb-2 scrollbar-none">
        {[
          { id: 'loop' as const, label: 'The 5-Stage Decision Loop' },
          { id: 'bottlenecks' as const, label: 'The 8 Bottleneck Categories' },
          { id: 'mom_test' as const, label: 'The Mom Test Discovery Rules' },
          { id: 'experiments' as const, label: 'Scientific Experiment Design' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTopic === t.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Topic Content */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
        {selectedTopic === 'loop' && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-base font-bold text-stone-900">
              The Continuous Customer Acquisition Loop
            </h2>
            <p>
              When a product is launched and sales don’t materialize, inexperienced founders typically do one of two things: they add more features, or they buy ads. Both reactions usually waste time and cash because they treat the symptom rather than the underlying constraint.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-0.5">1. Understand:</strong>
                Separate verified observable customer actions (e.g., credit card transactions, logged logins) from founder interpretations ("they seemed excited") and critical unknowns.
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-0.5">2. Diagnose:</strong>
                Isolate the earliest bottleneck in the funnel. If target buyers don’t care about the problem, running ads or lowering prices won’t fix the issue.
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-0.5">3. Experiment:</strong>
                Design the smallest practical test (7–10 business days) with explicit criteria for what proves or contradicts your hypothesis.
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-0.5">4. Measure:</strong>
                Log objective behavioral reactions: replies, objection quotes, and payments.
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-0.5">5. Learn:</strong>
                A disproven experiment is not a failure. It eliminates an unprofitable path, saving months of misdirected software development.
              </div>
            </div>
          </div>
        )}

        {selectedTopic === 'bottlenecks' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-base font-bold text-stone-900">
              The 8 Deterministic Bottleneck Categories
            </h2>
            <p>
              First Customers audits every business profile against 8 structured failure modes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">1. Demand Validation:</span>
                The problem is not painful or urgent enough; buyers do not spend money or effort on alternatives.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">2. Target Customer:</span>
                Targeting the wrong job title or a segment without discretionary budget authority.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">3. Acquisition Reach:</span>
                Lack of volume: fewer than 25 direct prospect touches conducted.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">4. Positioning & Offer:</span>
                Prospects don't understand how the tool differs from their current spreadsheet or status quo.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">5. Sales Conversion:</span>
                High replies or demo attendance, but hesitation at the moment of commitment.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">6. Activation & Value:</span>
                Users register or start trials, but abandon onboarding before experiencing the "Aha!" moment.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">7. Pricing & Purchasing:</span>
                Price format mismatch: e.g. requiring enterprise annual contracts for a lightweight utility.
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">8. Retention & Recurring Value:</span>
                High cancellation rates due to shallow utility or completed one-off tasks.
              </div>
            </div>
          </div>
        )}

        {selectedTopic === 'mom_test' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-base font-bold text-stone-900">
              The Mom Test Discovery Philosophy
            </h2>
            <p>
              People will lie to you if they think it will make you happy. When you ask friends or peers "Would you buy this software for $20?", they almost always say yes.
            </p>
            <div className="space-y-2.5">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block">Rule 1: Talk about their past behavior, not your future idea.</strong>
                Never say: "Imagine a tool that automatically does X. Would you like that?"<br />
                Say instead: "When was the last time you handled X? How long did it take? What went wrong?"
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block">Rule 2: Ask about specifics in the past, not generic opinions.</strong>
                Say: "Walk me through what happened last Tuesday when you needed to send that report."
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block">Rule 3: Listen more than you speak.</strong>
                If you are speaking for more than 20% of a discovery call, you are pitching, not listening.
              </div>
            </div>
          </div>
        )}

        {selectedTopic === 'experiments' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-base font-bold text-stone-900">
              The Architecture of a Validated Experiment
            </h2>
            <p>
              A true business experiment requires three distinct possible outcomes planned in advance:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-1">1. Supporting Outcome:</span>
                A concrete numeric threshold (e.g. 5 replies out of 25 touches) that substantiates the hypothesis.
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-950">
                <span className="font-bold block mb-1">2. Contradictory Outcome:</span>
                A specific threshold that disproves the assumption (e.g. 0 replies across 25 touches), triggering a strategic shift.
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                <span className="font-bold block mb-1">3. Inconclusive Outcome:</span>
                Sample size was inadequate (e.g. only 6 touches sent), requiring expansion rather than drawing conclusions.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center text-xs">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
        >
          ← Return to Dashboard
        </button>
        <button
          onClick={() => setCurrentView('next_actions')}
          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
        >
          <span>View Next Priority Actions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
