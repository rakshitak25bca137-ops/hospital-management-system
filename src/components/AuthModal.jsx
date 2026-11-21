import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { CareNovaLogo } from './HospitalImages';
import { AVAILABLE_ROLES } from '../data/initialData';

export default function AuthModal({
  isOpen,
  onLoginSuccess,
  onClose
}) {
  const [username, setUsername] = useState('kyra.sen');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Admin');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLocked) {
      setErrorMsg('Account is locked for 15 minutes due to 5 failed attempts (FR-1.3).');
      return;
    }

    // Demo password check
    if (password === 'password123' || password === 'admin') {
      setFailedAttempts(0);
      const chosenRoleObj = AVAILABLE_ROLES.find((r) => r.role === role);
      onLoginSuccess({
        name: role === 'Admin' ? 'Kyra' : chosenRoleObj?.name.split(' ')[0] || 'User',
        fullName: chosenRoleObj?.name || 'Kyra Sen',
        role: role,
        avatar: role === 'Doctor'
          ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        email: `${username}@carenova.health`
      });
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setIsLocked(true);
        setErrorMsg('Security Lockout: 5 consecutive failed attempts. Locked for 15 minutes per FR-1.3.');
      } else {
        setErrorMsg(`Invalid credentials. Attempt ${attempts} of 5 before 15-min lockout.`);
      }
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setIsResetMode(false);
      setResetSuccess(false);
      setErrorMsg('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6 text-xs animate-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <CareNovaLogo size={52} />
          </div>
          <h2 className="text-xl font-black text-slate-800">CareNova Hospital HMS</h2>
          <p className="text-slate-500 text-[11px]">Secure Role-Based Authentication Gateway (SRS Section 3.1)</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Username / ID *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password *</label>
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-blue-600 hover:underline text-[11px]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Default demo password: <code>password123</code></span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Access Role (RBAC) *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.id} value={r.role}>
                    {r.name} - {r.desc}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all text-xs"
            >
              Sign In to Hospital Portal
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="text-slate-600">
              Enter your registered hospital email to receive a password reset token per FR-1.4.
            </div>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold">
                Reset instructions dispatched! Redirecting...
              </div>
            ) : (
              <>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@carenova.health"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="w-1/2 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md"
                  >
                    Send Reset Link
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
