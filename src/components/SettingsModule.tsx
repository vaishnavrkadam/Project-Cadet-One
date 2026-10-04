import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Shield, User, Database, Info, LogOut } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentUser, role, cadetProfile, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 border-b border-[#192229] pb-3">
        <Settings className="w-5 h-5 text-[#f97316]" />
        <h2 className="text-xl font-bold text-[#e6edf3]">
          System Settings & Credentials
        </h2>
      </div>

      {/* Account Info */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-mono uppercase text-[#8b949e] font-bold flex items-center gap-2">
          <User className="w-4 h-4 text-[#f97316]" /> Authenticated Account Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
            <div className="text-[#8b949e] mb-1">GOOGLE EMAIL</div>
            <div className="text-[#e6edf3] font-bold">{currentUser?.email}</div>
          </div>

          <div className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
            <div className="text-[#8b949e] mb-1">SYSTEM ROLE</div>
            <div className="text-[#f97316] font-bold">{role}</div>
          </div>

          {cadetProfile && (
            <>
              <div className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
                <div className="text-[#8b949e] mb-1">CADET RANK</div>
                <div className="text-[#e6edf3] font-bold">{cadetProfile.rank}</div>
              </div>

              <div className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
                <div className="text-[#8b949e] mb-1">REGIMENTAL NUMBER</div>
                <div className="text-[#e6edf3] font-bold">{cadetProfile.regimentalNumber}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* System Architecture & Firebase Status */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-mono uppercase text-[#8b949e] font-bold flex items-center gap-2">
          <Database className="w-4 h-4 text-[#10b981]" /> Firebase Free-Tier Deployment Status
        </h3>

        <div className="space-y-2 text-xs font-mono text-[#8b949e]">
          <div className="flex justify-between p-2.5 bg-[#090d10] border border-[#192229] rounded">
            <span>Authentication:</span>
            <span className="text-[#10b981]">Google Identity Provider (Active)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-[#090d10] border border-[#192229] rounded">
            <span>Cloud Database:</span>
            <span className="text-[#10b981]">Google Cloud Firestore (IndexedDb Cached)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-[#090d10] border border-[#192229] rounded">
            <span>Storage Cost Strategy:</span>
            <span className="text-[#10b981]">Embedded YouTube & Google Drive (Zero Bandwidth Cost)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-[#090d10] border border-[#192229] rounded">
            <span>Design System:</span>
            <span className="text-[#e6edf3]">Official NCC Training Systems Reference</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="py-2.5 px-6 bg-[#221515] hover:bg-[#331c1c] text-[#ef4444] border border-[#ef4444]/30 rounded-lg text-xs font-mono font-bold flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT CURRENT SESSION</span>
        </button>
      </div>
    </div>
  );
};
