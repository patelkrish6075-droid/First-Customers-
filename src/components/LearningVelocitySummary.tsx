import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Zap, 
  Calendar, 
  Info, 
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrackedExperiment } from '../types';

interface LearningVelocitySummaryProps {
  experiments: TrackedExperiment[];
  onNavigateToExperiments?: () => void;
}

interface PeriodExperiment {
  name: string;
  category: string;
  outcome: 'validated' | 'disproven' | 'inconclusive';
  date: string;
  shiftOccurred: boolean;
}

interface TrendDataPoint {
  sprint: string;
  periodLabel: string;
  startDate: string;
  // In-period deltas
  periodSuccessful: number;
  periodUnsuccessful: number;
  periodInconclusive: number;
  periodTotal: number;
  // Cumulative metrics
  cumulativeSuccessful: number;
  cumulativeUnsuccessful: number;
  cumulativeInconclusive: number;
  cumulativeTotal: number;
  // Validation velocity rate
  successRatio: number;
  experiments: PeriodExperiment[];
}

// Canonical realistic 6-sprint learning history for early-stage B2B founder
const SAMPLE_SPRINT_DATA: {
  periodLabel: string;
  startDate: string;
  successful: number;
  unsuccessful: number;
  inconclusive: number;
  experiments: PeriodExperiment[];
}[] = [
  {
    periodLabel: 'Sprint 1',
    startDate: 'Weeks 1–2',
    successful: 0,
    unsuccessful: 2,
    inconclusive: 1,
    experiments: [
      { name: '50% Price Discount Email Promo', category: 'pricing_purchasing', outcome: 'disproven', date: 'Day 5', shiftOccurred: true },
      { name: 'Generic LinkedIn InMail Blast', category: 'acquisition_reach', outcome: 'disproven', date: 'Day 10', shiftOccurred: true },
      { name: 'Landing Page Video Explainer', category: 'positioning_offer', outcome: 'inconclusive', date: 'Day 14', shiftOccurred: false },
    ]
  },
  {
    periodLabel: 'Sprint 2',
    startDate: 'Weeks 3–4',
    successful: 1,
    unsuccessful: 2,
    inconclusive: 0,
    experiments: [
      { name: 'Solo Graphic Designers Niche Pitch', category: 'target_customer', outcome: 'validated', date: 'Day 19', shiftOccurred: false },
      { name: 'Cold Outreach to Agency CFOs', category: 'sales_conversion', outcome: 'disproven', date: 'Day 23', shiftOccurred: true },
      { name: 'Self-Serve Credit Card Modal', category: 'pricing_purchasing', outcome: 'disproven', date: 'Day 27', shiftOccurred: true },
    ]
  },
  {
    periodLabel: 'Sprint 3',
    startDate: 'Weeks 5–6',
    successful: 1,
    unsuccessful: 1,
    inconclusive: 1,
    experiments: [
      { name: 'Direct Screen-Share Onboarding Session', category: 'activation_value', outcome: 'validated', date: 'Day 34', shiftOccurred: false },
      { name: 'Automated Drip Email Sequence', category: 'activation_value', outcome: 'disproven', date: 'Day 38', shiftOccurred: true },
      { name: 'Twitter Launch Thread Feedback', category: 'acquisition_reach', outcome: 'inconclusive', date: 'Day 42', shiftOccurred: false },
    ]
  },
  {
    periodLabel: 'Sprint 4',
    startDate: 'Weeks 7–8',
    successful: 2,
    unsuccessful: 1,
    inconclusive: 0,
    experiments: [
      { name: 'Sample Pre-Loaded Demo Workspace', category: 'activation_value', outcome: 'validated', date: 'Day 48', shiftOccurred: false },
      { name: 'Paid Pilot Agreement at Demo Close', category: 'sales_conversion', outcome: 'validated', date: 'Day 52', shiftOccurred: false },
      { name: 'Google Ads Search Campaign', category: 'acquisition_reach', outcome: 'disproven', date: 'Day 56', shiftOccurred: true },
    ]
  },
  {
    periodLabel: 'Sprint 5',
    startDate: 'Weeks 9–10',
    successful: 2,
    unsuccessful: 0,
    inconclusive: 1,
    experiments: [
      { name: 'CFO-Ready Annual Invoice Pack', category: 'pricing_purchasing', outcome: 'validated', date: 'Day 62', shiftOccurred: false },
      { name: 'Zero-Password Client Magic Link', category: 'retention_recurring_value', outcome: 'validated', date: 'Day 66', shiftOccurred: false },
      { name: 'Referral Credit Program', category: 'acquisition_reach', outcome: 'inconclusive', date: 'Day 70', shiftOccurred: false },
    ]
  },
  {
    periodLabel: 'Sprint 6',
    startDate: 'Weeks 11–12',
    successful: 3,
    unsuccessful: 0,
    inconclusive: 0,
    experiments: [
      { name: 'Structured 15-Min Cancellation Exit Audit', category: 'retention_recurring_value', outcome: 'validated', date: 'Day 76', shiftOccurred: false },
      { name: 'Niche Community Partner Showcase', category: 'acquisition_reach', outcome: 'validated', date: 'Day 80', shiftOccurred: false },
      { name: 'Live Onboarding Concierge Assist', category: 'activation_value', outcome: 'validated', date: 'Day 84', shiftOccurred: false },
    ]
  }
];

