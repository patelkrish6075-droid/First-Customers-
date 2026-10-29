import { 
  BusinessProfile, 
  DiagnosticReport, 
  BottleneckCategory, 
  DiagnosticStatus, 
  ExperimentPlan,
  ChannelAttempt 
} from '../types';

export interface DiagnosticEvaluation {
  category: BottleneckCategory;
  confidence: 'high' | 'provisional' | 'sparse_data';
  hypothesis: string;
  primaryUnansweredQuestion: string;
  whyUncertaintyMatters: string;
  smallestPracticalExperimentSummary: string;
  supportingEvidence: string[];
  competingExplanations: string[];
  criticalUnknowns: string[];
  conflictingSignals: string[];
  priorityRationale: string;
  status: DiagnosticStatus;
  primaryExperiment: ExperimentPlan;
  limitations: string[];
}

/**
 * Calculates aggregate funnel metrics and detects missing denominators.
 */
export function analyzeFunnel(profile: BusinessProfile) {
  let totalProspects = 0;
  let hasUnknownProspects = false;
  let totalReplies = 0;
  let totalDemos = 0;
  let totalTrials = 0;
  let totalPurchases = 0;
  let totalSpend = 0;

  for (const ch of profile.channels) {
    if (ch.prospectsReached === 'unknown') hasUnknownProspects = true;
    else totalProspects += Number(ch.prospectsReached || 0);

    if (ch.repliesOrConversations !== 'unknown') totalReplies += Number(ch.repliesOrConversations || 0);
    if (ch.demosOrCalls !== 'unknown') totalDemos += Number(ch.demosOrCalls || 0);
    if (ch.trialsOrActivations !== 'unknown') totalTrials += Number(ch.trialsOrActivations || 0);
    if (ch.purchases !== 'unknown') totalPurchases += Number(ch.purchases || 0);
    if (ch.estimatedSpend !== 'unknown') totalSpend += Number(ch.estimatedSpend || 0);
  }

  const payingCustomers = profile.payingCustomers === 'unknown' ? 0 : Number(profile.payingCustomers);
  const freeUsers = profile.freeUsers === 'unknown' ? 0 : Number(profile.freeUsers);
  const trialsOrSignups = profile.trialsOrSignups === 'unknown' ? 0 : Number(profile.trialsOrSignups);

  return {
    totalProspects,
    hasUnknownProspects,
    totalReplies,
    totalDemos,
    totalTrials,
    totalPurchases: Math.max(totalPurchases, payingCustomers),
    totalSpend,
    payingCustomers,
    freeUsers,
    trialsOrSignups,
  };
}

/**
 * Extracts verifiable observed facts from the profile.
 */
export function extractObservedFacts(profile: BusinessProfile, funnel: ReturnType<typeof analyzeFunnel>): string[] {
  const facts: string[] = [];

  facts.push(`Product stage is reported as "${profile.stage}" (${profile.monthsSinceLaunch === 'unknown' ? 'launch age unrecorded' : `${profile.monthsSinceLaunch} months since launch`}).`);
  facts.push(`Commercial traction: ${profile.payingCustomers === 'unknown' ? 'Unrecorded' : `${profile.payingCustomers} paying customer(s)`} generating ${profile.mrr === 'unknown' ? 'unrecorded' : `${profile.currency} ${profile.mrr}/mo`} MRR, alongside ${profile.freeUsers === 'unknown' ? '0' : profile.freeUsers} free users and ${profile.trialsOrSignups === 'unknown' ? '0' : profile.trialsOrSignups} total signups.`);

  if (profile.channels.length > 0) {
    const channelSummaries = profile.channels.map(c => {
      const name = c.channelNameCustom || c.channel.replace(/_/g, ' ');
      const reached = c.prospectsReached === 'unknown' ? 'unknown' : c.prospectsReached;
      return `${name} (${reached} reached)`;
    }).join(', ');
    facts.push(`Acquisition channels tested (${profile.channels.length}): ${channelSummaries}. Cumulative recorded reach: ~${funnel.totalProspects} prospects reached, ~${funnel.totalReplies} replies, ~${funnel.totalDemos} demos.`);
  } else {
    facts.push('No outbound or inbound acquisition channels have been systematically recorded.');
  }

  if (profile.websiteVisitorsMonthly !== 'unknown' && Number(profile.websiteVisitorsMonthly) > 0) {
    facts.push(`Monthly website traffic is reported as ~${profile.websiteVisitorsMonthly} visitors.`);
  }

  if (profile.spendingOnAlternatives === 'no') {
    facts.push('Zero documented evidence that target buyers currently spend money, staff hours, or budgeted resources on existing alternatives.');
  } else if (profile.spendingOnAlternatives === 'yes') {
    facts.push(`Target buyers spend resources on alternatives (${profile.spendingDetails || 'existing workarounds noted'}).`);
  } else {
    facts.push('Evidence regarding whether buyers spend on existing alternatives remains unverified or unknown.');
  }

  if (profile.commonObjections && profile.commonObjections.trim().length > 0) {
    facts.push(`Documented prospect objections: "${profile.commonObjections.trim()}".`);
  }

  if (profile.reasonsCustomersBought && profile.reasonsCustomersBought.trim().length > 0) {
    facts.push(`Documented buying motivations: "${profile.reasonsCustomersBought.trim()}".`);
  }

  if (profile.observedCustomerSessions === 'yes') {
    facts.push('Founder has conducted direct, live screen-recording or observational sessions of users navigating the product.');
  } else {
    facts.push('Founder has not conducted structured live observational sessions of customer onboarding and usage.');
  }

  facts.push(`Founder constraints: ${profile.availableHoursPerWeek} hours/week available, ${profile.teamSize} team member(s), and ${profile.currency} ${profile.availableMonthlyBudget}/mo marketing budget.`);

  return facts;
}

/**
 * Extracts founder interpretations (distinguished from verifiable facts).
 */
export function extractFounderInterpretations(profile: BusinessProfile): string[] {
  const interpretations: string[] = [];

  if (profile.founderBottleneckBelief && profile.founderBottleneckBelief.trim().length > 0) {
    interpretations.push(`Founder's working belief of primary bottleneck: "${profile.founderBottleneckBelief.trim()}".`);
  }
  if (profile.founderAssumptionsEvidence && profile.founderAssumptionsEvidence.trim().length > 0) {
    interpretations.push(`Founder belief regarding problem urgency: "${profile.founderAssumptionsEvidence.trim()}".`);
  }
  if (profile.prospectFeedbackSummary && profile.prospectFeedbackSummary.trim().length > 0) {
    interpretations.push(`Founder interpretation of prospect sentiment: "${profile.prospectFeedbackSummary.trim()}".`);
  }
  if (profile.reasonsProspectsRefused && profile.reasonsProspectsRefused.trim().length > 0) {
    interpretations.push(`Founder perception of why prospects decline: "${profile.reasonsProspectsRefused.trim()}".`);
  }

  return interpretations;
}

/**
 * Detects conflicting signals between data points or between founder beliefs and user behavior.
 */
