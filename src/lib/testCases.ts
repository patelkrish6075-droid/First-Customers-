import { TestCase, BusinessProfile } from '../types';
import { runDeterministicDiagnosis } from './diagnosticEngine';

export const TEST_CASES: TestCase[] = [
  {
    id: 'test-case-a',
    code: 'Test A',
    title: 'Launched Product with No Meaningful Demand Evidence',
    scenarioDescription: 'A developer built an automated meeting notes summarizer for architects. They have 0 paying customers, reached 40 architects, got polite praise ("looks really neat!"), but zero active spend or workarounds exist. Architects currently just take manual bullet points in 2 minutes and have zero budget.',
    profile: {
      id: 'profile-test-a',
      updatedAt: new Date().toISOString(),
      productName: 'ArchiNotes AI',
      taglineOrSummary: 'Automated meeting notes and specifications generator for architecture studios.',
      productCategory: 'B2B SaaS / AI Productivity',
      stage: 'launched',
      monthsSinceLaunch: 4,
      targetBuyer: 'Boutique architectural practice owners',
      actualUsers: 'Architects and project leads',
      specificProblem: 'Architects spend 1-2 hours after client site meetings drafting specification minutes.',
      currentWorkarounds: 'Manual bullet notes in Apple Notes or email drafts, or simply doing nothing.',
      problemImportanceEvidence: 'Architects said the demo "looked really cool and slick" during coffee chats.',
      spendingOnAlternatives: 'no',
      spendingDetails: 'None. They allocate zero dollars or software tools to meeting transcription.',
      founderAssumptionsEvidence: 'Believes architects will pay $49/mo once they realize how much time it saves.',
      payingCustomers: 0,
      mrr: 0,
      currency: 'USD',
      freeUsers: 12,
      trialsOrSignups: 15,
      repeatUsageKnown: 'no',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 40,
          repliesOrConversations: 3,
          demosOrCalls: 2,
          trialsOrActivations: 2,
          purchases: 0,
          estimatedSpend: 0,
          durationWeeks: 4,
          consistencyNotes: 'Sent 40 personalized emails to architecture firm founders.'
        }
      ],
      websiteVisitorsMonthly: 80,
      prospectFeedbackSummary: 'People say it is a cool idea, but they do not have a budget or urgent need for it.',
      commonObjections: 'We already take quick notes; not worth another subscription right now.',
      reasonsProspectsRefused: 'Not an acute problem; manual notes are sufficient.',
      dropOffStage: 'demo_to_purchase',
      observedCustomerSessions: 'no',
      availableHoursPerWeek: 15,
      availableMonthlyBudget: 100,
      teamSize: 1,
      relevantSkills: 'Full-stack engineering, basic cold email',
      pastChangesTried: 'Added 5 new AI summary export formats and PDF templates.',
      failedExperimentsSummary: 'Offering 50% discount coupon generated zero conversions.',
      founderBottleneckBelief: 'I think I need to build more features or do paid Facebook ads.'
    },
    expectedCategory: 'demand_validation',
    expectedPrimaryAction: 'Past-behavior discovery interviews without pitching (Mom Test protocol)',
    expectedExperimentKeyword: 'Demand',
    criticalUnknowns: [
      'Do target architects actively spend money or painful hours on existing workarounds?',
      'Is drafting specification minutes an actual costly liability or merely a mild chore?'
    ],
    acceptableAlternativeExplanations: [
      'Positioning/Offer issue if value was pitched as "AI notes" instead of "risk mitigation for client disputes"',
      'Target buyer mismatch if studio partners never attend site meetings'
    ],
    failureConditions: [
      'Recommending paid advertising or scaling acquisition outreach when demand is unsubstantiated',
      'Recommending price cuts or discounts when willingness to pay is unproven',
      'Claiming 100% certainty that the product is doomed without testing customer past behavior'
    ]
  },
  {
    id: 'test-case-b',
    code: 'Test B',
    title: 'Broad Target Audience with Promising Signals from One Segment',
    scenarioDescription: 'A founder built an automated invoice reminder tool targeting "freelancers, agencies, and small businesses of all types". Traction is messy, but freelance graphic designers replied at a 25% rate and closed 2 paying accounts, whereas enterprise agencies ignored it completely.',
    profile: {
      id: 'profile-test-b',
      updatedAt: new Date().toISOString(),
      productName: 'RemindFlow',
      taglineOrSummary: 'Intelligent invoice reminders and payment collections for everyone in business.',
      productCategory: 'Fintech / Invoicing SaaS',
      stage: 'launched',
      monthsSinceLaunch: 6,
      targetBuyer: 'everyone, anyone, freelancers, agencies, and small businesses of all types',
      actualUsers: 'Freelance designers, agency account managers, consultants',
      specificProblem: 'Late client payments cause cash flow stress.',
      currentWorkarounds: 'Manual email nagging or QuickBooks default templates.',
      problemImportanceEvidence: 'Solo freelance designers expressed relief when unpaid invoices got paid faster.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Solo designers pay $15/mo for freshbooks or chase manually.',
      founderAssumptionsEvidence: 'Every business owner hates chasing invoices, so anyone with clients will buy.',
      payingCustomers: 2,
      mrr: 58,
      currency: 'USD',
      freeUsers: 8,
      trialsOrSignups: 20,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: 'The 2 freelance designers use it weekly and love it.',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 80,
          repliesOrConversations: 6,
          demosOrCalls: 4,
          trialsOrActivations: 3,
          purchases: 2,
          estimatedSpend: 50,
          durationWeeks: 6,
          consistencyNotes: 'Contacted 40 large agencies (0 replies) and 40 solo designers (6 replies, 2 bought).'
        }
      ],
      websiteVisitorsMonthly: 250,
      prospectFeedbackSummary: 'Agencies say they already have an ERP accounting department. Solo designers say it saves them awkward confrontation.',
      commonObjections: 'Agencies: "We have an accounts receivable team." Designers: "Will my client get mad at automated emails?"',
      reasonsCustomersBought: 'Freelance designers were owed $3,000+ and wanted non-awkward polite follow-ups.',
      reasonsProspectsRefused: 'Agencies have formal accounting systems and refuse 3rd party tools without SOC2.',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'yes',
      observedSessionsNotes: 'Designers set it up in 5 minutes.',
      availableHoursPerWeek: 20,
      availableMonthlyBudget: 150,
      teamSize: 1,
      relevantSkills: 'React, Node, UI design',
      pastChangesTried: 'Changed homepage headline 3 times trying to appeal to both large enterprise and solo makers.',
      failedExperimentsSummary: 'LinkedIn outreach to VP of Finance at 50-person agencies failed completely.',
      founderBottleneckBelief: 'I need to add multi-entity enterprise billing to win the big agencies.'
    },
    expectedCategory: 'target_customer',
    expectedPrimaryAction: 'Narrow ICP to solo creative freelancers and run head-to-head positioning test',
    expectedExperimentKeyword: 'Segment',
    criticalUnknowns: [
      'What is the customer acquisition cost and willingness to pay among solo creative freelancers vs agencies?',
      'Can the business sustain itself focusing strictly on solo professionals?'
    ],
    acceptableAlternativeExplanations: [
      'Positioning & Offer (tailoring landing page strictly to solo freelancers)',
      'Sales conversion in enterprise (if agency procurement requirements are insurmountable for solo founder)'
    ],
    failureConditions: [
      'Recommending enterprise SOC2 compliance and enterprise features to chase agencies',
      'Ignoring the 2 paying solo designer customers and clear behavioral signal',
      'Advising more horizontal marketing to "small businesses in general"'
    ]
  },
  {
    id: 'test-case-c',
    code: 'Test C',
    title: 'Very Little Acquisition Data, Insufficient to Evaluate Channel',
    scenarioDescription: 'A technical founder spent 9 months building a database optimization tool. They launched 3 weeks ago, posted on Twitter once (12 views), sent 6 cold emails to former colleagues, and concluded "cold outreach does not work and nobody wants this".',
    profile: {
      id: 'profile-test-c',
      updatedAt: new Date().toISOString(),
      productName: 'QueryPulse',
      taglineOrSummary: 'PostgreSQL slow-query analyzer and automated index advisor.',
      productCategory: 'Developer Tools / Infrastructure',
      stage: 'launched',
      monthsSinceLaunch: 1,
      targetBuyer: 'Engineering leads at fast-growing Series A SaaS companies',
      actualUsers: 'Backend developers and DevOps engineers',
      specificProblem: 'Slow database queries degrade application latency and cause customer churn.',
      currentWorkarounds: 'Manual EXPLAIN ANALYZE queries or Datadog alerts.',
      problemImportanceEvidence: 'Engineers frequently complain on Hacker News about unoptimized RDS costs.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Companies pay thousands for Datadog or AWS RDS performance insights.',
      founderAssumptionsEvidence: 'Believes engineers will eagerly install a CLI tool if it pinpoints slow queries.',
      payingCustomers: 0,
      mrr: 0,
      currency: 'USD',
      freeUsers: 1,
      trialsOrSignups: 2,
      repeatUsageKnown: 'unknown',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 6,
          repliesOrConversations: 1,
          demosOrCalls: 0,
          trialsOrActivations: 0,
          purchases: 0,
          estimatedSpend: 0,
          durationWeeks: 1,
          consistencyNotes: 'Sent 6 emails to former coworkers.'
        },
        {
          channel: 'twitter_x',
          prospectsReached: 12,
          repliesOrConversations: 0,
          demosOrCalls: 0,
          trialsOrActivations: 0,
          purchases: 0,
          estimatedSpend: 0,
          durationWeeks: 1,
          consistencyNotes: 'Posted one tweet about the launch.'
        }
      ],
      websiteVisitorsMonthly: 28,
      prospectFeedbackSummary: 'One coworker said "looks awesome, congrats on shipping".',
      commonObjections: 'None received yet; almost no one has seen it.',
      reasonsProspectsRefused: 'Unknown; sample size is statistically near zero.',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'no',
      availableHoursPerWeek: 25,
      availableMonthlyBudget: 200,
      teamSize: 1,
      relevantSkills: 'Go, PostgreSQL, Cloud Infrastructure',
      pastChangesTried: 'Rewrote the engine from Python to Rust.',
      failedExperimentsSummary: 'None conducted systematically.',
      founderBottleneckBelief: 'Cold outreach does not work for developer tools. I need to rebuild the product.'
    },
    expectedCategory: 'acquisition_reach',
    expectedPrimaryAction: 'Execute a disciplined 25-50 prospect bounded outbound sprint to establish real baseline data',
    expectedExperimentKeyword: 'Sprint',
    criticalUnknowns: [
      'What is the actual response rate when 25-50 qualified engineering leads receive a targeted message?',
      'Can the founder establish a repeatable top-of-funnel reach cadence?'
    ],
    acceptableAlternativeExplanations: [
      'Acquisition reach (sample size is unmeasured funnel)',
      'Positioning/Offer once initial reach of 50 prospects is achieved'
    ],
    failureConditions: [
      'Declaring cold outreach dead based on 6 emails',
      'Advising another product rewrite or adding more features before reaching 25-50 prospects',
      'Assuming lack of demand without any meaningful prospect exposure'
    ]
  },
  {
    id: 'test-case-d',
    code: 'Test D',
    title: 'Prospects Attend Demos but Do Not Purchase (Known Objections)',
    scenarioDescription: 'An HR compliance tool founder has conducted 14 live demos with HR directors. 10 of them attended, loved the product demo, but 0 purchased. Objections consistently cite: "We do not have discretionary budget without CFO approval, and our procurement cycle requires an annual vendor review."',
    profile: {
      id: 'profile-test-d',
      updatedAt: new Date().toISOString(),
      productName: 'CompliDesk',
      taglineOrSummary: 'Automated state labor law compliance tracker for remote teams.',
      productCategory: 'HR Tech / B2B SaaS',
      stage: 'launched',
      monthsSinceLaunch: 5,
      targetBuyer: 'HR Directors at 50-250 person remote companies',
      actualUsers: 'HR managers and People Ops generalists',
      specificProblem: 'Tracking changing remote work state compliance and tax disclosures is error-prone.',
      currentWorkarounds: 'Outsourced labor law firm retainers or manual spreadsheets.',
      problemImportanceEvidence: 'HR directors consistently book 30-minute calls to review state penalty risks.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Companies pay $5,000/yr to compliance attorneys or PEO services.',
      founderAssumptionsEvidence: 'At $99/mo, it should be an impulse buy for any HR department.',
      payingCustomers: 0,
      mrr: 0,
      currency: 'USD',
      freeUsers: 3,
      trialsOrSignups: 16,
      repeatUsageKnown: 'no',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 90,
          repliesOrConversations: 18,
          demosOrCalls: 14,
          trialsOrActivations: 6,
          purchases: 0,
          estimatedSpend: 100,
          durationWeeks: 8,
          consistencyNotes: 'Cold email sequence to HR Directors via LinkedIn.'
        }
      ],
      websiteVisitorsMonthly: 340,
      prospectFeedbackSummary: 'Prospects agree the problem is scary and real; they love the dashboard in the demo.',
      commonObjections: 'We do not have a company credit card; any software purchase over $500/year must go through CFO procurement.',
      reasonsProspectsRefused: 'HR Directors lack standalone purchasing authority; founder asked for monthly credit card swipe.',
      dropOffStage: 'demo_to_purchase',
      observedCustomerSessions: 'yes',
      observedSessionsNotes: 'HR directors found the software intuitive and clear.',
      availableHoursPerWeek: 20,
      availableMonthlyBudget: 300,
      teamSize: 1,
      relevantSkills: 'Sales, Product, Full-stack',
      pastChangesTried: 'Lowered price from $149/mo to $99/mo.',
      failedExperimentsSummary: 'Lowering the price did not change the 0% close rate.',
      founderBottleneckBelief: 'Our price must still be too high, or our demo needs more slides.'
    },
    expectedCategory: 'pricing_purchasing',
    expectedPrimaryAction: 'Introduce CFO-ready annual invoice procurement pack and diagnostic qualification during demo',
    expectedExperimentKeyword: 'Qualification',
    criticalUnknowns: [
      'What is the threshold and process for CFO sign-off at these target companies?',
      'Would packaging as an annual invoiced contract ($1,200/yr net-30) align with enterprise purchasing?'
    ],
    acceptableAlternativeExplanations: [
      'Sales conversion (building ROI business case for the economic buyer/CFO)',
      'Target customer (targeting smaller companies where the founder can swipe a credit card)'
    ],
    failureConditions: [
      'Recommending another price cut or free tier when objections explicitly cite procurement authority',
      'Advising more top-of-funnel cold outreach when demo-to-purchase is the bottleneck',
      'Ignoring the clear distinction between the HR user and the CFO economic buyer'
    ]
  },
  {
    id: 'test-case-e',
    code: 'Test E',
    title: 'Many Signups but Very Few Users Reach Core Product Benefit',
    scenarioDescription: 'A founder launched an AI video transcription and chaptering app. Product Hunt and Reddit drove 450 signups. However, 82% of users drop off on Step 2 of onboarding when asked to configure ffmpeg or upload video files >500MB without a progress bar.',
    profile: {
      id: 'profile-test-e',
      updatedAt: new Date().toISOString(),
      productName: 'ClipFlow AI',
      taglineOrSummary: 'Repurpose long-form YouTube podcasts into short viral video clips with one click.',
      productCategory: 'Creator Tools / Video AI',
      stage: 'launched',
      monthsSinceLaunch: 2,
      targetBuyer: 'YouTubers and podcast editors',
      actualUsers: 'Video creators',
      specificProblem: 'Editing clips for TikTok and Reels takes 4-6 hours per podcast episode.',
      currentWorkarounds: 'Hiring freelance video editors on Upwork or using Opus Clip / Descript.',
      problemImportanceEvidence: 'Creators spend $200-$500 per episode on Upwork editors.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Creators pay $19-$49/mo for Descript or Opus Clip.',
      founderAssumptionsEvidence: 'If signups are high, users will figure out the upload process.',
      payingCustomers: 1,
      mrr: 29,
      currency: 'USD',
      freeUsers: 380,
      trialsOrSignups: 450,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: 'Only 18 users have generated more than 1 clip.',
      channels: [
        {
          channel: 'directories_producthunt',
          prospectsReached: 2500,
          repliesOrConversations: 40,
          demosOrCalls: 0,
          trialsOrActivations: 35,
          purchases: 1,
          estimatedSpend: 0,
          durationWeeks: 3,
          consistencyNotes: 'Product Hunt launch and Reddit r/podcasting posts.'
        }
      ],
      websiteVisitorsMonthly: 2100,
      prospectFeedbackSummary: 'Users sign up eagerly but never come back. A few commented that upload took forever or failed silently.',
      commonObjections: 'Video upload timed out; why do I need to paste a YouTube URL that takes 15 minutes to process?',
      reasonsCustomersBought: 'The 1 paying customer was a personal friend who had the founder debug their upload.',
      reasonsProspectsRefused: 'Users abandon before seeing a single generated clip.',
      dropOffStage: 'signup_to_activation',
      observedCustomerSessions: 'no',
      availableHoursPerWeek: 30,
      availableMonthlyBudget: 150,
      teamSize: 1,
      relevantSkills: 'Python, React, AWS',
      pastChangesTried: 'Added 10 new subtitle animation styles and fonts.',
      failedExperimentsSummary: 'Sending reminder drip emails to unactivated signups had a 1% open rate.',
      founderBottleneckBelief: 'I need to run paid YouTube influencer sponsorships to get higher-quality creators.'
    },
    expectedCategory: 'activation_value',
    expectedPrimaryAction: 'Conduct 5 live moderated onboarding sessions to diagnose and eliminate upload friction',
    expectedExperimentKeyword: 'Activation',
    criticalUnknowns: [
      'What is the exact percentage drop-off at each onboarding screen?',
      'Why does video upload fail or delay, and does a sample pre-loaded video provide instant gratification?'
    ],
    acceptableAlternativeExplanations: [
      'Positioning/Offer if expectations set by the landing page clash with the technical requirements',
      'Demand validation if creators prefer human Upwork editors over automated clipping'
    ],
    failureConditions: [
      'Recommending paid advertising or influencer spend when 82% of existing signups fail to activate',
      'Adding more aesthetic subtitle presets instead of fixing the broken onboarding funnel',
      'Confusing 450 vanity signups with validated product-market fit'
    ]
  },
  {
    id: 'test-case-f',
    code: 'Test F',
    title: 'Paying Customers Stop Returning (Retention / Recurring Value Issue)',
    scenarioDescription: 'A B2B SaaS founder built a client onboarding checklist tool for digital marketing agencies. They sold 14 annual subscriptions at $490 each ($6,860 upfront). However, 6 months in, 11 of the 14 agencies have stopped logging in completely, and 2 requested early contract cancellations.',
    profile: {
      id: 'profile-test-f',
      updatedAt: new Date().toISOString(),
      productName: 'ClientLaunchpad',
      taglineOrSummary: 'Automated client onboarding portals and intake checklists for digital marketing agencies.',
      productCategory: 'Agency SaaS / Workflow Software',
      stage: 'growing',
      monthsSinceLaunch: 8,
      targetBuyer: 'Agency owners and Client Success Directors',
      actualUsers: 'Agency project managers and end clients',
      specificProblem: 'New agency clients take 3 weeks to submit assets, delaying project kickoffs.',
      currentWorkarounds: 'Google Sheets checklists, Notion docs, or ClickUp templates.',
      problemImportanceEvidence: 'Agencies were happy to pay $490 upfront because delayed kickoffs cost billable days.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Agencies spend on ClickUp, Asana, and manual account manager time.',
      founderAssumptionsEvidence: 'Agencies bought upfront, so product-market fit is proven.',
      payingCustomers: 14,
      mrr: 570,
      currency: 'USD',
      freeUsers: 25,
      trialsOrSignups: 40,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: '11 of 14 paying accounts have 0 logins in the past 45 days.',
      cancellationsCount: 2,
      retentionDetails: 'High churn: 11 inactive agency accounts, 2 requested cancellations citing "our clients refused to create another login".',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 200,
          repliesOrConversations: 30,
          demosOrCalls: 22,
          trialsOrActivations: 16,
          purchases: 14,
          estimatedSpend: 150,
          durationWeeks: 12,
          consistencyNotes: 'Cold email to agency owners.'
        }
      ],
      websiteVisitorsMonthly: 600,
      prospectFeedbackSummary: 'Selling was easy; keeping agencies active failed once their end clients complained about having to create accounts.',
      commonObjections: 'Post-purchase: "Our clients hate logging into another portal; they prefer email or Google Drive."',
      reasonsCustomersBought: 'Agency owners wanted a clean, professional first impression for new clients.',
      reasonsProspectsRefused: 'Non-buyers were worried clients would not adopt it.',
      dropOffStage: 'first_month_churn',
      observedCustomerSessions: 'partial',
      observedSessionsNotes: 'Agency owners loved the admin view, but end client portal experience was clunky.',
      availableHoursPerWeek: 25,
      availableMonthlyBudget: 400,
      teamSize: 2,
      relevantSkills: 'Sales, Full-stack, Agency background',
      pastChangesTried: 'Built a new agency white-label logo feature.',
      failedExperimentsSummary: 'Offering free 1-on-1 customer success calls was ignored by inactive agencies.',
      founderBottleneckBelief: 'I just need to hire a commission-only SDR to sell 50 more agencies this month.'
    },
    expectedCategory: 'retention_recurring_value',
    expectedPrimaryAction: 'Conduct structured 15-minute cancellation interviews with the inactive agencies and solve end-client friction',
    expectedExperimentKeyword: 'Retention',
    criticalUnknowns: [
      'Can the end-client experience be made friction-free (e.g. magic link with zero password/login required)?',
      'What percentage of agencies will renew after 12 months if client adoption is not fixed?'
    ],
    acceptableAlternativeExplanations: [
      'Activation/Value realization for the secondary user (the agency\'s end client)',
      'Product category mismatch (if client intake is naturally handled by existing agency PM tools like Asana/ClickUp)'
    ],
    failureConditions: [
      'Advising hiring an SDR to sell more accounts into a demonstrably churning customer base',
      'Ignoring the 11 inactive paying accounts and 2 cancellations',
      'Treating customer acquisition as the primary growth lever when retention is broken'
    ]
  },
  {
    id: 'test-case-g',
    code: 'Test G',
    title: 'Conflicting Signals: Enthusiastic Free Users vs. Zero B2B Buyer Revenue',
    scenarioDescription: 'A solo founder built an automated 3D icon generation plugin. 85 freelance designers and students use it daily for free and leave 5-star comments on Discord. However, outreach to 45 Creative Directors at design agencies yielded 0 sales ($0 MRR) because agencies use bundled Adobe/Figma licenses and have zero discretionary software budget.',
    profile: {
      id: 'profile-test-g',
      updatedAt: new Date().toISOString(),
      productName: 'IconMorph 3D',
      taglineOrSummary: 'Generate custom vector 3D icons from SVG sketches in seconds.',
      productCategory: 'Design Tools / Creative AI',
      stage: 'launched',
      monthsSinceLaunch: 5,
      targetBuyer: 'everyone, anyone, freelancers, design agencies, creative studios',
      actualUsers: 'Junior freelance designers, design students, hobbyists',
      specificProblem: 'Custom 3D iconography takes 3-4 hours per asset in Blender.',
      currentWorkarounds: 'Stock icon packs or Blender.',
      problemImportanceEvidence: 'Discord community has 85 active daily free users raving about the renders.',
      spendingOnAlternatives: 'no',
      spendingDetails: 'Designers use free stock packs or existing Figma plugins.',
      founderAssumptionsEvidence: 'Since free users love it, agencies with 10+ designers will happily pay $99/seat.',
      payingCustomers: 0,
      mrr: 0,
      currency: 'USD',
      freeUsers: 85,
      trialsOrSignups: 120,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: 'Free users generate 5-10 icons every week.',
      channels: [
        {
          channel: 'cold_outreach',
          prospectsReached: 45,
          repliesOrConversations: 2,
          demosOrCalls: 1,
          trialsOrActivations: 1,
          purchases: 0,
          estimatedSpend: 50,
          durationWeeks: 4,
          consistencyNotes: 'Cold InMail to Creative Directors at branding agencies.'
        }
      ],
      websiteVisitorsMonthly: 550,
      prospectFeedbackSummary: 'Creative Directors say: "We do not have a budget line for icon tools; our designers use Figma or Illustrator." Free users say: "Please keep this free forever!"',
      commonObjections: 'Agencies: "Not an approved vendor; we use bundled Figma." Free users: "I would never pay for icons."',
      reasonsProspectsRefused: 'Economic buyers see no business case; users have zero budget.',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'yes',
      availableHoursPerWeek: 15,
      availableMonthlyBudget: 100,
      teamSize: 1,
      relevantSkills: 'Three.js, WebGL, Full-stack',
      pastChangesTried: 'Added 20 new icon presets and 4K export options.',
      failedExperimentsSummary: 'Paywalling 4K downloads dropped active free users by 60% without generating a single purchase.',
      founderBottleneckBelief: 'I need to add team collaboration or lower the agency seat price from $99 to $29.'
    },
    expectedCategory: 'target_customer',
    expectedPrimaryAction: 'Segment head-to-head test to isolate whether a commercially viable buyer niche exists',
    expectedExperimentKeyword: 'Segment',
    criticalUnknowns: [
      'Is there any sub-segment of creators (e.g. mobile game studios or Web3 marketing agencies) who have commercial budgets for 3D assets?',
      'Is this a sustainable B2B software product or a consumer freemium novelty?'
    ],
    acceptableAlternativeExplanations: [
      'Positioning & Offer (if pitched as branding asset generator rather than icon maker)',
      'Demand validation for B2B commercial software'
    ],
    failureConditions: [
      'Confusing 85 enthusiastic free users with product-market fit or commercial validation',
      'Recommending enterprise features to force agency sales when agencies have 0 interest',
      'Advising more free marketing to student communities'
    ]
  },
  {
    id: 'test-case-h',
    code: 'Test H',
    title: 'Severe Insufficient Data: Brand New Launch with 4 Visits & 0 Feedback',
    scenarioDescription: 'A developer built a Kubernetes log-clustering tool. They launched 48 hours ago, shared it on a personal Discord with 3 friends, recorded 4 total visits, 0 signups, and 0 customer outreach. The founder is panicking and planning to rewrite the entire UI or drop price to $0.',
    profile: {
      id: 'profile-test-h',
      updatedAt: new Date().toISOString(),
      productName: 'KubeCluster Logs',
      taglineOrSummary: 'Automated noise reduction and anomaly clustering for Kubernetes log streams.',
      productCategory: 'DevOps / Infrastructure',
      stage: 'launched',
      monthsSinceLaunch: 1,
      targetBuyer: 'DevOps engineers and Site Reliability Engineers',
      actualUsers: 'SREs',
      specificProblem: 'Log volume overwhelms engineers during production incidents.',
      currentWorkarounds: 'Grafana Loki or Datadog log alerts.',
      problemImportanceEvidence: 'Personal frustration experienced by the founder at their previous job.',
      spendingOnAlternatives: 'unknown',
      spendingDetails: '',
      founderAssumptionsEvidence: 'Assumes every SRE with >10 microservices desperately needs this.',
      payingCustomers: 0,
      mrr: 0,
      currency: 'USD',
      freeUsers: 0,
      trialsOrSignups: 0,
      repeatUsageKnown: 'unknown',
      channels: [
        {
          channel: 'other',
          channelNameCustom: 'Personal Discord share',
          prospectsReached: 4,
          repliesOrConversations: 0,
          demosOrCalls: 0,
          trialsOrActivations: 0,
          purchases: 0,
          estimatedSpend: 0,
          durationWeeks: 1,
          consistencyNotes: 'Shared once in a programming Discord.'
        }
      ],
      websiteVisitorsMonthly: 4,
      prospectFeedbackSummary: 'Zero feedback received yet; nobody has seen it.',
      commonObjections: 'None received.',
      reasonsProspectsRefused: 'Unknown; zero prospects evaluated.',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'no',
      availableHoursPerWeek: 20,
      availableMonthlyBudget: 150,
      teamSize: 1,
      relevantSkills: 'Go, Kubernetes, React',
      pastChangesTried: 'None yet.',
      failedExperimentsSummary: 'None.',
      founderBottleneckBelief: 'Nobody wants this because my landing page looks ugly. I should rebuild it.'
    },
    expectedCategory: 'insufficient_evidence',
    expectedPrimaryAction: 'Execute a disciplined 25-prospect baseline discovery outreach sprint before changing product',
    expectedExperimentKeyword: 'Sprint',
    criticalUnknowns: [
      'What is the baseline response when 25 verified SREs are contacted directly?',
      'Do target DevOps teams feel acute pain with their current Loki/Datadog setup?'
    ],
    acceptableAlternativeExplanations: [
      'Acquisition reach (sample size is near-zero)'
    ],
    failureConditions: [
      'Declaring product or demand failure on 4 website visits',
      'Recommending a redesign or pivot before establishing baseline reach',
      'Forcing a definitive diagnosis when data is statistically non-existent'
    ]
  },
  {
    id: 'test-case-i',
    code: 'Test I',
    title: 'Paying Customers Exist but Acquisition Attribution & Buying Trigger are Unknown',
    scenarioDescription: 'A B2B SaaS founder has 4 paying customers ($140 MRR) who bought organically, but the founder does not know what channel brought them or why they bought. The founder plans to launch cold outreach to 500 prospects or buy Google Ads to scale.',
    profile: {
      id: 'profile-test-i',
      updatedAt: new Date().toISOString(),
      productName: 'RecurTrack',
      taglineOrSummary: 'Automated failed payment and card dunning recovery tool for indie SaaS founders.',
      productCategory: 'Fintech / Revenue Operations',
      stage: 'launched',
      monthsSinceLaunch: 4,
      targetBuyer: 'SaaS founders and billing managers',
      actualUsers: 'Founders managing Stripe accounts',
      specificProblem: 'Failed credit card renewals cause involuntary subscriber churn.',
      currentWorkarounds: 'Default Stripe dunning emails or manual reaching out.',
      problemImportanceEvidence: 'The 4 paying customers have recovered $1,800 in failed payments over 60 days.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Companies pay for Churn Buster or Baremetrics Recover ($50-$200/mo).',
      founderAssumptionsEvidence: 'If 4 bought without marketing, 500 cold emails will generate 20 more customers.',
      payingCustomers: 4,
      mrr: 140,
      currency: 'USD',
      freeUsers: 2,
      trialsOrSignups: 6,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: 'All 4 paying customers have it running and retain.',
      channels: [],
      websiteVisitorsMonthly: 60,
      prospectFeedbackSummary: 'The 4 users love it and never log in because it works in the background.',
      commonObjections: 'None recorded from paying customers; cold prospects have not been systematically tested.',
      reasonsCustomersBought: '',
      reasonsProspectsRefused: '',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'no',
      availableHoursPerWeek: 20,
      availableMonthlyBudget: 200,
      teamSize: 1,
      relevantSkills: 'Full-stack, Stripe API, Node',
      pastChangesTried: 'Set up Stripe webhooks and automated recovery email triggers.',
      failedExperimentsSummary: 'None.',
      founderBottleneckBelief: 'I need to blast 500 cold emails or buy Google Ads to scale rapidly.'
    },
    expectedCategory: 'target_customer',
    expectedPrimaryAction: 'Conduct structured 20-minute motivation and attribution interviews with the 4 paying customers before scaling outreach',
    expectedExperimentKeyword: 'Motivation',
    criticalUnknowns: [
      'What specific trigger event caused the 4 paying customers to search for and buy RecurTrack?',
      'Which exact acquisition channel or touchpoint originally delivered them?'
    ],
    acceptableAlternativeExplanations: [
      'Positioning & Offer (once paying customer value proposition is articulated)',
      'Customer Attribution'
    ],
    failureConditions: [
      'Recommending 500-prospect cold outreach or paid ads without auditing existing paying customers',
      'Ignoring the 4 validated paying customers and their unexamined purchase motivations'
    ]
  },
  {
    id: 'test-case-j',
    code: 'Test J',
    title: 'Paying Customers Retain Strongly, but New Inbound Traffic Does Not Convert (Positioning Gap)',
    scenarioDescription: 'A developer productivity tool has 7 paying customers ($490 MRR) who retain and praise the product daily. However, 500 monthly unique website visitors convert at under 0.4% (only 2 signups). The founder is planning to build 5 new integrations because they believe the product lacks features.',
    profile: {
      id: 'profile-test-j',
      updatedAt: new Date().toISOString(),
      productName: 'DocuFast',
      taglineOrSummary: 'Unified instantaneous documentation search engine for backend developer teams.',
      productCategory: 'Developer Productivity SaaS',
      stage: 'growing',
      monthsSinceLaunch: 6,
      targetBuyer: 'Engineering leads at 20-100 person tech companies',
      actualUsers: 'Backend developers and software engineers',
      specificProblem: 'Developers waste 30 minutes a day context-switching across fragmented internal wikis.',
      currentWorkarounds: 'Slack search, Notion search, or Confluence default search.',
      problemImportanceEvidence: 'The 7 paying engineering teams run an average of 42 searches per engineer per week.',
      spendingOnAlternatives: 'yes',
      spendingDetails: 'Teams pay for Notion, Confluence, and GitHub enterprise licenses.',
      founderAssumptionsEvidence: 'Believes visitors bounce because DocuFast lacks Jira and Asana integrations.',
      payingCustomers: 7,
      mrr: 490,
      currency: 'USD',
      freeUsers: 10,
      trialsOrSignups: 4,
      repeatUsageKnown: 'yes',
      repeatUsageDetails: 'All 7 paying teams retain; zero churn in 4 months.',
      channels: [
        {
          channel: 'seo_content',
          prospectsReached: 500,
          repliesOrConversations: 2,
          demosOrCalls: 2,
          trialsOrActivations: 2,
          purchases: 0,
          estimatedSpend: 0,
          durationWeeks: 8,
          consistencyNotes: 'Technical blog posts driving 500 visitors/mo.'
        }
      ],
      websiteVisitorsMonthly: 500,
      prospectFeedbackSummary: 'Paying customers say: "It saves our engineers 3 hours a week." Bounce visitors say: "The homepage headline looks like another markdown editor; didn\'t realize it searches all wikis instantly."',
      commonObjections: 'Website visitors state the headline is too technical and confusing.',
      reasonsCustomersBought: 'Engineering leads wanted their developers to stop interrupting senior engineers with duplicate questions.',
      reasonsProspectsRefused: 'Homepage copy does not communicate instant cross-platform search; visitors assume it is just another wiki.',
      dropOffStage: 'traffic_to_signup',
      observedCustomerSessions: 'yes',
      availableHoursPerWeek: 25,
      availableMonthlyBudget: 150,
      teamSize: 1,
      relevantSkills: 'Elasticsearch, React, TypeScript',
      pastChangesTried: 'Added 2 new documentation syntax themes.',
      failedExperimentsSummary: 'None.',
      founderBottleneckBelief: 'We need to build 5 new integrations (Jira, Linear, Asana, Google Docs, Notion) to get visitors to sign up.'
    },
    expectedCategory: 'positioning_offer',
    expectedPrimaryAction: 'Extract verbatim value proposition from the 7 paying customers and test an outcome-aligned headline against current feature copy',
    expectedExperimentKeyword: 'Alignment',
    criticalUnknowns: [
      'Does the homepage headline clearly convey the instant cross-wiki search benefit that paying customers value?',
      'Can visitor-to-signup conversion be doubled purely through messaging alignment without new feature development?'
    ],
    acceptableAlternativeExplanations: [
      'Activation & Value Realization (if signup onboarding is confusing)',
      'Sales conversion'
    ],
    failureConditions: [
      'Recommending building 5 new integrations before fixing the confusing homepage headline',
      'Ignoring the 7 retaining paying customers and their clear verbatim reason for buying'
    ]
  }
];

