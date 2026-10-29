import { 
  BusinessProfile, 
  DiagnosticReport, 
  TrackedExperiment, 
  AppAnalytics, 
  UserAccount, 
  Workspace,
  MarketValidationReport,
  CustomerResearchRecord,
  SalesFunnelData,
  NextActionItem,
  IntegrationConnection,
  AssistantChatMessage
} from '../types';
import { generateDiagnosticReport } from './diagnosticEngine';

const STORAGE_KEYS = {
  PROFILE: 'fc_business_profile_v1',
  LATEST_REPORT: 'fc_latest_report_v1',
  EXPERIMENTS: 'fc_tracked_experiments_v1',
  ANALYTICS: 'fc_app_analytics_v1',
  USER: 'fc_active_user_v1',
  WORKSPACES: 'fc_workspaces_v1',
  ACTIVE_WORKSPACE_ID: 'fc_active_workspace_id_v1',
  MARKET_VALIDATION: 'fc_market_validation_v1',
  CUSTOMER_RESEARCH: 'fc_customer_research_v1',
  FUNNEL_DATA: 'fc_funnel_data_v1',
  NEXT_ACTIONS: 'fc_next_actions_v1',
  INTEGRATIONS: 'fc_integrations_v1',
  CHAT_MESSAGES: 'fc_chat_messages_v1'
};

export const DEFAULT_USER: UserAccount = {
  id: 'usr-founder-1',
  email: 'patelkrish6075@gmail.com',
  fullName: 'Krish Patel',
  companyName: 'My Startup Workspace',
  role: 'Founder & Builder',
  plan: 'pro',
  createdAt: '2026-10-01T00:00:00.000Z'
};

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-live-product',
    name: 'My SaaS Product (Live)',
    slug: 'my-product',
    ownerId: 'usr-founder-1',
    isDemo: false,
    createdAt: '2026-10-01T00:00:00.000Z'
  },
  {
    id: 'ws-demo-clinic',
    name: 'ClinicFlow (Sample Clinic)',
    slug: 'clinic-demo',
    ownerId: 'usr-founder-1',
    isDemo: true,
    createdAt: '2026-10-01T00:00:00.000Z'
  }
];

export const CLINIC_DEMO_PROFILE: BusinessProfile = {
  id: 'demo-clinic-flow',
  isDemo: true,
  updatedAt: new Date().toISOString(),
  productName: 'ClinicFlow',
  taglineOrSummary: 'Automated patient self-scheduling and reminder assistant for independent medical clinics.',
  productCategory: 'Healthcare SaaS / Clinic Workflow',
  websiteUrl: 'https://clinicflow-example.demo',
  stage: 'launched',
  monthsSinceLaunch: 4,
  targetBuyer: 'Independent specialty medical clinic practice managers (3-10 staff)',
  actualUsers: 'Front desk receptionists and medical assistants',
  specificProblem: 'Clinics experience 15-20% patient no-show rates and lose 2 hours daily on telephone rescheduling.',
  currentWorkarounds: 'Phone calls, paper appointment cards, and legacy desktop EMR calendar modules.',
  problemImportanceEvidence: 'Clinic managers complain about no-shows in trade forums, but daily operations continue regardless.',
  spendingOnAlternatives: 'yes',
  spendingDetails: 'Clinics pay $250-$500/month for their primary Electronic Medical Record (EMR) system which includes basic scheduling.',
  founderAssumptionsEvidence: 'Assumes independent clinics will gladly pay $129/month for an add-on that reduces no-shows.',
  payingCustomers: 0,
  mrr: 0,
  currency: 'USD',
  freeUsers: 2,
  trialsOrSignups: 6,
  repeatUsageKnown: 'no',
  channels: [
    {
      channel: 'cold_outreach',
      prospectsReached: 40,
      repliesOrConversations: 10,
      demosOrCalls: 6,
      trialsOrActivations: 2,
      purchases: 0,
      estimatedSpend: 80,
      durationWeeks: 6,
      consistencyNotes: 'Cold email and phone outreach to 40 independent clinic managers in 2 metro areas.'
    }
  ],
  websiteVisitorsMonthly: 120,
  prospectFeedbackSummary: 'Ten clinic managers replied and 6 attended full 30-minute product demos. Four prospects stated their current EMR calendar works adequately and they do not want another login. Two prospects said the specific ROI value was unclear.',
  commonObjections: 'Four prospects: "Our current EMR scheduling works adequately, and staff do not want to switch systems." Two prospects: "We do not understand how this connects to our existing billing."',
  reasonsCustomersBought: 'None yet acquired.',
  reasonsProspectsRefused: 'Perception that switching friction exceeds benefit; reluctance to operate software disjointed from their core EMR.',
  dropOffStage: 'demo_to_purchase',
  observedCustomerSessions: 'no',
  availableHoursPerWeek: 15,
  availableMonthlyBudget: 150,
  teamSize: 1,
  relevantSkills: 'Full-stack TypeScript, React, Healthcare workflows',
  pastChangesTried: 'Redesigned the booking widget UI and added SMS reminder customization.',
  failedExperimentsSummary: 'Offering a 14-day free trial on the demo calls led to zero trial activations.',
  founderBottleneckBelief: 'I think my $129/mo price is too high and I should drop it to $49/mo, or I need to run Google Search ads.'
};

