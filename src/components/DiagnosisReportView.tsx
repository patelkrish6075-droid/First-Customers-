import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  FlaskConical, 
  Clock, 
  DollarSign, 
  Wrench, 
  Target, 
  Share2, 
  Printer, 
  ArrowLeft, 
  BookmarkPlus, 
  Info,
  ShieldCheck,
  Check,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  FileQuestion,
  Zap,
  Sparkles
} from 'lucide-react';
import { DiagnosticReport, TrackedExperiment } from '../types';

interface DiagnosisReportViewProps {
  report: DiagnosticReport;
  onSaveExperiment: (report: DiagnosticReport) => void;
  isExperimentSaved: boolean;
  onBackToDashboard: () => void;
  onGoToExperiments: () => void;
}

export const DiagnosisReportView: React.FC<DiagnosisReportViewProps> = ({
  report,
  onSaveExperiment,
  isExperimentSaved,
  onBackToDashboard,
  onGoToExperiments
}) => {
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: DiagnosticReport['provisionalStatus']) => {
    switch (status) {
      case 'provisional_diagnosis':
        return { label: 'Provisional Diagnosis', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'additional_evidence_needed':
        return { label: 'Additional Evidence Needed', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'experiment_ready':
        return { label: 'Experiment Ready', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'results_awaiting_review':
        return { label: 'Results Awaiting Review', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      default:
        return { label: 'Evaluated', color: 'bg-stone-100 text-stone-900 border-stone-300' };
    }
  };

  const statusConfig = getStatusBadge(report.provisionalStatus);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `Founder Compass Diagnostic Report\n\nBottleneck: ${report.leadingBottleneckCategory.replace(/_/g, ' ')}\nHypothesis: ${report.leadingHypothesis}\nRecommended Experiment: ${report.primaryExperiment.title}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 mr-1 text-stone-500" />}
            <span>{copied ? 'Copied' : 'Share Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-stone-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-5">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className="text-xs text-stone-600 font-mono">
              ID: {report.id.slice(0, 16)}
            </span>
          </div>

          <div className="text-xs text-stone-600 flex items-center space-x-2">
            <span className="font-semibold text-stone-800">Engine:</span>
            <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-mono text-[11px]">
              {report.modelUsed || report.provider}
            </span>
          </div>
        </div>

        {report.disclaimer && (
          <div className="mt-4 p-3 bg-amber-50/90 border border-amber-200 rounded-lg text-xs font-medium text-amber-900 flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{report.disclaimer}</span>
          </div>
        )}

        <div className="mt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Primary Bottleneck Investigation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 capitalize tracking-tight">
            {report.leadingBottleneckCategory.replace(/_/g, ' ')}
          </h1>
          <p className="mt-3 text-base text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/90 font-medium">
            "{report.leadingHypothesis}"
          </p>
        </div>

        {/* Priority Rationale */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
          <div className="flex items-center space-x-1.5 font-bold mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why Investigate This Issue First? (Priority Rationale)</span>
          </div>
          <p>{report.priorityRationale}</p>
        </div>
      </div>

      {/* Core Diagnostic Reasoning & Strategic Uncertainty (5 Pillars) */}
      <div className="bg-white border-2 border-indigo-100/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Core Diagnostic Reasoning & Strategic Uncertainty</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/90">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Single Most Important Unanswered Question
            </span>
            <p className="text-sm font-bold text-stone-900 leading-snug">
              {report.primaryUnansweredQuestion || report.criticalUnknowns[0] || 'What is the primary constraint limiting repeatable conversion?'}
            </p>
          </div>

          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/90">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Why That Uncertainty Matters Right Now
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {report.whyUncertaintyMatters || report.priorityRationale}
            </p>
          </div>
        </div>

        {report.smallestPracticalExperimentSummary && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start space-x-2.5">
            <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900 block mb-0.5">Smallest Practical Experiment Justification:</span>
              <p className="text-indigo-900 leading-relaxed">{report.smallestPracticalExperimentSummary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Facts vs Interpretations vs Missing Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facts Provided by Founder */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Verifiable Observed Facts
            </h3>
          </div>
          <p className="text-[11px] text-stone-600 mb-3">
            Objective baseline inputs provided by the founder (distinguished from subjective interpretations).
          </p>
          <ul className="space-y-2 text-xs text-stone-700">
            {report.observedFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span className="leading-snug">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Founder Interpretations */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 mb-3">
            <FileQuestion className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Founder Interpretations
            </h3>
          </div>
          <p className="text-[11px] text-stone-600 mb-3">
            Subjective working beliefs and prospect sentiments that require behavioral verification.
          </p>
          <ul className="space-y-2 text-xs text-stone-700">
            {report.founderInterpretations.length > 0 ? (
              report.founderInterpretations.map((interp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{interp}</span>
                </li>
              ))
            ) : (
              <li className="text-stone-600 italic">No subjective interpretations recorded.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Missing or Unreliable Data */}
      {report.missingOrUnreliableData.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5">
          <div className="flex items-center space-x-2 mb-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Missing Denominators & Unmeasured Data Points</span>
          </div>
          <p className="text-xs text-rose-800 mb-3">
            The following essential baseline data points are currently uninstrumented or unknown:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900">
            {report.missingOrUnreliableData.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2 bg-white/70 p-2.5 rounded border border-rose-200/60">
                <span className="text-rose-500 font-bold">!</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflicting Evidence & Signal Divergences */}
      {report.conflictingSignals && report.conflictingSignals.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5">
          <div className="flex items-center space-x-2 mb-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Conflicting Evidence & Signal Divergences</span>
          </div>
          <p className="text-xs text-amber-900 mb-3">
            The engine identified the following conflicting observations between founder beliefs and recorded customer behavior:
          </p>
          <div className="space-y-2 text-xs text-amber-950">
            {report.conflictingSignals.map((sig, idx) => (
              <div key={idx} className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <span className="text-amber-600 font-bold">⚡</span>
                <span className="leading-snug">{sig}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Arguments: Evidence, Competing Explanations, Critical Unknowns */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
          Diagnostic Evaluation & Evidence Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Supporting evidence */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-900 block flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Evidence Supporting Hypothesis
            </span>
            <ul className="space-y-2 text-xs text-stone-700">
              {report.supportingEvidence.map((ev, idx) => (
                <li key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70 leading-snug">
                  {ev}
                </li>
              ))}
            </ul>
          </div>

          {/* Competing Explanations */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-900 block flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              Competing Explanations
            </span>
            <ul className="space-y-2 text-xs text-stone-700">
              {report.competingExplanations.map((exp, idx) => (
                <li key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70 leading-snug">
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Unknowns */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-900 block flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" />
              Critical Unknowns to Resolve
            </span>
            <ul className="space-y-2 text-xs text-stone-700">
              {report.criticalUnknowns.map((un, idx) => (
                <li key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70 leading-snug">
                  {un}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* THE PRIMARY RECOMMENDED EXPERIMENT */}
      <div className="bg-gradient-to-b from-white to-stone-50/50 border-2 border-indigo-500/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Single Primary Experiment
              </span>
              <h2 className="text-xl font-extrabold text-stone-900">
                {report.primaryExperiment.title}
              </h2>
            </div>
          </div>

          <div>
            {isExperimentSaved ? (
              <button
                onClick={onGoToExperiments}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                <span>Saved in Experiment Tracker</span>
              </button>
            ) : (
              <button
                onClick={() => onSaveExperiment(report)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4 mr-1.5" />
                <span>Save to Experiment Tracker</span>
              </button>
            )}
          </div>
        </div>

        {/* Experiment Hypothesis & Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Hypothesis Under Test
            </span>
            <p className="text-xs text-stone-800 leading-snug font-medium">
              {report.primaryExperiment.hypothesis}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1 flex items-center">
              <Target className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Target Audience / Subject
            </span>
            <p className="text-xs text-stone-800 leading-snug font-medium">
              {report.primaryExperiment.targetAudience}
            </p>
          </div>
        </div>

        {/* Resources & Time Frame */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col justify-between">
            <span className="text-[10px] text-stone-600 block uppercase font-bold">Effort</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-bold text-stone-900">~{report.primaryExperiment.requiredResources.timeHours} Hours</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col justify-between">
            <span className="text-[10px] text-stone-600 block uppercase font-bold">Execution Window</span>
            <span className="text-xs font-bold text-stone-900 mt-1">{report.primaryExperiment.timeFrame || '10 business days'}</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col justify-between">
            <span className="text-[10px] text-stone-600 block uppercase font-bold">Budget Required</span>
            <div className="flex items-center space-x-1 mt-1">
              <DollarSign className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-bold text-stone-900">
                {report.primaryExperiment.requiredResources.moneyBudget > 0 ? `$${report.primaryExperiment.requiredResources.moneyBudget}` : '$0 spend'}
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col justify-between">
            <span className="text-[10px] text-stone-600 block uppercase font-bold">Tools / Skills</span>
            <div className="flex items-center space-x-1 mt-1">
              <Wrench className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="text-xs font-bold text-stone-900 truncate">
                {report.primaryExperiment.requiredResources.toolsOrSkills}
              </span>
            </div>
          </div>
        </div>

        {/* Step by Step Procedure */}
        <div>
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
            Execution Procedure (Numbered Protocol)
          </span>
          <div className="space-y-2">
            {report.primaryExperiment.procedure.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-stone-800 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Measurement Plan & Metrics */}
        <div>
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
            Measurement Plan: Metrics to Record
          </span>
          <div className="flex flex-wrap gap-2">
            {report.primaryExperiment.metricsToRecord.map((metric, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-stone-300 rounded-md text-xs font-mono text-stone-800">
                {metric}
              </span>
            ))}
          </div>
        </div>

        {/* Decision Criteria: Supporting vs Contradictory vs Inconclusive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Supporting */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-emerald-900 block">Supporting Evidence Outcome</span>
            <p className="text-emerald-800 leading-snug">{report.primaryExperiment.supportingEvidenceOutcome}</p>
            <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-950 font-medium">
              <strong>Next Action:</strong> {report.primaryExperiment.nextActionSupporting}
            </div>
          </div>

          {/* Contradictory */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-rose-900 block">Contradictory Evidence Outcome</span>
            <p className="text-rose-800 leading-snug">{report.primaryExperiment.contradictoryEvidenceOutcome}</p>
            <div className="pt-2 border-t border-rose-200 text-[11px] text-rose-950 font-medium">
              <strong>Next Action:</strong> {report.primaryExperiment.nextActionContradictory}
            </div>
          </div>

          {/* Inconclusive */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-amber-900 block">Inconclusive Outcome Criteria</span>
            <p className="text-amber-800 leading-snug">{report.primaryExperiment.inconclusiveCriteria}</p>
            <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-950 font-medium">
              <strong>Next Action:</strong> {report.primaryExperiment.nextActionInconclusive}
            </div>
          </div>
        </div>
      </div>

      {/* Limitations & Grounded Sources */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
        <div className="flex items-center space-x-2 text-stone-700 font-bold uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-stone-500" />
          <span>Diagnostic Limitations & Research Sources</span>
        </div>
        <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
          {report.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>

        {report.sources && report.sources.length > 0 && (
          <div className="pt-3 border-t border-stone-100 space-y-1">
            <span className="font-semibold text-stone-800 block">Methodology & Source Citations:</span>
            {report.sources.map((src, idx) => (
              <div key={idx} className="text-stone-700">
                <strong>{src.title}</strong> — {src.note}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
