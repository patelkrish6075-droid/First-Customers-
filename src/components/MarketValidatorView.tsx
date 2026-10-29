import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  FlaskConical, 
  ShieldCheck, 
  RotateCcw,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { BusinessProfile, MarketValidationReport, TrackedExperiment } from '../types';
import { runMarketValidation } from '../lib/marketValidatorEngine';

interface MarketValidatorViewProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onSaveExperimentFromValidation: (experimentPlan: MarketValidationReport['recommendedValidationExperiment']) => void;
  onGoToExperiments: () => void;
}

export const MarketValidatorView: React.FC<MarketValidatorViewProps> = ({
  profile,
  onSaveProfile,
  onSaveExperimentFromValidation,
  onGoToExperiments
}) => {
  const [report, setReport] = useState<MarketValidationReport>(() => runMarketValidation(profile));
  const [isSavedExperiment, setIsSavedExperiment] = useState(false);
  const [isEditingInputs, setIsEditingInputs] = useState(false);

  // Edit form state
  const [tempProfile, setTempProfile] = useState<BusinessProfile>(profile);

  const handleRunValidation = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(tempProfile);
    const updated = runMarketValidation(tempProfile);
    setReport(updated);
    setIsEditingInputs(false);
  };

  const handleSaveExperiment = () => {
    onSaveExperimentFromValidation(report.recommendedValidationExperiment);
    setIsSavedExperiment(true);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Product & Market Demand Validator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Structured first-principles audit separating verified customer facts from founder beliefs, untested hypotheses, and critical unknowns.
          </p>
        </div>

        <button
          onClick={() => setIsEditingInputs(!isEditingInputs)}
          className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          {isEditingInputs ? 'Cancel Edit' : 'Adjust Business Inputs'}
        </button>
      </div>

      {/* Editing Form Drawer */}
      {isEditingInputs && (
        <form onSubmit={handleRunValidation} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Update Validation Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Product Name</label>
              <input
                type="text"
                value={tempProfile.productName}
                onChange={e => setTempProfile({ ...tempProfile, productName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Target Buyer Persona</label>
              <input
                type="text"
                value={tempProfile.targetBuyer}
                onChange={e => setTempProfile({ ...tempProfile, targetBuyer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Specific Problem Solved</label>
            <textarea
              value={tempProfile.specificProblem}
              onChange={e => setTempProfile({ ...tempProfile, specificProblem: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Current Workarounds / Existing Alternatives</label>
            <input
              type="text"
              value={tempProfile.currentWorkarounds}
              onChange={e => setTempProfile({ ...tempProfile, currentWorkarounds: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
            />
          </div>

          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setIsEditingInputs(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              Re-evaluate Market Validation
            </button>
          </div>
        </form>
      )}

      {/* 4 Pillars Evidence Matrix */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              The 4-Category Demand Evidence Breakdown
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            Never declare a market validated without verified buyer actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Verified Facts */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
                1. Verified Facts (Commercial Actions)
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <ul className="space-y-1.5 text-emerald-900">
              {report.demandEvidence.verifiedFacts.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* User-Provided Statements */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                2. Founder-Provided Statements
              </span>
              <Info className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <ul className="space-y-1.5 text-stone-700">
              {report.demandEvidence.userProvidedStatements.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inferred Hypotheses */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px]">
                3. Inferred Hypotheses (Requiring Proof)
              </span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <ul className="space-y-1.5 text-indigo-900">
              {report.demandEvidence.inferredHypotheses.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Unknowns */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                4. Critical Unknowns (Biggest Blindspots)
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <ul className="space-y-1.5 text-amber-900">
              {report.demandEvidence.criticalUnknowns.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Target Buyer & Competitor Alternatives Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Segments */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Target Customer Segments & Buying Propensity
          </h3>
          <div className="space-y-3">
            {report.targetCustomerSegments.map((seg, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900">{seg.segmentName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    seg.purchaseLikelihood === 'high'
                      ? 'bg-emerald-100 text-emerald-800'
                      : seg.purchaseLikelihood === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {seg.purchaseLikelihood} Propensity
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 block mb-1">Role: {seg.buyerRole}</span>
                <p className="text-stone-600 leading-snug">{seg.rationale}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Alternatives */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Existing Alternatives & Switching Friction
          </h3>
          <div className="space-y-3">
            {report.competitorsAndAlternatives.map((alt, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900">{alt.name}</span>
                  <span className="text-[10px] text-stone-500 font-mono">{alt.pricingSummary.split(',')[0]}</span>
                </div>
                <p className="text-stone-600 text-[11px] mb-1 leading-snug">
                  Cost: <span className="text-stone-800 font-medium">{alt.pricingSummary}</span>
                </p>
                <p className="text-rose-700 text-[11px] leading-snug">
                  Deficiency: {alt.keyDeficiency}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Validation Experiment */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
              Recommended Validation Experiment
            </span>
            <h2 className="text-lg font-bold text-indigo-950 mt-0.5">
              {report.recommendedValidationExperiment.title}
            </h2>
            <p className="text-xs text-indigo-900/80 mt-1">
              Timeframe: {report.recommendedValidationExperiment.timeFrame} · Budget: ${report.recommendedValidationExperiment.requiredResources.moneyBudget}
            </p>
          </div>

          {isSavedExperiment ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved to Workspace
              </span>
              <button
                onClick={onGoToExperiments}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer"
              >
                Go to Tracker →
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveExperiment}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer shadow-2xs flex items-center space-x-1.5"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Save & Track This Experiment</span>
            </button>
          )}
        </div>

        <div className="text-xs space-y-3">
          <div>
            <span className="font-bold text-indigo-950 block mb-1">Core Hypothesis Being Tested:</span>
            <p className="text-indigo-900 bg-white/80 p-3 rounded-lg border border-indigo-100 leading-relaxed">
              {report.recommendedValidationExperiment.hypothesis}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100">
              <span className="font-bold text-emerald-800 block mb-1">Supporting Outcome:</span>
              <p className="text-stone-700">{report.recommendedValidationExperiment.supportingEvidenceOutcome}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100">
              <span className="font-bold text-rose-800 block mb-1">Contradictory Outcome:</span>
              <p className="text-stone-700">{report.recommendedValidationExperiment.contradictoryEvidenceOutcome}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100">
              <span className="font-bold text-amber-800 block mb-1">Inconclusive Outcome:</span>
              <p className="text-stone-700">{report.recommendedValidationExperiment.inconclusiveCriteria}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
