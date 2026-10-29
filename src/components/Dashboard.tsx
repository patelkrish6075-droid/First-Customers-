import React from 'react';
import { 
  ArrowRight, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  HelpCircle,
  FileText,
  AlertTriangle,
  Play,
  Target,
  BarChart3,
  BookOpen,
  Zap,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { BusinessProfile, DiagnosticReport, TrackedExperiment, ActiveAppView, SalesFunnelData } from '../types';
import { LearningVelocitySummary } from './LearningVelocitySummary';

interface DashboardProps {
  profile: BusinessProfile;
  latestReport: DiagnosticReport | null;
  experiments: TrackedExperiment[];
  funnelData?: SalesFunnelData;
  setCurrentView: (view: ActiveAppView) => void;
  onStartDiagnosis: () => void;
  onViewExampleReport: () => void;
  onViewReport: () => void;
  onGoToExperiments: () => void;
  onGoToTestBench: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  latestReport,
  experiments,
  funnelData,
  setCurrentView,
  onStartDiagnosis,
  onViewExampleReport,
  onViewReport,
  onGoToExperiments,
  onGoToTestBench
}) => {
  const activeExperiments = experiments.filter(e => e.status === 'active' || e.status === 'planned');
  const completedExperiments = experiments.filter(e => e.status === 'completed' || e.status === 'inconclusive' || e.status === 'abandoned');

  const totalTouches = profile.channels.reduce((sum, ch) => {
    return sum + (ch.prospectsReached !== 'unknown' ? Number(ch.prospectsReached) : 0);
  }, 0);

  const totalReplies = profile.channels.reduce((sum, ch) => {
    return sum + (ch.repliesOrConversations !== 'unknown' ? Number(ch.repliesOrConversations) : 0);
  }, 0);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Hero / Current Business Pulse */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider border border-stone-200/60">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Customer Acquisition Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {profile.productName || 'Your Startup Product'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Target Buyer: <strong className="text-stone-800">{profile.targetBuyer || 'Unspecified Target'}</strong> · 
              Stage: <span className="capitalize text-stone-800 font-semibold">{profile.stage}</span> · 
              Paying Accounts: <strong className="text-stone-900">{profile.payingCustomers === 'unknown' ? '0' : profile.payingCustomers}</strong>
            </p>

            <p className="text-xs text-stone-500 italic max-w-xl">
              Problem: "{profile.specificProblem ? profile.specificProblem.slice(0, 140) + '...' : 'Operational friction in daily workflows'}"
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => setCurrentView('next_actions')}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer space-x-1.5"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>What Should I Do Next?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onStartDiagnosis}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-xs transition cursor-pointer"
            >
              <span>Update Intake Profile</span>
            </button>
          </div>
        </div>

        {/* High-Density Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Outreach Touches</span>
            <span className="text-xl font-bold font-mono text-stone-900 mt-0.5 block">{totalTouches}</span>
            <span className="text-[10px] text-stone-400">across {profile.channels.length} channel(s)</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Replies Received</span>
            <span className="text-xl font-bold font-mono text-stone-900 mt-0.5 block">{totalReplies}</span>
            <span className="text-[10px] text-stone-400">
              {totalTouches > 0 ? `${Math.round((totalReplies / totalTouches) * 100)}% reply rate` : 'No touches yet'}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Paying Accounts</span>
            <span className="text-xl font-bold font-mono text-emerald-950 mt-0.5 block">
              {profile.payingCustomers === 'unknown' ? '0' : profile.payingCustomers}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {profile.currency} {profile.mrr || 0}/mo MRR
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Active Experiments</span>
            <span className="text-xl font-bold font-mono text-indigo-600 mt-0.5 block">{activeExperiments.length}</span>
            <span className="text-[10px] text-stone-400">{completedExperiments.length} completed</span>
          </div>
        </div>
      </section>

      {/* 2. Recharts Learning Velocity Summary */}
      <section>
        <LearningVelocitySummary 
          experiments={experiments}
          onNavigateToExperiments={onGoToExperiments}
        />
      </section>

      {/* 3. Current Diagnostic Assessment & Recommended Experiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Diagnosis & Critical Uncertainty */}
        <div className="lg:col-span-2 space-y-6">
          {latestReport ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Primary Identified Constraint
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                      {latestReport.provisionalStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    Bottleneck: <span className="text-indigo-600 capitalize">{latestReport.leadingBottleneckCategory.replace(/_/g, ' ')}</span>
                  </h3>
                </div>

                <button
                  onClick={onViewReport}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                >
                  View Full Report →
                </button>
              </div>

              {/* Leading Hypothesis */}
              <div className="text-xs bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1">
                <span className="font-bold text-stone-900 block">Leading Hypothesis:</span>
                <p className="text-stone-700 leading-relaxed">{latestReport.leadingHypothesis}</p>
              </div>

              {/* Primary Unanswered Question & Why It Matters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Single Most Critical Unknown:
                  </span>
                  <p className="leading-relaxed">
                    {latestReport.primaryUnansweredQuestion || 'Whether the buyer has immediate willingness to authorize payment.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950">
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Why Uncertainty Matters Now:
                  </span>
                  <p className="leading-relaxed">
                    {latestReport.whyUncertaintyMatters || 'Resolving this uncertainty prevents months of building features for non-buyers.'}
                  </p>
                </div>
              </div>

              {/* Recommended Experiment */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-stone-100">
                <div className="truncate">
                  <span className="font-bold text-stone-900 block truncate">
                    Recommended Test: {latestReport.primaryExperiment.title}
                  </span>
                  <span className="text-stone-500">
                    Est. {latestReport.primaryExperiment.requiredResources.timeHours} hrs · ${latestReport.primaryExperiment.requiredResources.moneyBudget} budget
                  </span>
                </div>

                <button
                  onClick={() => setCurrentView('next_actions')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer shrink-0"
                >
                  View Execution Steps →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-xs space-y-3">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">No Diagnosis Generated Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Complete the guided intake to diagnose your earliest bottleneck and receive evidence-grounded experiments.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={onStartDiagnosis}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Start Intake
                </button>
                <button
                  onClick={onViewExampleReport}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition cursor-pointer"
                >
                  Load Demo Clinic
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Workflow Hub */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-2">
              Growth Acceleration Modules
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setCurrentView('market_validation')}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 transition flex items-center justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-stone-900 block group-hover:text-indigo-600">
                    Market Validator (Module B)
                  </span>
                  <span className="text-[10px] text-stone-500">4-category evidence audit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => setCurrentView('customer_research')}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 transition flex items-center justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-stone-900 block group-hover:text-indigo-600">
                    Customer Research (Module C)
                  </span>
                  <span className="text-[10px] text-stone-500">ICPs, triggers, competitors</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => setCurrentView('acquisition_plans')}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 transition flex items-center justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-stone-900 block group-hover:text-indigo-600">
                    Acquisition Engine (Module D)
                  </span>
                  <span className="text-[10px] text-stone-500">10 channels & 4-sentence copy</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => setCurrentView('sales_diagnosis')}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 transition flex items-center justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-stone-900 block group-hover:text-indigo-600">
                    Sales Diagnosis (Module G)
                  </span>
                  <span className="text-[10px] text-stone-500">Mathematical funnel calculator</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => setCurrentView('founder_lessons')}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 transition flex items-center justify-between text-left cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-stone-900 block group-hover:text-indigo-600">
                    Founder Lessons (Module F)
                  </span>
                  <span className="text-[10px] text-stone-500">10+ documented case studies</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Test Bench launcher */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-700 text-[10px] block">
              Automated Test Bench
            </span>
            <p className="text-stone-600 leading-snug">
              Verify diagnostic accuracy across 10 startup archetypes (including paying customer scenarios).
            </p>
            <button
              onClick={onGoToTestBench}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Run Automated Test Bench (10/10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