export const DEFAULT_INTEGRATIONS: IntegrationConnection[] = [
  {
    id: 'int-analytics',
    name: 'Google Analytics 4 & PostHog',
    category: 'analytics',
    description: 'Track real visitor traffic, landing page bounce rate, and activation funnels.',
    status: 'not_connected'
  },
  {
    id: 'int-crm',
    name: 'HubSpot / Attio / Close CRM',
    category: 'crm',
    description: 'Sync target prospects, lead stages, and outreach interaction timelines.',
    status: 'not_connected'
  },
  {
    id: 'int-email',
    name: 'Resend / Smartlead / Instantly',
    category: 'email',
    description: 'Automate personalized founder outreach threads with deliverability tracking.',
    status: 'not_connected'
  },
  {
    id: 'int-calendar',
    name: 'Google Calendar & Cal.com',
    category: 'calendar',
    description: 'Log discovery calls and customer interview slots directly to your schedule.',
    status: 'not_connected'
  },
  {
    id: 'int-mcp',
    name: 'Model Context Protocol (MCP) Agent Proxy',
    category: 'mcp_agent',
    description: 'Allow local AI coding or research agents to query your business constraints and experiment state securely.',
    status: 'planned'
  }
];

export const DEFAULT_FUNNEL_DATA: SalesFunnelData = {
  prospectsContacted: 40,
  repliesReceived: 10,
  meetingsBooked: 6,
  trialsOrDemosStarted: 2,
  proposalsSent: 1,
  customersAcquired: 0,
  revenueGenerated: 0,
  trackingPeriodWeeks: 4
};

// User & Auth State
export function getSavedUser(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading user:', err);
  }
  return DEFAULT_USER;
}

export function saveUser(user: UserAccount): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.warn('LocalStorage error saving user:', err);
  }
}

export function getSavedWorkspaces(): Workspace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading workspaces:', err);
  }
  return DEFAULT_WORKSPACES;
}

export function saveWorkspaces(workspaces: Workspace[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
  } catch (err) {
    console.warn('LocalStorage error saving workspaces:', err);
  }
}

export function getActiveWorkspaceId(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID) || 'ws-live-product';
  } catch {
    return 'ws-live-product';
  }
}

export function setActiveWorkspaceId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID, id);
  } catch (err) {
    console.warn('Error setting active workspace id:', err);
  }
}

export function getClinicDemoReport(): DiagnosticReport {
  return generateDiagnosticReport(CLINIC_DEMO_PROFILE, 'demo');
}

export function getSavedProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading profile:', err);
  }
  return CLINIC_DEMO_PROFILE;
}

export function saveProfile(profile: BusinessProfile): void {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('LocalStorage error saving profile:', err);
  }
}

export function getSavedReport(): DiagnosticReport | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LATEST_REPORT);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading report:', err);
  }
  return null;
}

export function saveReport(report: DiagnosticReport): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LATEST_REPORT, JSON.stringify(report));
    recordAnalyticsEvent('reportGenerations');
  } catch (err) {
    console.warn('LocalStorage error saving report:', err);
  }
}

export function getSavedExperiments(): TrackedExperiment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading experiments:', err);
  }
  return [];
}

export function saveExperiments(experiments: TrackedExperiment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(experiments));
  } catch (err) {
    console.warn('LocalStorage error saving experiments:', err);
  }
}

export function addExperimentFromReport(report: DiagnosticReport): TrackedExperiment {
  const current = getSavedExperiments();
  const existing = current.find(e => e.id === report.primaryExperiment.id);
  if (existing) return existing;

  const today = new Date();
  const review = new Date();
  review.setDate(today.getDate() + 14);

  const newExp: TrackedExperiment = {
    id: report.primaryExperiment.id,
    reportId: report.id,
    name: report.primaryExperiment.title,
    category: report.leadingBottleneckCategory,
    hypothesis: report.primaryExperiment.hypothesis,
    targetAudience: report.primaryExperiment.targetAudience,
    timeFrame: report.primaryExperiment.timeFrame,
    procedure: report.primaryExperiment.procedure,
    startDate: today.toISOString().split('T')[0],
    reviewDate: review.toISOString().split('T')[0],
    requiredResources: report.primaryExperiment.requiredResources,
    metricsToRecord: report.primaryExperiment.metricsToRecord,
    initialAssumptions: `Based on diagnosis: ${report.leadingHypothesis}`,
    status: 'planned'
  };

  const updated = [newExp, ...current];
  saveExperiments(updated);
  recordAnalyticsEvent('experimentsSaved');
  return newExp;
}

