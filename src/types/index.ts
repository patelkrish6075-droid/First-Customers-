export type BusinessStage = 'idea' | 'prototype' | 'beta' | 'launched' | 'growing';

export type ProductChannel = 
  | 'cold_outreach'
  | 'linkedin'
  | 'twitter_x'
  | 'seo_content'
  | 'communities_slack_reddit'
  | 'paid_ads'
  | 'directories_producthunt'
  | 'referrals_word_of_mouth'
  | 'events_partnerships'
  | 'other';

export interface ChannelAttempt {
  channel: ProductChannel;
  channelNameCustom?: string;
  prospectsReached: number | 'unknown';
  repliesOrConversations: number | 'unknown';
  demosOrCalls: number | 'unknown';
  trialsOrActivations: number | 'unknown';
  purchases: number | 'unknown';
  estimatedSpend: number | 'unknown';
  durationWeeks: number | 'unknown';
  consistencyNotes?: string;
}

export interface BusinessProfile {
  id: string;
  updatedAt: string;
  isDemo?: boolean;

  // Step 1: Product
  productName: string;
  taglineOrSummary: string;
  productCategory: string;
  websiteUrl?: string;
  stage: BusinessStage;
  monthsSinceLaunch: number | 'unknown';

  // Step 2: Customer and problem
  targetBuyer: string;
  actualUsers: string;
  specificProblem: string;
  currentWorkarounds: string;
  problemImportanceEvidence: string;
  spendingOnAlternatives: 'yes' | 'no' | 'unclear' | 'unknown';
  spendingDetails?: string;
  founderAssumptionsEvidence: string;

  // Step 3: Traction
  payingCustomers: number | 'unknown';
  mrr: number | 'unknown';
  currency: string;
  freeUsers: number | 'unknown';
  trialsOrSignups: number | 'unknown';
  repeatUsageKnown: 'yes' | 'no' | 'unknown';
  repeatUsageDetails?: string;
  retentionDetails?: string;
  cancellationsCount?: number | 'unknown';

  // Step 4: Acquisition
  channels: ChannelAttempt[];
  websiteVisitorsMonthly: number | 'unknown';
  qualitativeFunnelObservations?: string;

  // Step 5: Feedback and sales
  prospectFeedbackSummary: string;
  commonObjections: string;
  reasonsCustomersBought?: string;
  reasonsProspectsRefused: string;
  dropOffStage: 'traffic_to_signup' | 'signup_to_activation' | 'demo_to_purchase' | 'trial_to_paid' | 'first_month_churn' | 'unknown';
  observedCustomerSessions: 'yes' | 'no' | 'partial';
  observedSessionsNotes?: string;

  // Step 6: Constraints and past attempts
  availableHoursPerWeek: number;
  availableMonthlyBudget: number;
  teamSize: number;
  relevantSkills: string;
  pastChangesTried: string;
  failedExperimentsSummary: string;
  founderBottleneckBelief: string;
}

export type BottleneckCategory = 
  | 'demand_validation'
  | 'target_customer'
  | 'acquisition_reach'
  | 'positioning_offer'
  | 'sales_conversion'
  | 'activation_value'
  | 'pricing_purchasing'
  | 'retention_recurring_value'
  | 'insufficient_evidence';

export type DiagnosticStatus = 
  | 'provisional_diagnosis'
  | 'additional_evidence_needed'
  | 'experiment_ready'
  | 'results_awaiting_review';

export interface ExperimentPlan {
  id: string;
  title: string;
  hypothesis: string;
  targetAudience: string;
  timeFrame: string;
  procedure: string[];
  requiredResources: {
    timeHours: number;
    moneyBudget: number;
    toolsOrSkills: string;
  };
  metricsToRecord: string[];
  supportingEvidenceOutcome: string;
  contradictoryEvidenceOutcome: string;
  inconclusiveCriteria: string;
  nextActionSupporting: string;
  nextActionContradictory: string;
  nextActionInconclusive: string;
}

export interface DiagnosticReport {
  id: string;
  profileId: string;
  createdAt: string;
  provider: 'openai' | 'gemini' | 'demo';
  modelUsed?: string;
  disclaimer?: string;

  businessSummary: string;
  observedFacts: string[];
  founderInterpretations: string[];
  missingOrUnreliableData: string[];
  conflictingSignals?: string[];
  
