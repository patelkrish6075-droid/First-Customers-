import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  Target, 
  FlaskConical, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText,
  Lock,
  Zap,
  Activity
} from 'lucide-react';
import { ActiveAppView } from '../types';

interface LandingPageProps {
  onStartDiagnosis: () => void;
  onExplorePlatform: () => void;
  onViewExampleReport: () => void;
  setCurrentView: (view: ActiveAppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiagnosis,
  onExplorePlatform,
  onViewExampleReport,
  setCurrentView
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why do founders struggle to get customers after launching?',
      a: 'Most founders assume that a lack of sales means they need more marketing traffic or more product features. In reality, the earliest bottleneck is almost always Target Buyer Mismatch, an Unclear Purchase Trigger, or High Switching Inertia (prospects prefer to stick with free spreadsheets). First Customers isolates the exact bottleneck so you don’t burn runway on the wrong fix.'
    },
    {
      q: 'How is this different from generic AI business plan generators?',
      a: 'Generic AI generators produce hallucinated advice, generic SEO lists, and fabricated market sizes. First Customers enforces a strict zero-hallucination constraint: it separates verified facts, user-provided statements, and unknowns, only recommending experiments specifically justified by what you actually submit.'
    },
    {
      q: 'Do I need paying customers or revenue to use this platform?',
      a: 'No. The platform is designed specifically for founders with zero paying customers up to early traction ($5k MRR). If you have zero customers, it guides demand validation and high-touch discovery. If you have paying customers, it analyzes what caused those specific buyers to pay and creates lookalike acquisition plans.'
    },
    {
      q: 'How does the experiment tracking and learning velocity work?',
      a: 'Instead of counting generic tasks, First Customers maps the cumulative history of validated customer signals versus disproven false assumptions. In early-stage venture building, disproving a false assumption in 10 days prevents 3 to 6 months of wasted code development.'
    },
    {
      q: 'Where is my startup business data stored?',
      a: 'Your workspace data is stored in your private browser session with full export controls (JSON export, markdown reports, and complete data wipe). We never share or sell your business ideas or funnel metrics.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-stone-200">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>The Customer Acquisition Engine for Builders</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] max-w-3xl mx-auto text-balance">
          Stop guessing. <br />
          <span className="text-indigo-600">Find your first customers.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto text-balance">
          Turn your product, market evidence, and real-world experiments into a focused plan for customer acquisition.
        </p>

        {/* Primary Action Zone */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStartDiagnosis}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Diagnose My Growth Problem</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExplorePlatform}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm border border-stone-300 transition cursor-pointer"
          >
            Explore the Platform
          </button>
        </div>

