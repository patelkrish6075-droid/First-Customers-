import { SalesFunnelData, SalesDiagnosisReport } from '../types';

export function evaluateSalesFunnel(data: SalesFunnelData): SalesDiagnosisReport {
  const {
    prospectsContacted,
    repliesReceived,
    meetingsBooked,
    trialsOrDemosStarted,
    proposalsSent,
    customersAcquired,
    revenueGenerated,
    trackingPeriodWeeks
  } = data;

  // Calculate conversion rates with strict zero-division protection
  const replyRatePct = prospectsContacted > 0 
    ? Math.round((repliesReceived / prospectsContacted) * 1000) / 10 
    : 0;

  const meetingBookingRatePct = repliesReceived > 0 
    ? Math.round((meetingsBooked / repliesReceived) * 1000) / 10 
    : 0;

  const demoStartRatePct = meetingsBooked > 0 
    ? Math.round((trialsOrDemosStarted / meetingsBooked) * 1000) / 10 
    : 0;

  const proposalCloseRatePct = proposalsSent > 0 
    ? Math.round((customersAcquired / proposalsSent) * 1000) / 10 
    : 0;

  const overallFunnelConversionPct = prospectsContacted > 0 
    ? Math.round((customersAcquired / prospectsContacted) * 1000) / 10 
    : 0;

  const effectiveCAC = customersAcquired > 0 
    ? Math.round(revenueGenerated / customersAcquired) 
    : 0;

  // Determine statistical adequacy
  let sampleSizeAdequate = true;
  let sampleSizeWarning: string | undefined;

  if (prospectsContacted === 0) {
    sampleSizeAdequate = false;
    sampleSizeWarning = 'No outreach or prospect touches recorded. A funnel cannot be diagnosed without initial volume.';
  } else if (prospectsContacted < 30) {
    sampleSizeAdequate = false;
    sampleSizeWarning = `Sample size (${prospectsContacted} prospects) is below the minimum threshold of 30 touches for directional certainty. Variations may be random noise.`;
  }

  // Transparent calculations log
  const transparentCalculations: string[] = [
    `Reply Rate: ${repliesReceived} replies ÷ ${prospectsContacted} touches = ${replyRatePct}% (Healthy B2B benchmark: 8%–15%)`,
    `Meeting Conversion Rate: ${meetingsBooked} calls ÷ ${repliesReceived} replies = ${meetingBookingRatePct}% (Healthy benchmark: 30%–50%)`,
    `Demo / Evaluation Rate: ${trialsOrDemosStarted} evals ÷ ${meetingsBooked} calls = ${demoStartRatePct}% (Healthy benchmark: 50%–70%)`,
    `Proposal Closing Rate: ${customersAcquired} purchases ÷ ${proposalsSent} proposals = ${proposalCloseRatePct}% (Healthy benchmark: 25%–40%)`,
    `Overall End-to-End Yield: ${customersAcquired} customers ÷ ${prospectsContacted} prospects = ${overallFunnelConversionPct}%`
  ];

  // Diagnose primary bottleneck
  let primaryBottleneck: SalesDiagnosisReport['primaryBottleneck'] = 'insufficient_sample';
  let diagnosisTitle = 'Insufficient Funnel Data';
  let frictionAnalysis = 'More top-of-funnel prospect touches are required before diagnosing sales friction.';
  let recommendedImmediateAction = 'Execute a focused sprint of 30 targeted touches to establish a meaningful baseline.';

  if (!sampleSizeAdequate && prospectsContacted < 20) {
    primaryBottleneck = 'insufficient_sample';
    diagnosisTitle = 'Inadequate Denominator (Under 20 Touches)';
    frictionAnalysis = `You have only recorded ${prospectsContacted} prospect interactions. Attempting to diagnose messaging or pricing on fewer than 20 touches produces misleading conclusions.`;
    recommendedImmediateAction = 'Do not change product code or pricing yet. Complete at least 25 additional direct touches to the exact same ICP.';
  } else if (replyRatePct < 5 && prospectsContacted >= 25) {
    primaryBottleneck = 'messaging';
    diagnosisTitle = 'Top-of-Funnel Messaging or Target Mismatch';
    frictionAnalysis = `Only ${replyRatePct}% of contacted prospects replied (${repliesReceived} out of ${prospectsContacted}). When reply rate is under 5% over 25+ touches, prospects either do not recognize the problem, do not trust the sender, or you are emailing the wrong job title.`;
    recommendedImmediateAction = 'Audit your subject line and opening hook. Replace product feature descriptions with a single question asking about their specific daily workflow friction.';
  } else if (replyRatePct >= 5 && meetingBookingRatePct < 20 && repliesReceived >= 5) {
    primaryBottleneck = 'meeting_conversion';
    diagnosisTitle = 'Conversation to Meeting Friction';
    frictionAnalysis = `Prospects are replying (${replyRatePct}% reply rate), but only ${meetingBookingRatePct}% agree to meet. This indicates high curiosity about the pain point, but low clarity or hesitation about the proposed next step (e.g. asking for 30 minutes too early).`;
    recommendedImmediateAction = 'Stop asking for calendar links in message #1. Offer a 2-minute Loom breakdown or a concrete insight in the message thread first to build reciprocal credibility.';
  } else if (meetingsBooked >= 3 && demoStartRatePct < 30) {
    primaryBottleneck = 'product_value_demo';
    diagnosisTitle = 'Discovery to Active Evaluation Drop-Off';
    frictionAnalysis = `You booked ${meetingsBooked} discovery calls, but only ${trialsOrDemosStarted} proceeded to evaluate the solution. The demo or discovery call is failing to create urgency, or the product requires too much friction to test.`;
    recommendedImmediateAction = 'Structure the discovery call around their workflow: "Show me how you currently do X." Do not pitch slides; identify whether the pain is urgent enough to justify switching.';
  } else if (proposalsSent >= 3 && proposalCloseRatePct < 20) {
    primaryBottleneck = 'pricing_closing';
    diagnosisTitle = 'Purchasing Hesitation or Unclear ROI at Close';
    frictionAnalysis = `You sent ${proposalsSent} formal proposals/pricing plans, but only ${customersAcquired} converted to paid customers (${proposalCloseRatePct}% close rate). The friction occurs at the commercial decision point: price structure, annual lock-in, or missing internal champion leverage.`;
    recommendedImmediateAction = 'Offer a bounded 30-day paid pilot with defined success criteria, or ask the prospect: "What specific metric would your CFO need to see to approve this invoice next week?"';
  } else if (prospectsContacted < 40 && customersAcquired === 0) {
    primaryBottleneck = 'prospecting';
    diagnosisTitle = 'Prospecting Volume & Target Definition';
    frictionAnalysis = `You have conducted initial outreach, but the total volume (${prospectsContacted}) has not yet crossed statistical certainty for B2B closing cycles.`;
    recommendedImmediateAction = 'Maintain outreach cadence for one more week while tightening qualification filters.';
  } else {
    primaryBottleneck = 'prospecting';
    diagnosisTitle = 'Funnel Healthy — Scaling Candidate';
    frictionAnalysis = `Conversion rates across the funnel are within standard healthy ranges (Overall yield: ${overallFunnelConversionPct}%). The current constraint is volume of qualified inbound/outbound touches.`;
    recommendedImmediateAction = 'Systematize the current outreach workflow or add one complementary inbound distribution channel.';
  }

  return {
    id: `sales-diag-${Date.now()}`,
    evaluatedAt: new Date().toISOString(),
    funnelData: data,
    sampleSizeAdequate,
    sampleSizeWarning,
    metrics: {
      replyRatePct,
      meetingBookingRatePct,
      demoStartRatePct,
      proposalCloseRatePct,
      overallFunnelConversionPct,
      effectiveCAC
    },
    primaryBottleneck,
    diagnosisTitle,
    transparentCalculations,
    frictionAnalysis,
    recommendedImmediateAction
  };
}