export interface TestBenchResult {
  testId: string;
  testCode: string;
  testTitle: string;
  passed: boolean;
  actualCategory: string;
  expectedCategory: string;
  primaryActionSummary: string;
  experimentVerified: boolean;
  conflictsDetected: string[];
  failureFlags: string[];
  executionTimeMs: number;
}

/**
 * Executes automated test suite on all test cases (including edge and paying-customer scenarios)
 * and evaluates both diagnosis & experiment.
 */
export function runAutomatedTestBench(): TestBenchResult[] {
  return TEST_CASES.map(tc => {
    const start = performance.now();
    const evaluation = runDeterministicDiagnosis(tc.profile);
    const executionTimeMs = Math.round(performance.now() - start);

    const failureFlags: string[] = [];

    // Check 1: Category match
    const categoryMatched = evaluation.category === tc.expectedCategory;
    if (!categoryMatched) {
      failureFlags.push(`Category mismatch: Expected "${tc.expectedCategory}" but engine diagnosed "${evaluation.category}".`);
    }

    // Check 2: Experiment verification
    let experimentVerified = true;
    if (tc.expectedExperimentKeyword) {
      const expTitleAndHyp = `${evaluation.primaryExperiment.title} ${evaluation.primaryExperiment.hypothesis}`.toLowerCase();
      const kw = tc.expectedExperimentKeyword.toLowerCase();
      if (!expTitleAndHyp.includes(kw)) {
        experimentVerified = false;
        failureFlags.push(`Experiment mismatch: Expected experiment keyword "${tc.expectedExperimentKeyword}" was not found in generated experiment title.`);
      }
    }

    // Check 3: Evaluate specific failure condition rules
    const expText = `${evaluation.hypothesis} ${evaluation.primaryExperiment.title} ${evaluation.primaryExperiment.procedure.join(' ')} ${evaluation.priorityRationale}`.toLowerCase();

    if (tc.code === 'Test A') {
      if (expText.includes('paid ad') || expText.includes('scale acquisition') || expText.includes('discount')) {
        failureFlags.push('Severe Failure: Recommended paid ads or discounting when demand is unproven.');
      }
    } else if (tc.code === 'Test B') {
      if (expText.includes('soc2') || expText.includes('enterprise feature') || expText.includes('ignore freelancers')) {
        failureFlags.push('Severe Failure: Recommended enterprise expansion instead of focusing on validated freelancer niche.');
      }
    } else if (tc.code === 'Test C') {
      if (expText.includes('give up') || expText.includes('cold outreach is dead') || expText.includes('rewrite')) {
        failureFlags.push('Severe Failure: Concluded channel is dead on statistically insignificant sample of 6 emails.');
      }
    } else if (tc.code === 'Test D') {
      if (expText.includes('cut price') || expText.includes('lower price to $29') || expText.includes('free tier')) {
        failureFlags.push('Severe Failure: Recommended price cuts when objection is procurement authority.');
      }
    } else if (tc.code === 'Test E') {
      if (expText.includes('paid influencer') || expText.includes('more ads') || expText.includes('subtitle preset')) {
        failureFlags.push('Severe Failure: Recommended top-of-funnel scaling while 82% onboarding drop-off remains unaddressed.');
      }
    } else if (tc.code === 'Test F') {
      if (expText.includes('hire sdr') || expText.includes('scale cold email') || expText.includes('ignore retention')) {
        failureFlags.push('Severe Failure: Recommended selling more accounts while customer base is severely churning.');
      }
    } else if (tc.code === 'Test G') {
      if (expText.includes('ignore agencies') && expText.includes('keep free')) {
        failureFlags.push('Severe Failure: Confused 85 free users with viable business model.');
      }
    } else if (tc.code === 'Test H') {
      if (evaluation.category !== 'insufficient_evidence') {
        failureFlags.push('Severe Failure: Forced an arbitrary diagnosis on 4 website visits instead of diagnosing insufficient evidence.');
      }
    } else if (tc.code === 'Test I') {
      if (expText.includes('500 cold email') || expText.includes('google ad') || expText.includes('blast 500')) {
        failureFlags.push('Severe Failure: Prescribed scaling outreach or paid ads without auditing the 4 paying customers for purchase motivation and attribution.');
      }
    } else if (tc.code === 'Test J') {
      if (expText.includes('build 5 new') || expText.includes('build integrations') || expText.includes('jira integration')) {
        failureFlags.push('Severe Failure: Recommended building new integrations before fixing the confusing headline.');
      }
    }

    return {
      testId: tc.id,
      testCode: tc.code,
      testTitle: tc.title,
      passed: categoryMatched && experimentVerified && failureFlags.length === 0,
      actualCategory: evaluation.category,
      expectedCategory: tc.expectedCategory,
      primaryActionSummary: evaluation.primaryExperiment.title,
      experimentVerified,
      conflictsDetected: evaluation.conflictingSignals,
      failureFlags,
      executionTimeMs
    };
  });
}
