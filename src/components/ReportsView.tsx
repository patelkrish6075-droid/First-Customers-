import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { BusinessProfile, DiagnosticReport, TrackedExperiment, SalesFunnelData } from '../types';

interface ReportsViewProps {
  profile: BusinessProfile;
  latestReport: DiagnosticReport | null;
  experiments: TrackedExperiment[];
  funnelData: SalesFunnelData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  profile,
  latestReport,
  experiments,
  funnelData
}) => {
  const [copied, setCopied] = useState(false);

  const completedExps = experiments.filter(e => e.status === 'completed');
  const activeExps = experiments.filter(e => e.status === 'active' || e.status === 'planned');

  const generateMarkdownReport = () => {
    return `# First Customers — Founder Executive Progress Report
Product: ${profile.productName}
Date: ${new Date().toLocaleDateString()}
Stage: ${profile.stage.toUpperCase()} | Paying Customers: ${profile.payingCustomers} | Monthly Revenue: ${profile.currency} ${profile.mrr}

## 1. Product & Target Customer Summary
- Target Buyer: ${profile.targetBuyer}
- Specific Problem: ${profile.specificProblem}
- Current Workarounds: ${profile.currentWorkarounds || 'Manual Spreadsheets'}

## 2. Core Growth Constraint & Diagnosis
- Bottleneck: ${latestReport?.leadingBottleneckCategory.replace(/_/g, ' ') || 'Demand Validation'}
- Leading Hypothesis: ${latestReport?.leadingHypothesis || 'Direct buyer willingness to pay requires confirmation.'}
- Primary Unanswered Question: ${latestReport?.primaryUnansweredQuestion || 'What is the most critical constraint?'}

## 3. Customer Acquisition Funnel
- Prospects Contacted: ${funnelData.prospectsContacted}
- Replies Received: ${funnelData.repliesReceived} (Reply Rate: ${funnelData.prospectsContacted > 0 ? ((funnelData.repliesReceived / funnelData.prospectsContacted) * 100).toFixed(1) : 0}%)
- Meetings Booked: ${funnelData.meetingsBooked}
- Customers Acquired: ${funnelData.customersAcquired}

## 4. Completed Experiments & Lessons Learned (${completedExps.length})
${completedExps.map(e => `### ${e.name}
- Hypothesis: ${e.hypothesis}
- Outcome: ${e.evaluation?.outcomeSummary || 'Completed'}
- Conclusion: ${e.evaluation?.updatedConclusion || 'None logged'}`).join('\n\n')}

## 5. Next Recommended Action
- Immediate Focus: ${latestReport?.primaryExperiment.title || 'Execute 25 direct prospect touches'}
- Success Threshold: ${latestReport?.primaryExperiment.supportingEvidenceOutcome || 'At least 5 replies gathered'}
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.productName.toLowerCase().replace(/\s+/g, '-')}-progress-report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header & Export Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Shareable Founder Progress Report
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Executive summary of your verified evidence, current bottleneck, experiment velocity, and prioritized next steps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-stone-200 pb-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              First Customers Executive Briefing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {profile.productName}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Generated on {new Date().toLocaleDateString()} · Business Stage: {profile.stage.toUpperCase()}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-stone-900 block">
              {profile.payingCustomers === 'unknown' ? '0' : profile.payingCustomers} Paying Customers
            </span>
            <span className="text-stone-500">
              {profile.currency} {profile.mrr || 0}/month MRR
            </span>
          </div>
        </div>

        {/* Section 1: Business Profile */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1">
            1. Problem & Customer Focus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-500 block mb-0.5">Target Buyer:</span>
              <p className="font-semibold text-stone-900">{profile.targetBuyer}</p>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">Current Workaround:</span>
              <p className="font-semibold text-stone-900">{profile.currentWorkarounds || 'Manual Spreadsheets'}</p>
            </div>
          </div>
          <div className="text-xs">
            <span className="text-stone-500 block mb-0.5">Specific Problem Solved:</span>
            <p className="text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
              {profile.specificProblem}
            </p>
          </div>
        </div>

        {/* Section 2: Current Diagnostic Assessment */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1">
            2. Strategic Diagnosis & Primary Bottleneck
          </h3>
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 uppercase tracking-wide">
                Primary Bottleneck: {latestReport?.leadingBottleneckCategory.replace(/_/g, ' ') || 'Demand Validation'}
              </span>
            </div>
            <p className="text-indigo-900 font-medium">
              {latestReport?.leadingHypothesis || 'Direct buyer willingness to pay requires confirmation before additional development.'}
            </p>
          </div>
        </div>

        {/* Section 3: Funnel Metrics Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1">
            3. Customer Acquisition Funnel Baseline
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <span className="text-stone-500 block text-[10px] uppercase">Touches</span>
              <span className="text-xl font-bold font-mono text-stone-900">{funnelData.prospectsContacted}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <span className="text-stone-500 block text-[10px] uppercase">Replies</span>
              <span className="text-xl font-bold font-mono text-stone-900">{funnelData.repliesReceived}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <span className="text-stone-500 block text-[10px] uppercase">Meetings</span>
              <span className="text-xl font-bold font-mono text-stone-900">{funnelData.meetingsBooked}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-emerald-800 block text-[10px] uppercase">Acquired</span>
              <span className="text-xl font-bold font-mono text-emerald-950">{funnelData.customersAcquired}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Completed Experiments & Learnings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1">
            4. Experiment History & Lessons Learned ({completedExps.length} Completed)
          </h3>
          {completedExps.length === 0 ? (
            <p className="text-xs text-stone-500 italic">No completed experiments logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {completedExps.map((exp, idx) => (
                <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{exp.name}</span>
                    <span className="text-[10px] text-stone-500">{exp.reviewDate}</span>
                  </div>
                  <p className="text-stone-600 leading-snug">{exp.evaluation?.outcomeSummary}</p>
                  {exp.evaluation?.updatedConclusion && (
                    <p className="text-[11px] text-indigo-900 font-medium">
                      Conclusion: {exp.evaluation.updatedConclusion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Next Action Priority */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1">
            5. Recommended Next Action
          </h3>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-900 block">
              {latestReport?.primaryExperiment.title || 'Execute 25 direct prospect touches'}
            </span>
            <p className="text-stone-600 leading-relaxed">
              Target Success Threshold: {latestReport?.primaryExperiment.supportingEvidenceOutcome || 'At least 5 replies gathered'}
            </p>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-400 flex items-center justify-between">
          <span>First Customers Evidence Engine · No fabricated metrics</span>
          <span>Verified Workspace Snapshot</span>
        </div>
      </div>
    </div>
  );
};
