import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export const AdminCheckIn: React.FC = () => {
  const { loginAdmin, setActiveTab, businessSettings } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        setErrorMessage(res.message || 'Authentication failed. Please verify your staff credentials.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
        {/* Brand Header */}
        <div className="text-center mb-8">
          {businessSettings.logoUrl ? (
            <img
              src={businessSettings.logoUrl}
              alt={businessSettings.name}
              className="h-12 mx-auto mb-4 object-contain rounded-xl"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700/80 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-5 h-5 text-[#F51B55]" />
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight">{businessSettings.name || 'UMUJYI RWANDA'}</h1>
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            Management & Operations Portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/70 border border-red-800/70 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@umujyi.rw"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/90 rounded-xl border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#F51B55] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 bg-neutral-800/90 rounded-xl border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#F51B55] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#F51B55] rounded"
              />
              <span className="text-xs text-neutral-400">Remember credentials</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-[#F51B55] hover:bg-[#d41446] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span>Verifying authorization...</span>
            ) : (
              <>
                <span>Sign In to Operations</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Note & Return to Customer Storefront */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 space-y-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Authorized personnel & restaurant staff only</span>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