export const LearningVelocitySummary: React.FC<LearningVelocitySummaryProps> = ({
  experiments,
  onNavigateToExperiments
}) => {
  const [selectedSprintIndex, setSelectedSprintIndex] = useState<number | null>(null);
  const [useSampleDataOverride, setUseSampleDataOverride] = useState<boolean | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'cumulative' | 'period'>('cumulative');

  // Compute live sprint data if user has completed experiments
  const realSprintData = useMemo<TrendDataPoint[]>(() => {
    const completedOrEvaluated = experiments.filter(
      e => e.status === 'completed' || e.status === 'inconclusive' || e.evaluation || e.observedResults
    );

    if (completedOrEvaluated.length === 0) return [];

    // Group chronologically
    const sorted = [...completedOrEvaluated].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const dataPoints: TrendDataPoint[] = [];
    const chunkSize = 2; // pairs for clean sprint progression

    let runningSuccessful = 0;
    let runningUnsuccessful = 0;
    let runningInconclusive = 0;
    let runningTotal = 0;

    for (let i = 0; i < sorted.length; i += chunkSize) {
      const chunk = sorted.slice(i, i + chunkSize);
      let pSucc = 0;
      let pUnsucc = 0;
      let pInconc = 0;

      const expList: PeriodExperiment[] = chunk.map(exp => {
        const evalSum = exp.evaluation?.outcomeSummary?.toLowerCase() || '';
        let outcome: 'validated' | 'disproven' | 'inconclusive' = 'inconclusive';

        if (evalSum.includes('support') || (!exp.evaluation?.recommendationShifted && exp.status === 'completed')) {
          outcome = 'validated';
          pSucc++;
        } else if (evalSum.includes('contradict') || exp.evaluation?.recommendationShifted || exp.status === 'abandoned') {
          outcome = 'disproven';
          pUnsucc++;
        } else {
          outcome = 'inconclusive';
          pInconc++;
        }

        return {
          name: exp.name,
          category: exp.category,
          outcome,
          date: exp.reviewDate || exp.startDate,
          shiftOccurred: Boolean(exp.evaluation?.recommendationShifted)
        };
      });

      runningSuccessful += pSucc;
      runningUnsuccessful += pUnsucc;
      runningInconclusive += pInconc;
      runningTotal += chunk.length;

      const sprintNum = Math.floor(i / chunkSize) + 1;
      dataPoints.push({
        sprint: `Sprint ${sprintNum}`,
        periodLabel: `Sprint ${sprintNum}`,
        startDate: chunk[0]?.startDate ? `From ${chunk[0].startDate}` : `Sprint ${sprintNum}`,
        periodSuccessful: pSucc,
        periodUnsuccessful: pUnsucc,
        periodInconclusive: pInconc,
        periodTotal: chunk.length,
        cumulativeSuccessful: runningSuccessful,
        cumulativeUnsuccessful: runningUnsuccessful,
        cumulativeInconclusive: runningInconclusive,
        cumulativeTotal: runningTotal,
        successRatio: runningTotal > 0 ? Math.round((runningSuccessful / runningTotal) * 100) : 0,
        experiments: expList
      });
    }

    return dataPoints;
  }, [experiments]);

  // Compute canonical sample dataset with cumulative progression
  const sampleSprintData = useMemo<TrendDataPoint[]>(() => {
    let runningSucc = 0;
    let runningUnsucc = 0;
    let runningInconc = 0;
    let runningTotal = 0;

    return SAMPLE_SPRINT_DATA.map((item, idx) => {
      runningSucc += item.successful;
      runningUnsucc += item.unsuccessful;
      runningInconc += item.inconclusive;
      runningTotal += (item.successful + item.unsuccessful + item.inconclusive);

      return {
        sprint: item.periodLabel,
        periodLabel: item.periodLabel,
        startDate: item.startDate,
        periodSuccessful: item.successful,
        periodUnsuccessful: item.unsuccessful,
        periodInconclusive: item.inconclusive,
        periodTotal: item.successful + item.unsuccessful + item.inconclusive,
        cumulativeSuccessful: runningSucc,
        cumulativeUnsuccessful: runningUnsucc,
        cumulativeInconclusive: runningInconc,
        cumulativeTotal: runningTotal,
        successRatio: runningTotal > 0 ? Math.round((runningSucc / runningTotal) * 100) : 0,
        experiments: item.experiments
      };
    });
  }, []);

  const hasRealData = realSprintData.length >= 2;
  const isShowingSample = useSampleDataOverride !== null 
    ? useSampleDataOverride 
    : !hasRealData;

  const activeData = isShowingSample ? sampleSprintData : realSprintData;

  // Aggregate summary calculations
  const totals = useMemo(() => {
    const lastPoint = activeData[activeData.length - 1];
    if (!lastPoint) {
      return {
        cumulativeSuccessful: 0,
        cumulativeUnsuccessful: 0,
        cumulativeInconclusive: 0,
        cumulativeTotal: 0,
        successRatio: 0,
        pivotRatio: 0,
        velocity: '0.0'
      };
    }

    const { cumulativeSuccessful, cumulativeUnsuccessful, cumulativeInconclusive, cumulativeTotal } = lastPoint;
    const successRatio = cumulativeTotal > 0 ? Math.round((cumulativeSuccessful / cumulativeTotal) * 100) : 0;
    const pivotRatio = cumulativeTotal > 0 ? Math.round((cumulativeUnsuccessful / cumulativeTotal) * 100) : 0;
    const velocity = (cumulativeTotal / Math.max(activeData.length, 1)).toFixed(1);

    return {
      cumulativeSuccessful,
      cumulativeUnsuccessful,
      cumulativeInconclusive,
      cumulativeTotal,
      successRatio,
      pivotRatio,
      velocity
    };
  }, [activeData]);

  // Active selected sprint inspector
  const activeSprint = selectedSprintIndex !== null 
    ? activeData[selectedSprintIndex] 
    : activeData[activeData.length - 1];

  // Custom styled Recharts tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: TrendDataPoint = payload[0].payload;
      return (
        <div className="bg-stone-900/95 text-white p-3 rounded-xl shadow-xl border border-stone-700/80 text-xs max-w-xs backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2">
            <span className="font-bold text-stone-100">{data.periodLabel}</span>
            <span className="text-[10px] text-stone-400">{data.startDate}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {chartViewMode === 'cumulative' ? 'Cumulative Validated:' : 'Sprint Validated:'}
              </span>
              <span className="font-bold font-mono text-stone-100">
                {chartViewMode === 'cumulative' ? data.cumulativeSuccessful : data.periodSuccessful}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                {chartViewMode === 'cumulative' ? 'Cumulative Disproven:' : 'Sprint Disproven:'}
              </span>
              <span className="font-bold font-mono text-stone-100">
                {chartViewMode === 'cumulative' ? data.cumulativeUnsuccessful : data.periodUnsuccessful}
              </span>
            </div>

            {chartViewMode === 'cumulative' && (
              <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[11px] text-stone-400">
                <span>Total Evaluated:</span>
                <span className="font-semibold text-stone-200">{data.cumulativeTotal}</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 pt-1.5 border-t border-stone-800/80 text-[10px] text-stone-400 flex items-center justify-between">
            <span>Click chart node to inspect sprint details</span>
            <ChevronRight className="w-3 h-3 text-stone-500" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Founder Learning Velocity
                </h3>
                {isShowingSample ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    Sample Benchmark Data
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Live Business History
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Recharts trend visualization tracking cumulative validated signals vs. disproven false assumptions.
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Chart view toggle */}
          <div className="inline-flex rounded-lg border border-stone-200 p-0.5 bg-stone-50 text-xs">
            <button
              onClick={() => setChartViewMode('cumulative')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                chartViewMode === 'cumulative' 
                  ? 'bg-white text-stone-900 shadow-2xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cumulative Trend
            </button>
            <button
              onClick={() => setChartViewMode('period')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                chartViewMode === 'period' 
                  ? 'bg-white text-stone-900 shadow-2xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sprint Delta
            </button>
          </div>

          {/* Toggle between real and sample benchmark */}
          {hasRealData && (
            <button
              onClick={() => setUseSampleDataOverride(!isShowingSample)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              {isShowingSample ? 'Show My Live Data' : 'View Sample Benchmark'}
            </button>
          )}

          {onNavigateToExperiments && (
            <button
              onClick={onNavigateToExperiments}
              className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1 cursor-pointer"
            >
              <span>Manage Experiments</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Pulse Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Cumulative Evaluated
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-stone-900">{totals.cumulativeTotal}</span>
            <span className="text-[11px] text-stone-500 font-medium">tests</span>
          </div>
          <span className="text-[11px] text-stone-600 block mt-1 font-medium">
            ~{totals.velocity} experiments / sprint pace
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Cumulative Validated
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-emerald-950">{totals.cumulativeSuccessful}</span>
            <span className="text-[11px] font-bold text-emerald-800">({totals.successRatio}%)</span>
          </div>
          <span className="text-[11px] text-emerald-800 block mt-1 font-medium">
            Substantiated by verified buyer actions
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Cumulative Disproven
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-rose-950">{totals.cumulativeUnsuccessful}</span>
            <span className="text-[11px] font-bold text-rose-800">({totals.pivotRatio}%)</span>
          </div>
          <span className="text-[11px] text-rose-800 block mt-1 font-medium">
            Dead ends and false paths eliminated early
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Inconclusive Iterations
            </span>
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-amber-950">{totals.cumulativeInconclusive}</span>
            <span className="text-[11px] text-amber-800 font-medium">refined</span>
          </div>
          <span className="text-[11px] text-amber-800 block mt-1 font-medium">
            Sample size under threshold; re-tested
          </span>
        </div>
      </div>

      {/* Recharts Trend Chart Section */}
      <div className="p-4 sm:p-5 bg-stone-50/80 border border-stone-200 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              {chartViewMode === 'cumulative' 
                ? 'Cumulative Learning Curve: Validated vs Disproven Experiments' 
                : 'Per-Sprint Experiment Output Comparison'}
            </h4>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shadow-2xs" />
              <span className="text-stone-700 font-medium">
                {chartViewMode === 'cumulative' ? 'Cumulative Validated' : 'Sprint Validated'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block shadow-2xs" />
              <span className="text-stone-700 font-medium">
                {chartViewMode === 'cumulative' ? 'Cumulative Disproven' : 'Sprint Disproven'}
              </span>
            </div>
            {chartViewMode === 'cumulative' && (
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
                <span className="text-stone-500 font-medium">Total Volume</span>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Recharts Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeData}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
              onClick={(e) => {
                if (e && e.activeTooltipIndex !== undefined && e.activeTooltipIndex !== null) {
                  setSelectedSprintIndex(Number(e.activeTooltipIndex));
                }
              }}
            >
              <defs>
                {/* Emerald Gradient for Validated Proof */}
                <linearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                </linearGradient>
                {/* Rose Gradient for Disproven False Assumptions */}
                <linearGradient id="gradientUnsuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />

              <XAxis 
                dataKey="sprint" 
                tick={{ fill: '#78716C', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: '#D6D3D1' }}
              />

              <YAxis 
                tick={{ fill: '#78716C', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Area 1: Validated Experiments */}
              <Area 
                type="monotone" 
                dataKey={chartViewMode === 'cumulative' ? 'cumulativeSuccessful' : 'periodSuccessful'} 
                name="Validated (Successful)"
                stroke="#10B981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#gradientSuccess)" 
                activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
              />

              {/* Area 2: Disproven Experiments */}
              <Area 
                type="monotone" 
                dataKey={chartViewMode === 'cumulative' ? 'cumulativeUnsuccessful' : 'periodUnsuccessful'} 
                name="Disproven (Unsuccessful)"
                stroke="#F43F5E" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#gradientUnsuccess)" 
                activeDot={{ r: 6, fill: '#F43F5E', stroke: '#FFFFFF', strokeWidth: 2 }}
              />

              {/* Trajectory line for total tests in cumulative view */}
              {chartViewMode === 'cumulative' && (
                <Line
                  type="monotone"
                  dataKey="cumulativeTotal"
                  name="Cumulative Total"
                  stroke="#818CF8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Sprint Drill-down Inspector */}
        {activeSprint && (
          <div className="pt-3 border-t border-stone-200/90 bg-white p-3.5 sm:p-4 rounded-xl border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-900">
                  {activeSprint.periodLabel} Breakdown ({activeSprint.startDate}):
                </span>
                <span className="text-[11px] text-stone-600">
                  {activeSprint.periodTotal} experiment{activeSprint.periodTotal > 1 ? 's' : ''} in period
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeSprint.periodSuccessful} Validated
                  <span className="text-stone-400 font-normal">
                    (cum. {activeSprint.cumulativeSuccessful})
                  </span>
                </span>
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {activeSprint.periodUnsuccessful} Disproven
                  <span className="text-stone-400 font-normal">
                    (cum. {activeSprint.cumulativeUnsuccessful})
                  </span>
                </span>
                {activeSprint.periodInconclusive > 0 && (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {activeSprint.periodInconclusive} Inconclusive
                  </span>
                )}
              </div>
            </div>

            {/* List of experiments in active sprint */}
            <div className="space-y-2">
              {activeSprint.experiments.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 text-xs hover:border-stone-300 transition"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      item.outcome === 'validated' 
                        ? 'bg-emerald-500' 
                        : item.outcome === 'disproven' 
                        ? 'bg-rose-500' 
                        : 'bg-amber-500'
                    }`} />
                    <span className="font-bold text-stone-900 truncate">{item.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 hidden sm:inline">
                      ({item.category.replace(/_/g, ' ')})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.shiftOccurred && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                        Shifted Strategy
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.outcome === 'validated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.outcome === 'disproven'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategic Principle Callout */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start space-x-2.5">
        <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>The Founder Velocity Law:</strong> A disproven experiment is not a failure. In early-stage venture creation, systematically disproving a false assumption in 10 days prevents 3–6 months of wasted code development and saves thousands of marketing dollars.
        </p>
      </div>
    </div>
  );
};
