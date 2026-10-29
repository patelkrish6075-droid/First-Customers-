import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw,
  Zap,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { SalesFunnelData, SalesDiagnosisReport } from '../types';
import { evaluateSalesFunnel } from '../lib/salesDiagnosisEngine';

interface SalesDiagnosisViewProps {
  initialData: SalesFunnelData;
  onSaveFunnelData: (data: SalesFunnelData) => void;
  onNavigateToExperiments?: () => void;
}

export const SalesDiagnosisView: React.FC<SalesDiagnosisViewProps> = ({
  initialData,
  onSaveFunnelData,
  onNavigateToExperiments
}) => {
  const [funnelData, setFunnelData] = useState<SalesFunnelData>(initialData);
  const [report, setReport] = useState<SalesDiagnosisReport>(() => evaluateSalesFunnel(initialData));
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = evaluateSalesFunnel(funnelData);
    setReport(updated);
    onSaveFunnelData(funnelData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Sales & Conversion Diagnosis
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Enter your real customer acquisition numbers. We calculate conversion step rates with explicit denominators to isolate where sales friction occurs.
          </p>
        </div>

        {isSavedFeedback && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Funnel Data Saved
          </span>
        )}
      </div>

      {/* Main Grid: Inputs on Left, Diagnostic Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
            Recent Acquisition Numbers
          </h2>

          <form onSubmit={handleCalculate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Prospects Contacted (Touches)
              </label>
              <input
                type="number"
                min="0"
                value={funnelData.prospectsContacted}
                onChange={e => setFunnelData({ ...funnelData, prospectsContacted: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                required
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Total targeted outbound messages, emails, or direct touches.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Replies / Responses Received
              </label>
              <input
                type="number"
                min="0"
                value={funnelData.repliesReceived}
                onChange={e => setFunnelData({ ...funnelData, repliesReceived: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Meetings / Calls Booked
              </label>
              <input
                type="number"
                min="0"
                value={funnelData.meetingsBooked}
                onChange={e => setFunnelData({ ...funnelData, meetingsBooked: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Trials or Demos Started
              </label>
              <input
                type="number"
                min="0"
                value={funnelData.trialsOrDemosStarted}
                onChange={e => setFunnelData({ ...funnelData, trialsOrDemosStarted: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Proposals / Pricing Quotes Sent
              </label>
              <input
                type="number"
                min="0"
                value={funnelData.proposalsSent}
                onChange={e => setFunnelData({ ...funnelData, proposalsSent: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Customers Acquired
                </label>
                <input
                  type="number"
                  min="0"
                  value={funnelData.customersAcquired}
                  onChange={e => setFunnelData({ ...funnelData, customersAcquired: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Revenue Collected ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={funnelData.revenueGenerated}
                  onChange={e => setFunnelData({ ...funnelData, revenueGenerated: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg border-stone-300 font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Calculate & Diagnose Funnel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Diagnostic Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sample Size Warning Banner */}
          {!report.sampleSizeAdequate && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm mb-0.5">Sample Size Caution</span>
                <p className="leading-relaxed">{report.sampleSizeWarning}</p>
              </div>
            </div>
          )}

          {/* Core Bottleneck Diagnosis Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Automated Conversion Analysis
              </span>
              <h2 className="text-lg font-bold text-stone-900 mt-0.5">
                {report.diagnosisTitle}
              </h2>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              {report.frictionAnalysis}
            </p>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Recommended Immediate Fix:</span>
                <p className="leading-relaxed">{report.recommendedImmediateAction}</p>
              </div>
            </div>
          </div>

          {/* Conversion Rates Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-semibold block uppercase">Reply Rate</span>
              <span className="text-xl font-bold font-mono text-stone-900">{report.metrics.replyRatePct}%</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Goal: 8–15%</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-semibold block uppercase">Call Book Rate</span>
              <span className="text-xl font-bold font-mono text-stone-900">{report.metrics.meetingBookingRatePct}%</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Goal: 30–50%</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-semibold block uppercase">Demo Start Rate</span>
              <span className="text-xl font-bold font-mono text-stone-900">{report.metrics.demoStartRatePct}%</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Goal: 50–70%</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-semibold block uppercase">Proposal Close</span>
              <span className="text-xl font-bold font-mono text-stone-900">{report.metrics.proposalCloseRatePct}%</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Goal: 25–40%</span>
            </div>
          </div>

          {/* Transparent Mathematical Formula Breakdown */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Transparent Mathematical Breakdown
            </h3>
            <div className="space-y-2">
              {report.transparentCalculations.map((calc, idx) => (
                <div key={idx} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 font-mono text-[11px] text-stone-800">
                  {calc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