export function updateExperimentStatus(id: string, status: TrackedExperiment['status']): void {
  const current = getSavedExperiments();
  const updated = current.map(e => e.id === id ? { ...e, status } : e);
  saveExperiments(updated);
  if (status === 'active') recordAnalyticsEvent('experimentsStarted');
}

export function recordExperimentResults(
  id: string,
  observedResults: NonNullable<TrackedExperiment['observedResults']>,
  evaluation: NonNullable<TrackedExperiment['evaluation']>
): void {
  const current = getSavedExperiments();
  const updated = current.map(e => {
    if (e.id === id) {
      return {
        ...e,
        status: 'completed' as const,
        observedResults,
        evaluation
      };
    }
    return e;
  });
  saveExperiments(updated);
  recordAnalyticsEvent('resultsRecorded');
  recordAnalyticsEvent('reviewsCompleted');
  if (evaluation.recommendationShifted) {
    recordAnalyticsEvent('recommendationsShifted');
  }
}

export function getSavedFunnelData(): SalesFunnelData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FUNNEL_DATA);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading funnel data:', err);
  }
  return DEFAULT_FUNNEL_DATA;
}

export function saveFunnelData(data: SalesFunnelData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FUNNEL_DATA, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage error saving funnel data:', err);
  }
}

export function getSavedIntegrations(): IntegrationConnection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading integrations:', err);
  }
  return DEFAULT_INTEGRATIONS;
}

export function saveIntegrations(integrations: IntegrationConnection[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
  } catch (err) {
    console.warn('LocalStorage error saving integrations:', err);
  }
}

export function getSavedChatMessages(): AssistantChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error reading chat messages:', err);
  }
  return [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: 'Welcome to First Customers! I have direct context on your business profile, target customer assumptions, and active experiments.\n\nAsk me anything about identifying why customers aren\'t buying, drafting high-converting direct outreach messages, or structuring your next experiment.',
      timestamp: new Date().toISOString(),
      suggestedFollowUps: [
        'Why aren\'t my target buyers responding to cold outreach?',
        'How should I structure my first 15-minute customer interview?',
        'Analyze my current funnel leak and suggest an immediate fix',
        'Draft a 4-sentence outreach message for my specific ICP'
      ]
    }
  ];
}

export function saveChatMessages(messages: AssistantChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.warn('LocalStorage error saving chat messages:', err);
  }
}

export function getAppAnalytics(): AppAnalytics {
  const defaults: AppAnalytics = {
    intakeCompletions: 1,
    reportGenerations: 1,
    experimentsSaved: 0,
    experimentsStarted: 0,
    resultsRecorded: 0,
    reviewsCompleted: 0,
    recommendationsShifted: 0
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('LocalStorage error reading analytics:', err);
  }
  return defaults;
}

export function recordAnalyticsEvent(event: keyof AppAnalytics): void {
  try {
    const current = getAppAnalytics();
    current[event] = (current[event] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
  } catch (err) {
    console.warn('LocalStorage error recording analytics:', err);
  }
}

export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.LATEST_REPORT);
    localStorage.removeItem(STORAGE_KEYS.EXPERIMENTS);
    localStorage.removeItem(STORAGE_KEYS.FUNNEL_DATA);
    localStorage.removeItem(STORAGE_KEYS.MARKET_VALIDATION);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_RESEARCH);
    localStorage.removeItem(STORAGE_KEYS.NEXT_ACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  } catch (err) {
    console.warn('LocalStorage error clearing user data:', err);
  }
}

export function exportAllDataAsJson(): string {
  const payload = {
    platform: 'First Customers',
    exportedAt: new Date().toISOString(),
    user: getSavedUser(),
    workspaces: getSavedWorkspaces(),
    activeWorkspaceId: getActiveWorkspaceId(),
    profile: getSavedProfile(),
    latestReport: getSavedReport(),
    funnelData: getSavedFunnelData(),
    experiments: getSavedExperiments(),
    integrations: getSavedIntegrations(),
    analytics: getAppAnalytics()
  };
  return JSON.stringify(payload, null, 2);
}

export function importAllDataFromJson(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.profile) saveProfile(data.profile);
    if (data.latestReport) saveReport(data.latestReport);
    if (Array.isArray(data.experiments)) saveExperiments(data.experiments);
    if (data.funnelData) saveFunnelData(data.funnelData);
    if (data.user) saveUser(data.user);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
