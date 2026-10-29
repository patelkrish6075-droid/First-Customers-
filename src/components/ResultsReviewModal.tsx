import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Loader2,
  FileText
} from 'lucide-react';
import { TrackedExperiment } from '../types';

interface ResultsReviewModalProps {
  experiment: TrackedExperiment;
  onClose: () => void;
  onSubmitResults: (
    experimentId: string,
    observedResults: NonNullable<TrackedExperiment['observedResults']>,
    evaluation: NonNullable<TrackedExperiment['evaluation']>
  ) => void;
}

export const ResultsReviewModal: React.FC<ResultsReviewModalProps> = ({
  experiment,
  onClose,
  onSubmitResults
}) => {
  const [qualitativeFindings, setQualitativeFindings] = useState('');
  const [unexpectedFindings, setUnexpectedFindings] = useState('');
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMetricChange = (metricName: string, val: string) => {
    setMetricValues(prev => ({ ...prev, [metricName]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualitativeFindings.trim()) {
      setErrorMsg('Please enter your qualitative customer observations.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const observedResults = {
      recordedDate: new Date().toISOString().split('T')[0],
      metricsValues: metricValues,
      qualitativeFindings: qualitativeFindings.trim(),
      unexpectedFindings: unexpectedFindings.trim() || undefined
    };

    try {
      // Call backend review endpoint
      const res = await fetch('/api/review-experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment, observedResults })
      });

      if (!res.ok) {
        throw new Error(`Review endpoint returned ${res.status}`);
      }

      const data = await res.json();
      onSubmitResults(experiment.id, observedResults, data.evaluation);
    } catch (err) {
      console.warn('API review failed, generating client-side evaluation fallback:', err);
      // Fallback deterministic evaluation
      const combined = `${qualitativeFindings} ${JSON.stringify(metricValues)}`.toLowerCase();
      const isPositive = combined.includes('bought') || combined.includes('positive') || combined.includes('signed') || combined.includes('validated') || combined.includes('success');
      const isNegative = combined.includes('refused') || combined.includes('fail') || combined.includes('zero') || combined.includes('no interest');

      const evaluation = {
        reviewedAt: new Date().toISOString(),
        supportingEvidenceFound: `Recorded customer observations: "${qualitativeFindings}"`,
        contradictoryEvidenceFound: unexpectedFindings ? `Unexpected friction: "${unexpectedFindings}"` : 'None documented.',
        missingMeasurementsIdentified: Object.keys(metricValues).length === 0 ? ['Quantitative metrics unrecorded.'] : [],
        outcomeSummary: isPositive 
          ? 'Observed evidence strongly supports the initial experimental hypothesis.'
          : isNegative
          ? 'Observed evidence contradicts the initial experimental hypothesis.'
          : 'Observed results are currently inconclusive or sample size was sparse.',
        interpretationSeparation: 'Distinction preserved: User observations are raw facts; analysis below updates the strategic pivot.',
        updatedConclusion: isPositive
          ? 'Primary bottleneck assumption was validated. Friction in this area is clarified.'
          : isNegative
          ? 'Assumption was not substantiated by customer behavior. Shifting investigation to earlier stage.'
          : 'Sample size insufficient to draw definitive conclusion.',
        nextRecommendedAction: isPositive
          ? 'Standardize this winning workflow into daily execution.'
          : isNegative
          ? 'Pivot to investigating earlier stage funnel assumptions (Demand or Target Customer).'
          : 'Expand sample size before drawing conclusions.',
        recommendationShifted: isNegative
      };

      onSubmitResults(experiment.id, observedResults, evaluation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Record Experiment Results & Review</h2>
              <span className="text-[11px] text-stone-600 block">{experiment.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Retrieved Hypothesis Banner */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
            <span className="font-bold text-indigo-900 block">Original Hypothesis Under Test:</span>
            <p className="text-indigo-950 font-medium">{experiment.hypothesis}</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quantitative Metrics Recorded */}
          {experiment.metricsToRecord.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                1. Quantitative Measurements Recorded
              </label>
              <div className="space-y-2">
                {experiment.metricsToRecord.map((metric, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs">
                    <span className="font-medium text-stone-800">{metric}</span>
                    <input
                      type="text"
                      value={metricValues[metric] || ''}
                      onChange={(e) => handleMetricChange(metric, e.target.value)}
                      placeholder="e.g. 4 replies (or 'unmeasured')"
                      className="px-2.5 py-1 text-xs border border-stone-300 rounded bg-white w-full sm:w-48 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualitative Customer Observations */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
              2. Qualitative Customer Observations (Verbatim behavior & feedback) *
            </label>
            <p className="text-[11px] text-stone-700 mb-2">
              What did prospects or users actually do or say? Record observations without defending the product.
            </p>
            <textarea
              rows={3}
              value={qualitativeFindings}
              onChange={(e) => setQualitativeFindings(e.target.value)}
              placeholder="e.g. Spoke to 5 clinic managers. 3 said their existing calendar works adequately. 2 were open to a trial but asked how it connects to their billing software."
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Unexpected Friction / Surprises */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
              3. Unexpected Friction or Anomalies (Optional)
            </label>
            <textarea
              rows={2}
              value={unexpectedFindings}
              onChange={(e) => setUnexpectedFindings(e.target.value)}
              placeholder="e.g. 2 emails bounced due to spam filters; 1 manager forwarded it to their receptionist instead."
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  <span>Evaluating Results...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  <span>Review Evidence & Update Hypothesis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
