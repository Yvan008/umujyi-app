import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, KeyRound, ArrowRight, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const AdminCheckIn: React.FC = () => {
  const { loginAdmin, setActiveTab } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await loginAdmin(email, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMessage('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@umujyi.rw');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F51B55] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20">
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Staff Check-in</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Secure administrative portal for Umujyi Rwanda operations
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800/80 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@umujyi.rw"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/80 rounded-xl border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#F51B55] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/80 rounded-xl border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#F51B55] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#F51B55] hover:bg-[#d41446] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
          <p className="text-[11px] text-neutral-500 mb-2">Reviewer / Staff Demo Credentials</p>
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono font-semibold transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#F51B55]" />
            <span>Fill: admin@umujyi.rw / admin123</span>
          </button>
        </div>

        {/* Return to Customer Storefront */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
