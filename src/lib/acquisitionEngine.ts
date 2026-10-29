import { BusinessProfile, AcquisitionChannelPlan, ProductChannel } from '../types';

export function generateAcquisitionPlans(profile: BusinessProfile): AcquisitionChannelPlan[] {
  const isB2B = profile.targetBuyer.toLowerCase().includes('lead') || 
                profile.targetBuyer.toLowerCase().includes('founder') || 
                profile.targetBuyer.toLowerCase().includes('agency') || 
                profile.targetBuyer.toLowerCase().includes('manager') || 
                profile.targetBuyer.toLowerCase().includes('head of') || 
                profile.targetBuyer.toLowerCase().includes('director') || 
                profile.targetBuyer.toLowerCase().includes('engineer') || 
                profile.targetBuyer.toLowerCase().includes('cfo') || 
                profile.targetBuyer.toLowerCase().includes('b2b');

  const budget = profile.availableMonthlyBudget;
  const hours = profile.availableHoursPerWeek;
  const hasPayingCustomers = profile.payingCustomers !== 'unknown' && Number(profile.payingCustomers) > 0;

  const plans: AcquisitionChannelPlan[] = [
    {
      id: 'plan-founder-outreach',
      channelKey: 'cold_outreach',
      title: 'Founder-Led Direct High-Touch Outreach',
      suitabilityScore: isB2B ? 96 : 74,
      suitabilityReason: `For ${profile.productName}, direct outreach by the founder generates raw qualitative feedback and unvarnished objections that no automated dashboard can provide.`,
      targetAudience: profile.targetBuyer || 'Target decision-makers with acute workflow pain',
      prospectIdentificationCriteria: [
        `Job titles matching: ${profile.targetBuyer}`,
        'Companies active in the last 12 months with visible hiring or recent product updates',
        'Profiles where the bio or posts mention current frustration with manual workarounds or tools like Excel/spreadsheets'
      ],
      exactFirstSteps: [
        'Curate a hyper-focused list of exactly 25 specific named individuals (not an automated scraping list)',
        'Research each prospect’s company to verify they experience the core workflow bottleneck',
        'Send a plain-text 4-sentence peer message asking about their current operational workaround',
        'Record response rates and verbatim objections in your experiment tracker'
      ],
      sampleOutreachTemplates: [
        {
          templateName: 'The Workflow Inquiry (No Pitch)',
          subjectLine: `Question about handling ${profile.specificProblem ? profile.specificProblem.slice(0, 30) : 'workflow'} at {{company}}`,
          messageBody: `Hi {{first_name}},\n\nI noticed you oversee operations at {{company}}. I'm a founder researching how modern teams currently handle ${profile.specificProblem || 'the recurring friction in this workflow'}.\n\nAre you currently solving this with custom internal spreadsheets, or have you found an external tool that actually works?\n\nNot pitching you software—just trying to learn what the biggest point of failure is right now.\n\nBest,\n{{your_name}}`,
          followUpBody: `Hi {{first_name}},\n\nQuick follow-up in case this got buried. If you are already completely happy with how {{company}} handles this, feel free to ignore!\n\nOtherwise, would love to hear your 30-second perspective.\n\nBest,\n{{your_name}}`,
          tacticalNote: 'Do not include a calendar scheduling link in message #1. Aim for a response, not a booked meeting.'
        }
      ],
      timeRequirementHoursPerWeek: Math.min(hours, 5),
      estimatedCostMonthly: 0,
      measurableSuccessCriteria: '≥ 20% reply rate (at least 5 replies from 25 personalized touches) and ≥ 2 discovery conversations booked.',
      risksAndFailureModes: [
        'Sounding like a generic automated SDR pitching features rather than an authentic technical founder',
        'Targeting generic organizational inboxes (info@, sales@) rather than the direct practitioner',
        'Asking for too much time upfront (e.g. asking for 45 minutes from a busy executive)'
      ],
      iterationPlan: 'If 25 touches produce < 3 replies, rewrite the opening sentence to focus purely on a specific observable workflow symptom rather than broad benefits.'
    },
    {
      id: 'plan-linkedin-inbound-outbound',
      channelKey: 'linkedin',
      title: 'LinkedIn Network Warm Outreach & Practitioner Posts',
      suitabilityScore: isB2B ? 90 : 60,
      suitabilityReason: `B2B buyers and decision makers in ${profile.productCategory || 'software'} actively consume LinkedIn professional updates and respond to personalized connection notes.`,
      targetAudience: `${profile.targetBuyer} actively publishing or commenting on industry topics`,
      prospectIdentificationCriteria: [
        '2nd-degree connections who have shared or liked posts about industry tooling in the last 30 days',
        'Members of targeted professional LinkedIn groups related to the category',
        'Practitioners whose headlines specify hands-on ownership of the relevant business process'
      ],
      exactFirstSteps: [
        'Optimize founder LinkedIn profile headline: "Building [Product] to solve [Specific Pain] for [Target Buyer]"',
        'Identify 30 active 2nd-degree connections matching the exact buyer persona',
        'Send personalized connection requests referencing a mutual interest or recent public post',
        'Publish 2 breakdown posts weekly dissecting real mistakes teams make when attempting workarounds'
      ],
      sampleOutreachTemplates: [
        {
          templateName: 'Connection Note (Under 300 Characters)',
          messageBody: `Hi {{first_name}}, saw your perspective on {{recent_topic_or_post}}. I'm currently studying how teams like {{company}} manage ${profile.specificProblem ? profile.specificProblem.slice(0, 35) : 'this process'}. Would love to connect and follow your journey.`,
          tacticalNote: 'Never pitch immediately upon connection acceptance. Wait 48 hours and interact with one of their posts first.'
        }
      ],
      timeRequirementHoursPerWeek: 4,
      estimatedCostMonthly: 0,
      measurableSuccessCriteria: '≥ 40% connection acceptance rate and at least 3 organic message exchanges exploring their setup.',
      risksAndFailureModes: [
        'Posting broad platitudes instead of concrete, actionable teardowns of real workflows',
        'Immediate automated pitching upon connection acceptance, burning reputation'
      ],
      iterationPlan: 'If connection acceptance is low, audit your headline to ensure it clearly reflects genuine peer engineering credibility.'
    },
    {
      id: 'plan-community-listening',
      channelKey: 'communities_slack_reddit',
      title: 'Community Listening & Solution Teardowns',
      suitabilityScore: 85,
      suitabilityReason: 'Practitioners congregate in specialized Slack communities, Discord servers, and Subreddits to ask for recommendations when their current tools fail.',
      targetAudience: 'Active community members asking "How do you guys handle X?" or "What tool do you recommend for Y?"',
      prospectIdentificationCriteria: [
        'Specific subreddits and Slack groups (e.g., r/SaaS, r/startups, industry-specific communities)',
        'Threads with high comment counts complaining about existing legacy tools',
        'Posts where members are asking for spreadsheet templates or manual workflows'
      ],
      exactFirstSteps: [
        'Join 3 high-density practitioner communities where target buyers ask for advice',
        'Set up search queries for keywords related to the problem and competitor names',
        'Contribute 5 thorough, non-promotional educational answers to existing discussions',
        'When directly relevant, offer a free lightweight template or tear-down with zero hard sell'
      ],
      sampleOutreachTemplates: [
        {
          templateName: 'Community Value Post / Response',
          messageBody: `Hey everyone, spent the last 3 weeks analyzing why most teams struggle with ${profile.specificProblem || 'this workflow'}. Here are the 3 major reasons the standard workaround breaks down:\n\n1. [Point 1: Denominator / data sync]\n2. [Point 2: Team adoption friction]\n3. [Point 3: Time cost]\n\nPut together a simple checklist to audit your setup—happy to share the link if anyone wants it, completely free.`,
          tacticalNote: 'Provide 90% of the value directly in the post. Only link out if permitted by community guidelines.'
        }
      ],
      timeRequirementHoursPerWeek: 3,
      estimatedCostMonthly: 0,
      measurableSuccessCriteria: 'At least 15 community engagements/upvotes and 5 direct messages asking for further information or early access.',
      risksAndFailureModes: [
        'Violating community self-promotion rules leading to bans',
        'Pitching too early before establishing helpful community presence'
      ],
      iterationPlan: 'If a post gets moderated, pivot to private 1-on-1 direct messages offering constructive assistance to people who posted questions.'
    },
    {
      id: 'plan-customer-interviews',
      channelKey: 'directories_producthunt',
      title: 'Mom-Test Discovery Interviews with Previous Buyers/Non-Buyers',
      suitabilityScore: hasPayingCustomers ? 92 : 82,
      suitabilityReason: hasPayingCustomers 
        ? 'You have existing paying customers. Interviewing them reveals the exact purchase trigger that will unlock your next 10 customers.'
        : 'Crucial for early validation to discover whether the problem is top-of-mind before burning runway.',
      targetAudience: hasPayingCustomers ? 'Existing paying accounts and churned trials' : 'Active users who tried competitors or workarounds',
      prospectIdentificationCriteria: [
        'Customers who upgraded within 48 hours of signup',
        'Users who completed onboarding but never logged in again',
        'Industry peers who recently evaluated a competing platform'
      ],
      exactFirstSteps: [
        'Schedule 5 structured 15-minute video feedback conversations',
        'Ask about past behavior rather than hypothetical future interest ("When was the last time you paid for X?")',
        'Ask what almost prevented them from buying and what alternative they considered'
      ],
      sampleOutreachTemplates: [
        {
          templateName: '15-Minute Customer Trigger Interview',
          subjectLine: 'Quick question about your experience with {{product_name}}',
          messageBody: `Hi {{first_name}},\n\nI’m the founder of {{product_name}}. I’m doing an audit of what we should build next, and your feedback as an early user is invaluable.\n\nWould you be open to a 12-minute call this Thursday? Not selling anything—just want to hear what made you sign up and what we should improve.\n\nTo thank you for your time, I’d be glad to credit your account or send a $25 Amazon/coffee gift card.\n\nBest,\n{{your_name}}`,
          tacticalNote: 'Limit calls to 15 minutes strictly to respect the buyer’s time.'
        }
      ],
      timeRequirementHoursPerWeek: 3,
      estimatedCostMonthly: 75,
      measurableSuccessCriteria: 'Conduct 5 complete interviews yielding at least 2 verbatim quotes that explain the exact buying trigger.',
      risksAndFailureModes: [
        'Asking leading questions ("Would you like a feature that does X?") that elicit polite, false positive answers',
        'Focusing on feature requests instead of underlying emotional frustration'
      ],
      iterationPlan: 'Transcribe the exact phrases customers use to describe their problem and insert them verbatim into your landing page hero and outreach copy.'
    },
    {
      id: 'plan-seo-content',
      channelKey: 'seo_content',
      title: 'High-Intent Problem Comparison & Workaround Guides',
      suitabilityScore: isB2B ? 78 : 70,
      suitabilityReason: 'Captures buyers actively searching for alternatives to their painful manual spreadsheets or overpriced legacy tools.',
      targetAudience: 'Searchers typing "[Competitor] alternatives", "[Problem] template", or "How to automate [Process]"',
      prospectIdentificationCriteria: [
        'Low-competition search queries with high purchase intent (under 500 searches/mo but high conversion)',
        'Alternative-to keyword queries where incumbents have poor user ratings'
      ],
      exactFirstSteps: [
        'Identify 3 specific long-tail keyword queries your target buyer types when their workaround fails',
        'Write 1 comprehensive, unbiased teardown guide comparing manual spreadsheet workflows vs dedicated software',
        'Provide a free downloadable template or interactive calculator directly on the page'
      ],
      sampleOutreachTemplates: [
        {
          templateName: 'High-Intent Teardown Outline',
          messageBody: `Title: Why [Spreadsheet Workaround] Breaks at 50 [Units] (And How Teams Solve It)\n\nSection 1: The real cost of manual maintenance (hours wasted)\nSection 2: The 3 failure points when scaling\nSection 3: Free downloadable template to test your workflow\nSection 4: When it makes sense to upgrade to [Product Name]`,
          tacticalNote: 'Never bash competitors. Present an honest, technical trade-off breakdown.'
        }
      ],
      timeRequirementHoursPerWeek: 4,
      estimatedCostMonthly: 0,
      measurableSuccessCriteria: 'Page indexed within 14 days and at least 3 organic search visits converting into email signups or template downloads.',
      risksAndFailureModes: [
        'Targeting vanity high-volume head terms that take 12 months to rank',
        'Publishing generic AI-generated articles with no unique screenshots or primary data'
      ],
      iterationPlan: 'If organic rankings take too long, distribute the guide directly into niche Slack/LinkedIn communities.'
    }
  ];

  // If budget > $250, add paid search experimental channel
  if (budget >= 250) {
    plans.push({
      id: 'plan-paid-micro-search',
      channelKey: 'paid_ads',
      title: 'Bounded Google Search High-Intent Micro-Campaign',
      suitabilityScore: 68,
      suitabilityReason: 'Only recommended with a strict budget cap to validate search demand keywords before scaling.',
      targetAudience: 'Active searchers with explicit commercial purchase intent',
      prospectIdentificationCriteria: [
        'Exact match keywords only (e.g. "[keyword] software", "buy [keyword] tool")',
        'Negative keyword list excluding "free", "open source", "cracked", "jobs", "salary"'
      ],
      exactFirstSteps: [
        'Set daily budget strictly to $10/day ($150 total 2-week cap)',
        'Create a dedicated landing page matching the exact search intent of the chosen keyword',
        'Measure click-to-lead and lead-to-conversation conversion rate'
      ],
      sampleOutreachTemplates: [
        {
          templateName: 'Exact Match Search Ad Copy',
          subjectLine: 'Headline: The Modern Alternative to [Competitor/Manual]',
          messageBody: `Headline 1: Solve [Specific Problem]\nHeadline 2: Without the Overhead of [Legacy Tool]\nDescription: Built specifically for [Target Buyer]. Start your first evaluation in 2 minutes. No lengthy sales calls required.`,
          tacticalNote: 'Always use exact match brackets [keyword] to prevent Google from burning budget on irrelevant queries.'
        }
      ],
      timeRequirementHoursPerWeek: 2,
      estimatedCostMonthly: Math.min(budget, 250),
      measurableSuccessCriteria: '≥ 3% click-through rate and at least 2 qualified inbound trial evaluations within $150 ad spend.',
      risksAndFailureModes: [
        'Broad match keywords burning entire budget on non-commercial searchers',
        'Sending paid traffic to a generic homepage instead of an intent-matched landing page'
      ],
      iterationPlan: 'If cost-per-click exceeds $5 without conversions, pause the campaign immediately and return to founder-led direct outreach.'
    });
  }

  // Sort by suitability score descending
  return plans.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
