import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, LogOut, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loading, error, currentUser, role, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    try {
      setSubmitting(true);
      await loginWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  // If user is authenticated with Google but not recognized as ANO or active Cadet
  if (currentUser && role === 'Unauthorized' && !loading) {
    return (
      <div className="min-h-screen bg-[#06090c] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c1013] border border-[#192229] rounded-xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#1a1311] border border-[#ef4444]/30 rounded-full flex items-center justify-center mx-auto mb-5 text-[#ef4444]">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-[#e6edf3] mb-2 tracking-wide">
            Access Not Yet Granted
          </h2>

          <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
            Signed in as <span className="text-[#f97316] font-medium">{currentUser.email}</span>.
            <br />
            This Google account has not yet been registered into the Nominal Roll by the Associate NCC Officer (ANO).
          </p>

          <div className="bg-[#090d10] border border-[#192229] rounded-lg p-4 text-xs text-[#8b949e] text-left mb-6 space-y-2">
            <div className="font-semibold text-[#c9d1d9] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#f97316]" /> Next Steps:
            </div>
            <p>1. Contact your NCC Company ANO or Troop Commander.</p>
            <p>2. Request your official Google email be added to the company Nominal Roll.</p>
            <p>3. Once registered, log in again to access the cadet training platform.</p>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 px-4 bg-[#141b21] hover:bg-[#1c272f] text-[#c9d1d9] border border-[#273842] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign In with Different Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090c] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Brand Header */}
      <div className="flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img 
            src="/NCC Logo.png" 
            alt="NCC Crest" 
            className="w-10 h-10 object-contain drop-shadow" 
            onError={(e) => {
              // fallback if logo fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="text-[#e6edf3] font-bold text-base tracking-widest uppercase">
              National Cadet Corps
            </div>
            <div className="text-[#8b949e] text-xs font-mono uppercase tracking-wider">
              Management & Training Platform
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-[#8b949e] border border-[#192229] px-3 py-1.5 rounded bg-[#090d10]">
          UNITY AND DISCIPLINE
        </div>
      </div>

      {/* Main Login Card */}
      <div className="z-10 w-full max-w-md mx-auto my-auto">
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-8 shadow-2xl relative">
          {/* Subtle Orange accent bar */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent opacity-80" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#12181d] border border-[#273842] rounded-lg flex items-center justify-center mx-auto mb-4 text-[#f97316]">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#e6edf3] tracking-wide mb-2">
              Cadet & ANO Access
            </h1>
            <p className="text-sm text-[#8b949e]">
              Sign in with your verified Google account to access your unit resources, nominal roll, and training simulators.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-[#1f1315] border border-[#ef4444]/40 rounded-lg flex items-start gap-3 text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              disabled={loading || submitting}
              className="w-full py-3 px-4 bg-[#141b21] hover:bg-[#1a232b] active:bg-[#11171d] text-[#e6edf3] border border-[#273842] hover:border-[#f97316]/50 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{submitting || loading ? 'Verifying Credentials...' : 'Sign in with Google'}</span>
              <ChevronRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#f97316] transition-colors ml-auto" />
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#484f58]">
                Designated ANO Account: <code className="text-[#8b949e]">vaishnavkadam57@gmail.com</code>
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#192229]/80 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Real Firestore Nominal Roll & Attendance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>INSAS 5.56mm & 7.62mm Rifle Training</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>B & C Certificate Theory Exam Simulator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Motto */}
      <div className="text-center z-10 py-2">
        <p className="text-xs text-[#484f58] italic font-serif">
          “Discipline today, safety tomorrow.” — NCC
        </p>
      </div>
    </div>
  );
};