  leadingBottleneckCategory: BottleneckCategory;
  leadingHypothesis: string;
  primaryUnansweredQuestion?: string;
  whyUncertaintyMatters?: string;
  smallestPracticalExperimentSummary?: string;
  supportingEvidence: string[];
  competingExplanations: string[];
  criticalUnknowns: string[];
  priorityRationale: string;
  provisionalStatus: DiagnosticStatus;

  primaryExperiment: ExperimentPlan;

  limitations: string[];
  sources?: { title: string; note: string; url?: string }[];
}

export type ExperimentStatus = 'planned' | 'active' | 'completed' | 'inconclusive' | 'abandoned';

export interface TrackedExperiment {
  id: string;
  reportId?: string;
  name: string;
  category: BottleneckCategory;
  hypothesis: string;
  targetAudience: string;
  timeFrame?: string;
  procedure: string[];
  startDate: string;
  reviewDate: string;
  requiredResources: {
    timeHours: number;
    moneyBudget: number;
    toolsOrSkills: string;
  };
  metricsToRecord: string[];
  initialAssumptions: string;
  status: ExperimentStatus;

  // Results recorded upon return
  observedResults?: {
    recordedDate: string;
    metricsValues: Record<string, string>;
    qualitativeFindings: string;
    unexpectedFindings?: string;
  };

  // Evaluation & review
  evaluation?: {
    reviewedAt: string;
    supportingEvidenceFound: string;
    contradictoryEvidenceFound: string;
    missingMeasurementsIdentified: string[];
    outcomeSummary: string;
    interpretationSeparation: string;
    updatedConclusion: string;
    nextRecommendedAction: string;
    recommendationShifted: boolean;
  };
}

export interface AppAnalytics {
  intakeCompletions: number;
  reportGenerations: number;
  experimentsSaved: number;
  experimentsStarted: number;
  resultsRecorded: number;
  reviewsCompleted: number;
  recommendationsShifted: number;
}

export interface TestCase {
  id: string;
  code: string;
  title: string;
  name?: string;
  archetype?: string;
  scenarioDescription: string;
  expectedCategory: BottleneckCategory;
  expectedPrimaryAction: string;
  rationale?: string;
  profile: BusinessProfile;
  expectedExperimentKeyword?: string;
  criticalUnknowns: string[];
  acceptableAlternativeExplanations: string[];
  failureConditions: string[];
}

// User & Workspace Authentication Models
export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  isDemo: boolean;
  createdAt: string;
}

// Module B: Market Validator Structured Assessment
export interface MarketValidationReport {
  id: string;
  profileId: string;
  createdAt: string;
  problemSeverity: 'critical' | 'moderate' | 'low' | 'unknown';
  problemFrequency: 'daily' | 'weekly' | 'occasional' | 'unknown';
  problemSummary: string;
  competitorsAndAlternatives: {
    name: string;
    type: 'direct_competitor' | 'status_quo_excel' | 'agency_manual' | 'free_tool';
    pricingSummary: string;
    keyDeficiency: string;
  }[];
  targetCustomerSegments: {
    segmentName: string;
    buyerRole: string;
    purchaseLikelihood: 'high' | 'medium' | 'low';
    rationale: string;
  }[];
  demandEvidence: {
    verifiedFacts: string[];
    userProvidedStatements: string[];
    inferredHypotheses: string[];
    criticalUnknowns: string[];
  };
  willingnessToPaySignals: {
    signal: string;
    strength: 'strong' | 'weak' | 'untested';
    evidence: string;
  }[];
  differentiationAndPositioning: {
    claimedAdvantage: string;
    buyerRealityCheck: string;
    isDefensible: boolean;
  };
  distributionChallenges: string[];
  mainAssumptionsRequiringValidation: string[];
  risksAndMissingEvidence: string[];
  recommendedValidationExperiment: ExperimentPlan;
}

// Module C: Customer and Market Research
export interface CustomerResearchRecord {
  id: string;
  profileId: string;
  createdAt: string;
  icps: {
    segment: string;
    targetTitle: string;
    buyingTrigger: string;
    topFrictionPoint: string;
    budgetAuthority: string;
    whereToFindThem: string[];
    highConvertingHook: string;
  }[];
  competitorLandscape: {
    competitor: string;
    category: string;
    estimatedPricePoint: string;
    weaknessOrVulnerability: string;
    differentiationStrategy: string;
  }[];
  marketTrends: {
    trendTitle: string;
    impactOnBuyer: string;
    verifiableCitation?: string;
  }[];
  publicDiscussionForums: {
    platform: string;
    communityName: string;
    relevantKeywords: string[];
    searchUrl?: string;
    sampleDiscussionPrompt: string;
  }[];
  acquisitionOpportunities: string[];
}

