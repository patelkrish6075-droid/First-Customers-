import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Search, 
  Target, 
  FlaskConical, 
  BookOpen, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles, 
  FileText, 
  Layers, 
  Settings, 
  HelpCircle,
  Play,
  CreditCard,
  Building2,
  X,
  CheckCircle2
} from 'lucide-react';
import { ActiveAppView, Workspace } from '../types';

interface SidebarProps {
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  activeWorkspace?: Workspace;
  activeExperimentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpenOnMobile,
  onCloseMobile,
  activeWorkspace,
  activeExperimentCount
}) => {
  const primaryNavItems = [
    { id: 'dashboard' as const, label: 'Founder Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'next_actions' as const, label: 'What Should I Do Next?', icon: ArrowUpRight, badge: 'Core' },
    { id: 'market_validation' as const, label: 'Market Validator', icon: Compass, badge: null },
    { id: 'customer_research' as const, label: 'Customer Research', icon: Search, badge: null },
    { id: 'acquisition_plans' as const, label: 'Acquisition Engine', icon: Target, badge: null },
    { 
      id: 'experiment_workspace' as const, 
      label: 'Experiment Workspace', 
      icon: FlaskConical, 
      badge: activeExperimentCount > 0 ? `${activeExperimentCount}` : null 
    },
    { id: 'founder_lessons' as const, label: 'Founder Lessons', icon: BookOpen, badge: null },
    { id: 'sales_diagnosis' as const, label: 'Sales Diagnosis', icon: BarChart3, badge: null },
    { id: 'ai_assistant' as const, label: 'AI Strategy Assistant', icon: Sparkles, badge: null },
    { id: 'reports' as const, label: 'Reports & Exports', icon: FileText, badge: null },
    { id: 'integrations' as const, label: 'Integrations Hub', icon: Layers, badge: null },
  ];

  const secondaryNavItems = [
    { id: 'onboarding' as const, label: 'Update Intake Profile', icon: CheckCircle2 },
    { id: 'pricing' as const, label: 'Plans & Pricing', icon: CreditCard },
    { id: 'settings' as const, label: 'Workspace & Privacy', icon: Settings },
    { id: 'help_docs' as const, label: 'Methodology & Help', icon: HelpCircle },
  ];

  const handleNavClick = (viewId: ActiveAppView) => {
    setCurrentView(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpenOnMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-10 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Mobile Header Inside Drawer */}
          <div className="md:hidden flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-sm text-stone-900">First Customers</span>
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Workspace Label */}
          {activeWorkspace && (
            <div className="px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Active Workspace
              </span>
              <span className="font-bold text-stone-900 block truncate mt-0.5">
                {activeWorkspace.name}
              </span>
              {activeWorkspace.isDemo && (
                <span className="text-[10px] text-amber-700 font-medium">Demo Clinic Scenario</span>
              )}
            </div>
          )}

          {/* Primary Core Modules (A through K) */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-2 block mb-1.5">
              Core Modules
            </span>
            <nav className="space-y-0.5">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer text-left ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-stone-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                        item.badge === 'Core'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Configuration & Support */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-2 block mb-1.5">
              System & Tools
            </span>
            <nav className="space-y-0.5">
              {secondaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-stone-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Methodology Box */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/70 text-xs">
          <p className="text-[11px] font-semibold text-stone-800">First Customers Loop</p>
          <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">
            Diagnose → Validate → Experiment → Measure → Learn
          </p>
        </div>
      </aside>
    </>
  );
};