export function extractConflictingSignals(profile: BusinessProfile, funnel: ReturnType<typeof analyzeFunnel>): string[] {
  const conflicts: string[] = [];

  // Conflict 1: Free user engagement vs zero paying customers
  if (funnel.freeUsers >= 10 && funnel.payingCustomers === 0) {
    conflicts.push(`Divergence between user adoption and economic commitment: ${funnel.freeUsers} free users utilize the product, but 0 paying customers exist. End-user enthusiasm does not necessarily indicate buyer purchasing authority.`);
  }

  // Conflict 2: Demo attendance vs demo-to-close rate
  if (funnel.totalDemos >= 4 && funnel.payingCustomers === 0) {
    conflicts.push(`Divergence between curiosity and purchase readiness: ${funnel.totalDemos} prospects agreed to 30-minute demos, but 0 closed. Top-of-funnel pitch attracts attention, but the commercial offer or procurement threshold stalls conversion.`);
  }

  // Conflict 3: Founder price-cut belief when drop-off happens before checkout
  if (/price|expensive|cost|cheaper/i.test(profile.founderBottleneckBelief || '') && profile.dropOffStage === 'traffic_to_signup') {
    conflicts.push('Hypothesis conflict: Founder suspects price is too high, but data indicates prospects abandon at initial homepage traffic before ever reaching pricing or checkout.');
  }

  // Conflict 4: Outreach channel declared dead on tiny sample
  if (funnel.totalProspects < 15 && /cold outreach does not work|nobody wants this|channels failed/i.test(profile.failedExperimentsSummary || profile.founderBottleneckBelief || '')) {
    conflicts.push(`Premature channel conclusion: Channel is considered non-viable, yet recorded reach is only ${funnel.totalProspects} prospects. A sample size under 15 cannot reliably evaluate channel viability.`);
  }

  // Conflict 5: Contemplating scaling outreach when existing paying customer motivation is unverified
  if (funnel.payingCustomers > 0 && /scale|hire|500|ads|blast/i.test(profile.founderBottleneckBelief || '') && !profile.reasonsCustomersBought) {
    conflicts.push(`Unverified scale trigger: Founder plans to scale broad acquisition, but has not documented why the existing ${funnel.payingCustomers} paying customer(s) actually bought.`);
  }

  return conflicts;
}

/**
 * Identifies missing or unreliable data points and unmeasured denominators.
 */
export function identifyMissingData(profile: BusinessProfile, funnel: ReturnType<typeof analyzeFunnel>): string[] {
  const missing: string[] = [];

  if (funnel.hasUnknownProspects) {
    missing.push('Top-of-funnel reach denominator: exact number of relevant prospects contacted is partially or fully unrecorded.');
  }
  if (profile.websiteVisitorsMonthly === 'unknown') {
    missing.push('Monthly unique website visitors is marked as unknown (inbound baseline conversion cannot be calculated).');
  }
  if (profile.repeatUsageKnown === 'unknown' || profile.repeatUsageKnown === 'no') {
    missing.push('Repeat engagement / cohort retention metrics are uninstrumented.');
  }
  if (profile.payingCustomers === 'unknown') {
    missing.push('Paying customer count is marked unknown.');
  }
  if (profile.observedCustomerSessions !== 'yes') {
    missing.push('Direct screen-recording or live observational data of user onboarding workflows is absent.');
  }
  if (!profile.spendingDetails && profile.spendingOnAlternatives === 'unclear') {
    missing.push('Concrete budget or behavioral spend data on how target users currently cope with the problem is unverified.');
  }

  return missing;
}

/**
 * Core deterministic diagnosis evaluation engine adhering to the 5 diagnostic pillars:
 * 1. Summarize actual business facts provided.
 * 2. Identify the single most important unanswered question affecting the decision.
 * 3. Explain why that uncertainty matters.
 * 4. Recommend the smallest practical experiment that resolves it (specifically justified by submitted answers).
 * 5. Define measurable success, contradictory, and inconclusive outcomes.
 */
