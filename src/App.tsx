import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout, type NavTab } from './components/DashboardLayout';
import { AnoHomeDashboard } from './components/AnoHomeDashboard';
import { CadetHomeDashboard } from './components/CadetHomeDashboard';
import { NominalRollModule } from './components/NominalRollModule';
import { AttendanceModule } from './components/AttendanceModule';
import { AnnouncementsModule } from './components/AnnouncementsModule';
import { WeaponTrainingModule } from './components/WeaponTrainingModule';
import { ExamSimulatorModule } from './components/ExamSimulatorModule';
import { SelectiveCampsModule } from './components/SelectiveCampsModule';
import { SSBPrepModule } from './components/SSBPrepModule';
import { SettingsModule } from './components/SettingsModule';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser, role, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#0c1013] border border-[#273842] rounded-xl flex items-center justify-center text-[#f97316] animate-pulse">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8b949e]">
            Verifying NCC Credentials...
          </div>
        </div>
      </div>
    );
  }

  // Not signed in or Unauthorized role
  if (!currentUser || role === 'Unauthorized') {
    return <LoginPage />;
  }

  // Render Module based on Current Tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return role === 'ANO' ? (
          <AnoHomeDashboard onNavigate={(t) => setCurrentTab(t)} />
        ) : (
          <CadetHomeDashboard onNavigate={(t) => setCurrentTab(t)} />
        );

      case 'nominal-roll':
        return <NominalRollModule />;

      case 'attendance':
        return <AttendanceModule />;

      case 'announcements':
        return <AnnouncementsModule />;

      case 'resources':
      case 'selective-camps':
        return <SelectiveCampsModule />;

      case 'weapon-training':
        return <WeaponTrainingModule />;

      case 'exam-simulator':
      case 'question-bank':
      case 'past-papers':
      case 'performance':
      case 'weak-spots':
        return <ExamSimulatorModule />;

      case 'ssb-prep':
        return <SSBPrepModule />;

      case 'settings':
        return <SettingsModule />;

      default:
        return role === 'ANO' ? (
          <AnoHomeDashboard onNavigate={(t) => setCurrentTab(t)} />
        ) : (
          <CadetHomeDashboard onNavigate={(t) => setCurrentTab(t)} />
        );
    }
  };

  const getHeaderTitle = () => {
    if (currentTab === 'weapon-training') return 'NCC CADET TRAINING SYSTEM';
    if (currentTab === 'exam-simulator') return 'NCC EXAM SIMULATOR';
    if (currentTab === 'selective-camps' || currentTab === 'resources') return 'NCC TRAINING PORTAL';
    return role === 'ANO' ? 'NCC ANO COMMAND PLATFORM' : 'NCC CADET TRAINING SYSTEM';
  };

  const getHeaderSubtitle = () => {
    if (currentTab === 'weapon-training') return 'WEAPON TRAINING';
    if (currentTab === 'exam-simulator') return 'B & C CERTIFICATE THEORY PREPARATION';
    if (currentTab === 'selective-camps' || currentTab === 'resources') return 'SELECTIVE CAMP RESOURCES';
    return role === 'ANO' ? 'COMPANY MUSTER & TRAINING ARCHITECTURE' : 'CADET MANAGEMENT & PREPARATION PORTAL';
  };

  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      headerTitle={getHeaderTitle()}
      headerSubtitle={getHeaderSubtitle()}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default App;
