import React, { useState } from 'react';
import { 
  Target, 
  ArrowRight, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Copy, 
  Check, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { BusinessProfile, AcquisitionChannelPlan, ExperimentPlan } from '../types';
import { generateAcquisitionPlans } from '../lib/acquisitionEngine';

interface AcquisitionEngineViewProps {
  profile: BusinessProfile;
  onSaveExperiment: (plan: ExperimentPlan) => void;
  onNavigateToExperiments: () => void;
}

export const AcquisitionEngineView: React.FC<AcquisitionEngineViewProps> = ({
  profile,
  onSaveExperiment,
  onNavigateToExperiments
}) => {
  const [plans] = useState<AcquisitionChannelPlan[]>(() => generateAcquisitionPlans(profile));
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [copiedTemplateName, setCopiedTemplateName] = useState<string | null>(null);
  const [savedChannelIds, setSavedChannelIds] = useState<Set<string>>(new Set());

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleCopyText = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateName(name);
    setTimeout(() => setCopiedTemplateName(null), 2000);
  };

  const handleCreateExperiment = (plan: AcquisitionChannelPlan) => {
    const expPlan: ExperimentPlan = {
      id: `exp-${plan.id}-${Date.now()}`,
      title: `${plan.title} (Acquisition Sprint)`,
      hypothesis: `Testing ${plan.title} with 25 targeted touches will generate at least 3 qualified customer conversations.`,
      targetAudience: plan.targetAudience,
      timeFrame: '7 to 14 business days',
      procedure: plan.exactFirstSteps,
      requiredResources: {
        timeHours: plan.timeRequirementHoursPerWeek * 2,
        moneyBudget: plan.estimatedCostMonthly,
        toolsOrSkills: 'Direct 1-on-1 outreach'
      },
      metricsToRecord: ['Touches conducted', 'Replies received', 'Meetings booked'],
      supportingEvidenceOutcome: plan.measurableSuccessCriteria,
      contradictoryEvidenceOutcome: `0 replies or rejection of the workflow pain across ${plan.exactFirstSteps.length * 10} touches.`,
      inconclusiveCriteria: 'Fewer than 15 touches completed; sample size too small.',
      nextActionSupporting: 'Standardize this channel and double weekly outreach volume.',
      nextActionContradictory: plan.iterationPlan,
      nextActionInconclusive: 'Complete the remaining touches before evaluating.'
    };

    onSaveExperiment(expPlan);
    setSavedChannelIds(new Set([...savedChannelIds, plan.id]));
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Customer Acquisition Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Channel blueprints tailored specifically to your stage, weekly time availability ({profile.availableHoursPerWeek} hrs/wk), and budget (${profile.availableMonthlyBudget}/mo).
          </p>
        </div>

        <button
          onClick={onNavigateToExperiments}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer self-start sm:self-auto"
        >
          View Active Experiments →
        </button>
      </div>

      {/* Channel Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {plans.map(plan => {
          const isSelected = plan.id === selectedPlanId;
          const isSaved = savedChannelIds.has(plan.id);
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{plan.title.split(' ')[0]} {plan.title.split(' ')[1]}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-600'
              }`}>
                {plan.suitabilityScore}% Fit
              </span>
              {isSaved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Selected Channel Blueprint Card */}
      {activePlan && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Top Title & CTA Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-stone-900">{activePlan.title}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activePlan.suitabilityScore}/100 Suitability Score
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                {activePlan.suitabilityReason}
              </p>
            </div>

            {savedChannelIds.has(activePlan.id) ? (
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved to Tracker
                </span>
                <button
                  onClick={onNavigateToExperiments}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                >
                  View Experiment →
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleCreateExperiment(activePlan)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center space-x-1.5 shrink-0"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Turn into Tracked Experiment</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                Target Audience
              </span>
              <span className="font-semibold text-stone-900 block truncate">{activePlan.targetAudience}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                Weekly Time Needed
              </span>
              <span className="font-semibold text-stone-900 block">{activePlan.timeRequirementHoursPerWeek} hrs/week</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                Estimated Monthly Cost
              </span>
              <span className="font-semibold text-stone-900 block">
                {activePlan.estimatedCostMonthly > 0 ? `$${activePlan.estimatedCostMonthly}/mo` : '$0 (Founder Sweat Equity)'}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                Target Success Benchmark
              </span>
              <span className="font-bold text-emerald-950 block truncate">20% reply / 2 calls</span>
            </div>
          </div>

          {/* Step-by-Step Execution Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Step-by-Step Execution Blueprint
            </h3>
            <div className="space-y-2">
              {activePlan.exactFirstSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-stone-800 font-medium leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Concrete Copy Templates */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Ready-to-Use Outreach Templates
            </h3>
            <div className="space-y-4">
              {activePlan.sampleOutreachTemplates.map((template, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{template.templateName}</span>
                    <button
                      onClick={() => handleCopyText(template.messageBody, template.templateName)}
                      className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition"
                    >
                      {copiedTemplateName === template.templateName ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  {template.subjectLine && (
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200 font-mono text-[11px] text-stone-800">
                      <strong className="text-stone-500">Subject:</strong> {template.subjectLine}
                    </div>
                  )}

                  <pre className="bg-white p-3 rounded-lg border border-stone-200 font-sans text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {template.messageBody}
                  </pre>

                  {template.tacticalNote && (
                    <p className="text-[11px] text-amber-800 font-medium bg-amber-50/80 p-2 rounded border border-amber-200">
                      Rule of thumb: {template.tacticalNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risks and Iteration Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
              <span className="font-bold text-rose-950 uppercase tracking-wider text-[10px] block">
                Failure Modes & Traps to Avoid
              </span>
              <ul className="space-y-1 text-rose-900">
                {activePlan.risksAndFailureModes.map((risk, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
                Iteration & Contingency Plan
              </span>
              <p className="text-stone-700 leading-relaxed">
                {activePlan.iterationPlan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
