import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Building2, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { UserAccount } from '../types';
import { DEFAULT_USER } from '../lib/storage';

interface AuthModalProps {
  initialMode: 'login' | 'signup' | 'recover';
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'recover'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'recover') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setRecoverySent(true);
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const authenticatedUser: UserAccount = {
      id: `usr-${Date.now()}`,
      email,
      fullName: fullName.trim() || email.split('@')[0],
      companyName: companyName.trim() || 'My Startup Workspace',
      role: 'Founder & CEO',
      plan: 'pro',
      createdAt: new Date().toISOString()
    };

    onSuccess(authenticatedUser);
  };

  const handleDemoLogin = () => {
    onSuccess(DEFAULT_USER);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              FC
            </div>
            <span className="font-extrabold text-sm text-stone-900">First Customers</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-2 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {mode === 'login' && 'Sign in to your workspace'}
              {mode === 'signup' && 'Create your founder account'}
              {mode === 'recover' && 'Recover workspace access'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {mode === 'login' && 'Access your business profile, experiments, and customer acquisition plans.'}
              {mode === 'signup' && 'Start finding why customers aren’t buying, and what to test next.'}
              {mode === 'recover' && 'Enter your verified account email to receive a password reset link.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          {recoverySent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-bold">Password Reset Email Dispatched</p>
              <p className="text-emerald-800">
                If an account exists for <strong>{email}</strong>, a secure access reset link has been dispatched.
              </p>
              <button
                onClick={() => {
                  setRecoverySent(false);
                  setMode('login');
                }}
                className="mt-2 text-xs font-bold text-emerald-900 hover:underline cursor-pointer block mx-auto"
              >
                Back to Sign In →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Startup / Product Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="e.g. LeadPulse Analytics"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="founder@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              {mode !== 'recover' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('recover')}
                        className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>
                  {mode === 'login' && 'Sign In to Workspace'}
                  {mode === 'signup' && 'Create Workspace Account'}
                  {mode === 'recover' && 'Send Reset Instructions'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Login Button */}
          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-600" />
              <span>Instant Test Drive (1-Click Demo Login)</span>
            </button>
            <span className="text-[10px] text-stone-400 text-center block mt-1">
              Loads pre-configured founder profile and sample workspace data
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="text-center text-xs text-stone-500 pt-2">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('signup');
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('login');
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'recover' && (
              <p>
                Remember your password?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('login');
                  }}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
