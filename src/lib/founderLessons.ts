import { FounderCaseStudy } from '../types';

export const FOUNDER_CASE_STUDIES: FounderCaseStudy[] = [
  {
    id: 'case-buffer',
    companyName: 'Buffer',
    founderNames: 'Joel Gascoigne',
    industry: 'Social Media Management',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'demand_validation',
    situation: 'In 2010, Joel Gascoigne wanted to build a scheduled publishing tool for Twitter. Instead of spending months coding the backend, he needed to know if anyone would actually pay money for scheduled tweets before building anything.',
    decision: 'Built a 2-page static site in 2 hours with a pricing plans table ($0, $5, $20) connected to an email collection form stating "We are not quite ready yet, enter your email to get early access."',
    evidenceAvailableAtTime: 'Zero existing code. 100+ tweets posted into niche communities. 120 visitors visited the site, and a measurable percentage clicked the paid plan buttons rather than the free plan, inputting their real email address.',
    outcomeDocumented: 'Multiple people clicked the $5/mo button and entered their emails. Joel then built the minimal functional version in 7 weeks. Grew to $1M+ ARR within 2 years without venture capital.',
    coreLesson: 'Willingness to pay can and must be tested before software is written. A user clicking a pricing button reveals significantly higher intent than a verbal compliment.',
    whatAppliesToYourProduct: 'If you have low traction, check if you have validated willingness to pay or merely general interest. Test pricing page conversion with a lightweight experiment.',
    whatMayNotTransfer: 'Twitter in 2010 had an open API and rapid organic viral discovery that does not exist in today’s saturated social ecosystems.',
    sources: [
      {
        title: 'Idea to paying customers in 7 weeks: how we did it',
        publisher: 'Joel.is Blog',
        year: '2011',
        url: 'https://joel.is/idea-to-paying-customers-in-7-weeks/'
      }
    ]
  },
  {
    id: 'case-superhuman',
    companyName: 'Superhuman',
    founderNames: 'Rahul Vohra',
    industry: 'Productivity & Email Client',
    stage: 'early_traction',
    businessModel: 'prosumer',
    primaryChallenge: 'positioning_offer',
    situation: 'Superhuman had built an ultra-fast email client priced at $30/mo, but was struggling with scattered user feedback. Some users loved it, others demanded endless features that would dilute the core value proposition.',
    decision: 'Implemented the Sean Ellis 40% PMF benchmark survey: asked active users "How would you feel if you could no longer use Superhuman?" Isolated the segment that answered "Very Disappointed" and focused exclusively on their persona.',
    evidenceAvailableAtTime: 'Initially only 22% of users answered "Very Disappointed" (below the 40% PMF threshold). By filtering out users whose primary role was not keyboard-centric executives/founders, the metric surged to 58%.',
    outcomeDocumented: 'Turned away users who did not fit the core ICP. Accelerated word-of-mouth growth with a 100,000+ person waitlist and high retention.',
    coreLesson: 'Trying to please every curious signup dilutes your product positioning. Double down on the specific cohort that would be deeply disappointed if your product vanished.',
    whatAppliesToYourProduct: 'Identify which specific users derive immediate utility from your tool, and eliminate distracting requests from non-buyers.',
    whatMayNotTransfer: 'Superhuman raised significant capital to sustain a high-touch, concierge onboarding process that solo bootstrapped founders cannot always afford at scale.',
    sources: [
      {
        title: 'How Superhuman Built an Engine to Find Product Market Fit',
        publisher: 'First Round Review',
        year: '2018',
        url: 'https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/'
      }
    ]
  },
  {
    id: 'case-convertkit',
    companyName: 'Kit (formerly ConvertKit)',
    founderNames: 'Nathan Barry',
    industry: 'Creator Marketing & Newsletters',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'sales_conversion',
    situation: 'After 18 months, ConvertKit was stagnating at $2,000/mo MRR. Nathan had tried content marketing, blogging, and passive signups, but churn was high and customer acquisition was stalling out.',
    decision: 'Committed to doing pure direct founder sales outreach. Personally reached out to professional bloggers on Mailchimp, offering free white-glove migration: "Give me your login, I will manually transfer your forms, tags, and subscribers this weekend for free."',
    evidenceAvailableAtTime: 'Prospects were declining to switch because the migration switching cost was too high, not because the software was worse than Mailchimp.',
    outcomeDocumented: 'Conversion rate soared from single digits to over 70% on personalized calls. Scaled from $2k MRR to over $100k MRR in under 18 months.',
    coreLesson: 'Early customer acquisition requires doing things that do not scale. Eliminating the customer’s switching cost directly converts hesitant evaluators into loyal buyers.',
    whatAppliesToYourProduct: 'If prospects drop off before completing setup, offer to do the onboarding or setup manually for them to observe exactly where friction occurs.',
    whatMayNotTransfer: 'Manual migration works when average customer lifetime value is hundreds of dollars per year. It does not work for $5 one-off utility apps.',
    sources: [
      {
        title: 'The Web App Challenge: $0 to $5,000/mo',
        publisher: 'Nathan Barry Essays',
        year: '2015',
        url: 'https://nathanbarry.com/convertkit-history/'
      }
    ]
  },
  {
    id: 'case-segment',
    companyName: 'Segment',
    founderNames: 'Peter Reinhardt, Calvin French-Owen, Ilya Volodarsky, Ian Storm Taylor',
    industry: 'Data Infrastructure & Analytics',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'demand_validation',
    situation: 'The founders had spent over a year building an automated university classroom analytics tool and an analytics dashboard. Nobody wanted either product. They had 3 months of runway remaining before bankruptcy.',
    decision: 'Cleaned up a 500-line open-source JavaScript library (`analytics.js`) they had written for their own internal debugging and posted it to Hacker News as a standalone utility with a simple landing page.',
    evidenceAvailableAtTime: 'The classroom tool had 0 daily active users despite thousands of lines of code. The 500-line library instantly hit #1 on Hacker News with hundreds of GitHub stars and requests for hosted integration.',
    outcomeDocumented: 'Pivoted completely to data piping infrastructure. Segment was acquired by Twilio for $3.2 Billion in 2020.',
    coreLesson: 'The tool you built as an internal helper or side script often has stronger immediate demand than the grand conceptual product you spent months over-engineering.',
    whatAppliesToYourProduct: 'Listen to what users or engineers actually extract from your product versus the complex features you assumed they needed.',
    whatMayNotTransfer: 'Developer tools with immediate open-source appeal have unique viral developer dynamics that consumer or non-technical B2B apps do not share.',
    sources: [
      {
        title: 'The Idea That Stood for 2 Weeks: The Segment Story',
        publisher: 'Mixpanel Tech Talks & Y Combinator',
        year: '2015',
        url: 'https://segment.com/blog/how-we-found-product-market-fit/'
      }
    ]
  },
  {
    id: 'case-dropbox',
    companyName: 'Dropbox',
    founderNames: 'Drew Houston',
    industry: 'Cloud Storage & Sync',
    stage: 'zero_to_one',
    businessModel: 'b2c_freemium',
    primaryChallenge: 'acquisition_reach',
    situation: 'Drew Houston had created a reliable desktop folder synchronization engine in Python/C++. Google Adwords keywords like "online file storage" cost $300 per customer acquisition for a $99/year product, completely destroying the unit economics.',
    decision: 'Abandoned paid search advertising. Created a 3-minute screen-recording demonstration video tailored specifically for the Digg and Hacker News communities with inside jokes and real technical nuances.',
    evidenceAvailableAtTime: 'Search ads resulted in negative ROI and indifferent signups. The Digg/HN community deeply appreciated technical authenticity over polished ad copy.',
    outcomeDocumented: 'Overnight, the waitlist jumped from 5,000 to over 75,000 tech-forward users. Later introduced a two-sided referral program (500MB free storage) that permanently reduced CAC to near zero.',
    coreLesson: 'When paid acquisition unit economics do not work, find the specific high-affinity community where your technical differentiation is instantly recognized.',
    whatAppliesToYourProduct: 'If paid ads are burning budget without conversions, stop spending. Showcase the product in action to a community that already experiences the underlying pain.',
    whatMayNotTransfer: 'Desktop-level file system utilities were a brand-new computing paradigm in 2008 with massive organic novelty that commoditized SaaS products cannot easily reproduce.',
    sources: [
      {
        title: 'Dropbox: How We Grew from 100k to 4M Users in 15 Months',
        publisher: 'TechCrunch & Startup Lessons Learned',
        year: '2010',
        url: 'https://techcrunch.com/2011/10/19/dropbox-growth/'
      }
    ]
  },
  {
    id: 'case-zapier',
    companyName: 'Zapier',
    founderNames: 'Wade Foster, Bryan Helmig, Mike Knoop',
    industry: 'Workflow Automation',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'acquisition_reach',
    situation: 'In 2011, Zapier had no users and no marketing budget. They wanted to connect SaaS APIs so non-programmers could pass data between tools without coding.',
    decision: 'Scoured the developer support forums of existing SaaS tools (such as Highrise, Mailchimp, and Zendesk). Whenever a user posted "Does anyone have a way to connect Highrise with Mailchimp?", the founders replied with a link to a tailored landing page offering the exact connector.',
    evidenceAvailableAtTime: 'Users in support forums were actively expressing acute, unsolved pain points at the exact moment of search intent.',
    outcomeDocumented: 'Acquired their first 100 paying customers directly from forum replies and partner community discussions. Bootstrapped to hundreds of millions in ARR with a single early seed round.',
    coreLesson: 'Intercept high-intent users where they are already complaining about the absence of your solution, rather than creating artificial traffic from scratch.',
    whatAppliesToYourProduct: 'Monitor customer support communities, subreddits, and forum threads where buyers complain about current tools failing to solve the exact problem you address.',
    whatMayNotTransfer: 'Many modern platforms now moderate or restrict external promotional links in their support forums.',
    sources: [
      {
        title: 'From 0 to 100,000 Users: How Zapier Bootstrapped Growth',
        publisher: 'Zapier Official Engineering Blog',
        year: '2014',
        url: 'https://zapier.com/blog/how-we-launched-zapier/'
      }
    ]
  },
  {
    id: 'case-loom',
    companyName: 'Loom',
    founderNames: 'Joe Thomas, Shahed Khan, Vinay Hiremath',
    industry: 'Async Video Communication',
    stage: 'zero_to_one',
    businessModel: 'prosumer',
    primaryChallenge: 'demand_validation',
    situation: 'The founders had spent 18 months building an expert user testing marketplace called Opentest. It had 0 traction and they had 2 weeks of runway left in the bank account.',
    decision: 'Stripped away the entire marketplace, kept only the Chrome extension screen-recording widget, polished it so it copied a shareable link immediately upon recording, and launched it for free on Product Hunt as "Opentest Loom".',
    evidenceAvailableAtTime: 'The marketplace was too complex and two-sided. The Chrome extension was lightweight and solved an immediate frictionless need: asynchronous communication.',
    outcomeDocumented: '3,000 signups on launch day. Reached 100,000 users in months through viral viewer-to-creator loops. Loom was acquired by Atlassian for $975M in 2023.',
    coreLesson: 'Removing friction from value delivery often turns a failed product into an overnight viral utility. Isolate the atomic unit of value.',
    whatAppliesToYourProduct: 'If your full product requires complex configuration, see if there is an atomic, one-click feature that can deliver immediate utility.',
    whatMayNotTransfer: 'Loom had an inherent product-led viral loop (every video sent exposed a new potential user to Loom). Products without built-in viral distribution cannot rely solely on free launches.',
    sources: [
      {
        title: 'How Loom Survived Near-Death to Build a Video Empire',
        publisher: 'Lenny\'s Newsletter',
        year: '2021',
        url: 'https://www.lennysnewsletter.com/p/how-loom-grew'
      }
    ]
  },
  {
    id: 'case-basecamp',
    companyName: 'Basecamp (37signals)',
    founderNames: 'Jason Fried, David Heinemeier Hansson',
    industry: 'Project Management & Team Collaboration',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'pricing_purchasing',
    situation: '37signals was a busy web design agency in 2003. They struggled to keep client feedback, design mockups, and deadlines organized over email. Existing enterprise project management tools (like Microsoft Project) were bloated and expensive.',
    decision: 'Built an ultra-simple web tool for their own agency clients. When clients started asking "Can we use this internal tool for our own separate projects?", they packaged Basecamp as a paid subscription ($12/mo to $99/mo) with flat monthly pricing rather than per-user seats.',
    evidenceAvailableAtTime: 'Real paying design clients voluntarily asked to pay for the internal tool because it made their daily work easier than existing alternatives.',
    outcomeDocumented: 'Basecamp generated more revenue than the agency within one year. 37signals shut down agency client work entirely to focus on Basecamp, generating hundreds of millions in profit.',
    coreLesson: 'Solving your own real operational problem creates an authentic product. Selling to businesses who already know and respect your work creates immediate early trust.',
    whatAppliesToYourProduct: 'Examine whether your software solves an urgent workflow issue for businesses with whom you already have relationships or domain credibility.',
    whatMayNotTransfer: '37signals already had a popular web design blog (Signal vs. Noise) with thousands of loyal readers before Basecamp launched, giving them a distribution advantage.',
    sources: [
      {
        title: 'Rework: Business Lessons from 37signals',
        publisher: 'Crown Publishing',
        year: '2010',
        url: 'https://basecamp.com/books/rework'
      }
    ]
  },
  {
    id: 'case-posthog',
    companyName: 'PostHog',
    founderNames: 'James Hawkins, Tim Glaser',
    industry: 'Product Analytics & Developer Tools',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'demand_validation',
    situation: 'After pivoting through 5 different startup ideas in Y Combinator (including an automated code review tool), the founders had 2 weeks left before demo day with 0 users and no traction.',
    decision: 'Decided to open-source an open, self-hosted alternative to Mixpanel and Amplitude, posting the GitHub repository directly to Hacker News with an honest founder message explaining why product analytics should be open-source and privacy-compliant.',
    evidenceAvailableAtTime: 'Previous 5 ideas failed because developers didn’t care enough to install or pay for them. Privacy regulations (GDPR/HIPAA) were making SaaS analytics increasingly difficult for health and enterprise teams.',
    outcomeDocumented: 'Over 3,000 GitHub stars within a week, hundreds of community deployments, and rapid viral developer adoption. Grew to tens of millions in ARR with high capital efficiency.',
    coreLesson: 'Radical transparency and aligning with a major regulatory or market shift (e.g., privacy/self-hosting) creates an immediate tailwind.',
    whatAppliesToYourProduct: 'Identify whether macro shifts (regulation, AI changes, pricing hikes by incumbents) create an opening for an alternative positioning.',
    whatMayNotTransfer: 'Open-source business models require high engineering leverage and strong developer empathy; this model fails for general enterprise or consumer apps.',
    sources: [
      {
        title: 'PostHog Pivot: How We Went from 0 to 3,000 GitHub Stars in a Week',
        publisher: 'PostHog Blog',
        year: '2020',
        url: 'https://posthog.com/blog/story-of-posthog'
      }
    ]
  },
  {
    id: 'case-figma',
    companyName: 'Figma',
    founderNames: 'Dylan Field, Evan Wallace',
    industry: 'Design Software & Collaboration',
    stage: 'zero_to_one',
    businessModel: 'b2b_saas',
    primaryChallenge: 'activation_value',
    situation: 'In 2012–2015, Sketch and Adobe were the undisputed design standards, but both were offline desktop applications. Figma spent years engineering WebGL rendering in the browser, but early designers scoffed at the idea of designing in a web tab.',
    decision: 'Instead of doing a massive public ad push, Dylan Field ran a closed, high-touch private beta. He personally invited respected Twitter design leaders (like designer Daniel Burka and Twitter designers) and watched them use the tool live over video calls.',
    evidenceAvailableAtTime: 'Designers resisted switching until they experienced multiplayer live cursor collaboration with teammates during an active sprint.',
    outcomeDocumented: 'Initial design influencers became vocal organic champions. Multiplayer collaboration turned Figma into an industry-standard product with tens of millions of users.',
    coreLesson: 'When introducing a new paradigm, invite high-influence early adopters into a closed feedback loop and watch them work live until the activation breakthrough is crystal clear.',
    whatAppliesToYourProduct: 'Watch real users interact with your software in real time rather than relying on automated logs. The moments of hesitation tell you where the product fails.',
    whatMayNotTransfer: 'Figma required deep multi-year technical research and venture funding that bootstrapped founders cannot mirror.',
    sources: [
      {
        title: 'How Figma Became the Design Industry Standard',
        publisher: 'Wired & TechCrunch',
        year: '2020',
        url: 'https://www.wired.com/story/figma-design-tool-browser/'
      }
    ]
  }
];
