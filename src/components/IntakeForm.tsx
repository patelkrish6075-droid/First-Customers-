import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Trash2, 
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Loader2,
  Clock,
  Save,
  CheckCircle2,
  Database,
  Building2
} from 'lucide-react';
import { BusinessProfile, BusinessStage, ChannelAttempt, ProductChannel } from '../types';
import { CLINIC_DEMO_PROFILE } from '../lib/storage';
import { TEST_CASES } from '../lib/testCases';

interface IntakeFormProps {
  initialProfile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onGenerateReport: (profile: BusinessProfile) => void;
  isLoading: boolean;
}

const STEPS = [
  { id: 1, title: 'Product', subtitle: 'What you built', estMinutes: 1 },
  { id: 2, title: 'Customer & Problem', subtitle: 'Who pays & pain points', estMinutes: 1 },
  { id: 3, title: 'Traction', subtitle: 'Paying vs free reality', estMinutes: 1 },
  { id: 4, title: 'Acquisition', subtitle: 'Channels & reach data', estMinutes: 1 },
  { id: 5, title: 'Feedback & Constraints', subtitle: 'Objections & resources', estMinutes: 1 },
];

const AVAILABLE_CHANNELS: { value: ProductChannel; label: string }[] = [
  { value: 'cold_outreach', label: 'Cold Outreach (Email / Phone)' },
  { value: 'linkedin', label: 'LinkedIn (Messaging / Content)' },
  { value: 'twitter_x', label: 'Twitter / X' },
  { value: 'seo_content', label: 'SEO & Content Marketing' },
  { value: 'communities_slack_reddit', label: 'Communities (Reddit / Slack)' },
  { value: 'paid_ads', label: 'Paid Advertising (Meta / Google / LinkedIn)' },
  { value: 'directories_producthunt', label: 'Directories / Product Hunt' },
  { value: 'referrals_word_of_mouth', label: 'Referrals & Word of Mouth' },
  { value: 'events_partnerships', label: 'Events & Partnerships' },
  { value: 'other', label: 'Other Channel' },
];

const EMPTY_BUSINESS_PROFILE: BusinessProfile = {
  id: `profile-${Date.now()}`,
  isDemo: false,
  updatedAt: new Date().toISOString(),
  productName: '',
  taglineOrSummary: '',
  productCategory: '',
  stage: 'launched',
  monthsSinceLaunch: 'unknown',
  targetBuyer: '',
  actualUsers: '',
  specificProblem: '',
  currentWorkarounds: '',
  problemImportanceEvidence: '',
  spendingOnAlternatives: 'unclear',
  spendingDetails: '',
  founderAssumptionsEvidence: '',
  payingCustomers: 0,
  mrr: 0,
  currency: 'USD',
  freeUsers: 0,
  trialsOrSignups: 0,
  repeatUsageKnown: 'unknown',
  channels: [
    {
      channel: 'cold_outreach',
      prospectsReached: 'unknown',
      repliesOrConversations: 'unknown',
      demosOrCalls: 'unknown',
      trialsOrActivations: 'unknown',
      purchases: 'unknown',
      estimatedSpend: 0,
      durationWeeks: 'unknown'
    }
  ],
  websiteVisitorsMonthly: 'unknown',
  prospectFeedbackSummary: '',
  commonObjections: '',
  reasonsCustomersBought: '',
  reasonsProspectsRefused: '',
  dropOffStage: 'unknown',
  observedCustomerSessions: 'no',
  availableHoursPerWeek: 15,
  availableMonthlyBudget: 100,
  teamSize: 1,
  relevantSkills: 'Product, Engineering',
  pastChangesTried: '',
  failedExperimentsSummary: '',
  founderBottleneckBelief: ''
};

