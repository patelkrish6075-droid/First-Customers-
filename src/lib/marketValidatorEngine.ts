import { BusinessProfile, MarketValidationReport, ExperimentPlan } from '../types';

export function runMarketValidation(profile: BusinessProfile): MarketValidationReport {
  const hasPayingCustomers = profile.payingCustomers !== 'unknown' && Number(profile.payingCustomers) > 0;
  const payingCount = hasPayingCustomers ? Number(profile.payingCustomers) : 0;
  const hasRevenue = profile.mrr !== 'unknown' && Number(profile.mrr) > 0;
  const hasFreeUsers = profile.freeUsers !== 'unknown' && Number(profile.freeUsers) > 0;
  const spendingOnAlts = profile.spendingOnAlternatives;

  // Problem Severity evaluation
  let problemSeverity: MarketValidationReport['problemSeverity'] = 'unknown';
  if (spendingOnAlts === 'yes' || hasPayingCustomers) {
    problemSeverity = 'critical';
  } else if (profile.specificProblem && profile.specificProblem.length > 30) {
    problemSeverity = 'moderate';
  } else {
    problemSeverity = 'unknown';
  }

  // Problem Frequency
  let problemFrequency: MarketValidationReport['problemFrequency'] = 'weekly';
  const probText = (profile.specificProblem || '').toLowerCase();
  if (probText.includes('daily') || probText.includes('hour') || probText.includes('continuous') || probText.includes('every day')) {
    problemFrequency = 'daily';
  } else if (probText.includes('month') || probText.includes('quarter') || probText.includes('tax') || probText.includes('annual')) {
    problemFrequency = 'occasional';
  }

  // Competitors and alternatives
  const competitorsAndAlternatives: MarketValidationReport['competitorsAndAlternatives'] = [
    {
      name: profile.currentWorkarounds || 'Manual Spreadsheets & Email Chains',
      type: 'status_quo_excel',
      pricingSummary: '$0 direct spend, but 5–10 hours of wasted founder/team labor per week',
      keyDeficiency: 'Fragile, prone to copy-paste data corruption, zero automated reminders or unified visibility.'
    },
    {
      name: 'Legacy Enterprise Software Suite',
      type: 'direct_competitor',
      pricingSummary: '$50–$300/user/month with mandatory annual commitment and high onboarding friction',
      keyDeficiency: 'Bloated feature set, slow interface, requires weeks of configuration and training.'
    },
    {
      name: 'Ad-hoc Freelancers or Outsourced Virtual Assistants',
      type: 'agency_manual',
      pricingSummary: '$20–$50/hour recurring variable expenditure',
      keyDeficiency: 'Inconsistent turnaround times, turnover requires continual re-training, lack of centralized audit history.'
    }
  ];

  // Target customer segments
  const targetCustomerSegments: MarketValidationReport['targetCustomerSegments'] = [
    {
      segmentName: `Active Practitioners (${profile.targetBuyer})`,
      buyerRole: 'Direct Operator & End User',
      purchaseLikelihood: 'high',
      rationale: 'Feels the daily operational pain directly; will champion adoption if onboarding requires under 15 minutes.'
    },
    {
      segmentName: 'Operations Leads / Department Heads',
      buyerRole: 'Budget Gatekeeper & Economic Buyer',
      purchaseLikelihood: hasPayingCustomers ? 'high' : 'medium',
      rationale: 'Seeks labor cost reduction, reporting consistency, and predictable team throughput.'
    },
    {
      segmentName: 'Early-Stage Founders / Solo Operators',
      buyerRole: 'Sole Decision Maker',
      purchaseLikelihood: 'medium',
      rationale: 'High willingness to adopt new tools, but price-sensitive and prone to building their own temporary hacks.'
    }
  ];

  // Demand Evidence Separation (Verified facts vs user-provided vs hypotheses vs unknowns)
  const verifiedFacts: string[] = [];
  const userProvidedStatements: string[] = [];
  const inferredHypotheses: string[] = [];
  const criticalUnknowns: string[] = [];

  // Verified facts
  if (hasPayingCustomers) {
    verifiedFacts.push(`${payingCount} paying customer account(s) have completed commercial transactions for ${profile.productName}.`);
  }
  if (hasRevenue) {
    verifiedFacts.push(`Recorded recurring monthly revenue of ${profile.currency} ${profile.mrr}/month.`);
  }
  if (hasFreeUsers) {
    verifiedFacts.push(`${profile.freeUsers} user accounts have actively registered or completed free trials.`);
  }
  if (verifiedFacts.length === 0) {
    verifiedFacts.push('Zero verified commercial transactions have been recorded in the business ledger to date.');
  }

  // User-provided statements
  userProvidedStatements.push(`Product value proposition: "${profile.taglineOrSummary || profile.productName}"`);
  userProvidedStatements.push(`Target buyer specified by founder: "${profile.targetBuyer}"`);
  userProvidedStatements.push(`Specific problem statement provided: "${profile.specificProblem}"`);
  if (profile.spendingDetails) {
    userProvidedStatements.push(`Founder reported alternative spending: "${profile.spendingDetails}"`);
  }
  if (profile.prospectFeedbackSummary) {
    userProvidedStatements.push(`Reported prospect feedback: "${profile.prospectFeedbackSummary}"`);
  }

  // Inferred hypotheses
  inferredHypotheses.push(`Hypothesis: ${profile.targetBuyer} experiences sufficient operational pain from ${profile.specificProblem.slice(0, 40)} to reallocate budget.`);
  inferredHypotheses.push(`Hypothesis: The primary barrier to purchase is currently ${profile.founderBottleneckBelief || 'unclear positioning or lack of qualified outreach volume'}.`);
  if (!hasPayingCustomers) {
    inferredHypotheses.push('Hypothesis: An initial offer priced at reasonable value will convert if friction in the onboarding flow is removed.');
  }

  // Critical unknowns
  if (!hasPayingCustomers) {
    criticalUnknowns.push('What specific dollar amount will a real buyer authorize on a credit card to solve this problem today?');
    criticalUnknowns.push('What is the actual decision cycle (days from first touch to purchase authorization)?');
  }
  criticalUnknowns.push('Which acquisition channel yields the lowest cost per qualified discovery conversation?');
  criticalUnknowns.push('What alternative will the prospect choose if they decline to adopt this software?');

  // Willingness to pay signals
  const willingnessToPaySignals: MarketValidationReport['willingnessToPaySignals'] = [];
  if (hasPayingCustomers) {
    willingnessToPaySignals.push({
      signal: 'Direct Financial Transactions',
      strength: 'strong',
      evidence: `${payingCount} accounts have already paid ${profile.currency} ${profile.mrr || ''} to use the service.`
    });
  } else if (spendingOnAlts === 'yes') {
    willingnessToPaySignals.push({
      signal: 'Substituted Alternative Spending',
      strength: 'strong',
      evidence: `Target prospects are actively spending money on workarounds (${profile.spendingDetails || 'competitors, consultants, or manual labor'}).`
    });
  } else {
    willingnessToPaySignals.push({
      signal: 'Verbal / Hypothetical Interest Only',
      strength: 'weak',
      evidence: 'No transactional commitment observed yet. Verbal praise from peers without credit card authorization is an unvalidated signal.'
    });
  }

  // Differentiation and positioning
  const differentiationAndPositioning: MarketValidationReport['differentiationAndPositioning'] = {
    claimedAdvantage: profile.productCategory ? `Specialized ${profile.productCategory} tailored for ${profile.targetBuyer}` : 'Streamlined workflow automation',
    buyerRealityCheck: 'Buyers evaluate tools based on how quickly they eliminate a painful chore, not on architecture or feature counts.',
    isDefensible: hasPayingCustomers
  };

  // Distribution challenges
  const distributionChallenges: string[] = [
    `Reaching ${profile.targetBuyer} directly without getting trapped in automated spam filters`,
    'Overcoming customer switching inertia (inertia favors sticking with imperfect free spreadsheets)',
    'Educating prospects who do not yet realize their current workaround is costing them hundreds of hours'
  ];

  // Main assumptions requiring validation
  const mainAssumptionsRequiringValidation: string[] = [
    `Assumption 1: ${profile.targetBuyer} has direct credit card or budget sign-off authority for this software tier`,
    `Assumption 2: The time saved by ${profile.productName} exceeds the initial setup and learning curve friction`,
    'Assumption 3: The founder can acquire qualified leads at a cost significantly below Customer Lifetime Value (LTV)'
  ];

  // Risks and missing evidence
  const risksAndMissingEvidence: string[] = [
    hasPayingCustomers ? 'Risk of relying on a tiny cohort without knowing which acquisition channel scales' : 'Zero proven willingness to pay recorded: risk of building features for non-buyers',
    'Unclear payback period: sales cycle length has not been statistically established',
    'Competitor lock-in: incumbents may add lightweight versions of this feature'
  ];

  // Recommended next validation experiment
  const recommendedValidationExperiment: ExperimentPlan = {
    id: `exp-val-${Date.now()}`,
    title: hasPayingCustomers 
      ? 'Paid Customer Motivation & Attribution Audit'
      : 'Lightweight Pre-Commitment & Discovery Sprint',
    hypothesis: hasPayingCustomers
      ? `Interviewing existing paying accounts will isolate the exact high-converting acquisition channel and purchase trigger.`
      : `Presenting a specific pricing proposal to 20 qualified ${profile.targetBuyer} prospects will validate whether willingness-to-pay exists before writing more code.`,
    targetAudience: profile.targetBuyer,
    timeFrame: '7 to 10 business days',
    procedure: hasPayingCustomers
      ? [
          'Schedule 15-minute video debriefs with your existing paying customers',
          'Ask: "What specific incident happened the day you decided to buy our product?"',
          'Ask: "If we shut down tomorrow, what exact tool or spreadsheet would you replace us with?"',
          'Double down on the exact channel and use-case revealed by paying users'
        ]
      : [
          `Compile a list of 20 named individuals matching the target buyer profile: ${profile.targetBuyer}`,
          'Send personalized outreach asking for feedback on a concrete pricing tier ($X/month)',
          'Track whether prospects ask for a live demo/pilot or reject the value proposition',
          'Record verbatim objections to identify missing value requirements'
        ],
    requiredResources: {
      timeHours: 6,
      moneyBudget: 0,
      toolsOrSkills: 'Direct 1-on-1 customer outreach'
    },
    metricsToRecord: ['Response rate', 'Willingness to review pricing', 'Verbatim objections recorded'],
    supportingEvidenceOutcome: 'At least 3 prospects agree to evaluate the paid tier or state the price is reasonable for the value provided.',
    contradictoryEvidenceOutcome: 'Prospects state the problem is not painful enough to justify paying money, or prefer existing free spreadsheets.',
    inconclusiveCriteria: 'Fewer than 10 total responses gathered; sample size too small to confirm.',
    nextActionSupporting: 'Standardize the pitch and initiate systematic multi-channel outreach.',
    nextActionContradictory: 'Revisit the target buyer or pivot to a higher-severity problem.',
    nextActionInconclusive: 'Expand outreach to 20 additional prospects to reach statistical confidence.'
  };

  return {
    id: `mkt-val-${Date.now()}`,
    profileId: profile.id,
    createdAt: new Date().toISOString(),
    problemSeverity,
    problemFrequency,
    problemSummary: profile.specificProblem || 'Operational friction in daily workflows',
    competitorsAndAlternatives,
    targetCustomerSegments,
    demandEvidence: {
      verifiedFacts,
      userProvidedStatements,
      inferredHypotheses,
      criticalUnknowns
    },
    willingnessToPaySignals,
    differentiationAndPositioning,
    distributionChallenges,
    mainAssumptionsRequiringValidation,
    risksAndMissingEvidence,
    recommendedValidationExperiment
  };
}
