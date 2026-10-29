import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { FreeValidatorTool } from './components/FreeValidatorTool';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { IntakeForm } from './components/IntakeForm';
import { DiagnosisReportView } from './components/DiagnosisReportView';
import { MarketValidatorView } from './components/MarketValidatorView';
import { CustomerResearchView } from './components/CustomerResearchView';
import { AcquisitionEngineView } from './components/AcquisitionEngineView';
import { ExperimentWorkspace } from './components/ExperimentWorkspace';
import { FounderLessonsView } from './components/FounderLessonsView';
import { SalesDiagnosisView } from './components/SalesDiagnosisView';
import { NextActionsView } from './components/NextActionsView';
import { AIAssistantView } from './components/AIAssistantView';
import { ReportsView } from './components/ReportsView';
import { IntegrationsView } from './components/IntegrationsView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import { HelpDocsView } from './components/HelpDocsView';
import { TestBench } from './components/TestBench';
import { 
  getSavedProfile, 
  saveProfile, 
  getSavedReport, 
  saveReport, 
  getSavedExperiments, 
  saveExperiments,
  addExperimentFromReport, 
  updateExperimentStatus, 
  recordExperimentResults,
  getClinicDemoReport,
  CLINIC_DEMO_PROFILE,
  getSavedUser,
  saveUser,
  getSavedWorkspaces,
  saveWorkspaces,
  getActiveWorkspaceId,
  setActiveWorkspaceId,
  getSavedFunnelData,
  saveFunnelData
} from './lib/storage';
import { 
  BusinessProfile, 
  DiagnosticReport, 
  TrackedExperiment, 
  ExperimentStatus, 
  ActiveAppView, 
  UserAccount, 
  Workspace,
  SalesFunnelData,
  ExperimentPlan
} from './types';
import { generateDiagnosticReport } from './lib/diagnosticEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('landing');
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => getSavedUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => getSavedWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>(() => getActiveWorkspaceId());
  
  const [profile, setProfile] = useState<BusinessProfile>(() => getSavedProfile());
  const [latestReport, setLatestReport] = useState<DiagnosticReport | null>(() => getSavedReport());
  const [experiments, setExperiments] = useState<TrackedExperiment[]>(() => getSavedExperiments());
  const [funnelData, setFunnelDataState] = useState<SalesFunnelData>(() => getSavedFunnelData());

  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'recover' }>({
    isOpen: false,
    mode: 'login'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const handleSaveProfile = (updated: BusinessProfile) => {
    setProfile(updated);
    saveProfile(updated);
  };

  const handleGenerateReport = async (prof: BusinessProfile) => {
    setIsLoadingReport(true);
    handleSaveProfile(prof);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prof)
      });

      if (!response.ok) {
        throw new Error(`Diagnosis API responded with status ${response.status}`);
      }

      const report: DiagnosticReport = await response.json();
      setLatestReport(report);
      saveReport(report);
      setCurrentView('dashboard');
    } catch (err) {
      console.warn('API diagnosis failed, generating deterministic fallback report:', err);
      const fallback = generateDiagnosticReport(prof, 'demo', 'Deterministic Rule Engine (v1.0)');
      setLatestReport(fallback);
      saveReport(fallback);
      setCurrentView('dashboard');
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleViewExampleReport = () => {
    const demoReport = getClinicDemoReport();
    setProfile(CLINIC_DEMO_PROFILE);
    saveProfile(CLINIC_DEMO_PROFILE);
    setLatestReport(demoReport);
    saveReport(demoReport);
    setCurrentView('dashboard');
  };

  const handleSwitchWorkspace = (workspaceId: string) => {
    setActiveWorkspaceIdState(workspaceId);
    setActiveWorkspaceId(workspaceId);
    if (workspaceId === 'ws-demo-clinic') {
      setProfile(CLINIC_DEMO_PROFILE);
      saveProfile(CLINIC_DEMO_PROFILE);
      const demoRep = getClinicDemoReport();
      setLatestReport(demoRep);
      saveReport(demoRep);
    }
  };

  const handleAddWorkspace = (name: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      ownerId: currentUser.id,
      isDemo: false,
      createdAt: new Date().toISOString()
    };
    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    saveWorkspaces(updated);
    handleSwitchWorkspace(newWs.id);
  };

  const handleSaveExperimentPlan = (plan: ExperimentPlan) => {
    const today = new Date();
    const review = new Date();
    review.setDate(today.getDate() + 14);

    const newExp: TrackedExperiment = {
      id: plan.id,
      name: plan.title,
      category: 'demand_validation',
      hypothesis: plan.hypothesis,
      targetAudience: plan.targetAudience,
      timeFrame: plan.timeFrame,
      procedure: plan.procedure,
      startDate: today.toISOString().split('T')[0],
      reviewDate: review.toISOString().split('T')[0],
      requiredResources: plan.requiredResources,
      metricsToRecord: plan.metricsToRecord,
      initialAssumptions: `Direct experiment: ${plan.hypothesis}`,
      status: 'planned'
    };

    const current = getSavedExperiments();
    const updated = [newExp, ...current.filter(e => e.id !== newExp.id)];
    setExperiments(updated);
    saveExperiments(updated);
  };

  const handleCreateCustomExperiment = (exp: TrackedExperiment) => {
    const current = getSavedExperiments();
    const updated = [exp, ...current];
    setExperiments(updated);
    saveExperiments(updated);
  };

  const handleUpdateExperimentStatus = (id: string, status: ExperimentStatus) => {
    updateExperimentStatus(id, status);
    setExperiments(getSavedExperiments());
  };

  const handleRecordExperimentResults = (
    id: string,
    observedResults: NonNullable<TrackedExperiment['observedResults']>,
    evaluation: NonNullable<TrackedExperiment['evaluation']>
  ) => {
    recordExperimentResults(id, observedResults, evaluation);
    setExperiments(getSavedExperiments());
  };

  const handleSaveFunnelData = (data: SalesFunnelData) => {
    setFunnelDataState(data);
    saveFunnelData(data);
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    saveUser(user);
    setIsAuthenticated(true);
    setAuthModalConfig({ isOpen: false, mode: 'login' });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  const handleUnlockFullFromPreview = (partial: Partial<BusinessProfile>) => {
    const updated = { ...profile, ...partial };
    setProfile(updated);
    saveProfile(updated);
    setCurrentView('onboarding');
  };

  const isPublicStandaloneView = 
    currentView === 'landing' || 
    currentView === 'features' || 
    currentView === 'free_validator';

  const isCurrentExperimentSaved = Boolean(
    latestReport && experiments.some(e => e.id === latestReport.primaryExperiment.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1E232A]">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={handleSwitchWorkspace}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar navigation for application routes */}
        {!isPublicStandaloneView && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            isOpenOnMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            activeWorkspace={activeWorkspace}
            activeExperimentCount={experiments.filter(e => e.status === 'active').length}
          />
        )}

        {/* Primary Viewport */}
        <main className={`flex-1 w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 ${isPublicStandaloneView ? 'max-w-7xl mx-auto' : 'max-w-6xl mx-auto'}`}>
          {/* 1. Public Landing Page */}
          {currentView === 'landing' && (
            <LandingPage
              onStartDiagnosis={() => setCurrentView('onboarding')}
              onExplorePlatform={() => setCurrentView('dashboard')}
              onViewExampleReport={handleViewExampleReport}
              setCurrentView={setCurrentView}
            />
          )}

          {/* 2. Product Features Overview */}
          {currentView === 'features' && (
            <FeaturesPage
              setCurrentView={setCurrentView}
              onStartDiagnosis={() => setCurrentView('onboarding')}
            />
          )}

          {/* 3. Free Product Validation Tool */}
          {currentView === 'free_validator' && (
            <FreeValidatorTool
              onUnlockFullPlatform={handleUnlockFullFromPreview}
            />
          )}

          {/* 7. Onboarding & Guided Intake */}
          {currentView === 'onboarding' && (
            <IntakeForm
              initialProfile={profile}
              onSaveProfile={handleSaveProfile}
              onGenerateReport={handleGenerateReport}
              isLoading={isLoadingReport}
            />
          )}

          {/* 8. Main Dashboard (Module A) */}
          {currentView === 'dashboard' && (
            <Dashboard
              profile={profile}
              latestReport={latestReport}
              experiments={experiments}
              funnelData={funnelData}
              setCurrentView={setCurrentView}
              onStartDiagnosis={() => setCurrentView('onboarding')}
              onViewExampleReport={handleViewExampleReport}
              onViewReport={() => setCurrentView('market_validation')}
              onGoToExperiments={() => setCurrentView('experiment_workspace')}
              onGoToTestBench={() => setCurrentView('help_docs')}
            />
          )}

          {/* 9. Market Validation (Module B) */}
          {currentView === 'market_validation' && (
            <MarketValidatorView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onSaveExperimentFromValidation={handleSaveExperimentPlan}
              onGoToExperiments={() => setCurrentView('experiment_workspace')}
            />
          )}

          {/* 10. Customer Research (Module C) */}
          {currentView === 'customer_research' && (
            <CustomerResearchView
              profile={profile}
              onNavigateToAcquisition={() => setCurrentView('acquisition_plans')}
            />
          )}

          {/* 11. Acquisition Plans (Module D) */}
          {currentView === 'acquisition_plans' && (
            <AcquisitionEngineView
              profile={profile}
              onSaveExperiment={handleSaveExperimentPlan}
              onNavigateToExperiments={() => setCurrentView('experiment_workspace')}
            />
          )}

          {/* 12. Experiment Workspace (Module E) */}
          {currentView === 'experiment_workspace' && (
            <ExperimentWorkspace
              experiments={experiments}
              onUpdateStatus={handleUpdateExperimentStatus}
              onRecordResults={handleRecordExperimentResults}
              onCreateCustomExperiment={handleCreateCustomExperiment}
              onNavigateToIntake={() => setCurrentView('onboarding')}
            />
          )}

          {/* 13. Founder Lessons Library (Module F) */}
          {currentView === 'founder_lessons' && (
            <FounderLessonsView />
          )}

          {/* 14. Sales Diagnosis (Module G) */}
          {currentView === 'sales_diagnosis' && (
            <SalesDiagnosisView
              initialData={funnelData}
              onSaveFunnelData={handleSaveFunnelData}
              onNavigateToExperiments={() => setCurrentView('experiment_workspace')}
            />
          )}

          {/* 15. Next-Action Recommendations (Module H) */}
          {currentView === 'next_actions' && (
            <NextActionsView
              profile={profile}
              experiments={experiments}
              funnelData={funnelData}
              onSaveExperiment={handleSaveExperimentPlan}
              onNavigateToExperiments={() => setCurrentView('experiment_workspace')}
            />
          )}

          {/* 16. AI Assistant (Module I) */}
          {currentView === 'ai_assistant' && (
            <AIAssistantView
              profile={profile}
              latestReport={latestReport}
              experiments={experiments}
            />
          )}

          {/* 17. Reports & Exports (Module J) */}
          {currentView === 'reports' && (
            <ReportsView
              profile={profile}
              latestReport={latestReport}
              experiments={experiments}
              funnelData={funnelData}
            />
          )}

          {/* 18. Integrations Hub (Module K) */}
          {currentView === 'integrations' && (
            <IntegrationsView />
          )}

          {/* 19. Pricing Page */}
          {currentView === 'pricing' && (
            <PricingView
              currentUser={currentUser}
              onSelectPlan={(plan) => {
                const updated = { ...currentUser, plan };
                setCurrentUser(updated);
                saveUser(updated);
                setCurrentView('dashboard');
              }}
            />
          )}

          {/* 20 & 21. Settings & Privacy Controls */}
          {(currentView === 'settings' || currentView === 'privacy') && (
            <SettingsView
              currentUser={currentUser}
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                saveUser(updated);
              }}
              onSwitchWorkspace={handleSwitchWorkspace}
              onAddWorkspace={handleAddWorkspace}
              onDataReset={() => {
                setProfile(CLINIC_DEMO_PROFILE);
                setLatestReport(null);
                setExperiments([]);
                setCurrentView('landing');
              }}
            />
          )}

          {/* 22. Methodology & Documentation */}
          {currentView === 'help_docs' && (
            <HelpDocsView
              setCurrentView={setCurrentView}
            />
          )}
        </main>
      </div>

      {/* Global Quiet Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-stone-900">First Customers</span>
            <span aria-hidden="true">·</span>
            <span>Customer Acquisition Engine for Builders</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-600">
            <button 
              onClick={() => setCurrentView('landing')} 
              className="hover:text-stone-900 transition cursor-pointer"
            >
              Overview
            </button>
            <button 
              onClick={() => setCurrentView('features')} 
              className="hover:text-stone-900 transition cursor-pointer"
            >
              Capabilities
            </button>
            <button 
              onClick={() => setCurrentView('pricing')} 
              className="hover:text-stone-900 transition cursor-pointer"
            >
              Pricing
            </button>
            <button 
              onClick={() => setCurrentView('help_docs')} 
              className="hover:text-stone-900 transition cursor-pointer"
            >
              Methodology
            </button>
            <button 
              onClick={() => setCurrentView('settings')} 
              className="hover:text-stone-900 transition cursor-pointer"
            >
              Data Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModalConfig.isOpen && (
        <AuthModal
          initialMode={authModalConfig.mode}
          onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
