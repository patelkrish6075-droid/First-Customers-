import { BusinessProfile, CustomerResearchRecord } from '../types';

export function generateCustomerResearch(profile: BusinessProfile): CustomerResearchRecord {
  const buyer = profile.targetBuyer || 'Software Practitioners and Founders';
  const problem = profile.specificProblem || 'Manual operational friction';
  const category = profile.productCategory || 'B2B Software';

  return {
    id: `res-${Date.now()}`,
    profileId: profile.id,
    createdAt: new Date().toISOString(),
    icps: [
      {
        segment: 'Primary Practitioner & Daily User',
        targetTitle: buyer,
        buyingTrigger: 'When a manual process breaks down during a peak sprint, or when an executive requests a report that takes 4 hours of copy-pasting to generate.',
        topFrictionPoint: 'Reluctance to learn another complex dashboard; desires an instant setup that integrates with existing workflows.',
        budgetAuthority: 'Corporate card / discretionary budget up to $50–$100/mo without formal procurement approval.',
        whereToFindThem: [
          'Specialized professional LinkedIn groups and active creator discussion threads',
          'Niche Reddit communities (e.g., r/SaaS, r/startups, r/productivity)',
          'Community Slack/Discord groups centered on modern workflow automation'
        ],
        highConvertingHook: `How much time does your team spend manually managing ${problem ? problem.slice(0, 35) : 'this process'} each week?`
      },
      {
        segment: 'Operations Lead / Department Head',
        targetTitle: 'Head of Operations / VP / Director',
        buyingTrigger: 'When scaling team headcount causes communication bottlenecks and errors in manual records.',
        topFrictionPoint: 'Security compliance, vendor lock-in, and whether the tool will actually be adopted by the team.',
        budgetAuthority: 'Formal departmental budget up to $1,000–$5,000/year with CFO or Director sign-off.',
        whereToFindThem: [
          'Industry trade conferences and executive roundtables',
          'Peer recommendation networks on LinkedIn',
          'Professional associations and curated member directories'
        ],
        highConvertingHook: `We helped teams cut 6 hours of weekly administrative overhead in ${category}. Happy to share the teardown.`
      }
    ],
    competitorLandscape: [
      {
        competitor: 'Manual Status Quo (Google Sheets / Excel)',
        category: 'Status Quo Alternative',
        estimatedPricePoint: 'Free (included in Google Workspace/Microsoft 365)',
        weaknessOrVulnerability: 'Requires continuous manual data hygiene, has no automated state transitions or reminders, and lacks an audit trail.',
        differentiationStrategy: 'Highlight hours wasted and potential data loss from accidental cell overwrites.'
      },
      {
        competitor: 'Legacy Enterprise incumbent',
        category: 'Direct Enterprise Competitor',
        estimatedPricePoint: '$40–$200/seat/month with annual upfront commitments',
        weaknessOrVulnerability: 'Bloated, slow interface with months-long implementation cycles and steep learning curves.',
        differentiationStrategy: 'Position as the lightweight, modern alternative: zero setup delay, self-serve, and focused strictly on the core workflow.'
      },
      {
        competitor: 'Point-Solution Startup Competitors',
        category: 'Niche Emerging Competitor',
        estimatedPricePoint: '$29–$79/month',
        weaknessOrVulnerability: 'Often lack responsive customer support or fail to solve the end-to-end user loop.',
        differentiationStrategy: 'Deliver white-glove founder onboarding and fast feature turnaround on verified customer feedback.'
      }
    ],
    marketTrends: [
      {
        trendTitle: 'Tool Consolidation & Scrutiny on Shelfware',
        impactOnBuyer: 'Executives are cutting unessential SaaS subscriptions. Your tool must show direct time savings or revenue protection within the first 14 days.',
        verifiableCitation: 'Documented in industry enterprise spending reports: Gartner & Bessemer Cloud Index'
      },
      {
        trendTitle: 'Preference for Self-Serve & Transparent Pricing',
        impactOnBuyer: 'Modern practitioners resent "Contact Sales for a Quote" walls. Public pricing and frictionless trials accelerate early adoption.',
        verifiableCitation: 'OpenView Product-Led Growth Benchmarks'
      }
    ],
    publicDiscussionForums: [
      {
        platform: 'Reddit',
        communityName: 'r/SaaS & r/startups',
        relevantKeywords: [buyer.toLowerCase(), 'workaround', 'recommendation', 'alternative'],
        sampleDiscussionPrompt: 'What tools are you using to automate manual workflows? Is anyone else frustrated with legacy software?'
      },
      {
        platform: 'Twitter / X',
        communityName: 'BuildInPublic & Tech Founders',
        relevantKeywords: ['founder problems', 'first customers', 'SaaS launch'],
        sampleDiscussionPrompt: 'Ask peers: How did you acquire your first 5 paying B2B customers without spending money on ads?'
      }
    ],
    acquisitionOpportunities: [
      `Partner with complementary agency service providers who set up systems for ${buyer}`,
      'Write an unbiased comparison teardown article ranking the top 5 ways teams solve this workflow',
      'Host a live 20-minute screen-share clinic auditing workflow breakdowns for volunteer participants'
    ]
  };
}
