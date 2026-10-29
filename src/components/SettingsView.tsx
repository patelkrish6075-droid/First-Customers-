import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  User, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Plus
} from 'lucide-react';
import { UserAccount, Workspace } from '../types';
import { 
  exportAllDataAsJson, 
  importAllDataFromJson, 
  clearAllUserData 
} from '../lib/storage';

interface SettingsViewProps {
  currentUser: UserAccount;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onUpdateUser: (user: UserAccount) => void;
  onSwitchWorkspace: (id: string) => void;
  onAddWorkspace: (name: string) => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  workspaces,
  activeWorkspaceId,
  onUpdateUser,
  onSwitchWorkspace,
  onAddWorkspace,
  onDataReset
}) => {
  const [userName, setUserName] = useState(currentUser.fullName);
  const [companyName, setCompanyName] = useState(currentUser.companyName);
  const [userRole, setUserRole] = useState(currentUser.role);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      fullName: userName,
      companyName,
      role: userRole
    });
    setFeedbackMessage('User profile updated successfully.');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    onAddWorkspace(newWorkspaceName.trim());
    setNewWorkspaceName('');
    setFeedbackMessage('New workspace created.');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleExportData = () => {
    const json = exportAllDataAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `first-customers-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataFromJson(content);
        if (success) {
          setFeedbackMessage('Data imported successfully. Reloading workspace state.');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setFeedbackMessage('Import failed: invalid JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    clearAllUserData();
    setShowConfirmReset(false);
    onDataReset();
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Workspace & Privacy Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Manage your startup workspaces, export full backups, and control data privacy settings.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 1. Startup Workspaces */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-stone-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Active Startup Workspaces
            </h2>
          </div>
          <span className="text-[11px] text-stone-500">Isolate data per product</span>
        </div>

        <div className="space-y-2">
          {workspaces.map(ws => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <div 
                key={ws.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                  isActive ? 'bg-indigo-50/70 border-indigo-200 font-bold' : 'bg-stone-50 border-stone-200/80 text-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-stone-900">{ws.name}</span>
                    {ws.isDemo && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                        Sample Scenario
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 font-normal">
                    Workspace ID: {ws.slug}
                  </span>
                </div>

                {isActive ? (
                  <span className="text-indigo-600 text-[11px] font-bold">Currently Active</span>
                ) : (
                  <button
                    onClick={() => onSwitchWorkspace(ws.id)}
                    className="px-3 py-1 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Switch to Workspace
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Workspace Form */}
        <form onSubmit={handleCreateWorkspace} className="pt-2 flex gap-2">
          <input
            type="text"
            value={newWorkspaceName}
            onChange={e => setNewWorkspaceName(e.target.value)}
            placeholder="New product workspace name (e.g. LeadPulse B2B)..."
            className="flex-1 px-3 py-2 border rounded-lg border-stone-300 text-xs"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Workspace</span>
          </button>
        </form>
      </div>

      {/* 2. Account Profile Settings */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
          <User className="w-4 h-4 text-stone-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Founder Account Information
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company / Studio</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email (Account Login)</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 border rounded-lg border-stone-200 bg-stone-50 text-stone-500 text-xs cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Role Title</label>
              <input
                type="text"
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-stone-300 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. Data Controls & Privacy */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Lock className="w-4 h-4 text-stone-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Data Portability & Complete Privacy
          </h2>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          You own 100% of your business data, hypotheses, and experiment observations. You can download a full unencrypted JSON backup of all workspace entities or erase local records instantly.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full JSON Backup</span>
          </button>

          <label className="px-4 py-2 rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset / Wipe Workspace Data</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmReset && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-3 mt-4 animate-in fade-in">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to reset all workspace data?</p>
                <p className="text-rose-900/90 mt-0.5">
                  This will erase your current business profile, recorded experiments, funnel logs, and chat history. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-rose-800 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer"
              >
                Confirm Erase & Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
