import React, { useState } from 'react';
import { 
  Compass, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Building2, 
  Settings, 
  LogOut, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ActiveAppView, UserAccount, Workspace } from '../types';

interface HeaderProps {
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  currentUser: UserAccount;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (id: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onOpenAuth,
  isAuthenticated,
  onLogout,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const isPublicPage = currentView === 'landing' || currentView === 'features' || currentView === 'pricing' || currentView === 'free_validator';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-2 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs group-hover:bg-indigo-700 transition">
              FC
            </div>
            <span className="text-lg font-extrabold tracking-tight text-stone-900 whitespace-nowrap">
              First Customers
            </span>
          </button>

          {/* Quiet workspace selector for authenticated app */}
          {isAuthenticated && (
            <div className="relative hidden sm:block ml-2">
              <button
                onClick={() => {
                  setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-100 transition border border-stone-200 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[140px] truncate">{activeWorkspace?.name || 'Workspace'}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isWorkspaceDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-100">
                    Switch Product Workspace
                  </div>
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSwitchWorkspace(ws.id);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer ${
                        ws.id === activeWorkspaceId ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-stone-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{ws.name}</span>
                        {ws.isDemo && (
                          <span className="text-[10px] text-amber-700 font-medium">Illustrative Demo Scenario</span>
                        )}
                      </div>
                      {ws.id === activeWorkspaceId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {isPublicPage ? (
            <>
              <button 
                onClick={() => setCurrentView('landing')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'landing' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setCurrentView('features')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'features' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Capabilities
              </button>
              <button 
                onClick={() => setCurrentView('free_validator')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'free_validator' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Free Validator
              </button>
              <button 
                onClick={() => setCurrentView('pricing')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'pricing' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Pricing
              </button>
              <button 
                onClick={() => setCurrentView('help_docs')}
                className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Methodology
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'dashboard' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('next_actions')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'next_actions' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Next Actions
              </button>
              <button 
                onClick={() => setCurrentView('market_validation')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'market_validation' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Validator
              </button>
              <button 
                onClick={() => setCurrentView('acquisition_plans')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'acquisition_plans' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Acquisition
              </button>
              <button 
                onClick={() => setCurrentView('experiment_workspace')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${currentView === 'experiment_workspace' ? 'text-stone-900 font-semibold' : ''}`}
              >
                Experiments
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.fullName ? currentUser.fullName[0] : 'U'}
                </div>
                <span className="text-xs font-semibold hidden sm:inline max-w-[120px] truncate">
                  {currentUser.fullName || currentUser.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="font-bold text-stone-900 truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {currentUser.plan.toUpperCase()} Plan
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                  >
                    Founder Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                  >
                    Workspace & Data Settings
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('pricing');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                  >
                    Upgrade Plan
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 transition flex items-center space-x-1.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition whitespace-nowrap cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Diagnose Growth
              </button>
            </div>
          )}

          {/* Quick Primary CTA to jump into diagnosis if authenticated on landing */}
          {isAuthenticated && isPublicPage && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <span>Go to App</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
