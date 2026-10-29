import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Database,
  ExternalLink
} from 'lucide-react';
import { 
  exportAllDataAsJson, 
  importAllDataFromJson, 
  clearAllUserData, 
  CLINIC_DEMO_PROFILE, 
  saveProfile 
} from '../lib/storage';

interface SettingsModalProps {
  onClose: () => void;
  providerStatus: {
    openaiConfigured: boolean;
    geminiConfigured: boolean;
    activeProvider: 'openai' | 'gemini' | 'demo';
    openaiModel: string;
    message: string;
  };
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  providerStatus,
  onRefreshData
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founder-compass-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllDataFromJson(content);
      if (success) {
        setImportStatus('Data successfully imported!');
        onRefreshData();
      } else {
        setImportStatus('Failed to import JSON: Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDemo = () => {
    if (confirm('Reset your profile back to the ClinicFlow demo scenario?')) {
      saveProfile(CLINIC_DEMO_PROFILE);
      onRefreshData();
      onClose();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all saved business profiles, diagnoses, and experiments? This action cannot be undone.')) {
      clearAllUserData();
      onRefreshData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-stone-900">Settings & Data Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* AI Provider Status */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center">
                <Key className="w-3.5 h-3.5 mr-1.5 text-stone-600" />
                AI Provider Integration Status
              </span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                providerStatus.activeProvider === 'openai'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : providerStatus.activeProvider === 'gemini'
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {providerStatus.activeProvider === 'openai' ? 'OpenAI Active' : providerStatus.activeProvider === 'gemini' ? 'Gemini Live' : 'Demo Local Engine'}
              </span>
            </div>

            <p className="text-stone-700 leading-relaxed">
              {providerStatus.message}
            </p>

            <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Configured Model Identifier:</span>
                <span className="font-mono font-medium text-stone-900">{providerStatus.openaiModel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>OpenAI Server Key Configured:</span>
                <span className="font-semibold text-stone-900">{providerStatus.openaiConfigured ? 'Yes (Server-side)' : 'No (Using Demo Fallback)'}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-[11px] text-stone-700 leading-relaxed flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Secret Exposure:</strong> API keys are never stored in localStorage, client bundles, or exposed in UI code. All calls execute via the secure server proxy endpoint (<code>/api/diagnose</code>).
              </span>
            </div>
          </div>

          {/* Local Persistence & Privacy */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
            <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center">
              <Database className="w-3.5 h-3.5 mr-1.5 text-stone-600" />
              Data Storage & Device Persistence
            </span>
            <p className="text-stone-700 leading-relaxed">
              Your business profile, diagnostic reports, and experiment history are safely stored in your browser's persistent local storage. They do not leave your device without explicit action.
            </p>
          </div>

          {/* Export / Import */}
          <div className="space-y-3">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              Backup, Export & Import
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center space-x-2 p-3 bg-white border border-stone-300 rounded-lg font-medium text-stone-800 hover:bg-stone-50 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-stone-600" />
                <span>Export Profile & History (.json)</span>
              </button>

              <label className="flex items-center justify-center space-x-2 p-3 bg-white border border-stone-300 rounded-lg font-medium text-stone-800 hover:bg-stone-50 transition cursor-pointer">
                <Upload className="w-4 h-4 text-stone-600" />
                <span>Import from JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
            {importStatus && (
              <p className="text-xs font-semibold text-indigo-700">{importStatus}</p>
            )}
          </div>

          {/* Reset / Danger Zone */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <span className="font-bold text-rose-900 uppercase tracking-wider block">
              Reset & Data Clearing
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetToDemo}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                <span>Reset to ClinicFlow Demo Scenario</span>
              </button>

              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete All Saved Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
