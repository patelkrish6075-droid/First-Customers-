import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  DollarSign, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';
import { BusinessProfile, TrackedExperiment, NextActionItem, SalesFunnelData, ExperimentPlan } from '../types';
import { generateNextThreeActions } from '../lib/nextActionsEngine';

interface NextActionsViewProps {
  profile: BusinessProfile;
  experiments: TrackedExperiment[];
  funnelData?: SalesFunnelData;
  onSaveExperiment: (plan: ExperimentPlan) => void;
  onNavigateToExperiments: () => void;
}

export const NextActionsView: React.FC<NextActionsViewProps> = ({
  profile,
  experiments,
  funnelData,
  onSaveExperiment,
  onNavigateToExperiments
}) => {
  const [actions] = useState<NextActionItem[]>(() => 
    generateNextThreeActions(profile, experiments, funnelData)
  );
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [savedActionIds, setSavedActionIds] = useState<Set<string>>(new Set());

  const handleCopySteps = (action: NextActionItem) => {
    const text = `Priority Action: ${action.actionTitle}\nWhy: ${action.whyPriorityNow}\nSteps:\n${action.exactExecutionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\nSuccess Metric: ${action.measurableSuccessThreshold}`;
    navigator.clipboard.writeText(text);
    setCopiedActionId(action.id);
    setTimeout(() => setCopiedActionId(null), 2000);
  };

  const handleTurnIntoExperiment = (action: NextActionItem) => {
    const expPlan: ExperimentPlan = {
      id: `exp-${action.id}-${Date.now()}`,
      title: action.actionTitle,
      hypothesis: `Executing this action will resolve: ${action.whatRemainsUncertain[0] || 'primary operational friction'}`,
      targetAudience: profile.targetBuyer,
      timeFrame: `${Math.ceil(action.timeEstimateHours / 2)} to 10 business days`,
      procedure: action.exactExecutionSteps,
      requiredResources: {
        timeHours: action.timeEstimateHours,
        moneyBudget: action.costEstimateDollars,
        toolsOrSkills: 'Founder direct execution'
      },
      metricsToRecord: ['Touches conducted', 'Responses recorded', 'Qualitative findings'],
      supportingEvidenceOutcome: action.measurableSuccessThreshold,
      contradictoryEvidenceOutcome: 'No positive response gathered; assumptions not substantiated.',
      inconclusiveCriteria: 'Fewer than 5 interactions recorded.',
      nextActionSupporting: action.whatIfItSucceeds,
      nextActionContradictory: action.whatIfItFails,
      nextActionInconclusive: 'Expand sample size before concluding.'
    };

    onSaveExperiment(expPlan);
    setSavedActionIds(new Set([...savedActionIds, action.id]));
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              “What Should I Do Next?”
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Your personalized 3-action priority plan. We eliminate task overload by sequencing only the decisions that materially reduce uncertainty right now.
          </p>
        </div>

        <button
          onClick={onNavigateToExperiments}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer self-start sm:self-auto"
        >
          View Experiment History →
        </button>
      </div>

      {/* 3 Prioritized Actions */}
      <div className="space-y-6">
        {actions.map(action => {
          const isSaved = savedActionIds.has(action.id);

          return (
            <div 
              key={action.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-stone-300 transition space-y-5"
            >
              {/* Header / Rank */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-start space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{action.priorityRank}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      Priority Action #{action.priorityRank} · {action.category.replace(/_/g, ' ')}
                    </span>
                    <h2 className="text-lg font-bold text-stone-900 mt-0.5">{action.actionTitle}</h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => handleCopySteps(action)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium flex items-center space-x-1 cursor-pointer transition"
                  >
                    {copiedActionId === action.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Checklist</span>
                      </>
                    )}
                  </button>

                  {isSaved ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tracking</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTurnIntoExperiment(action)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Track as Experiment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Why Priority Now */}
              <div className="text-xs bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1">
                <span className="font-bold text-stone-900 block">Why this is priority right now:</span>
                <p className="text-stone-700 leading-relaxed">{action.whyPriorityNow}</p>
              </div>

              {/* Supporting Evidence vs Critical Uncertainty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px] block">
                    Verified Supporting Evidence
                  </span>
                  <ul className="space-y-1 text-emerald-900">
                    {action.supportingEvidence.map((ev, eIdx) => (
                      <li key={eIdx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block">
                    What Remains Uncertain
                  </span>
                  <ul className="space-y-1 text-amber-900">
                    {action.whatRemainsUncertain.map((unc, uIdx) => (
                      <li key={uIdx} className="flex items-start space-x-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{unc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                    Exact Execution Steps:
                  </span>
                  <span className="text-stone-500 font-medium">
                    Est. {action.timeEstimateHours} hrs · ${action.costEstimateDollars} spend
                  </span>
                </div>
                <div className="space-y-1.5">
                  {action.exactExecutionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start space-x-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200/70">
                      <span className="w-4 h-4 rounded bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="text-stone-800 font-medium leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contingency Outlines */}
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-stone-100">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70">
                  <span className="font-bold text-emerald-800 block mb-0.5">If this works:</span>
                  <p className="text-stone-600">{action.whatIfItSucceeds}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70">
                  <span className="font-bold text-rose-800 block mb-0.5">If this fails:</span>
                  <p className="text-stone-600">{action.whatIfItFails}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
