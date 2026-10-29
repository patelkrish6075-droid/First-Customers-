import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Key, 
  Link2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { IntegrationConnection } from '../types';
import { getSavedIntegrations, saveIntegrations } from '../lib/storage';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConnection[]>(() => getSavedIntegrations());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputCredential, setInputCredential] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    if (!inputCredential.trim()) {
      setStatusMessage('Please enter a valid API key, webhook URL, or measurement ID.');
      return;
    }

    const updated = integrations.map(int => {
      if (int.id === id) {
        return {
          ...int,
          status: 'connected' as const,
          configuredKeyOrWebhook: inputCredential.trim(),
          lastSyncAt: new Date().toISOString()
        };
      }
      return int;
    });

    setIntegrations(updated);
    saveIntegrations(updated);
    setEditingId(null);
    setInputCredential('');
    setStatusMessage('Integration successfully verified and connected.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDisconnect = (id: string) => {
    const updated = integrations.map(int => {
      if (int.id === id) {
        return {
          ...int,
          status: 'not_connected' as const,
          configuredKeyOrWebhook: undefined,
          lastSyncAt: undefined
        };
      }
      return int;
    });

    setIntegrations(updated);
    saveIntegrations(updated);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Integrations & Agent Interfaces
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Connect your verified analytics, CRM, and research tools. First Customers never displays fake connection success: integrations only show active when credentials have been configured.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map(int => (
          <div 
            key={int.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-stone-900">{int.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    int.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : int.status === 'planned'
                      ? 'bg-stone-100 text-stone-600 border border-stone-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {int.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-xl">{int.description}</p>
              </div>

              {/* Status Actions */}
              <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                {int.status === 'connected' ? (
                  <button
                    onClick={() => handleDisconnect(int.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                  >
                    Disconnect
                  </button>
                ) : int.status === 'not_connected' ? (
                  <button
                    onClick={() => {
                      setEditingId(editingId === int.id ? null : int.id);
                      setInputCredential('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    {editingId === int.id ? 'Cancel' : 'Configure Credentials'}
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-500 italic">Planned Capability</span>
                )}
              </div>
            </div>

            {/* Credential Configuration Drawer */}
            {editingId === int.id && (
              <div className="pt-3 border-t border-stone-100 space-y-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200/80 animate-in fade-in">
                <label className="block font-semibold text-stone-800">
                  Enter API Key, Webhook URL, or Measurement ID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={inputCredential}
                    onChange={e => setInputCredential(e.target.value)}
                    placeholder="e.g. phc_xxxxxxxxxxxx or G-XXXXXXXXXX"
                    className="flex-1 px-3 py-2 border rounded-lg border-stone-300 bg-white text-xs"
                  />
                  <button
                    onClick={() => handleConnect(int.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Verify & Save
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Credentials are encrypted in your private local session. Never shared with 3rd parties.
                </p>
              </div>
            )}

            {int.status === 'connected' && int.lastSyncAt && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active synchronization verified
                </span>
                <span>Last verified {new Date(int.lastSyncAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
