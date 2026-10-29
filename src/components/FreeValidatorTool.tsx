import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface FreeValidatorToolProps {
  onUnlockFullPlatform: (initialProfile: Partial<BusinessProfile>) => void;
}

export const FreeValidatorTool: React.FC<FreeValidatorToolProps> = ({
  onUnlockFullPlatform
}) => {
  const [productName, setProductName] = useState('');
  const [targetBuyer, setTargetBuyer] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [currentWorkaround, setCurrentWorkaround] = useState('');
  const [stage, setStage] = useState<'idea' | 'prototype' | 'launched'>('launched');
  const [hasPayingCustomers, setHasPayingCustomers] = useState<'yes' | 'no'>('no');
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !targetBuyer.trim() || !problemDescription.trim()) {
      return;
    }
    setIsEvaluated(true);
  };

  const handleReset = () => {
    setIsEvaluated(false);
  };

  const handleProceed = () => {
    onUnlockFullPlatform({
      productName,
      targetBuyer,
      specificProblem: problemDescription,
      currentWorkarounds: currentWorkaround,
      stage,
      payingCustomers: hasPayingCustomers === 'yes' ? 1 : 0
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider border border-stone-200">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Preview Utility</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Free Product-Market Friction Validator
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Get an immediate first-principles assessment of your target buyer, problem severity, and the most critical assumption requiring testing today.
        </p>
      </div>

      {!isEvaluated ? (
        /* Input Form */
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              What is your product called? *
            </label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. LeadPulse, ClinicSync, InvoiceFlow"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Who is the exact target buyer? *
            </label>
            <input
              type="text"
              value={targetBuyer}
              onChange={e => setTargetBuyer(e.target.value)}
              placeholder="e.g. Solo graphic designers, Independent clinic practice managers, B2B sales leads"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">
              Be specific: title, team size, or operational context. Avoid "everyone" or "businesses".
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              What specific daily problem does it solve? *
            </label>
            <textarea
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="e.g. Managing client invoice follow-ups manually takes 4 hours every Friday and causes missed cash collections."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              How do they solve it right now? (Current Workaround)
            </label>
            <input
              type="text"
              value={currentWorkaround}
              onChange={e => setCurrentWorkaround(e.target.value)}
              placeholder="e.g. Google Sheets, manual email chains, WhatsApp messages, paper cards"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Current Stage
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-stone-800 bg-white"
              >
                <option value="idea">Idea / Conceptual Design</option>
                <option value="prototype">Prototype / MVP Under Development</option>
                <option value="launched">Launched to Public / Working Software</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Any Paying Customers Yet?
              </label>
              <select
                value={hasPayingCustomers}
                onChange={e => setHasPayingCustomers(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-stone-800 bg-white"
              >
                <option value="no">No paying customers yet (0 accounts)</option>
                <option value="yes">Yes, at least 1 paying customer account</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Run Instant Validation Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Evaluation Results Card */
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Validation Assessment
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">{productName}</h2>
              <p className="text-xs text-stone-500">Target Buyer: {targetBuyer}</p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">Primary Inertia Risk:</span>
              <p className="text-stone-600 leading-relaxed">
                Your prospect’s primary alternative is <strong>{currentWorkaround || 'their current manual routine'}</strong>. Even if your software is 5x faster, buyers resist switching because learning a new tool carries perceived friction. You must make onboarding instantaneous.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">Critical Path Question:</span>
              <p className="text-stone-600 leading-relaxed">
                {hasPayingCustomers === 'yes'
                  ? 'Why did your existing paying customer buy? Their specific trigger is the template for the next 10 accounts.'
                  : `Will ${targetBuyer} authorize a credit card payment to eliminate this specific problem today?`}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-indigo-950">Recommended Immediate Experiment:</span>
            </div>
            <p className="text-indigo-900 leading-relaxed">
              Do not code additional secondary features. Execute 20 direct touches to named {targetBuyer} profiles presenting a bounded evaluation offer ($X/month) to confirm whether willingness-to-pay exists.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
            <span className="text-xs text-stone-500">
              Unlock acquisition channels, experiment tracking, and funnel diagnosis:
            </span>

            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>Import to Workspace & Begin Experiments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
