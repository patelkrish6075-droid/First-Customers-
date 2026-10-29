import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  Target, 
  FlaskConical, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ActiveAppView } from '../types';

interface FeaturesPageProps {
  setCurrentView: (view: ActiveAppView) => void;
  onStartDiagnosis: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  setCurrentView,
  onStartDiagnosis
}) => {
  const featureChains = [
    {
      module: 'Module A: Founder Dashboard',
      icon: TrendingUp,
      userGoal: 'See the health of customer acquisition and exact next priority at a glance.',
      mechanism: 'Unified status card integrating business profile, Recharts learning velocity curve, active experiments, and recent decisions.',
      benefit: 'Eliminates morning decision fatigue and keeps the team focused strictly on the primary bottleneck.'
    },
    {
      module: 'Module B: Market Validator',
      icon: Compass,
      userGoal: 'Know if the product solves a real problem before spending months building more features.',
      mechanism: 'Four-category evidence separator (verified facts, user-provided statements, inferred hypotheses, and unknowns).',
      benefit: 'Protects runway from false validation and reveals missing willingness-to-pay signals early.'
    },
    {
      module: 'Module C: Customer Research',
      icon: Target,
      userGoal: 'Identify exactly who has budget and where to reach them directly.',
      mechanism: 'ICP generator mapping daily practitioner vs economic buyer roles, buying triggers, competitor vulnerabilities, and community forums.',
      benefit: 'Prevents pitching generic organizational inboxes and identifies the specific trigger where buyers switch.'
    },
    {
      module: 'Module D: Acquisition Engine',
      icon: Target,
      userGoal: 'Choose the right channel without wasting money on expensive ads.',
      mechanism: 'Suitability scoring algorithm matching B2B/B2C profiles to 10 channels with 4-sentence peer outreach copy templates.',
      benefit: 'Delivers a step-by-step prospecting checklist rather than theoretical marketing advice.'
    },
    {
      module: 'Module E: Experiment Workspace',
      icon: FlaskConical,
      userGoal: 'Run systematic 7-to-10 day tests and record real customer reactions.',
      mechanism: 'Structured hypothesis cards with execution checklists, success/failure thresholds, and Recharts cumulative velocity curves.',
      benefit: 'Transforms vague founder effort into verifiable, auditable business learning.'
    },
    {
      module: 'Module F: Founder Lessons Library',
      icon: BookOpen,
      userGoal: 'Learn from real startup pivots and avoid documented distribution traps.',
      mechanism: 'Searchable library of 10+ documented founder decisions (Buffer, ConvertKit, Segment, Superhuman, Zapier) with transferability audits.',
      benefit: 'Prevents copying strategies from famous companies that cannot transfer to your specific business model.'
    },
    {
      module: 'Module G: Sales & Conversion Diagnosis',
      icon: BarChart3,
      userGoal: 'Find the exact leak in your sales funnel.',
      mechanism: 'Mathematical conversion calculator displaying reply rates, demo conversion, closing percentages, and sample-size confidence warnings.',
      benefit: 'Prevents misdiagnosing a messaging problem as a pricing flaw when sample size is under threshold.'
    },
    {
      module: 'Module H: “What Should I Do Next?”',
      icon: ArrowRight,
      userGoal: 'Get an unambiguous, short-term plan for the current week.',
      mechanism: 'Dynamic 3-action priority engine explaining why an action is prioritized, what remains uncertain, time/cost estimates, and failure plans.',
      benefit: 'Gives solo and early founders clear execution clarity every single morning.'
    },
    {
      module: 'Module I: AI Strategy Assistant',
      icon: Sparkles,
      userGoal: 'Get peer-level advice on customer pushback and cold outreach copy.',
      mechanism: 'Context-aware assistant referencing your active business profile, constraints, and funnel numbers.',
      benefit: 'Instant feedback on draft emails, interview questions, and objection handling without generic fluff.'
    },
    {
      module: 'Module J: Reports & Exports',
      icon: FileText,
      userGoal: 'Share an evidence-based progress summary with co-founders or advisors.',
      mechanism: 'Print/PDF-ready executive summary generator, Markdown downloader, and one-click clipboard copy.',
      benefit: 'Transparently documents experiments attempted, results gathered, and lessons learned.'
    },
    {
      module: 'Module K: Integrations Hub',
      icon: Layers,
      userGoal: 'Connect real analytics, CRM, and research tools without fake indicators.',
      mechanism: 'Verified connection manager for PostHog/GA4, HubSpot, Resend, and local MCP coding agents.',
      benefit: 'Future-proof automation for customer discovery and experiment synchronization.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
          Complete Architectural Specifications
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Every Feature Linked to a Measurable Outcome
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          We designed First Customers using a strict mechanism-to-outcome chain: your goal connects directly to visible software state, delivering verifiable business progress.
        </p>
      </div>

      {/* Feature Chains List */}
      <div className="space-y-4">
        {featureChains.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs hover:border-stone-300 transition"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">{item.module}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    1. Founder Goal
                  </span>
                  <p className="text-stone-800 font-medium">{item.userGoal}</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    2. Visible Interface Mechanism
                  </span>
                  <p className="text-stone-700">{item.mechanism}</p>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    3. Measurable Progress
                  </span>
                  <p className="text-emerald-950 font-medium">{item.benefit}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Ready to test your business against this engine?</h2>
        <p className="text-xs text-stone-300 max-w-md mx-auto">
          Start with the guided intake or try the free instant validator tool with zero registration.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={onStartDiagnosis}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Start Guided Intake
          </button>
          <button
            onClick={() => setCurrentView('free_validator')}
            className="px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition cursor-pointer border border-stone-700"
          >
            Try Free Instant Validator
          </button>
        </div>
      </div>
    </div>
  );
};