// Module D: Customer Acquisition Engine
export interface AcquisitionChannelPlan {
  id: string;
  channelKey: ProductChannel;
  title: string;
  suitabilityScore: number; // 0 to 100
  suitabilityReason: string;
  targetAudience: string;
  prospectIdentificationCriteria: string[];
  exactFirstSteps: string[];
  sampleOutreachTemplates: {
    templateName: string;
    subjectLine?: string;
    messageBody: string;
    followUpBody?: string;
    tacticalNote: string;
  }[];
  timeRequirementHoursPerWeek: number;
  estimatedCostMonthly: number;
  measurableSuccessCriteria: string;
  risksAndFailureModes: string[];
  iterationPlan: string;
}

// Module G: Sales and Conversion Diagnosis
export interface SalesFunnelData {
  prospectsContacted: number;
  repliesReceived: number;
  meetingsBooked: number;
  trialsOrDemosStarted: number;
  proposalsSent: number;
  customersAcquired: number;
  revenueGenerated: number;
  trackingPeriodWeeks: number;
}

export interface SalesDiagnosisReport {
  id: string;
  evaluatedAt: string;
  funnelData: SalesFunnelData;
  sampleSizeAdequate: boolean;
  sampleSizeWarning?: string;
  metrics: {
    replyRatePct: number;
    meetingBookingRatePct: number;
    demoStartRatePct: number;
    proposalCloseRatePct: number;
    overallFunnelConversionPct: number;
    effectiveCAC: number;
  };
  primaryBottleneck: 'prospecting' | 'messaging' | 'meeting_conversion' | 'product_value_demo' | 'pricing_closing' | 'insufficient_sample';
  diagnosisTitle: string;
  transparentCalculations: string[];
  frictionAnalysis: string;
  recommendedImmediateAction: string;
}

// Module H: What Should I Do Next? (Core Action Plan)
export interface NextActionItem {
  id: string;
  priorityRank: 1 | 2 | 3;
  actionTitle: string;
  category: BottleneckCategory;
  whyPriorityNow: string;
  supportingEvidence: string[];
  whatRemainsUncertain: string[];
  timeEstimateHours: number;
  costEstimateDollars: number;
  exactExecutionSteps: string[];
  measurableSuccessThreshold: string;
  whatIfItSucceeds: string;
  whatIfItFails: string;
}

// Module F: Founder Lessons Library
export interface FounderCaseStudy {
  id: string;
  companyName: string;
  founderNames: string;
  industry: string;
  stage: 'zero_to_one' | 'early_traction' | 'scale';
  businessModel: 'b2b_saas' | 'b2c_freemium' | 'marketplace' | 'prosumer';
  primaryChallenge: BottleneckCategory;
  situation: string;
  decision: string;
  evidenceAvailableAtTime: string;
  outcomeDocumented: string;
  coreLesson: string;
  whatAppliesToYourProduct: string;
  whatMayNotTransfer: string;
  sources: {
    title: string;
    publisher: string;
    year: string;
    url?: string;
  }[];
}

// Module K: Integrations
export interface IntegrationConnection {
  id: string;
  name: string;
  category: 'analytics' | 'crm' | 'email' | 'calendar' | 'research' | 'mcp_agent';
  description: string;
  status: 'connected' | 'not_connected' | 'planned';
  configuredKeyOrWebhook?: string;
  lastSyncAt?: string;
}

// Module I: AI Assistant Chat Message
export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  referencedPillars?: string[];
}

export type ActiveAppView = 
  | 'landing'
  | 'features'
  | 'free_validator'
  | 'auth_login'
  | 'auth_signup'
  | 'auth_recover'
  | 'onboarding'
  | 'dashboard'
  | 'market_validation'
  | 'customer_research'
  | 'acquisition_plans'
  | 'experiment_workspace'
  | 'founder_lessons'
  | 'sales_diagnosis'
  | 'next_actions'
  | 'ai_assistant'
  | 'reports'
  | 'integrations'
  | 'pricing'
  | 'settings'
  | 'privacy'
  | 'help_docs';