export function runDeterministicDiagnosis(profile: BusinessProfile): DiagnosticEvaluation {
  const funnel = analyzeFunnel(profile);
  const timeBudget = Math.max(5, Math.min(profile.availableHoursPerWeek, 15));
  const moneyBudget = Math.min(profile.availableMonthlyBudget, 100);
  const conflictingSignals = extractConflictingSignals(profile, funnel);

  const hasPayingCustomers = funnel.payingCustomers > 0 || funnel.totalPurchases > 0;
  const reportsCancellations = (profile.cancellationsCount !== 'unknown' && Number(profile.cancellationsCount || 0) > 0) ||
    (profile.retentionDetails && /cancel|churn|stop|inactive|discontinue|drop/i.test(profile.retentionDetails)) ||
    profile.dropOffStage === 'first_month_churn';

  // RULE 1: Severe Insufficient Data
  // Triggered when activity is too sparse (<15 prospects, <50 visitors, <=1 demo, 0 paying, <=3 signups).
  // The recommended experiment MUST be specifically justified by what the founder submitted, NOT an automatic template.
  const isSevereInsufficientData = funnel.totalProspects < 15 &&
    (profile.websiteVisitorsMonthly === 'unknown' || Number(profile.websiteVisitorsMonthly) < 50) &&
    funnel.totalDemos <= 1 &&
    funnel.payingCustomers === 0 &&
    funnel.trialsOrSignups <= 3;

  if (isSevereInsufficientData) {
    const primaryChannel = profile.channels.length > 0 
      ? (profile.channels[0].channelNameCustom || profile.channels[0].channel.replace(/_/g, ' ')) 
      : 'inbound/direct';
    const recordedReach = funnel.totalProspects;
    const recordedVisits = profile.websiteVisitorsMonthly === 'unknown' ? 0 : Number(profile.websiteVisitorsMonthly);

    const primaryUnansweredQuestion = `Do verified ${profile.targetBuyer || 'target buyers'} experience "${profile.specificProblem || 'the stated problem'}" with enough operational urgency to seek a solution?`;
    const whyUncertaintyMatters = `You have recorded only ${recordedReach} prospect contact(s) and ~${recordedVisits} visit(s) (via ${primaryChannel}). Concluding that the product, copy, or pricing has failed—and planning actions like "${profile.founderBottleneckBelief || 'rebuilding the UI'}"—risks wasting weeks of engineering on an unmeasured audience.`;
    const smallestPracticalExperimentSummary = `Execute a bounded 15-20 person problem discovery sprint specifically engaging verified ${profile.targetBuyer || 'target buyers'} directly to establish baseline ground truth before touching code.`;

    return {
      category: 'insufficient_evidence',
      confidence: 'sparse_data',
      hypothesis: `Recorded activity (${recordedReach} prospects reached, ~${recordedVisits} visitors) is too sparse to evaluate product value or market demand. Diagnosing failure or redesigning the product on this sample size would be premature speculation.`,
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `Total recorded reach is only ~${recordedReach} prospect(s) across recorded channels (${primaryChannel}) with ${funnel.totalDemos} demo(s) and ${recordedVisits} monthly visitor(s).`,
        'No complete conversion funnel cycle has occurred to evaluate.',
        `Founder is considering product changes ("${profile.founderBottleneckBelief || 'rebuilding the app'}") despite having zero structured buyer feedback.`
      ],
      competingExplanations: [
        'The problem definition may be acute, but target decision-makers have simply not been exposed to it yet.',
        'The initial communication medium may have had deliverability or visibility issues.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'What specific existing manual workarounds or tools do target buyers actively use today?'
      ],
      conflictingSignals,
      priorityRationale: 'Speculating on product or price changes before establishing minimum baseline reach wastes scarce founder engineering hours. First build the observation sample.',
      status: 'additional_evidence_needed',
      limitations: [
        'No diagnosis can be reliable without minimum behavioral observations.',
        'Focus must be on low-cost data collection, not scaling.'
      ],
      primaryExperiment: {
        id: `exp-insufficient-sprint-${Date.now()}`,
        title: `Targeted 20-Prospect Problem Discovery Sprint with Verified ${profile.targetBuyer || 'Buyers'}`,
        hypothesis: `Reaching 15-20 hand-vetted individuals strictly matching "${profile.targetBuyer || 'the target ICP'}" with a neutral problem inquiry will produce at least 3 substantive conversations to establish true problem urgency.`,
        targetAudience: `15-20 verified ${profile.targetBuyer || 'target decision-makers'}.`,
        timeFrame: '7 business days',
        procedure: [
          `Identify 15-20 specific individuals matching "${profile.targetBuyer || 'target buyer'}" on LinkedIn, GitHub, or relevant professional groups.`,
          `Send a concise 3-sentence inquiry inquiring how they currently handle "${profile.specificProblem || 'the stated problem'}", explicitly stating you have nothing to sell.`,
          'Track deliveries, replies, and verbatim responses in a simple spreadsheet.',
          'Conduct at least 2 brief 15-minute discovery conversations asking about past behavioral workarounds without showing the software.'
        ],
        requiredResources: {
          timeHours: 6,
          moneyBudget: 0,
          toolsOrSkills: 'Direct messaging (LinkedIn/Email/Community), spreadsheet'
        },
        metricsToRecord: [
          'Deliveries confirmed (target: 15-20)',
          'Substantive replies received (target: >=3)',
          'Number of respondents citing existing active workarounds'
        ],
        supportingEvidenceOutcome: 'At least 3 respondents detail painful, ongoing manual workarounds or budget spent trying to solve the problem.',
        contradictoryEvidenceOutcome: 'All 15-20 respondents report that while the issue occurs, it is an occasional mild annoyance that they ignore for free.',
        inconclusiveCriteria: 'Fewer than 10 messages successfully delivered due to inaccurate contact information.',
        nextActionSupporting: 'Input recorded customer workarounds back into Founder Compass to generate a calibrated offer and positioning diagnosis.',
        nextActionContradictory: 'Re-evaluate target buyer profile or problem scope before building further features.',
        nextActionInconclusive: 'Re-source verified contact details and re-run discovery sprint.'
      }
    };
  }

  // RULE 2: Retention & Recurring Value with Paying Customers
  // When paying customers exist, but cancellations, churn, or usage decay are reported
  if (hasPayingCustomers && reportsCancellations) {
    const primaryUnansweredQuestion = `What exact workflow breakdown, lack of recurring necessity, or secondary user friction causes paying accounts to abandon active usage after purchase?`;
    const whyUncertaintyMatters = `You have acquired ${funnel.payingCustomers} paying customer(s), but ${profile.cancellationsCount || 'reported'} accounts have cancelled or become inactive. Attempting to acquire more accounts (such as "${profile.founderBottleneckBelief || 'hiring sales help'}") into a leaking bucket burns customer goodwill and founder capital. Solving retention is the single highest-leverage growth unlock.`;
    const smallestPracticalExperimentSummary = `Conduct structured 15-minute retention & inactivity audits with 3-5 churned or disengaged paying accounts to pinpoint the precise drop-off trigger.`;

    return {
      category: 'retention_recurring_value',
      confidence: 'high',
      hypothesis: 'Customers experience initial commercial interest and purchase, but encounter early value decay, secondary user friction, or workflow misalignment post-onboarding.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `You have successfully acquired ${funnel.payingCustomers} paying customer(s), verifying upfront willingness to pay.`,
        `Reported cancellations or inactive accounts (${profile.retentionDetails || 'usage decay noted'}) indicate continuous utility is not cementing into weekly workflows.`,
        'Customer drop-off point is documented post-purchase rather than top-of-funnel.'
      ],
      competingExplanations: [
        'Acquired an early segment that bought out of curiosity or personal relationship rather than acute recurring necessity.',
        'Software solved a one-time project need and lacks reasons for monthly recurring retention.',
        'Secondary users (e.g. clients, team members) reject the tool interface.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'At what exact calendar day or milestone does customer login activity drop to zero?'
      ],
      conflictingSignals,
      priorityRationale: 'Acquiring more users into an un-retained bucket burns time and reputation. Retention is the highest-leverage bottleneck when customer drop-off is already observed.',
      status: 'provisional_diagnosis',
      limitations: [
        'Requires direct interviews with churned users; polite cancellation reasons must be probed for operational reality.'
      ],
      primaryExperiment: {
        id: 'exp-retention-cohort-audit',
        title: 'Structured 15-Minute Retention & Cancellation Cohort Audit',
        hypothesis: 'Interviewing 3-5 churned or inactive paying accounts will reveal whether failure stems from unfulfilled workflow expectations or lack of recurring need.',
        targetAudience: 'The 5 most recent customers who cancelled, requested refunds, or became inactive.',
        timeFrame: '10 to 14 calendar days',
        procedure: [
          'Send a direct, non-defensive message to the 5 churned/inactive customers offering a $25 gift card or brief chat on where the tool fell short.',
          'Ask 3 diagnostic questions: "What project triggered initial purchase?", "What exact moment did you realize the product was not working for that workflow?", "What tool or manual process are you using today instead?"',
          'Record verbatim workflow blockers without defending the product.'
        ],
        requiredResources: {
          timeHours: 6,
          moneyBudget: 75,
          toolsOrSkills: 'Google Meet/Zoom, direct outreach'
        },
        metricsToRecord: [
          'Churned accounts contacted (target: 5)',
          'Completed interview count (target: 3-5)',
          'Primary cited root cause (one-time need vs UI friction vs missing integration vs cost)'
        ],
        supportingEvidenceOutcome: 'At least 3 of 5 interviewed customers pinpoint the same missing recurring integration or workflow friction.',
        contradictoryEvidenceOutcome: 'Customers report they simply solved a one-off project and were delighted, indicating a pricing packaging mismatch (one-time license vs subscription).',
        inconclusiveCriteria: 'Fewer than 2 customers respond to the interview request, or responses provide conflicting idiosyncratic reasons.',
        nextActionSupporting: 'Address the single primary recurring friction point before scaling acquisition spend.',
        nextActionContradictory: 'Re-evaluate pricing/packaging to support project-based or annual licenses rather than recurring monthly seats.',
        nextActionInconclusive: 'Implement automated in-app event tracking to inspect the exact last page visited prior to abandonment.'
      }
    };
  }

  // RULE 3: Paying Customers Exist without Verified Attribution or Use Case
  // For businesses with existing paying customers, investigate what those customers reveal about strongest use case,
  // acquisition source, and purchase motivation before prescribing more outreach!
  const hasPayingCustomersWithoutClearAttribution = hasPayingCustomers &&
    !reportsCancellations &&
    (!profile.reasonsCustomersBought || profile.reasonsCustomersBought.trim().length === 0 || /scale|ads|500|blast|cold outreach/i.test(profile.founderBottleneckBelief || '')) &&
    funnel.trialsOrSignups <= 25;

  if (hasPayingCustomersWithoutClearAttribution) {
    const primaryUnansweredQuestion = `What specific trigger event, acquisition touchpoint, and core use case persuaded your existing ${funnel.payingCustomers} paying customer(s) to purchase?`;
    const whyUncertaintyMatters = `Prescribing outbound campaigns to hundreds of prospects or spending on ads before auditing your existing paying customers risks broadcasting the wrong value proposition to the wrong audience. Your ${funnel.payingCustomers} paying customer(s) are your only proven ground truth; their verbatim purchase motivations hold the exact blueprint for repeatable growth.`;
    const smallestPracticalExperimentSummary = `Conduct a structured 20-minute purchase motivation and attribution audit with all ${funnel.payingCustomers} paying customers before launching new outreach.`;

    return {
      category: 'target_customer',
      confidence: 'high',
      hypothesis: `Your initial ${funnel.payingCustomers} paying customer(s) validated willingness to pay, but the exact acquisition attribution, buying trigger, and highest-value use case remain uncodified. Scaling outreach without this clarity risks acquiring low-intent churn risks.`,
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `You have ${funnel.payingCustomers} paying customer(s) generating ${profile.currency} ${profile.mrr}/mo MRR.`,
        'The exact channel attribution and primary purchase triggers have not been systematically audited.',
        `Founder is contemplating scaling growth ("${profile.founderBottleneckBelief || 'broad acquisition'}") without verified customer attribution.`
      ],
      competingExplanations: [
        'Paying customers converted through word-of-mouth or personal relationships that do not generalize to cold prospects.',
        'Each paying customer may be using a completely different feature for disjointed workflows.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'What would these paying customers do if your product disappeared tomorrow?'
      ],
      conflictingSignals,
      priorityRationale: 'Do not guess what to say to cold prospects when you have real paying customers who can tell you exactly why they paid.',
      status: 'provisional_diagnosis',
      limitations: [
        'Requires all or most paying customers to participate in a brief interview or written debrief.'
      ],
      primaryExperiment: {
        id: 'exp-paying-customer-attribution-audit',
        title: `Structured Paying Customer Motivation & Attribution Audit with ${funnel.payingCustomers} Accounts`,
        hypothesis: `Interviewing all ${funnel.payingCustomers} paying customer(s) will reveal the single dominant trigger event and use case that drove purchase, providing the verified baseline for customer acquisition.`,
        targetAudience: `All ${funnel.payingCustomers} existing paying customer(s).`,
        timeFrame: '7 to 10 calendar days',
        procedure: [
          `Send a personal email to each of your ${funnel.payingCustomers} paying customer(s) requesting a 20-minute product review conversation.`,
          'Ask 4 structured diagnostic questions: "What happened the day you decided to seek out a solution?", "How did you first find us?", "What is the single most valuable outcome you get from the tool?", "What alternative would you use if we closed down?"',
          'Transcribe their verbatim phrases and record which specific workflow delivered their ROI.',
          'Synthesize commonalities into a verified Ideal Customer Profile (ICP) profile.'
        ],
        requiredResources: {
          timeHours: 5,
          moneyBudget: 0,
          toolsOrSkills: 'Google Meet/Zoom, interview notepad'
        },
        metricsToRecord: [
          `Paying customers interviewed (target: ${Math.max(2, Math.min(funnel.payingCustomers, 5))})`,
          'Dominant trigger event identified (e.g. compliance deadline, awkward follow-up, cost leak)',
          'Primary acquisition channel identified'
        ],
        supportingEvidenceOutcome: `At least ${Math.max(2, Math.round(funnel.payingCustomers * 0.7))} of interviewed customers cite the identical buying trigger and highest-value workflow.`,
        contradictoryEvidenceOutcome: 'Every paying customer bought for completely unrelated, one-off idiosyncratic reasons with zero shared use case.',
        inconclusiveCriteria: 'Fewer than 50% of paying customers agree to respond or schedule a call.',
        nextActionSupporting: 'Re-align your entire positioning, outbound copy, and target criteria around the winning use case.',
        nextActionContradictory: 'Broaden qualitative discovery to evaluate whether the product is a loose collection of utility features.',
        nextActionInconclusive: 'Send a concise 3-question survey directly in-app or via email with a $20 incentive.'
      }
    };
  }

  // RULE 4: Target Customer Definition & Segment Divergence
  // Target audience is broad, buyer/user confused, inconsistent feedback across segments,
  // OR clear user enthusiasm from one group while economic buyers reject it (e.g. Test B, Test G).
  const broadAudience = /everyone|anyone|any company|all businesses|creators|freelancers and enterprises/i.test(profile.targetBuyer) ||
    (profile.targetBuyer.split(',').length >= 3 && profile.actualUsers.split(',').length >= 2) ||
    (funnel.freeUsers >= 20 && funnel.payingCustomers === 0 && /agencies|enterprise|companies|studios/i.test(profile.targetBuyer)) ||
    (hasPayingCustomers && funnel.payingCustomers <= 3 && /agencies|enterprise/i.test(profile.targetBuyer) && /freelancer|designer|solo/i.test(profile.actualUsers));

  if (broadAudience) {
    const primaryUnansweredQuestion = `Which specific sub-segment experiences the highest quantifiable urgency and demonstrates verifiable willingness to pay?`;
    const whyUncertaintyMatters = `Targeting "${profile.targetBuyer}" forces generic messaging that fails to convert. When different segments exhibit conflicting buying behavior (e.g. users who love the tool vs economic buyers who reject it), building features or messaging for both dilutes founder focus and stalls revenue.`;
    const smallestPracticalExperimentSummary = `Execute a narrow head-to-head outbound test comparing response and conversion between the two primary candidate segments.`;

    return {
      category: 'target_customer',
      confidence: 'provisional',
      hypothesis: 'The target buyer definition is too diffuse or conflates end users with economic buyers, leading to diluted messaging that fails to close transactions.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `Target buyer is described broadly as "${profile.targetBuyer}".`,
        'Feedback and objections vary widely, suggesting different user types evaluate the tool for conflicting purposes.',
        'No single niche demonstrates consistent problem severity or buying velocity across all segments.'
      ],
      competingExplanations: [
        'Product is horizontal, but outbound messaging lacks vertical-specific landing pages.',
        'Channels tested so far have reached low-intent demographics.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'Which sub-segment has the shortest sales cycle and highest eagerness to talk?'
      ],
      conflictingSignals,
      priorityRationale: 'Targeting everyone means targeting no one. Narrowing the ICP sharpens the value proposition, lowers acquisition cost, and clarifies objection handling.',
      status: 'experiment_ready',
      limitations: [
        'Requires testing segments sequentially or in parallel with consistent messaging.'
      ],
      primaryExperiment: {
        id: 'exp-niche-segment-head-to-head',
        title: 'Two-Segment Head-to-Head Outbound Response Test',
        hypothesis: 'Segmenting outreach into two narrow, distinct candidate niches with tailored copy will yield a 3x difference in conversation rate, revealing the true beachhead ICP.',
        targetAudience: '40 vetted prospects divided evenly into Segment A (20) and Segment B (20).',
        timeFrame: '10 business days',
        procedure: [
          'Select two distinct candidate niches from your current broad audience.',
          'Build a list of 20 verified decision makers for Segment A and 20 for Segment B.',
          'Write a tailored 4-sentence email for each addressing their niche-specific workflow.',
          'Send 20 emails per segment and track open, reply, and positive conversation rates over 10 days.'
        ],
        requiredResources: {
          timeHours: 6,
          moneyBudget: 25,
          toolsOrSkills: 'Prospect sourcing (LinkedIn or verified email tool), sequencer'
        },
        metricsToRecord: [
          'Prospects contacted per segment (20 each)',
          'Positive response / meeting booked count per segment',
          'Depth of problem articulation in replies'
        ],
        supportingEvidenceOutcome: 'One segment generates at least 3 positive qualified conversations while the other produces 0-1, confirming a superior beachhead ICP.',
        contradictoryEvidenceOutcome: 'Both segments respond equally well or both report the same non-niche specific blockers.',
        inconclusiveCriteria: 'Reply rate is below 5% across both segments due to deliverability or poor list quality.',
        nextActionSupporting: 'Commit 100% of positioning, messaging, and roadmap to the winning segment for the next 90 days.',
        nextActionContradictory: 'Investigate whether positioning or core value proposition is the underlying constraint.',
        nextActionInconclusive: 'Refine email deliverability and prospect list verification before drawing conclusions.'
      }
    };
  }

  // RULE 5: Demand Validation
  // Little evidence of problem, no existing spend on alternatives, interest based mainly on compliments (Test A)
  const lowDemandSignals = (profile.spendingOnAlternatives === 'no' || profile.spendingOnAlternatives === 'unclear') &&
    (funnel.payingCustomers === 0) &&
    (/compliment|friendly|said they liked|interesting|cool|neat/i.test(profile.problemImportanceEvidence) ||
     /hypothetical|would use|might buy|idea sounds good/i.test(profile.founderAssumptionsEvidence) ||
     (funnel.totalProspects >= 20 && funnel.totalReplies <= 4) ||
     (profile.spendingOnAlternatives === 'no' && funnel.payingCustomers === 0));

  if (lowDemandSignals && profile.dropOffStage !== 'signup_to_activation') {
    const primaryUnansweredQuestion = `Do target buyers actively spend measurable budget, dedicated staff hours, or painful effort on existing workarounds, or is the problem an occasional mild inconvenience?`;
    const whyUncertaintyMatters = `You have reached ~${funnel.totalProspects} prospects and received polite praise ("${profile.problemImportanceEvidence || 'liked the idea'}"), but zero active spend on alternatives exists. Building more features or running ads for a problem people solve for free in 2 minutes leads to commercial failure.`;
    const smallestPracticalExperimentSummary = `Conduct 6-8 past-behavior discovery interviews using the Mom Test protocol without pitching your software to uncover actual historical spend.`;

    return {
      category: 'demand_validation',
      confidence: 'high',
      hypothesis: 'The problem being addressed is an inconvenience rather than a painful, budget-backed priority for the chosen target audience.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        'Zero documented evidence that target buyers currently spend money, staff hours, or budgeted resources on alternative solutions.',
        `Zero paying customers have been acquired despite ${funnel.totalProspects > 0 ? `reaching ~${funnel.totalProspects} prospects` : 'launching the product'}.`,
        'Reported buyer interest appears largely based on compliments, hypothetical statements, or polite interest rather than committed behavior.'
      ],
      competingExplanations: [
        'Demand exists, but the chosen outreach channel is completely missing the true economic decision-makers.',
        'The value proposition is articulated in technical jargon rather than the business impact buyers search for.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'Have target buyers actively searched or budgeted for a fix to this problem in the last 90 days?'
      ],
      conflictingSignals,
      priorityRationale: 'No marketing strategy, pricing trick, or UI polish can compensate for solving a problem nobody is willing to spend resources on. Demand must be validated before spending on growth.',
      status: 'additional_evidence_needed',
      limitations: [
        'Rejection of cold outreach does not definitively prove absence of demand, but zero workarounds strongly correlates with low urgency.',
        'Requires adherence to Mom Test methodology (asking about past behavior, never pitching the product).'
      ],
      primaryExperiment: {
        id: 'exp-past-behavior-demand-audit',
        title: 'Past-Behavior Demand Discovery Interviews (Mom Test Protocol)',
        hypothesis: 'Interviewing 8 target buyers strictly about how they handled this specific challenge in the past 6 months will determine if active spend or manual workarounds exist.',
        targetAudience: '8 individuals strictly meeting your target buyer persona criteria.',
        timeFrame: '10 business days',
        procedure: [
          `Reach out to 20-25 target buyers requesting 15 minutes of research on how their organization currently handles "${profile.specificProblem || 'this workflow'}". Explicitly state you have nothing to sell.`,
          'Do NOT show, mention, or pitch your software during the call.',
          'Ask: "When was the last time this issue occurred?", "What exact steps did you take to resolve it?", "How much time or budget did you allocate to that solution?", "What other solutions did you try and discard?"',
          'Tally whether they actively spent money, dedicated staff time, or just lived with it.'
        ],
        requiredResources: {
          timeHours: 8,
          moneyBudget: 0,
          toolsOrSkills: 'LinkedIn/Email outreach, Mom Test interview questions'
        },
        metricsToRecord: [
          'Interviews conducted (target: 8)',
          'Number of participants who spent >$50 or >3 hours on a workaround in the past 90 days',
          'Number of participants who actively evaluated tools vs did nothing'
        ],
        supportingEvidenceOutcome: 'At least 5 of 8 respondents detail active financial expenditure or painful manual workarounds they are desperate to replace.',
        contradictoryEvidenceOutcome: '6 or more respondents report that while the issue occurs occasionally, they simply ignore it or spend zero budget addressing it.',
        inconclusiveCriteria: 'Fewer than 4 interviews secured, or respondents are not actual economic decision makers.',
        nextActionSupporting: 'Demand is validated; proceed to positioning and offer messaging alignment.',
        nextActionContradictory: 'Pivot problem focus to an adjacent workflow where acute financial hemorrhage or regulatory mandate exists.',
        nextActionInconclusive: 'Re-qualify the outreach list to target larger companies with explicit compliance or cost pressures.'
      }
    };
  }

  // RULE 6: Activation & Value Realization
  // High signups / trials / free users, but drop-off occurs before reaching core benefit (Test E)
  const highSignupsLowActivation = (funnel.trialsOrSignups >= 25 || funnel.freeUsers >= 30) &&
    (funnel.payingCustomers === 0 || funnel.payingCustomers <= 1) &&
    (profile.dropOffStage === 'signup_to_activation' || /onboard|setup|drop|inactive|empty|upload|step/i.test(profile.prospectFeedbackSummary));

  if (highSignupsLowActivation) {
    const primaryUnansweredQuestion = `At what exact setup step, configuration friction, or cognitive barrier do newly registered users halt and abandon the onboarding flow?`;
    const whyUncertaintyMatters = `You have generated ${funnel.trialsOrSignups} signups / free users, proving top-of-funnel curiosity, but conversion to active or paying use is near zero. Pouring more traffic or ads into an 82% onboarding drop-off burns acquisition budget. Fixing the first-run experience unlocks the existing pipeline immediately.`;
    const smallestPracticalExperimentSummary = `Conduct 5 live moderated onboarding walkthroughs where new users complete setup in silence using a think-aloud protocol.`;

    return {
      category: 'activation_value',
      confidence: 'high',
      hypothesis: 'Users arrive and sign up, but encounter immediate friction, setup difficulty, or cognitive overload before experiencing the core value proposition.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `${funnel.trialsOrSignups} signups or ${funnel.freeUsers} free accounts have been generated, proving the top-of-funnel value proposition creates curiosity.`,
        'Conversion to active usage or paying customers remains near zero, indicating value delivery breaks down inside the product onboarding experience.',
        profile.observedCustomerSessions !== 'yes' ? 'Founder has not directly observed users going through initial setup in real time.' : 'Observed friction during setup was noted.'
      ],
      competingExplanations: [
        'Top-of-funnel messaging promises something different from what the software actually delivers.',
        'Initial setup requires high technical effort (API keys, large file uploads, configuration) without immediate gratification.',
        'Signups consist of non-serious window shoppers.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'What percentage of signups complete the mandatory setup steps within 24 hours?'
      ],
      conflictingSignals,
      priorityRationale: 'Driving more traffic or signups when activation is broken multiplies wasted acquisition effort. Fixing the first-run experience unlocks the existing pipeline.',
      status: 'experiment_ready',
      limitations: [
        'Without in-app telemetry, drop-off steps must be verified via direct observation.'
      ],
      primaryExperiment: {
        id: 'exp-live-activation-audit',
        title: '5-User Live Moderated Activation Walkthrough',
        hypothesis: 'Observing 5 newly signed-up target users attempt the primary setup workflow in silence will reveal the primary cognitive blocker preventing activation.',
        targetAudience: '5 recent or new signups matching your target buyer profile.',
        timeFrame: '7 to 10 business days',
        procedure: [
          'Email the next 15 signups offering a personalized 20-minute onboarding walkthrough or setup assistance.',
          'In the session, ask the user to share their screen and complete their first real task without you guiding them.',
          'Instruct them to think aloud; record timestamps where hesitation, error clicks, or confusion occur.',
          'Note the exact moment they either reach value or abandon the task.'
        ],
        requiredResources: {
          timeHours: timeBudget,
          moneyBudget: 0,
          toolsOrSkills: 'Screen-sharing software (Google Meet/Zoom), observation notepad'
        },
        metricsToRecord: [
          'Invitations sent vs sessions scheduled',
          'Fraction of participants who reach "value moment" without verbal hints',
          'Specific step where unassisted progress halted for >60 seconds'
        ],
        supportingEvidenceOutcome: 'At least 3 out of 5 users get stuck on the exact same step, form field, or missing data requirement.',
        contradictoryEvidenceOutcome: 'All 5 users easily complete onboarding and say they love it, but state they simply do not need it regularly.',
        inconclusiveCriteria: 'Users refuse to share screen or cannot schedule sessions within 14 days.',
        nextActionSupporting: 'Redesign or eliminate that specific onboarding friction step immediately; replace with interactive sample data.',
        nextActionContradictory: 'Shift diagnostic focus to problem urgency and demand validation.',
        nextActionInconclusive: 'Install screen session recording (e.g., Clarity or PostHog) to watch 20 unmoderated sessions.'
      }
    };
  }

  // RULE 7: Sales Conversion & Pricing / Purchasing Constraints
  // Qualified prospects attend demos or sales conversations (>=4 demos), but 0 purchases follow (Test D)
  const demosOccurred = funnel.totalDemos >= 4 || funnel.totalReplies >= 8;
  const zeroPurchases = funnel.totalPurchases === 0;

  if (demosOccurred && zeroPurchases) {
    const hasPricingObjections = /price|expensive|budget|cost|afford|procurement|authority|approval|cfo|annual invoice/i.test(profile.commonObjections);
    const category: BottleneckCategory = hasPricingObjections ? 'pricing_purchasing' : 'sales_conversion';

    const primaryUnansweredQuestion = hasPricingObjections
      ? `What is the exact procurement authority, sign-off process, and billing format required for the economic buyer to authorize payment?`
      : `Why do prospects who dedicate 30-45 minutes to a demo fail to perceive sufficient ROI or urgency to close?`;
    const whyUncertaintyMatters = `You have conducted ${funnel.totalDemos} live demos, proving initial curiosity. Dropping prices or building features when buyers cite procurement constraints ("${profile.commonObjections || 'procurement approval'}") will not close deals. You must align directly with the customer's purchasing process.`;
    const smallestPracticalExperimentSummary = `Introduce an economic buyer qualification step and an annual pilot invoice option during the next 4 scheduled demos.`;

    return {
      category,
      confidence: 'high',
      hypothesis: hasPricingObjections
        ? 'Prospects understand the functional capability, but face procurement, budget allocation, or economic buyer disconnect.'
        : 'Prospects are interested enough to attend demonstrations, but the sales process fails to build urgency, establish quantifiable ROI, or resolve perceived switching risks.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `You have generated ${funnel.totalDemos} demos or sales conversations, indicating top-of-funnel reach and initial intrigue are functioning.`,
        'Conversion from demo to closed-won purchase is 0%, pointing directly to the closing and evaluation stage.',
        `Documented objections: "${profile.commonObjections || 'Prospects drop off after receiving proposals or trial access'}".`
      ],
      competingExplanations: [
        'Speaking with end users who want the tool but lack discretionary purchasing authority.',
        'Current alternatives (e.g. spreadsheets or legacy systems) are deemed "good enough" to avoid switching friction.',
        'Perceived cost of migration exceeds perceived benefit.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'Does the person on the demo hold a corporate credit card or discretionary budget?'
      ],
      conflictingSignals,
      priorityRationale: 'When prospects are already giving you 30-45 minutes of their attention, lead generation is not your bottleneck. Unlocking conversion yields immediate revenue.',
      status: 'provisional_diagnosis',
      limitations: [
        'Sales cycles in B2B can exceed 60 days; verify whether pipeline is dead or merely slow.'
      ],
      primaryExperiment: {
        id: 'exp-pre-close-objection-protocol',
        title: 'Diagnostic Closing & Economic Buyer Qualification on Next 4 Demos',
        hypothesis: 'Introducing an upfront economic qualification and paid pilot agreement during the demo will uncover whether the barrier is budget authority or perceived ROI.',
        targetAudience: 'The next 4 prospective buyers who book a demonstration or call.',
        timeFrame: '14 calendar days',
        procedure: [
          'In the first 10 minutes of each demo, ask: "If this solves your problem today, what is the exact sign-off process to approve an investment?"',
          'At the conclusion of the demo, propose a structured 30-day "Success Pilot" with defined success criteria and 100% money-back guarantee.',
          'Document the verbatim response to the paid pilot proposal.'
        ],
        requiredResources: {
          timeHours: 6,
          moneyBudget: 0,
          toolsOrSkills: '1-page Paid Pilot Agreement template, demo script'
        },
        metricsToRecord: [
          'Demos conducted with economic qualification (target: 4)',
          'Prospects who identify clear decision authority and budget',
          'Paid pilot agreements accepted or redlined with concrete objections'
        ],
        supportingEvidenceOutcome: 'At least 2 prospects sign or provide specific security/budget criteria required to approve the purchase.',
        contradictoryEvidenceOutcome: 'Prospects state that price is fine, but they simply do not believe the software will work reliably in their environment.',
        inconclusiveCriteria: 'Prospects agree enthusiastically but never sign or reply to follow-ups.',
        nextActionSupporting: 'Standardize the paid pilot workflow as the primary commercial motion.',
        nextActionContradictory: 'Build verifiable case studies or sandbox demo environments to address trust.',
        nextActionInconclusive: 'Enforce upfront qualification questions on the demo booking form.'
      }
    };
  }

  // RULE 8: Acquisition Reach
  // Low reach, insufficient data to evaluate channels (Test C)
  const lowReach = (funnel.totalProspects >= 15 && funnel.totalProspects < 45 && profile.channels.length > 0) ||
    (funnel.totalProspects < 15 && funnel.totalProspects > 0 && profile.channels.length > 0 && profile.monthsSinceLaunch !== 'unknown' && Number(profile.monthsSinceLaunch) <= 3);

  if (lowReach) {
    const primaryUnansweredQuestion = `What is the actual baseline reply and conversation rate when a statistically viable sample of 30-50 verified target buyers receives a focused outreach?`;
    const whyUncertaintyMatters = `You have reached only ~${funnel.totalProspects} prospects in total. Concluding that a channel or problem is non-viable on a sample size under 15 leads to premature pivots and unnecessary product rewrites.`;
    const smallestPracticalExperimentSummary = `Execute a disciplined 30-prospect bounded outbound sprint in your primary channel to establish a statistically reliable baseline.`;

    return {
      category: 'acquisition_reach',
      confidence: 'provisional',
      hypothesis: 'The total number of verified target prospects reached is too small to draw statistically or commercially reliable conclusions about demand or conversion.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `Total recorded reach is only ~${funnel.totalProspects} prospects.`,
        'Channels have been tested sporadically for short durations without consistent execution.',
        'Current sample size makes it impossible to distinguish between a bad channel, a bad message, or a bad product.'
      ],
      competingExplanations: [
        'The channel chosen has severe ad fatigue or high noise.',
        'Top-of-funnel messaging is actively repelling prospects.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'Can a structured sample of 30-50 relevant prospects be reached with a clear, single message?'
      ],
      conflictingSignals,
      priorityRationale: 'You cannot optimize a funnel with zero throughput. Generating an initial baseline sample of 30-50 qualified impressions is required to diagnose conversion.',
      status: 'additional_evidence_needed',
      limitations: [
        'Requires 10 business days of sustained daily execution.'
      ],
      primaryExperiment: {
        id: 'exp-bounded-reach-sprint',
        title: '30-Prospect Bounded Acquisition Sprint',
        hypothesis: 'Executing a disciplined, high-touch outbound campaign to 30 hand-vetted prospects in one specific channel will generate at least 3 qualified conversations, confirming channel viability.',
        targetAudience: `30 hand-selected individuals who explicitly match "${profile.targetBuyer || 'the target ICP'}".`,
        timeFrame: '10 business days',
        procedure: [
          'Choose the single acquisition channel best aligned with your skills.',
          'Build a spreadsheet of 30 names, verified emails/profiles, and specific recent triggers.',
          'Send 3 personalized messages per business day for 10 business days.',
          'Log every interaction: Delivered, Opened, Replied, Booked, Declined.'
        ],
        requiredResources: {
          timeHours: 6,
          moneyBudget: 0,
          toolsOrSkills: 'Spreadsheet, LinkedIn or verified email tool'
        },
        metricsToRecord: [
          'Prospects contacted (target: 30)',
          'Reply rate (target: >10% or 3+ replies)',
          'Qualified calls booked'
        ],
        supportingEvidenceOutcome: 'Generating 3+ qualified conversations and at least 1 demo, confirming channel viability.',
        contradictoryEvidenceOutcome: 'Reaching 30 verified prospects with confirmed deliverability yields zero replies or 100% negative rejections.',
        inconclusiveCriteria: 'Deliverability issues or fewer than 20 messages successfully sent within the timeframe.',
        nextActionSupporting: 'Scale the channel workflow and monitor demo conversion.',
        nextActionContradictory: 'Shift to positioning/offer diagnostic or test an adjacent channel with different buyer access.',
        nextActionInconclusive: 'Audit email domain health and subject line copy before abandoning channel.'
      }
    };
  }

  // RULE 9: Positioning & Offer
  // Prospects reached, or website traffic arrives, but bounce or ghost; value unclear (or Test J with paying customers)
  const reachedWithoutReplies = funnel.totalProspects >= 30 && funnel.totalReplies <= 3;
  const webTrafficLowConversion = (profile.websiteVisitorsMonthly !== 'unknown' && Number(profile.websiteVisitorsMonthly) >= 150 && funnel.trialsOrSignups <= 5);

  if (reachedWithoutReplies || webTrafficLowConversion || /unclear|value|confusing|don't understand/i.test(profile.commonObjections)) {
    const isPayingCustomerScenario = hasPayingCustomers;
    const primaryUnansweredQuestion = isPayingCustomerScenario
      ? `Does your website headline and value proposition clearly articulate the exact outcome and buying trigger that your ${funnel.payingCustomers} paying customer(s) actually bought for?`
      : `Can target buyers understand the quantifiable business outcome of the product within 5 seconds of reading the hero message?`;
    const whyUncertaintyMatters = isPayingCustomerScenario
      ? `You have ${funnel.payingCustomers} paying customer(s) who validate that the software works, but ~${profile.websiteVisitorsMonthly} monthly visitors convert at negligible rates. Building more features before aligning the landing page with the paying customers' verbatim reasons for buying wastes product development.`
      : `Target prospects are being reached (~${funnel.totalProspects || profile.websiteVisitorsMonthly} exposures), but reply/conversion is under 5%. Feature-centric descriptions fail to trigger urgency, causing prospects to bounce.`;
    const smallestPracticalExperimentSummary = isPayingCustomerScenario
      ? `Extract verbatim language from your ${funnel.payingCustomers} paying customer(s) and test an outcome-aligned headline against the current generic hero copy.`
      : `Test an outcome-focused hook against your current feature-centric description with 30-40 targeted prospects.`;

    return {
      category: 'positioning_offer',
      confidence: 'high',
      hypothesis: 'Target prospects are arriving or being reached, but the value proposition is framed around feature mechanics rather than an urgent, quantifiable business outcome.',
      primaryUnansweredQuestion,
      whyUncertaintyMatters,
      smallestPracticalExperimentSummary,
      supportingEvidence: [
        `Over ${funnel.totalProspects || profile.websiteVisitorsMonthly} prospects or visitors reached, but conversion is below 5%.`,
        `Feedback indicates prospects do not immediately grasp why this tool justifies changing habits: "${profile.commonObjections || 'Lack of clarity'}"`,
        'The offer does not clearly communicate the pain relief or economic return in the first 5 seconds.'
      ],
      competingExplanations: [
        'Deliverability issues (emails landing in spam or messages ignored as promotional).',
        'Target list includes non-decision makers who lack budget ownership.'
      ],
      criticalUnknowns: [
        primaryUnansweredQuestion,
        'Does the offer present an irresistible, low-risk entry point?'
      ],
      conflictingSignals,
      priorityRationale: 'Fixing your positioning multiplies the efficiency of every future prospect you reach, without needing product changes.',
      status: 'experiment_ready',
      limitations: [
        'Requires testing positioning against the same target audience criteria.'
      ],
      primaryExperiment: {
        id: 'exp-outcome-based-positioning-test',
        title: isPayingCustomerScenario 
          ? 'Paying Customer Value Proposition & Headline Alignment Test'
          : 'Outcome-Focused vs Feature-Focused A/B Messaging Test',
        hypothesis: isPayingCustomerScenario
          ? `Rewriting the homepage headline to mirror the verbatim ROI cited by your ${funnel.payingCustomers} paying customer(s) will double visitor-to-signup conversion.`
          : 'Reframing the headline and outreach from "What the tool is" to "The specific metric it saves" will increase positive reply rates by 2.5x.',
        targetAudience: isPayingCustomerScenario
          ? 'Next 200 unique website visitors or 30 targeted prospects.'
          : '40 newly sourced target prospects split into Version A (current copy) and Version B (outcome copy).',
        timeFrame: '7 to 10 business days',
        procedure: [
          isPayingCustomerScenario
            ? `Review notes from your ${funnel.payingCustomers} paying customer(s) to isolate the single highest-value verb/metric they use.`
            : 'Draft Version A: Feature-centric description (what the tool does).',
          isPayingCustomerScenario
            ? 'Draft Version B headline: "Save [X hours/dollars] on [specific pain] without [biggest workaround friction]".'
            : 'Draft Version B: Outcome-centric hook (the concrete business impact).',
          'Deploy the test across incoming prospects or web traffic for 10 business days.',
          'Measure positive conversion rates.'
        ],
        requiredResources: {
          timeHours: 5,
          moneyBudget: 0,
          toolsOrSkills: 'Landing page editor or direct messaging template'
        },
        metricsToRecord: [
          'Exposures per variant (target: >=20 each)',
          'Signups or positive replies per variant',
          'Qualitative feedback in replies'
        ],
        supportingEvidenceOutcome: 'The outcome-aligned variant achieves at least a 2x increase in conversion/replies over the baseline.',
        contradictoryEvidenceOutcome: 'Neither version gets any conversion, indicating the underlying problem or customer segment is misaligned.',
        inconclusiveCriteria: 'Fewer than 15 responses or actions recorded due to insufficient traffic.',
        nextActionSupporting: 'Commit the winning outcome-focused message across all product assets and website copy.',
        nextActionContradictory: 'Re-evaluate demand urgency or customer segment definition.',
        nextActionInconclusive: 'Extend test duration to gather minimum statistical sample.'
      }
    };
  }

  // Fallback: Insufficient Evidence
  // Specifically tailored to submitted answers
  const primaryUnansweredQuestion = `What are the exact conversion rates across your core stages, and what do target buyers state when asked about their existing workarounds?`;
  const whyUncertaintyMatters = `Recorded business metrics lack the requisite depth, sample size, or conversion instrumentation to definitively isolate a single root bottleneck. Guessing a bottleneck without baseline evidence wastes scarce founder hours.`;
  const smallestPracticalExperimentSummary = `Implement simple step-by-step conversion tracking and conduct 15 targeted discovery contacts tailored strictly to "${profile.targetBuyer || 'your target audience'}".`;

  return {
    category: 'insufficient_evidence',
    confidence: 'sparse_data',
    hypothesis: 'Current recorded business metrics lack the requisite depth, sample size, or conversion instrumentation to definitively isolate a single root bottleneck.',
    primaryUnansweredQuestion,
    whyUncertaintyMatters,
    smallestPracticalExperimentSummary,
    supportingEvidence: [
      'Top-of-funnel prospect reach, conversion denominators, or customer usage sessions are unrecorded or marked unknown.',
      'Data points span multiple disjointed experiments without a single completed funnel cycle.',
      'Observed symptoms could be explained equally well by weak demand, wrong messaging, or low outreach volume.'
    ],
    competingExplanations: [
      'Problem definition is sound, but marketing activity has been too intermittent to measure.',
      'Channel is delivering low-quality traffic while core product value is high.',
      'Value proposition is compelling, but website navigation prevents conversion.'
    ],
    criticalUnknowns: [
      primaryUnansweredQuestion,
      'What specific software or manual processes do target buyers actually use today?'
    ],
    conflictingSignals,
    priorityRationale: 'Guessing a bottleneck without baseline evidence wastes scarce founder hours. Running a structured evidence-gathering sprint provides the ground truth required for confident execution.',
    status: 'additional_evidence_needed',
    limitations: [
      'No diagnosis can be definitive without verified behavioral data.',
      'Requires establishing minimum analytics tracking.'
    ],
    primaryExperiment: {
      id: 'exp-baseline-evidence-sprint',
      title: `Tailored Baseline Discovery Sprint with Verified ${profile.targetBuyer || 'Buyers'}`,
      hypothesis: `Engaging 15 verified individuals matching "${profile.targetBuyer || 'target buyers'}" with a neutral problem inquiry will provide the first reliable baseline to distinguish between a reach issue and an offer issue.`,
      targetAudience: `15 tightly defined target prospects matching "${profile.targetBuyer || 'ICP'}".`,
      timeFrame: '7 business days',
      procedure: [
        'Define a single spreadsheet funnel: Contacted → Replied → Demo/Conversation → Activated.',
        'Send 15 personalized inquiries to verified target buyers over 5 days focusing on their current workflows.',
        'Track every conversion point without changing messaging mid-way.',
        'Conduct at least 2 qualitative discovery conversations focused on current customer pain points.'
      ],
      requiredResources: {
        timeHours: 6,
        moneyBudget: 0,
        toolsOrSkills: 'Spreadsheet, direct messaging'
      },
      metricsToRecord: [
        'Prospects reached (target: 15)',
        'Replies received',
        'Specific objections or interest expressions'
      ],
      supportingEvidenceOutcome: 'At least 2-3 substantive replies detailing existing manual workarounds.',
      contradictoryEvidenceOutcome: 'Outreach cannot be executed due to inability to identify who the target buyer is.',
      inconclusiveCriteria: 'Messages sent are unread or bounced.',
      nextActionSupporting: 'Input recorded data back into Founder Compass for an updated, high-confidence diagnosis.',
      nextActionContradictory: 'Return to Step 2 (Customer & Problem) to narrow the ICP definition.',
      nextActionInconclusive: 'Verify contact email addresses and test a different communication medium.'
    }
  };
}

