import { BusinessProfile, TrackedExperiment, NextActionItem, SalesFunnelData } from '../types';

export function generateNextThreeActions(
  profile: BusinessProfile,
  experiments: TrackedExperiment[],
  funnelData?: SalesFunnelData
): NextActionItem[] {
  const hasPayingCustomers = profile.payingCustomers !== 'unknown' && Number(profile.payingCustomers) > 0;
  const payingCount = hasPayingCustomers ? Number(profile.payingCustomers) : 0;
  const activeExps = experiments.filter(e => e.status === 'active');
  const completedExps = experiments.filter(e => e.status === 'completed');

  const actions: NextActionItem[] = [];

  // Action 1: The #1 Critical Path Priority
  if (hasPayingCustomers) {
    actions.push({
      id: 'action-1-paying-customer-audit',
      priorityRank: 1,
      actionTitle: 'Conduct 1-on-1 Motivation Interviews with Your Paying Customers',
      category: 'retention_recurring_value',
      whyPriorityNow: `You already have ${payingCount} paying customer(s). Before spending time on broad cold outreach, you must discover why these specific buyers paid you. Their answers hold the blueprint for acquiring the next 10 customers.`,
      supportingEvidence: [
        `${payingCount} verified commercial account(s) in active business profile`,
        `Current MRR: ${profile.currency} ${profile.mrr || '0'}/month`,
        'Qualitative customer interview evidence consistently outperforms guessing marketing angles'
      ],
      whatRemainsUncertain: [
        'What was the specific event or breaking point that triggered their purchase decision?',
        'Which acquisition channel originally brought them to your product?',
        'What specific feature delivers 80% of their perceived value?'
      ],
      timeEstimateHours: 4,
      costEstimateDollars: 0,
      exactExecutionSteps: [
        'Send a brief personal email to your paying accounts requesting a 12-minute feedback conversation',
        'Ask: "What were you using before our product, and why wasn\'t that good enough?"',
        'Ask: "If you had to explain to a peer why they should buy this, what exact sentence would you use?"',
        'Transcribe their exact language into your value proposition and website copy'
      ],
      measurableSuccessThreshold: 'Complete at least 2 interviews and extract 1 verified purchase trigger common to both buyers.',
      whatIfItSucceeds: 'Update your landing page headline and cold outreach copy using their exact phrasing, then launch targeted outreach to lookalike profiles.',
      whatIfItFails: 'If customers decline to speak or express indifference, investigate whether churn risk is imminent and schedule an onboarding usability check.'
    });
  } else {
    actions.push({
      id: 'action-1-direct-prospect-discovery',
      priorityRank: 1,
      actionTitle: `Execute 25 Personalized High-Touch Touches to ${profile.targetBuyer || 'Target Buyers'}`,
      category: 'demand_validation',
      whyPriorityNow: 'You have built the product, but have 0 verified paying customers. The most dangerous trap is coding new features in isolation. You must confront the market directly to test whether the pain is severe enough to warrant purchase.',
      supportingEvidence: [
        'Product stage is launched or in testing with zero confirmed commercial transactions',
        `Stated target buyer: ${profile.targetBuyer}`,
        'Direct founder conversations yield immediate objection clarity in days rather than waiting months for passive traffic'
      ],
      whatRemainsUncertain: [
        'Do prospects actively recognize this problem, or is it merely a mild inconvenience?',
        'Does the current pricing structure match their willingness to pay?',
        'Are you reaching the actual decision maker with budget authority?'
      ],
      timeEstimateHours: 6,
      costEstimateDollars: 0,
      exactExecutionSteps: [
        `Identify 25 named individuals matching "${profile.targetBuyer}" on LinkedIn or professional directories`,
        'Audit their profiles to verify they experience the daily workflow friction',
        'Send a plain-text 4-sentence message asking how they currently solve the problem (no automated pitch link)',
        'Track every reply, objection, and follow-up in the First Customers Experiment Workspace'
      ],
      measurableSuccessThreshold: '≥ 20% reply rate (at least 5 replies) and at least 2 qualified discovery calls scheduled.',
      whatIfItSucceeds: 'Present a bounded paid evaluation offer to the interested respondents to validate direct willingness to pay.',
      whatIfItFails: 'If 25 touches produce 0 replies, rewrite your hook to highlight a specific costly symptom rather than general benefits.'
    });
  }

  // Action 2: Onboarding & Value Activation Friction Removal
  actions.push({
    id: 'action-2-activation-friction-removal',
    priorityRank: 2,
    actionTitle: 'Observe 3 Live User Screen-Share Sessions to Eliminate Onboarding Drop-Off',
    category: 'activation_value',
    whyPriorityNow: 'Founders suffer from the curse of knowledge: flows that seem obvious to you cause confusion for first-time visitors. Watching users interact live reveals where activation breaks down.',
    supportingEvidence: [
      `Reported drop-off stage: ${profile.dropOffStage.replace(/_/g, ' ')}`,
      profile.observedCustomerSessions === 'no' 
        ? 'No live user sessions recorded yet; assumptions about user behavior are unverified'
        : 'Observing continuous onboarding sessions prevents silent user abandonment'
    ],
    whatRemainsUncertain: [
      'At what exact screen or input field does user momentum stall?',
      'How many minutes elapse before the user experiences the core "Aha!" value moment?',
      'Are error messages or empty states confusing new signups?'
    ],
    timeEstimateHours: 3,
    costEstimateDollars: 0,
    exactExecutionSteps: [
      'Invite 3 target users or friendly peers to test the software while sharing their screen on a video call',
      'Instruct them: "Think out loud as you try to accomplish [Core Task]. I will stay silent and not assist you."',
      'Note every moment where the user pauses for more than 5 seconds or clicks the wrong element',
      'Deploy immediate fixes for the top 2 points of confusion before driving more traffic'
    ],
    measurableSuccessThreshold: 'Identify and fix at least 2 UI or UX friction points that caused user hesitation.',
    whatIfItSucceeds: 'New signups will activate faster, dramatically improving trial-to-paid conversion efficiency.',
    whatIfItFails: 'If users understand the UI perfectly but remain unimpressed by the outcome, the core value proposition requires strengthening.'
  });

  // Action 3: Quantified Funnel Instrumentation & Accountability
  actions.push({
    id: 'action-3-funnel-instrumentation',
    priorityRank: 3,
    actionTitle: 'Establish a Bounded 7-Day Funnel Benchmark in the Sales Diagnosis Module',
    category: 'sales_conversion',
    whyPriorityNow: 'Managing customer acquisition without clear funnel numbers leads to emotional rollercoasters. Tracking weekly touches, replies, and conversions provides objective evidence on whether growth is accelerating.',
    supportingEvidence: [
      `Available weekly time: ${profile.availableHoursPerWeek} hours/week`,
      'Mathematical sales funnel models isolate the exact leak (prospecting vs messaging vs closing)',
      'Disciplined sprint cadences prevent founder burnout'
    ],
    whatRemainsUncertain: [
      'What is your baseline reply-to-meeting conversion percentage?',
      'What is your actual sales cycle length in days?',
      'Which objection occurs most frequently during the final buying conversation?'
    ],
    timeEstimateHours: 2,
    costEstimateDollars: 0,
    exactExecutionSteps: [
      'Open the Sales Diagnosis module in First Customers',
      'Enter your last 14 days of prospect touches, replies, and meetings',
      'Review the automated bottleneck diagnosis to verify if messaging or closing is the primary constraint',
      'Log an experiment in the workspace testing one specific fix over the next 7 business days'
    ],
    measurableSuccessThreshold: 'Record complete funnel numbers for 14 continuous days with 0 missing denominator fields.',
    whatIfItSucceeds: 'You will have clear conversion baseline metrics to evaluate future marketing and acquisition channels.',
    whatIfItFails: 'If tracking feels too burdensome, simplify your funnel to just 3 metrics: Touches, Demos, and Cash Collected.'
  });

  return actions;
}
