import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { UserAccount } from '../types';

interface PricingViewProps {
  currentUser?: UserAccount;
  onSelectPlan: (plan: 'free' | 'pro' | 'team') => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free' as const,
      name: 'Free Starter',
      target: 'For solo founders validating their first product hypothesis',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Deterministic Diagnostic Engine (8 Bottleneck Rules)',
        'Up to 2 concurrent active experiments',
        'Basic customer acquisition channel outline',
        'Standard learning velocity tracking',
        'Founder lessons library access',
        '1 product workspace'
      ],
      ctaText: currentUser?.plan === 'free' ? 'Current Active Plan' : 'Select Free Plan',
      isPopular: false
    },
    {
      id: 'pro' as const,
      name: 'Founder Pro',
      target: 'For founders actively conducting outreach and testing funnels',
      priceMonthly: 29,
      priceAnnual: 24,
      features: [
        'Unlimited active & archived experiments',
        'Full Customer Research Engine & ICP generator',
        'Complete Acquisition Engine with 4-sentence copy templates',
        'Mathematical Sales & Conversion Diagnosis with denominator checks',
        'AI Strategy Assistant with contextual workspace memory',
        'Print/PDF executive reports & Markdown exports',
        'Up to 3 product workspaces'
      ],
      ctaText: currentUser?.plan === 'pro' ? 'Current Active Plan' : 'Upgrade to Pro',
      isPopular: true
    },
    {
      id: 'team' as const,
      name: 'Startup Team',
      target: 'For co-founding teams and early-stage growth squads',
      priceMonthly: 79,
      priceAnnual: 65,
      features: [
        'Everything in Founder Pro',
        'Unlimited product workspaces',
        'Team collaboration with shared experiment logs',
        'CRM & Analytics live synchronization (HubSpot, PostHog)',
        'MCP Agent protocol access for AI coding assistants',
        'Dedicated onboarding strategy session'
      ],
      ctaText: currentUser?.plan === 'team' ? 'Current Active Plan' : 'Select Team Plan',
      isPopular: false
    }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
          Transparent Packaging
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Invest in Evidence, Not Speculation
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Every plan includes our zero-hallucination guarantee. No fake metrics, no automated billing traps.
        </p>

        {/* Billing Switcher */}
        <div className="pt-4 flex items-center justify-center space-x-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-stone-900' : 'text-stone-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
              billingCycle === 'annual' ? 'bg-indigo-600' : 'bg-stone-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-stone-900' : 'text-stone-500'}`}>
            <span>Annual (Save ~20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentUser?.plan === plan.id;
          const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div 
              key={plan.id}
              className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition relative ${
                plan.isPopular 
                  ? 'border-2 border-indigo-600 shadow-md ring-1 ring-indigo-600/20' 
                  : 'border border-stone-200 shadow-xs'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Most Popular for Builders
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
                <p className="text-xs text-stone-500 mt-1 min-h-[32px]">{plan.target}</p>

                <div className="my-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono">
                      ${displayPrice}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      / month {billingCycle === 'annual' && displayPrice > 0 && '(billed annually)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs pt-4 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Included Capabilities:
                  </span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2 text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isCurrent
                      ? 'bg-stone-100 text-stone-500 cursor-default'
                      : plan.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-600 space-y-1">
        <p className="font-semibold text-stone-800">
          First Customers Guarantee: Cancel or change plans anytime with one click.
        </p>
        <p>
          We don't make unsupported claims about guaranteed revenue or conversion multipliers. We guarantee systematic, evidence-grounded decision making.
        </p>
      </div>
    </div>
  );
};
