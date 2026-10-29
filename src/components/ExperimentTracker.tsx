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
  AlertCircle
} from 'lucide-react';
import { TrackedExperiment, ExperimentStatus } from '../types';
import { ResultsReviewModal } from './ResultsReviewModal';

interface ExperimentTrackerProps {
  experiments: TrackedExperiment[];
  onUpdateStatus: (id: string, status: ExperimentStatus) => void;
  onRecordResults: (
    id: string,
    observedResults: NonNullable<TrackedExperiment['observedResults']>,
    evaluation: NonNullable<TrackedExperiment['evaluation']>
  ) => void;
  onNavigateToIntake: () => void;
}

export const ExperimentTracker: React.FC<ExperimentTrackerProps> = ({
  experiments,
  onUpdateStatus,
  onRecordResults,
  onNavigateToIntake
}) => {
  const [activeTab, setActiveTab] = useState<ExperimentStatus | 'all'>('all');
  const [selectedExperimentForReview, setSelectedExperimentForReview] = useState<TrackedExperiment | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredExperiments = activeTab === 'all' 
    ? experiments 
    : experiments.filter(e => e.status === activeTab);

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
    <div className="max-w-5xl mx-auto pb-24 px-1 sm:px-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Experiment Tracker</h1>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Execute bounded, evidence-linked tests, log observed customer feedback, and update your strategy.
          </p>
        </div>

        <button
          onClick={onNavigateToIntake}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>New Diagnosis / Experiment</span>
        </button>
      </div>

      {/* Tabs */}
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

      {/* Experiments List */}
      {filteredExperiments.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">No {activeTab === 'all' ? '' : activeTab} experiments found</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 mb-5">
            Run a business diagnosis to identify your primary bottleneck and add its recommended experiment to this tracker.
          </p>
          <button
            onClick={onNavigateToIntake}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer shadow-xs"
          >
            Diagnose My Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiments.map(exp => {
            const badge = getStatusBadge(exp.status);
            const isExpanded = expandedId === exp.id;

            return (
              <div 
                key={exp.id}
                className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-stone-600 font-semibold uppercase tracking-wider">
                        {exp.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-stone-900 leading-snug">{exp.name}</h2>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {exp.status === 'planned' && (
                      <button
                        onClick={() => onUpdateStatus(exp.id, 'active')}
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        <span>Start Experiment</span>
                      </button>
                    )}

                    {exp.status === 'active' && (
                      <button
                        onClick={() => setSelectedExperimentForReview(exp)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>Record Results & Review</span>
                      </button>
                    )}

                    {exp.status === 'active' && (
                      <button
                        onClick={() => onUpdateStatus(exp.id, 'inconclusive')}
                        className="px-2.5 py-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Inconclusive
                      </button>
                    )}

                    {exp.status === 'active' && (
                      <button
                        onClick={() => onUpdateStatus(exp.id, 'abandoned')}
                        className="px-2.5 py-1.5 rounded-md text-stone-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer"
                      >
                        Abandon
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:underline px-2 py-1 cursor-pointer"
                    >
                      {isExpanded ? 'Hide Details' : 'View Protocol'}
                    </button>
                  </div>
                </div>

                {/* Core Hypothesis & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2 bg-stone-50 p-3.5 rounded-lg border border-stone-200/80">
                    <span className="font-bold text-stone-700 block mb-0.5">Hypothesis:</span>
                    <p className="text-stone-900 font-medium leading-relaxed">{exp.hypothesis}</p>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Target:</span>
                      <strong className="text-stone-800 truncate max-w-[140px]">{exp.targetAudience}</strong>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Execution Window:</span>
                      <strong className="text-stone-800">{exp.timeFrame || '10 business days'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Review Date:</span>
                      <strong className="text-stone-800">{exp.reviewDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Expanded Details / Protocol */}
                {isExpanded && (
                  <div className="pt-4 border-t border-stone-100 space-y-4 text-xs animate-in fade-in duration-100">
                    <div>
                      <span className="font-bold text-stone-900 uppercase tracking-wider block mb-2">Procedure Steps:</span>
                      <ol className="list-decimal list-inside space-y-1.5 text-stone-800">
                        {exp.procedure.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <span className="font-bold text-stone-900 uppercase tracking-wider block mb-1">Metrics to Track:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.metricsToRecord.map((m, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded font-mono text-[11px] text-stone-800">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Evaluation Review */}
                {exp.evaluation && exp.observedResults && (
                  <div className="pt-4 border-t border-stone-100 bg-stone-50/80 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5 rounded-b-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                          Evidence Review & Strategic Learning
                        </h4>
                      </div>
                      {exp.evaluation.recommendationShifted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full self-start sm:self-auto">
                          Hypothesis Shifted Based on Evidence
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <span className="font-semibold text-stone-700 block mb-1">Observed Customer Behavior:</span>
                        <p className="text-stone-800 italic leading-relaxed">"{exp.observedResults.qualitativeFindings}"</p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <span className="font-semibold text-stone-700 block mb-1">Model Synthesis & Next Recommendation:</span>
                        <p className="text-stone-900 font-bold leading-relaxed">{exp.evaluation.nextRecommendedAction}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-snug">
                      <strong>Methodology Note:</strong> {exp.evaluation.interpretationSeparation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Results review modal */}
      {selectedExperimentForReview && (
        <ResultsReviewModal
          experiment={selectedExperimentForReview}
          onClose={() => setSelectedExperimentForReview(null)}
          onSubmitResults={(id, observed, evaluation) => {
            onRecordResults(id, observed, evaluation);
            setSelectedExperimentForReview(null);
          }}
        />
      )}
    </div>
  );
};