        {/* Secondary Trust Kicker */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero generic marketing fluff</span>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>No fabricated testimonials</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Evidence-based first principles only</span>
        </div>
      </section>

      {/* 2. Mechanism-to-Outcome: The 5-Stage Continuous Decision Loop */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Systematic Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            How First Customers Works
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            A repeatable cycle that isolates the earliest material constraint before you burn time and runway.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Diagnose Bottleneck',
              desc: 'Separate observed customer facts from founder beliefs and unknowns across 8 distinct failure modes.'
            },
            {
              step: '02',
              title: 'Validate Demand',
              desc: 'Confirm whether buyers experience acute daily pain and verify willingness to reallocate budget.'
            },
            {
              step: '03',
              title: 'Select Acquisition',
              desc: 'Prioritize 1–2 suitable channels matched to your specific B2B/B2C profile, hours, and budget.'
            },
            {
              step: '04',
              title: 'Execute Experiment',
              desc: 'Run a bounded 7-to-10 day test with explicit success, contradictory, and inconclusive thresholds.'
            },
            {
              step: '05',
              title: 'Update Action Plan',
              desc: 'Record real customer behavior and generate your next 3 prioritized actions based on evidence.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs relative flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 block mb-2">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-stone-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Capabilities Bento Showcase */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Product Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Everything You Need to Unlock Customer #1 Through #10
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: What Should I Do Next? (Large) */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                “What Should I Do Next?” Priority Engine
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Never open your laptop wondering what to work on. First Customers synthesizes your target customer, active traction, and previous test outcomes into a short-term plan of exactly 3 prioritized actions—explaining why each is urgent, what remains uncertain, and what to do if it fails.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Updated after every test result</span>
              <button
                onClick={() => setCurrentView('next_actions')}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                View Recommendation Logic →
              </button>
            </div>
          </div>

          {/* Card 2: Recharts Learning Velocity */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Learning Velocity Visualizer
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Recharts-powered cumulative trend mapping verified customer signals vs. disproven assumptions. Track how fast your venture is learning.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Validates pace of iteration</span>
            </div>
          </div>

          {/* Card 3: Customer Acquisition Engine */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Channel Blueprint Generator
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Practical execution plans for founder-led outreach, LinkedIn, customer interviews, and communities with exact 4-sentence copy templates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Ranked by suitability score</span>
            </div>
          </div>

          {/* Card 4: Documented Founder Lessons */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Documented Founder Lessons
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                10+ verified case studies (Buffer, ConvertKit, Segment, Superhuman, Zapier) analyzing the evidence available at the time, what applies to you, and what doesn't transfer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Real reported history with citations</span>
            </div>
          </div>

          {/* Card 5: Sales & Funnel Diagnosis */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Sales Funnel Leak Diagnosis
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Mathematical diagnosis of your conversion funnel with explicit denominators and warnings whenever sample size is too small for statistical certainty.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Transparent mathematical formulas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clearly Labeled Example Report Showcase (Demo Clinic) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Illustrative Case Example
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                See How First Customers Diagnosed “ClinicFlow”
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                A healthcare scheduling tool that launched 4 months ago, conducted 40 cold touches, booked 6 demos, but acquired 0 paying customers.
              </p>
            </div>

            <button
              onClick={onViewExampleReport}
              className="px-4 py-2.5 rounded-lg bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition whitespace-nowrap cursor-pointer shrink-0"
            >
              Inspect Complete Report →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/80">
              <span className="text-stone-400 block mb-1">Founder’s Belief:</span>
              <p className="font-medium text-stone-200">
                “My $129/mo price is too high and I should drop it to $49, or run Google Search ads.”
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/80">
              <span className="text-stone-400 block mb-1">System Diagnostic:</span>
              <p className="font-bold text-rose-400">
                Primary Bottleneck: Positioning & Perceived Friction (Not Pricing)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/80">
              <span className="text-stone-400 block mb-1">Prescribed Experiment:</span>
              <p className="font-medium text-stone-200">
                10-day audit observing receptionist calendar switching rather than wasting budget on Google Ads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Data Handling Guarantee */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-stone-900">
                Founder Privacy & Data Integrity Promise
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              We never invent customer quotes, fake metrics, or unverified claims. Your business answers, funnel numbers, and experiment notes remain strictly within your authorized workspace. Complete JSON backup and instant data deletion are supported at any time.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('privacy')}
            className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            Review Data Controls
          </button>
        </div>
      </section>

      {/* 6. Pricing Section Teaser */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
          Simple, Transparent Packaging
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Start for Free. Upgrade as You Grow.
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
          Every founder gets complete access to the product validator and the standard 5-stage customer acquisition loop.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentView('pricing')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
          >
            <span>Explore Free, Pro, and Team Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-stone-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-stone-200 rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-stone-900 hover:bg-stone-50 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                )}
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-8 sm:p-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Ready to find out why customers aren't buying?
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Take 5 minutes to submit your product situation and receive a structured, evidence-aware diagnosis today.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartDiagnosis}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm hover:shadow-md cursor-pointer inline-flex items-center space-x-2"
            >
              <span>Diagnose My Growth Problem Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