export const IntakeForm: React.FC<IntakeFormProps> = ({
  initialProfile,
  onSaveProfile,
  onGenerateReport,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    onSaveProfile(updated);
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!profile.productName.trim()) {
        setErrorMsg('Please enter a product name.');
        return;
      }
      if (!profile.taglineOrSummary.trim()) {
        setErrorMsg('Please enter what your product does.');
        return;
      }
    } else if (currentStep === 2) {
      if (!profile.targetBuyer.trim()) {
        setErrorMsg('Please enter who your target buyer is.');
        return;
      }
      if (!profile.specificProblem.trim()) {
        setErrorMsg('Please describe the problem you solve.');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!profile.productName.trim() || !profile.targetBuyer.trim()) {
      setErrorMsg('Product name and target buyer are required to run a diagnosis.');
      return;
    }
    onGenerateReport(profile);
  };

  const addChannel = () => {
    const newChannel: ChannelAttempt = {
      channel: 'cold_outreach',
      prospectsReached: 'unknown',
      repliesOrConversations: 'unknown',
      demosOrCalls: 'unknown',
      trialsOrActivations: 'unknown',
      purchases: 'unknown',
      estimatedSpend: 0,
      durationWeeks: 4,
    };
    updateField('channels', [...profile.channels, newChannel]);
  };

  const removeChannel = (index: number) => {
    const updated = profile.channels.filter((_, i) => i !== index);
    updateField('channels', updated);
  };

  const updateChannel = (index: number, patch: Partial<ChannelAttempt>) => {
    const updated = profile.channels.map((ch, i) => (i === index ? { ...ch, ...patch } : ch));
    updateField('channels', updated);
  };

  const handleStartFresh = () => {
    if (confirm('Start fresh with your own real business data? This will clear the demo scenario.')) {
      setProfile(EMPTY_BUSINESS_PROFILE);
      onSaveProfile(EMPTY_BUSINESS_PROFILE);
      setCurrentStep(1);
      setErrorMsg(null);
    }
  };

  const loadPreset = (presetProfile: BusinessProfile) => {
    setProfile({ ...presetProfile, id: `profile-${Date.now()}` });
    onSaveProfile(presetProfile);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  const estimatedMinutesLeft = 6 - currentStep;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-1 sm:px-0 space-y-6">
      {/* Demo Mode Alert Banner — Prevents confusion between demo and real business data */}
      {profile.isDemo && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-900 text-sm block">
                Illustrative Demo Preset Active ({profile.productName})
              </span>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                You are currently viewing the sample ClinicFlow scenario. Results will reflect demo inputs, not your real startup.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleStartFresh}
              className="px-3.5 py-2 rounded-lg bg-amber-900 text-white font-bold hover:bg-stone-900 transition cursor-pointer shadow-xs"
            >
              Start Fresh with My Business
            </button>
          </div>
        </div>
      )}

      {/* Quick Scenario Preset Loader */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-stone-900 block">Want to test with a synthetic case?</span>
          <span className="text-stone-600">Select any of the 8 canonical startup archetypes to pre-fill the intake.</span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            aria-label="Load Test Case Preset"
            onChange={(e) => {
              const found = TEST_CASES.find(tc => tc.code === e.target.value);
              if (found) loadPreset(found.profile);
            }}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 font-semibold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>Load Test Case (A–H)...</option>
            {TEST_CASES.map(tc => (
              <option key={tc.id} value={tc.code}>
                {tc.code}: {tc.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress & Timing Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-stone-900">Step {currentStep} of 5: {STEPS[currentStep - 1].title}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-600 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
              ~{estimatedMinutesLeft} min{estimatedMinutesLeft > 1 ? 's' : ''} left
            </span>
          </div>
          <div className="flex items-center text-emerald-700 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Autosaved locally</span>
          </div>
        </div>

        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Responsive Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(s.id)}
              className={`p-2.5 rounded-lg text-left transition cursor-pointer border ${
                currentStep === s.id
                  ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 font-bold shadow-2xs'
                  : currentStep > s.id
                  ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>0{s.id}</span>
                {currentStep > s.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="text-xs font-semibold mt-0.5 truncate">{s.title}</div>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Guided Multi-Step Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        
        {/* STEP 1: PRODUCT */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Step 1: Product Foundation</h2>
              <p className="text-xs text-stone-700 mt-0.5">What did you build, what category is it in, and when did you launch?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={profile.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  placeholder="e.g. ClinicFlow"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product Category
                </label>
                <input
                  type="text"
                  value={profile.productCategory}
                  onChange={(e) => updateField('productCategory', e.target.value)}
                  placeholder="e.g. Healthcare SaaS / Clinic Operations"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                What does the product do? (Core Function) *
              </label>
              <textarea
                rows={2}
                value={profile.taglineOrSummary}
                onChange={(e) => updateField('taglineOrSummary', e.target.value)}
                placeholder="e.g. Automated patient self-scheduling and reminder assistant for independent clinics."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Lifecycle Stage
                </label>
                <select
                  value={profile.stage}
                  onChange={(e) => updateField('stage', e.target.value as BusinessStage)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="beta">Beta</option>
                  <option value="launched">Launched (Public)</option>
                  <option value="growing">Growing / Stalled</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    Months Since Launch
                  </label>
                  <button
                    type="button"
                    onClick={() => updateField('monthsSinceLaunch', profile.monthsSinceLaunch === 'unknown' ? 3 : 'unknown')}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    {profile.monthsSinceLaunch === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                  </button>
                </div>
                {profile.monthsSinceLaunch === 'unknown' ? (
                  <div className="px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                    Marked as unknown
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={profile.monthsSinceLaunch}
                    onChange={(e) => updateField('monthsSinceLaunch', parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 4"
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={profile.websiteUrl || ''}
                  onChange={(e) => updateField('websiteUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMER & PROBLEM */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Step 2: Customer & Problem Urgency</h2>
              <p className="text-xs text-stone-700 mt-0.5">Distinguish who pays from who uses, and examine existing workarounds.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Target Buyer (The person who holds budget) *
                </label>
                <input
                  type="text"
                  value={profile.targetBuyer}
                  onChange={(e) => updateField('targetBuyer', e.target.value)}
                  placeholder="e.g. Independent clinic practice managers"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Daily End User (Who sits at the screen) *
                </label>
                <input
                  type="text"
                  value={profile.actualUsers}
                  onChange={(e) => updateField('actualUsers', e.target.value)}
                  placeholder="e.g. Front desk receptionists and medical assistants"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Specific Acute Problem You Solve *
              </label>
              <textarea
                rows={2}
                value={profile.specificProblem}
                onChange={(e) => updateField('specificProblem', e.target.value)}
                placeholder="e.g. 15-20% patient no-shows causing lost clinic revenue and 2 hours daily telephone rescheduling."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Existing Workarounds (How customers cope today) *
              </label>
              <textarea
                rows={2}
                value={profile.currentWorkarounds}
                onChange={(e) => updateField('currentWorkarounds', e.target.value)}
                placeholder="e.g. Phone calls, paper cards, and legacy desktop calendar modules."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Do buyers spend money/resources on alternatives?
                </label>
                <select
                  value={profile.spendingOnAlternatives}
                  onChange={(e) => updateField('spendingOnAlternatives', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="yes">Yes — they spend money or dedicated hours</option>
                  <option value="no">No — they spend $0 and tolerate the problem</option>
                  <option value="unclear">Unclear / Not verified</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Alternative Spend Details (if known)
                </label>
                <input
                  type="text"
                  value={profile.spendingDetails || ''}
                  onChange={(e) => updateField('spendingDetails', e.target.value)}
                  placeholder="e.g. $250-$500/mo for EMR system"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TRACTION */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Step 3: Commercial Traction</h2>
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-900 font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Strict Diagnostic Rule:</strong> Never confuse free signups with paying customers. Commercial validation requires financial or contractual commitment.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">Paying Customers *</label>
                  <button
                    type="button"
                    onClick={() => updateField('payingCustomers', profile.payingCustomers === 'unknown' ? 0 : 'unknown')}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    {profile.payingCustomers === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                  </button>
                </div>
                {profile.payingCustomers === 'unknown' ? (
                  <div className="px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                    Marked as unknown
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={profile.payingCustomers}
                    onChange={(e) => updateField('payingCustomers', parseInt(e.target.value, 10) || 0)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">Monthly Revenue (MRR)</label>
                  <button
                    type="button"
                    onClick={() => updateField('mrr', profile.mrr === 'unknown' ? 0 : 'unknown')}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    {profile.mrr === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                  </button>
                </div>
                {profile.mrr === 'unknown' ? (
                  <div className="px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                    Marked as unknown
                  </div>
                ) : (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-stone-300 bg-stone-50 text-stone-600 text-xs rounded-l-lg font-mono">
                      {profile.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={profile.mrr}
                      onChange={(e) => updateField('mrr', parseInt(e.target.value, 10) || 0)}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Currency</label>
                <input
                  type="text"
                  value={profile.currency}
                  onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
                  placeholder="USD"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">Active Free Users</label>
                  <button
                    type="button"
                    onClick={() => updateField('freeUsers', profile.freeUsers === 'unknown' ? 0 : 'unknown')}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    {profile.freeUsers === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                  </button>
                </div>
                {profile.freeUsers === 'unknown' ? (
                  <div className="px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                    Marked as unknown
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={profile.freeUsers}
                    onChange={(e) => updateField('freeUsers', parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 2"
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">Total Trials / Signups Ever</label>
                  <button
                    type="button"
                    onClick={() => updateField('trialsOrSignups', profile.trialsOrSignups === 'unknown' ? 0 : 'unknown')}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    {profile.trialsOrSignups === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                  </button>
                </div>
                {profile.trialsOrSignups === 'unknown' ? (
                  <div className="px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                    Marked as unknown
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={profile.trialsOrSignups}
                    onChange={(e) => updateField('trialsOrSignups', parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 6"
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Repeat Usage Measured?</label>
                <select
                  value={profile.repeatUsageKnown}
                  onChange={(e) => updateField('repeatUsageKnown', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="yes">Yes — we monitor active repeat usage</option>
                  <option value="no">No — repeat engagement is uninstrumented</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Customer Cancellations or Churn</label>
                <input
                  type="text"
                  value={profile.retentionDetails || ''}
                  onChange={(e) => updateField('retentionDetails', e.target.value)}
                  placeholder="e.g. 0 cancellations (or 2 churned citing missing integrations)"
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ACQUISITION */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">Step 4: Acquisition & Funnel Reach</h2>
                <p className="text-xs text-stone-700 mt-0.5">Record reach and conversion per channel. Use unknown toggles rather than guessing.</p>
              </div>
              <button
                type="button"
                onClick={addChannel}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Channel</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">
                  Estimated Monthly Unique Website Visitors
                </label>
                <button
                  type="button"
                  onClick={() => updateField('websiteVisitorsMonthly', profile.websiteVisitorsMonthly === 'unknown' ? 100 : 'unknown')}
                  className="text-[10px] font-semibold text-indigo-600 hover:underline"
                >
                  {profile.websiteVisitorsMonthly === 'unknown' ? 'Enter number' : 'Mark Unknown'}
                </button>
              </div>
              {profile.websiteVisitorsMonthly === 'unknown' ? (
                <div className="px-3.5 py-2.5 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 font-medium">
                  Marked as unknown (Engine will treat baseline web conversion as unmeasured)
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  value={profile.websiteVisitorsMonthly}
                  onChange={(e) => updateField('websiteVisitorsMonthly', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 120"
                  className="w-full sm:w-1/2 px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Channels List */}
            <div className="space-y-4">
              {profile.channels.map((ch, idx) => (
                <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-stone-900">Channel #{idx + 1}</span>
                      <select
                        value={ch.channel}
                        onChange={(e) => updateChannel(idx, { channel: e.target.value as ProductChannel })}
                        className="px-2.5 py-1 text-xs font-medium border border-stone-300 rounded-md bg-white"
                      >
                        {AVAILABLE_CHANNELS.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    {profile.channels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChannel(idx)}
                        className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-stone-700 block mb-1 font-semibold">Prospects Reached</label>
                      <input
                        type="text"
                        value={ch.prospectsReached}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          updateChannel(idx, { prospectsReached: val === 'unknown' ? 'unknown' : Number(val) || 0 });
                        }}
                        placeholder="e.g. 40"
                        className="w-full px-2.5 py-2 text-base sm:text-xs border border-stone-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-700 block mb-1 font-semibold">Replies / Convos</label>
                      <input
                        type="text"
                        value={ch.repliesOrConversations}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          updateChannel(idx, { repliesOrConversations: val === 'unknown' ? 'unknown' : Number(val) || 0 });
                        }}
                        placeholder="e.g. 10"
                        className="w-full px-2.5 py-2 text-base sm:text-xs border border-stone-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-700 block mb-1 font-semibold">Demos / Calls</label>
                      <input
                        type="text"
                        value={ch.demosOrCalls}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          updateChannel(idx, { demosOrCalls: val === 'unknown' ? 'unknown' : Number(val) || 0 });
                        }}
                        placeholder="e.g. 6"
                        className="w-full px-2.5 py-2 text-base sm:text-xs border border-stone-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-700 block mb-1 font-semibold">Purchases Closed</label>
                      <input
                        type="text"
                        value={ch.purchases}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          updateChannel(idx, { purchases: val === 'unknown' ? 'unknown' : Number(val) || 0 });
                        }}
                        placeholder="e.g. 0"
                        className="w-full px-2.5 py-2 text-base sm:text-xs border border-stone-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: FEEDBACK & CONSTRAINTS */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Step 5: Feedback Objections & Resources</h2>
              <p className="text-xs text-stone-700 mt-0.5">What did prospects actually say, where do they abandon, and what are your constraints?</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Common Repeated Objections *
              </label>
              <textarea
                rows={2}
                value={profile.commonObjections}
                onChange={(e) => updateField('commonObjections', e.target.value)}
                placeholder="e.g. Existing calendar works adequately; reluctance to switch systems; ROI unclear."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Where do prospects primarily drop off?
                </label>
                <select
                  value={profile.dropOffStage}
                  onChange={(e) => updateField('dropOffStage', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="traffic_to_signup">Traffic to Signup (Bounce from homepage)</option>
                  <option value="signup_to_activation">Signup to Activation (Sign up, drop in setup)</option>
                  <option value="demo_to_purchase">Demo to Purchase (Attend call, never buy)</option>
                  <option value="trial_to_paid">Trial to Paid (Finish trial, decline to pay)</option>
                  <option value="first_month_churn">First Month Churn (Buy then cancel)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Observed Customers Live on Screen?
                </label>
                <select
                  value={profile.observedCustomerSessions}
                  onChange={(e) => updateField('observedCustomerSessions', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="yes">Yes — conducted screen-share observations</option>
                  <option value="no">No — have not watched real users navigate</option>
                  <option value="partial">Partial — observed a friend or colleague</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                What do you currently believe is your primary bottleneck? *
              </label>
              <textarea
                rows={2}
                value={profile.founderBottleneckBelief}
                onChange={(e) => updateField('founderBottleneckBelief', e.target.value)}
                placeholder="e.g. I think my price is too high or I need more top-of-funnel ads."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Available Hours / Week</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={profile.availableHoursPerWeek}
                  onChange={(e) => updateField('availableHoursPerWeek', parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Marketing Budget / Month</label>
                <input
                  type="number"
                  min="0"
                  value={profile.availableMonthlyBudget}
                  onChange={(e) => updateField('availableMonthlyBudget', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Team Size</label>
                <input
                  type="number"
                  min="1"
                  value={profile.teamSize}
                  onChange={(e) => updateField('teamSize', parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="pt-5 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Previous</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-extrabold hover:bg-indigo-700 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Auditing Evidence & Bottlenecks...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Generate Structured Diagnosis</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
