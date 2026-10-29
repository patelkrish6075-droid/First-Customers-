import React, { useState } from 'react';
import { 
  Search, 
  Target, 
  ExternalLink, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { BusinessProfile, CustomerResearchRecord } from '../types';
import { generateCustomerResearch } from '../lib/customerResearchEngine';

interface CustomerResearchViewProps {
  profile: BusinessProfile;
  onNavigateToAcquisition?: () => void;
}

export const CustomerResearchView: React.FC<CustomerResearchViewProps> = ({
  profile,
  onNavigateToAcquisition
}) => {
  const [research] = useState<CustomerResearchRecord>(() => generateCustomerResearch(profile));

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Customer & Market Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Target buyer roles, buying triggers, competitor vulnerabilities, and live discussion communities for <strong>{profile.productName}</strong>.
          </p>
        </div>

        {onNavigateToAcquisition && (
          <button
            onClick={onNavigateToAcquisition}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer self-start sm:self-auto flex items-center space-x-1.5"
          >
            <span>View Acquisition Plans</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 1. Ideal Customer Profiles (ICPs) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-stone-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Ideal Customer Profile (ICP) Segment Breakdowns
            </h2>
          </div>
          <span className="text-[11px] text-stone-500">Verified buyer roles & authority</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {research.icps.map((icp, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      {icp.segment}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">{icp.targetTitle}</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {icp.budgetAuthority}
                  </span>
                </div>

                <div className="text-xs space-y-2.5">
                  <div>
                    <span className="font-bold text-stone-800 block mb-0.5">Primary Buying Trigger:</span>
                    <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                      {icp.buyingTrigger}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-stone-800 block mb-0.5">Top Adoption Friction:</span>
                    <p className="text-stone-600 leading-relaxed">
                      {icp.topFrictionPoint}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-stone-800 block mb-1">Where to Intercept Them:</span>
                    <ul className="space-y-1 text-stone-600">
                      {icp.whereToFindThem.map((loc, lIdx) => (
                        <li key={lIdx} className="flex items-start space-x-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{loc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 bg-indigo-50/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl text-xs">
                <span className="font-bold text-indigo-950 block mb-0.5 text-[11px] uppercase tracking-wider">
                  High-Converting Discovery Hook:
                </span>
                <p className="text-indigo-900 italic font-medium">
                  "{icp.highConvertingHook}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Competitors and Substitutes Matrix */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
          Competitor Vulnerabilities & Positioning Angles
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                <th className="py-2.5 pr-4">Competitor / Alternative</th>
                <th className="py-2.5 pr-4">Category</th>
                <th className="py-2.5 pr-4">Pricing Model</th>
                <th className="py-2.5 pr-4">Vulnerability / Pain Point</th>
                <th className="py-2.5">Your Differentiation Angle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {research.competitorLandscape.map((comp, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 pr-4 font-bold text-stone-900">{comp.competitor}</td>
                  <td className="py-3 pr-4 text-stone-600">{comp.category}</td>
                  <td className="py-3 pr-4 font-mono text-stone-700">{comp.estimatedPricePoint}</td>
                  <td className="py-3 pr-4 text-rose-800">{comp.weaknessOrVulnerability}</td>
                  <td className="py-3 font-medium text-emerald-800">{comp.differentiationStrategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Live Public Discussion Forums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              High-Intent Public Discussion Channels
            </h3>
          </div>

          <div className="space-y-3">
            {research.publicDiscussionForums.map((forum, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{forum.platform}: {forum.communityName}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Active Hub</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {forum.relevantKeywords.map((kw, kIdx) => (
                    <span key={kIdx} className="bg-white px-2 py-0.5 rounded border border-stone-200 text-[10px] text-stone-600">
                      #{kw}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-stone-600 pt-1 italic">
                  Search query sample: "{forum.sampleDiscussionPrompt}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Strategic Market Trends */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Macro Industry Trends & Headwinds
            </h3>
          </div>

          <div className="space-y-3">
            {research.marketTrends.map((trend, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <span className="font-bold text-stone-900 block">{trend.trendTitle}</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">{trend.impactOnBuyer}</p>
                {trend.verifiableCitation && (
                  <span className="text-[10px] text-stone-600 block pt-0.5">
                    Source: {trend.verifiableCitation}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
