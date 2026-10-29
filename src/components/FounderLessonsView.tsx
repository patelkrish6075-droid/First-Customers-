import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Tag
} from 'lucide-react';
import { FOUNDER_CASE_STUDIES } from '../lib/founderLessons';
import { FounderCaseStudy, BottleneckCategory } from '../types';

export const FounderLessonsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<string>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    return FOUNDER_CASE_STUDIES.filter(cs => {
      const matchesSearch = 
        cs.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.founderNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.coreLesson.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || cs.primaryChallenge === selectedCategory;
      const matchesModel = selectedBusinessModel === 'all' || cs.businessModel === selectedBusinessModel;

      return matchesSearch && matchesCat && matchesModel;
    });
  }, [searchQuery, selectedCategory, selectedBusinessModel]);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Documented Founder Lessons Library
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Learn from real early-stage decisions, failures, pivots, and acquisition strategies. Every case study is grounded in verifiable founder letters, documented interviews, and company archives.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search companies, founders, industries, or keywords (e.g. Buffer, ConvertKit, pricing)..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white"
          >
            <option value="all">All Failure Modes & Bottlenecks</option>
            <option value="demand_validation">Demand Validation</option>
            <option value="positioning_offer">Positioning & Offer</option>
            <option value="sales_conversion">Sales Conversion</option>
            <option value="acquisition_reach">Acquisition Reach</option>
            <option value="activation_value">Activation & Value</option>
            <option value="pricing_purchasing">Pricing & Purchasing</option>
          </select>

          {/* Business Model Filter */}
          <select
            value={selectedBusinessModel}
            onChange={e => setSelectedBusinessModel(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white"
          >
            <option value="all">All Business Models</option>
            <option value="b2b_saas">B2B SaaS</option>
            <option value="b2c_freemium">B2C Freemium</option>
            <option value="prosumer">Prosumer</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>Showing {filteredCases.length} of {FOUNDER_CASE_STUDIES.length} verified founder case studies</span>
          {(searchQuery || selectedCategory !== 'all' || selectedBusinessModel !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBusinessModel('all');
              }}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Case Studies Cards */}
      <div className="space-y-4">
        {filteredCases.map(cs => {
          const isExpanded = expandedCaseId === cs.id;

          return (
            <div 
              key={cs.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs hover:border-stone-300 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold text-sm">
                    {cs.companyName[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-stone-900">{cs.companyName}</h3>
                      <span className="text-[10px] font-semibold text-stone-500 hidden sm:inline">
                        by {cs.founderNames}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
                      {cs.industry} · {cs.businessModel.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 uppercase">
                    {cs.primaryChallenge.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => setExpandedCaseId(isExpanded ? null : cs.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer ml-2"
                  >
                    {isExpanded ? 'Collapse' : 'Read Full Case'}
                  </button>
                </div>
              </div>

              {/* Core Lesson Teaser */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs">
                <span className="font-bold text-stone-900 block mb-0.5">Core Strategic Lesson:</span>
                <p className="text-stone-700 leading-relaxed font-medium">{cs.coreLesson}</p>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="pt-2 space-y-4 text-xs animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1 uppercase text-[10px] tracking-wider">
                        Initial Situation:
                      </span>
                      <p className="text-stone-600 leading-relaxed">{cs.situation}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1 uppercase text-[10px] tracking-wider">
                        Strategic Decision Made:
                      </span>
                      <p className="text-stone-600 leading-relaxed">{cs.decision}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200">
                    <span className="font-bold text-stone-800 block mb-1 uppercase text-[10px] tracking-wider">
                      Evidence Available at the Time:
                    </span>
                    <p className="text-stone-600 leading-relaxed">{cs.evidenceAvailableAtTime}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                    <span className="font-bold text-emerald-900 block mb-1 uppercase text-[10px] tracking-wider">
                      Documented Outcome:
                    </span>
                    <p className="text-emerald-900 leading-relaxed font-medium">{cs.outcomeDocumented}</p>
                  </div>

                  {/* Transferability Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-indigo-950">
                      <span className="font-bold text-indigo-900 block mb-1 uppercase text-[10px] tracking-wider">
                        ✓ What Applies to Your Startup:
                      </span>
                      <p className="text-indigo-900/90 leading-relaxed">{cs.whatAppliesToYourProduct}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950">
                      <span className="font-bold text-rose-900 block mb-1 uppercase text-[10px] tracking-wider">
                        ✕ What May NOT Transfer:
                      </span>
                      <p className="text-rose-900/90 leading-relaxed">{cs.whatMayNotTransfer}</p>
                    </div>
                  </div>

                  {/* Source Citations */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
                    <div className="flex items-center space-x-1.5">
                      <span>Citations:</span>
                      {cs.sources.map((s, sIdx) => (
                        <span key={sIdx} className="font-medium text-stone-700">
                          {s.title} ({s.publisher}, {s.year})
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400">Verifiable public records</span>
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
