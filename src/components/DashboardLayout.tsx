import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  Crosshair, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Award, 
  BarChart3, 
  Target, 
  Settings, 
  Users, 
  CalendarCheck, 
  Bell, 
  FolderPlus,
  Compass,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

export type NavTab = 
  | 'home'
  | 'weapon-training'
  | 'exam-simulator'
  | 'question-bank'
  | 'past-papers'
  | 'selective-camps'
  | 'ssb-prep'
  | 'performance'
  | 'weak-spots'
  | 'nominal-roll'
  | 'attendance'
  | 'announcements'
  | 'resources'
  | 'settings';

interface LayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const DashboardLayout: React.FC<LayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
  headerTitle = 'NCC CADET TRAINING SYSTEM',
  headerSubtitle = 'CADET MANAGEMENT & PREPARATION PORTAL'
}) => {
  const { currentUser, role, cadetProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Navigation Items
  const cadetNavItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'weapon-training' as NavTab, label: 'Weapon Training', icon: Crosshair },
    { id: 'exam-simulator' as NavTab, label: 'Exam Simulator', icon: BookOpen },
    { id: 'question-bank' as NavTab, label: 'Question Bank', icon: HelpCircle },
    { id: 'past-papers' as NavTab, label: 'Past Year Papers', icon: FileText },
    { id: 'selective-camps' as NavTab, label: 'Selective Camps', icon: Award },
    { id: 'ssb-prep' as NavTab, label: 'SSB Preparation', icon: Compass },
    { id: 'performance' as NavTab, label: 'Performance', icon: BarChart3 },
    { id: 'weak-spots' as NavTab, label: 'Weak Spots', icon: Target },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const anoNavItems = [
    { id: 'home' as NavTab, label: 'ANO Command', icon: Home },
    { id: 'nominal-roll' as NavTab, label: 'Nominal Roll', icon: Users },
    { id: 'attendance' as NavTab, label: 'Attendance', icon: CalendarCheck },
    { id: 'announcements' as NavTab, label: 'Announcements', icon: Bell },
    { id: 'resources' as NavTab, label: 'Resource Mgmt', icon: FolderPlus },
    { id: 'weapon-training' as NavTab, label: 'Weapon Module', icon: Crosshair },
    { id: 'exam-simulator' as NavTab, label: 'B & C Exam Hub', icon: BookOpen },
    { id: 'selective-camps' as NavTab, label: 'Camp Training', icon: Award },
    { id: 'ssb-prep' as NavTab, label: 'SSB Center', icon: Compass },
    { id: 'settings' as NavTab, label: 'System Settings', icon: Settings },
  ];

  const navItems = role === 'ANO' ? anoNavItems : cadetNavItems;

  const displayName = role === 'ANO'
    ? (currentUser?.displayName || 'Lt. Vaishnav Kadam (ANO)')
    : (cadetProfile ? `${cadetProfile.rank} ${cadetProfile.fullName}` : currentUser?.displayName || 'Cadet');

  const unitTag = role === 'ANO'
    ? 'ANO | 1 KAR BN NCC'
    : (cadetProfile ? `${cadetProfile.institution || 'NCC'} | ${cadetProfile.unit || '1 KAR BN'}` : 'NCC CADET');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'CD';

  return (
    <div className="min-h-screen bg-[#06090c] text-[#c9d1d9] flex flex-col font-sans selection:bg-[#f97316]/30">
      {/* Top Header bar matching exact Reference Design layout */}
      <header className="h-16 border-b border-[#192229] bg-[#080c0f] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <img 
            src="/NCC Logo.png" 
            alt="NCC Logo" 
            className="w-9 h-9 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }} 
          />
          <div>
            <div className="text-sm font-bold tracking-widest text-[#e6edf3] uppercase">
              {headerTitle}
            </div>
            <div className="text-[10px] tracking-wider text-[#8b949e] uppercase font-mono">
              {headerSubtitle}
            </div>
          </div>
        </div>

        {/* User profile capsule */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#0d1317] border border-[#1c272f] rounded-lg px-3 py-1.5 shadow-sm">
            <div className="w-8 h-8 rounded bg-[#162129] border border-[#273842] flex items-center justify-center text-xs font-bold text-[#e6edf3] relative">
              {initials}
              <span className="w-2 h-2 rounded-full bg-[#10b981] absolute -bottom-0.5 -right-0.5 ring-2 ring-[#0c1013]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#e6edf3] leading-tight">
                {displayName}
              </div>
              <div className="text-[10px] text-[#8b949e] font-mono leading-tight">
                {unitTag}
              </div>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded bg-[#0d1317] hover:bg-[#1a232b] border border-[#1c272f] text-[#8b949e] hover:text-[#f97316] transition-colors flex items-center justify-center cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fbbf24]" /> : <Moon className="w-4 h-4 text-[#6366f1]" />}
          </button>

          <button
            onClick={logout}
            title="Sign out"
            className="w-8 h-8 rounded bg-[#0d1317] hover:bg-[#1a232b] border border-[#1c272f] text-[#8b949e] hover:text-[#f87171] transition-colors flex items-center justify-center cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 border-r border-[#192229] bg-[#070a0d] flex flex-col justify-between p-4 shrink-0">
          <nav className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#484f58] tracking-wider px-3 py-2">
              {role === 'ANO' ? 'COMMAND & CONTROL' : 'CADET PORTAL'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#121920] text-[#e6edf3] border-l-2 border-[#f97316] font-semibold pl-3 shadow-inner'
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0c1116]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f97316]' : 'text-[#8b949e]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Left Bottom Quote Banner */}
          <div className="border border-[#192229] bg-[#0a0e12] rounded-lg p-3.5 text-center mt-6">
            <p className="text-[11px] text-[#8b949e] italic font-serif leading-snug">
              “Discipline today, safety tomorrow.”
            </p>
            <div className="text-[10px] text-[#484f58] font-mono mt-1 font-semibold">
              — NCC
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 bg-[#06090c] p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
