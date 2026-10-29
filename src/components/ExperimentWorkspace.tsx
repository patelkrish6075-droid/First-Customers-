import React, { useState } from 'react';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  Play, 
  HelpCircle, 
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle,
  XCircle,
  Pause,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  Activity
} from 'lucide-react';
import { TrackedExperiment, ExperimentStatus, ExperimentPlan, BottleneckCategory } from '../types';
import { ResultsReviewModal } from './ResultsReviewModal';
import { LearningVelocitySummary } from './LearningVelocitySummary';

interface ExperimentWorkspaceProps {
  experiments: TrackedExperiment[];
  onUpdateStatus: (id: string, status: ExperimentStatus) => void;
  onRecordResults: (
    id: string,
    observedResults: NonNullable<TrackedExperiment['observedResults']>,
    evaluation: NonNullable<TrackedExperiment['evaluation']>
  ) => void;
  onCreateCustomExperiment: (experiment: TrackedExperiment) => void;
  onNavigateToIntake: () => void;
}

export const ExperimentWorkspace: React.FC<ExperimentWorkspaceProps> = ({
  experiments,
  onUpdateStatus,
  onRecordResults,
  onCreateCustomExperiment,
  onNavigateToIntake
}) => {
  const [activeTab, setActiveTab] = useState<ExperimentStatus | 'all'>('all');
  const [selectedExperimentForReview, setSelectedExperimentForReview] = useState<TrackedExperiment | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [showLearningVelocityTrend, setShowLearningVelocityTrend] = useState(true);

  // New experiment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BottleneckCategory>('demand_validation');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('');
  const [newProcedure, setNewProcedure] = useState('');
  const [newDurationDays, setNewDurationDays] = useState('10');

  const filteredExperiments = activeTab === 'all' 
    ? experiments 
    : experiments.filter(e => e.status === activeTab);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHypothesis.trim()) return;

    const today = new Date();
    const review = new Date();
    review.setDate(today.getDate() + (parseInt(newDurationDays, 10) || 10));

    const procedureSteps = newProcedure.trim() 
      ? newProcedure.split('\n').filter(s => s.trim().length > 0)
      : ['Execute outreach touchpoint', 'Record verbatim objections', 'Measure conversion response'];

    const newExp: TrackedExperiment = {
      id: `exp-custom-${Date.now()}`,
      name: newTitle.trim(),
      category: newCategory,
      hypothesis: newHypothesis.trim(),
      targetAudience: newTargetAudience.trim() || 'Target buyer persona',
      timeFrame: `${newDurationDays} business days`,
      procedure: procedureSteps,
      startDate: today.toISOString().split('T')[0],
      reviewDate: review.toISOString().split('T')[0],
      requiredResources: {
        timeHours: 6,
        moneyBudget: 0,
        toolsOrSkills: 'Direct customer outreach'
      },
      metricsToRecord: ['Touches conducted', 'Responses received', 'Qualified conversions'],
      initialAssumptions: 'Custom founder assumption entered in workspace',
      status: 'planned'
    };

    onCreateCustomExperiment(newExp);
    setIsCreatingModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewHypothesis('');
    setNewTargetAudience('');
    setNewProcedure('');
  };

  const getStatusBadge = (status: ExperimentStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'planned':
        return { label: 'Planned', bg: 'bg-stone-100 text-stone-900 border-stone-300' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'inconclusive':
        return { label: 'Inconclusive', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'abandoned':
        return { label: 'Abandoned', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { label: status, bg: 'bg-stone-100 text-stone-900 border-stone-300' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Experiment Workspace</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Create, start, evaluate, and learn from bounded tests. Every completed experiment updates your learning velocity.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowLearningVelocityTrend(!showLearningVelocityTrend)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showLearningVelocityTrend ? 'Hide Trend Chart' : 'Show Velocity Chart'}</span>
          </button>

          <button
            onClick={() => setIsCreatingModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Custom Test</span>
          </button>
        </div>
      </div>

      {/* Embedded Recharts Learning Velocity Component */}
      {showLearningVelocityTrend && (
        <LearningVelocitySummary 
          experiments={experiments}
        />
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-3">
        {(['all', 'active', 'planned', 'completed', 'inconclusive', 'abandoned'] as const).map(tab => {
          const count = tab === 'all' ? experiments.length : experiments.filter(e => e.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === tab
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab ? 'bg-indigo-400 text-stone-950' : 'bg-stone-200 text-stone-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Experiments List / Empty State */}
      {filteredExperiments.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-xs space-y-3">
          <FlaskConical className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            {activeTab === 'all' ? 'No Experiments in Workspace' : `No ${activeTab} experiments found`}
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Run a diagnosis report to auto-generate a primary diagnostic test, or create a custom experiment to begin tracking evidence.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setIsCreatingModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              Create First Experiment
            </button>
            <button
              onClick={onNavigateToIntake}
              className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition cursor-pointer"
            >
              Diagnose Product
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiments.map(exp => {
            const badge = getStatusBadge(exp.status);
            const isExpanded = expandedId === exp.id;

            return (
              <div 
                key={exp.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-stone-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-500">
                        {exp.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{exp.name}</h3>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {exp.status === 'planned' && (
                      <button
                        onClick={() => onUpdateStatus(exp.id, 'active')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start Test</span>
                      </button>
                    )}

                    {exp.status === 'active' && (
                      <>
                        <button
                          onClick={() => setSelectedExperimentForReview(exp)}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-2xs flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Log Results & Review</span>
                        </button>

                        <button
                          onClick={() => onUpdateStatus(exp.id, 'planned')}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs hover:bg-stone-50 transition cursor-pointer"
                          title="Pause experiment"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {exp.status === 'completed' && (
                      <button
                        onClick={() => setSelectedExperimentForReview(exp)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition cursor-pointer"
                      >
                        Inspect Review
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Core Hypothesis Banner */}
                <div className="text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                  <span className="font-bold text-stone-800 block mb-0.5">Hypothesis:</span>
                  <p className="text-stone-600 leading-relaxed">{exp.hypothesis}</p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-stone-100 space-y-4 text-xs animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">Target Audience</span>
                        <span className="text-stone-800 font-semibold">{exp.targetAudience}</span>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">Start & Review Dates</span>
                        <span className="text-stone-800 font-mono">{exp.startDate} → {exp.reviewDate}</span>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">Resource Budget</span>
                        <span className="text-stone-800">~{exp.requiredResources.timeHours} hrs / ${exp.requiredResources.moneyBudget}</span>
                      </div>
                    </div>

                    {/* Step-by-Step Procedure */}
                    <div>
                      <span className="font-bold text-stone-800 block mb-1.5">Execution Steps:</span>
                      <div className="space-y-1.5">
                        {exp.procedure.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start space-x-2 text-stone-700 bg-stone-50/60 p-2 rounded-lg border border-stone-100">
                            <span className="w-4 h-4 rounded bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recorded Results & Evaluation if completed */}
                    {exp.evaluation && (
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-950">Recorded Outcome Evaluation</span>
                          {exp.evaluation.recommendationShifted && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                              Shifted Strategy
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-900 font-medium">{exp.evaluation.outcomeSummary}</p>
                        <p className="text-stone-600 text-[11px] leading-relaxed">
                          <strong>Conclusion:</strong> {exp.evaluation.updatedConclusion}
                        </p>
                        <p className="text-stone-600 text-[11px] leading-relaxed">
                          <strong>Next Recommended Step:</strong> {exp.evaluation.nextRecommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedExperimentForReview && (
        <ResultsReviewModal
          experiment={selectedExperimentForReview}
          onClose={() => setSelectedExperimentForReview(null)}
          onSubmitResults={(id: string, observedResults, evaluation) => {
            onRecordResults(id, observedResults, evaluation);
            setSelectedExperimentForReview(null);
          }}
        />
      )}

      {/* Create Custom Experiment Modal */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Create New Custom Experiment
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Experiment Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. 20-Touch Direct Outreach Sprint to CFOs"
                  required
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Hypothesis Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs bg-white"
                  >
                    <option value="demand_validation">Demand Validation</option>
                    <option value="target_customer">Target Customer</option>
                    <option value="acquisition_reach">Acquisition Reach</option>
                    <option value="positioning_offer">Positioning & Offer</option>
                    <option value="sales_conversion">Sales Conversion</option>
                    <option value="activation_value">Activation & Value</option>
                    <option value="pricing_purchasing">Pricing & Purchasing</option>
                    <option value="retention_recurring_value">Retention & Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newDurationDays}
                    onChange={e => setNewDurationDays(e.target.value)}
                    min="3"
                    max="30"
                    className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Audience Persona</label>
                <input
                  type="text"
                  value={newTargetAudience}
                  onChange={e => setNewTargetAudience(e.target.value)}
                  placeholder="e.g. Agency Owners with 5-15 employees"
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hypothesis Being Tested *</label>
                <textarea
                  value={newHypothesis}
                  onChange={e => setNewHypothesis(e.target.value)}
                  placeholder="e.g. Offering a 30-day bounded pilot with free data migration will increase demo close rate from 10% to 35%."
                  rows={2}
                  required
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Execution Steps (1 per line)</label>
                <textarea
                  value={newProcedure}
                  onChange={e => setNewProcedure(e.target.value)}
                  placeholder="Step 1: Curate list of 20 named prospects&#10;Step 2: Send peer inquiry message&#10;Step 3: Track reply rate"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Save Experiment to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