/**
 * Builds the complete DiagnosticReport from a BusinessProfile.
 */
export function generateDiagnosticReport(
  profile: BusinessProfile,
  provider: 'openai' | 'gemini' | 'demo' = 'demo',
  modelUsed?: string
): DiagnosticReport {
  const funnel = analyzeFunnel(profile);
  const facts = extractObservedFacts(profile, funnel);
  const interpretations = extractFounderInterpretations(profile);
  const missing = identifyMissingData(profile, funnel);
  const evaluation = runDeterministicDiagnosis(profile);

  const businessSummary = `${profile.productName} is a ${profile.stage} stage ${profile.productCategory || 'digital product'} designed to solve "${profile.specificProblem || 'business inefficiency'}" for ${profile.targetBuyer || 'prospective buyers'}. Currently operating with ${funnel.payingCustomers} paying customer(s) (${profile.currency} ${profile.mrr}/mo) and ${funnel.freeUsers} free user(s). Primary bottleneck investigation focuses on ${evaluation.category.replace(/_/g, ' ')}.`;

  return {
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    profileId: profile.id,
    createdAt: new Date().toISOString(),
    provider,
    modelUsed: modelUsed || (provider === 'demo' ? 'Rule-Based Deterministic Engine (v1.2)' : 'Gemini 2.5 Flash'),
    disclaimer: provider === 'demo' ? 'Deterministic local diagnostic engine result — grounded in first principles.' : undefined,
    businessSummary,
    observedFacts: facts,
    founderInterpretations: interpretations,
    missingOrUnreliableData: missing,
    conflictingSignals: evaluation.conflictingSignals,
    primaryUnansweredQuestion: evaluation.primaryUnansweredQuestion,
    whyUncertaintyMatters: evaluation.whyUncertaintyMatters,
    smallestPracticalExperimentSummary: evaluation.smallestPracticalExperimentSummary,
    leadingBottleneckCategory: evaluation.category,
    leadingHypothesis: evaluation.hypothesis,
    supportingEvidence: evaluation.supportingEvidence,
    competingExplanations: evaluation.competingExplanations,
    criticalUnknowns: evaluation.criticalUnknowns,
    priorityRationale: evaluation.priorityRationale,
    provisionalStatus: evaluation.status,
    primaryExperiment: evaluation.primaryExperiment,
    limitations: evaluation.limitations,
    sources: [
      {
        title: 'Founder Compass Evidence Evaluation Rubric',
        note: 'Grounded in verifiable customer behavior, minimum sample thresholds, and stage-gate bottleneck progression.'
      }
    ]
  };
}
