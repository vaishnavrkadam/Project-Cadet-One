import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  BookOpen, 
  Award, 
  Compass, 
  CalendarCheck, 
  Bell, 
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { Announcement, AttendanceRecord } from '../types';
import type { NavTab } from './DashboardLayout';

interface CadetHomeProps {
  onNavigate: (tab: NavTab) => void;
}

export const CadetHomeDashboard: React.FC<CadetHomeProps> = ({ onNavigate }) => {
  const { cadetProfile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCadetDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Latest Company Announcements
        const aQuery = query(collection(db, 'announcements'), orderBy('date', 'desc'), limit(3));
        const aSnap = await getDocs(aQuery);
        setAnnouncements(aSnap.docs.map(d => ({ ...d.data() as Announcement, id: d.id })));

        // 2. Fetch Attendance and calculate percentage
        const attQuery = query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(20));
        const attSnap = await getDocs(attQuery);
        const attRecords: AttendanceRecord[] = attSnap.docs.map(d => ({ ...d.data() as AttendanceRecord, id: d.id }));

        if (cadetProfile && attRecords.length > 0) {
          const presentCount = attRecords.filter(r => r.presentCadetIds.includes(cadetProfile.id)).length;
          setAttendancePercentage(Math.round((presentCount / attRecords.length) * 100));
        }
      } catch (err) {
        console.error('Error fetching cadet dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCadetDashboardData();
  }, [cadetProfile]);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Cadet Welcome Banner */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs font-mono uppercase text-[#f97316] font-bold tracking-wider">
                ACTIVE CADET STATUS • {cadetProfile?.regimentalNumber || 'CADET ENROLLED'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#e6edf3] tracking-wide mb-1">
              Welcome, {cadetProfile?.rank || 'Cadet'} {cadetProfile?.fullName || ''}
            </h1>
            <p className="text-xs text-[#8b949e]">
              {cadetProfile?.institution || 'Institution'} • {cadetProfile?.unit || '1 KAR BN NCC'} • Batch {cadetProfile?.yearBatch || '2024-2027'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('exam-simulator')}
              className="py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4 fill-black" />
              <span>START CERTIFICATE MOCK</span>
            </button>
            <button
              onClick={() => onNavigate('weapon-training')}
              className="py-2.5 px-4 bg-[#141b21] hover:bg-[#1f2830] text-[#e6edf3] border border-[#273842] font-semibold text-xs font-mono rounded-lg transition-all flex items-center gap-2"
            >
              <Crosshair className="w-4 h-4 text-[#f97316]" />
              <span>RIFLE DRILL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cadet Journey Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Parade Attendance</div>
            <div className={`text-3xl font-extrabold font-mono ${attendancePercentage >= 75 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {attendancePercentage}%
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>{attendancePercentage >= 75 ? 'Exam Eligible' : 'Short Attendance'}</span>
            <button onClick={() => onNavigate('attendance')} className="text-[#f97316] hover:underline flex items-center gap-1">
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Weapon Training Drills</div>
            <div className="text-3xl font-extrabold text-[#e6edf3] font-mono">68%</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>INSAS / SLR Handling</span>
            <button onClick={() => onNavigate('weapon-training')} className="text-[#f97316] hover:underline flex items-center gap-1">
              Train <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Exam Mock Average</div>
            <div className="text-3xl font-extrabold text-[#10b981] font-mono">72%</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>B & C Certificate Theory</span>
            <button onClick={() => onNavigate('exam-simulator')} className="text-[#10b981] hover:underline flex items-center gap-1">
              Practice <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Officer Selection (SSB)</div>
            <div className="text-3xl font-extrabold text-[#c084fc] font-mono">Stage I</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>OIR / PPDT Ready</span>
            <button onClick={() => onNavigate('ssb-prep')} className="text-[#c084fc] hover:underline flex items-center gap-1">
              Cadre <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Announcements & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Announcements for Cadet */}
        <div className="lg:col-span-2 bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#f97316]" />
              <span>COMPANY ANNOUNCEMENTS & ORDERS</span>
            </span>
            <button onClick={() => onNavigate('announcements')} className="text-[#f97316] hover:underline">
              All Orders →
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8b949e] font-mono">
              No new announcements published.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-3.5 bg-[#090d10] border border-[#192229] rounded-lg">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8b949e] mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#1a120e] text-[#f97316] font-bold border border-[#f97316]/20">
                      {a.priority}
                    </span>
                    <span>{a.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">{a.title}</h4>
                  <p className="text-xs text-[#8b949e] line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camp Training Quick Tile */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
              <Award className="w-4 h-4 text-[#c084fc]" />
              <span>SELECTIVE CAMP CADRES</span>
            </div>

            <p className="text-xs text-[#8b949e] mb-4 leading-relaxed">
              Access the official syllabus, drill tutorials, and preparation checklist for Thal Sainik Camp (TSC) and Republic Day Camp (RDC).
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-[#090d10] rounded border border-[#192229]">
                <span className="text-[#e6edf3]">TSC Cadre</span>
                <span className="text-[#10b981]">Active</span>
              </div>
              <div className="flex justify-between p-2 bg-[#090d10] rounded border border-[#192229]">
                <span className="text-[#e6edf3]">RDC Cultural & Contingent</span>
                <span className="text-[#10b981]">Active</span>
              </div>
              <div className="flex justify-between p-2 bg-[#090d10] rounded border border-[#192229]">
                <span className="text-[#e6edf3]">IDSSC Shooting Cadre</span>
                <span className="text-[#10b981]">Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('selective-camps')}
            className="w-full mt-4 py-2.5 px-3 bg-[#141b21] hover:bg-[#1f2830] text-[#c084fc] border border-[#c084fc]/30 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2"
          >
            <span>Explore Camp Resources</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
