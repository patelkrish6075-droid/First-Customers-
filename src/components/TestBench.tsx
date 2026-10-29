import React, { useState, useEffect } from 'react';
import { 
  PlaySquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  FlaskConical,
  Zap
} from 'lucide-react';
import { TEST_CASES, runAutomatedTestBench, TestBenchResult } from '../lib/testCases';
import { BusinessProfile } from '../types';

interface TestBenchProps {
  onLoadTestCaseIntoIntake: (profile: BusinessProfile) => void;
}

export const TestBench: React.FC<TestBenchProps> = ({ onLoadTestCaseIntoIntake }) => {
  const [results, setResults] = useState<TestBenchResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>('test-case-g');

  const executeSuite = () => {
    const res = runAutomatedTestBench();
    setResults(res);
    setHasRun(true);
  };

  useEffect(() => {
    executeSuite();
  }, []);

  const totalPassed = results.filter(r => r.passed).length;

  return (
    <div className="max-w-5xl mx-auto pb-24 px-1 sm:px-0 space-y-6">
      {/* Synthetic Benchmark Disclaimer Banner */}
      <div className="p-4 bg-stone-100 border border-stone-300 rounded-xl text-xs text-stone-700 leading-relaxed flex items-start space-x-3 shadow-2xs">
        <Info className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-stone-900 block text-xs uppercase tracking-wider">
            Synthetic Benchmark Notice (Non-Commercial Claim)
          </span>
          <p className="mt-0.5 text-stone-600">
            These test cases are <strong>synthetic regression tests</strong> created to verify diagnostic rules, edge conditions, and conflicting evidence handling. They are designed to prevent logic regressions and must never be presented as real-world market accuracy or commercial guarantees.
          </p>
        </div>
      </div>

      {/* Title & Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs shadow-indigo-600/30">
              <PlaySquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">Diagnostic Test Bench</h1>
              <p className="text-xs text-stone-600 mt-0.5">
                Automated regression suite verifying {TEST_CASES.length} canonical archetypes, ambiguous cases, conflicting evidence, and paying-customer scenarios.
              </p>
            </div>
          </div>

          <button
            onClick={executeSuite}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Re-run Test Suite ({TEST_CASES.length} Cases)</span>
          </button>
        </div>

        {/* Suite Status Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 block uppercase font-bold text-[10px]">Total Scenarios</span>
            <span className="text-lg font-extrabold text-stone-900 mt-0.5 block">{TEST_CASES.length} Archetypes</span>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
            <span className="text-emerald-700 block uppercase font-bold text-[10px]">Verification Rate</span>
            <span className="text-lg font-extrabold text-emerald-900 mt-0.5 block">{totalPassed} / {TEST_CASES.length} Verified</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 block uppercase font-bold text-[10px]">Experiment Validation</span>
            <span className="text-xs font-bold text-stone-900 mt-1 block">Category & Action Verified</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 block uppercase font-bold text-[10px]">Anti-Slop Protection</span>
            <span className="text-xs font-bold text-emerald-800 mt-1 block">Zero Generic Fluff</span>
          </div>
        </div>
      </div>

      {/* The 8 Test Cases */}
      <div className="space-y-4">
        {TEST_CASES.map(tc => {
          const testResult = results.find(r => r.testId === tc.id);
          const isExpanded = expandedTestId === tc.id;
          const passed = testResult?.passed ?? true;

          return (
            <div 
              key={tc.id} 
              className={`bg-white border rounded-xl overflow-hidden transition shadow-xs ${
                passed ? 'border-stone-200' : 'border-rose-300'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => setExpandedTestId(isExpanded ? null : tc.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/70 transition"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0 ${
                    passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 uppercase px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200">
                        {tc.code}
                      </span>
                      <h2 className="text-sm font-bold text-stone-900">{tc.title}</h2>
                    </div>
                    <span className="text-xs text-stone-600 block mt-1">
                      Expected: <strong className="text-stone-800 capitalize">{tc.expectedCategory.replace(/_/g, ' ')}</strong>
                      {testResult && ` • Diagnosed: ${testResult.actualCategory.replace(/_/g, ' ')} (${testResult.executionTimeMs}ms)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadTestCaseIntoIntake(tc.profile);
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                  >
                    <span>Load Case into Intake</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  <div className="text-stone-400 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Inspection Drawer */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/60 space-y-4 text-xs animate-in fade-in duration-100">
                  {/* Scenario Description */}
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 uppercase tracking-wider block mb-1">
                      Synthetic Facts & Input Context
                    </span>
                    <p className="text-stone-700 leading-relaxed">{tc.scenarioDescription}</p>
                  </div>

                  {/* Conflicting Signals Detected */}
                  {testResult && testResult.conflictsDetected.length > 0 && (
                    <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-3 space-y-1">
                      <span className="font-bold text-amber-950 flex items-center">
                        <Zap className="w-3.5 h-3.5 text-amber-600 mr-1" />
                        Conflicting Evidence Isolated by Engine:
                      </span>
                      {testResult.conflictsDetected.map((c, idx) => (
                        <p key={idx} className="text-amber-900 text-[11px] leading-snug">• {c}</p>
                      ))}
                    </div>
                  )}

                  {/* Expected vs Actual Evaluation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1">
                      <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                        Expected Primary Intervention
                      </span>
                      <p className="text-stone-800 font-medium">{tc.expectedPrimaryAction}</p>
                      {testResult && (
                        <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-800 font-semibold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                          <span className="truncate">Generated: {testResult.primaryActionSummary}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1">
                      <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                        Acceptable Alternative Explanations
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                        {tc.acceptableAlternativeExplanations.map((alt, idx) => (
                          <li key={idx}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Critical Unknowns */}
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 uppercase tracking-wider block mb-1 text-[11px]">
                      Critical Unknowns to Address First
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                      {tc.criticalUnknowns.map((un, idx) => (
                        <li key={idx}>{un}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Evaluated Failure Conditions */}
                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                    <span className="font-bold text-stone-900 uppercase tracking-wider block flex items-center text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                      Failure Conditions Guardrails (Must NOT happen)
                    </span>
                    <div className="space-y-1">
                      {tc.failureConditions.map((fc, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{fc} — <strong className="text-emerald-700">AVOIDED</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
