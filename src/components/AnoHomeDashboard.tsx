import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Bell, 
  Crosshair, 
  BookOpen, 
  Award, 
  ArrowRight,
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { CadetProfile, Announcement, AttendanceRecord } from '../types';
import type { NavTab } from './DashboardLayout';

interface AnoHomeProps {
  onNavigate: (tab: NavTab) => void;
}

export const AnoHomeDashboard: React.FC<AnoHomeProps> = ({ onNavigate }) => {
  const [cadets, setCadets] = useState<CadetProfile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        // 1. Cadets
        const cSnap = await getDocs(collection(db, 'cadets'));
        const cadetList = cSnap.docs.map(d => ({ ...d.data() as CadetProfile, id: d.id }));
        setCadets(cadetList);

        // 2. Announcements
        const aSnap = await getDocs(query(collection(db, 'announcements'), orderBy('date', 'desc'), limit(3)));
        setAnnouncements(aSnap.docs.map(d => ({ ...d.data() as Announcement, id: d.id })));

        // 3. Attendance
        const attSnap = await getDocs(query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(3)));
        setRecentAttendance(attSnap.docs.map(d => ({ ...d.data() as AttendanceRecord, id: d.id })));
      } catch (err) {
        console.error('Error fetching ANO overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const totalCadets = cadets.length;
  const activeCadets = cadets.filter(c => c.status === 'Active').length;
  const seniors = cadets.filter(c => c.role === 'Senior' || c.rank.includes('Under Officer')).length;

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* ANO Hero Banner */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs font-mono uppercase text-[#f97316] font-bold tracking-wider">
                COMPANY HEADQUARTERS
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#e6edf3] tracking-wide mb-1">
              Associate NCC Officer Command Overview
            </h1>
            <p className="text-xs text-[#8b949e] max-w-xl">
              1 KAR BN NCC • Company Muster Roll, Training Cadres, and Certificate Eligibility Management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('nominal-roll')}
              className="py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg"
            >
              <Users className="w-4 h-4 fill-black" />
              <span>MANAGE NOMINAL ROLL</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="py-2.5 px-4 bg-[#141b21] hover:bg-[#1f2830] text-[#e6edf3] border border-[#273842] font-semibold text-xs font-mono rounded-lg transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-[#10b981]" />
              <span>MARK ATTENDANCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Total Enrolled Cadets</div>
            <div className="text-3xl font-extrabold text-[#e6edf3] font-mono">{totalCadets}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>Active: {activeCadets}</span>
            <button onClick={() => onNavigate('nominal-roll')} className="text-[#f97316] hover:underline flex items-center gap-1">
              View Roll <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Senior Ranks & Cadre</div>
            <div className="text-3xl font-extrabold text-[#f97316] font-mono">{seniors}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>JUO / SUO / SGT</span>
            <span className="text-[#10b981]">Appointed</span>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Total Muster Sessions</div>
            <div className="text-3xl font-extrabold text-[#10b981] font-mono">{recentAttendance.length}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>Parades logged</span>
            <button onClick={() => onNavigate('attendance')} className="text-[#10b981] hover:underline flex items-center gap-1">
              Muster <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Training Modules Active</div>
            <div className="text-3xl font-extrabold text-[#c084fc] font-mono">5</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-xs font-mono text-[#8b949e]">
            <span>Weapon / Cert / Camps / SSB</span>
            <span className="text-[#e6edf3]">Online</span>
          </div>
        </div>
      </div>

      {/* Main Command Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Nominal Roll Snapshot */}
        <div className="lg:col-span-2 bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            <span>RECENTLY ENROLLED CADETS</span>
            <button onClick={() => onNavigate('nominal-roll')} className="text-[#f97316] hover:underline flex items-center gap-1">
              Full Nominal Roll →
            </button>
          </div>

          {cadets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8b949e] font-mono">
              No cadets enrolled in the Nominal Roll yet.
              <br />
              <button
                onClick={() => onNavigate('nominal-roll')}
                className="mt-2 text-[#f97316] underline"
              >
                Enroll cadets now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#192229] text-[#8b949e]">
                    <th className="py-2.5 px-3 font-normal">CADET</th>
                    <th className="py-2.5 px-3 font-normal">REGIMENTAL NO</th>
                    <th className="py-2.5 px-3 font-normal">RANK</th>
                    <th className="py-2.5 px-3 font-normal text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#192229]/60">
                  {cadets.slice(0, 5).map(c => (
                    <tr key={c.id} className="hover:bg-[#090d10]">
                      <td className="py-2.5 px-3 font-semibold text-[#e6edf3]">{c.fullName}</td>
                      <td className="py-2.5 px-3 text-[#8b949e]">{c.regimentalNumber}</td>
                      <td className="py-2.5 px-3 text-[#f97316]">{c.rank}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          c.status === 'Active' ? 'bg-[#10241b] text-[#10b981]' : 'bg-[#221515] text-[#ef4444]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
              <span>RECENT ANNOUNCEMENTS</span>
              <button onClick={() => onNavigate('announcements')} className="text-[#f97316] hover:underline">
                New Notice +
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8b949e] font-mono">
                No announcements published yet.
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="p-3 bg-[#090d10] border border-[#192229] rounded-lg text-xs font-mono">
                    <div className="flex items-center justify-between text-[10px] text-[#8b949e] mb-1">
                      <span className="text-[#f97316] font-bold uppercase">{a.priority}</span>
                      <span>{a.date}</span>
                    </div>
                    <div className="font-semibold text-[#e6edf3] line-clamp-1">{a.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#192229] text-[11px] font-mono text-[#8b949e]">
            Announcements are immediately visible on all cadet devices.
          </div>
        </div>
      </div>

      {/* Quick Launch Direct Links to Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('weapon-training')}
          className="p-4 bg-[#0c1013] hover:bg-[#121920] border border-[#192229] hover:border-[#f97316]/50 rounded-xl text-left transition-all group"
        >
          <Crosshair className="w-5 h-5 text-[#f97316] mb-2" />
          <div className="text-xs font-bold text-[#e6edf3] group-hover:text-[#f97316]">Weapon Training Module</div>
          <div className="text-[10px] text-[#8b949e] mt-1">INSAS 5.56mm & 7.62mm SLR technical breakdown & safety drills.</div>
        </button>

        <button
          onClick={() => onNavigate('exam-simulator')}
          className="p-4 bg-[#0c1013] hover:bg-[#121920] border border-[#192229] hover:border-[#f97316]/50 rounded-xl text-left transition-all group"
        >
          <BookOpen className="w-5 h-5 text-[#10b981] mb-2" />
          <div className="text-xs font-bold text-[#e6edf3] group-hover:text-[#10b981]">B & C Exam Simulator</div>
          <div className="text-[10px] text-[#8b949e] mt-1">Timed Directorate mock examinations and weak spot analytics.</div>
        </button>

        <button
          onClick={() => onNavigate('selective-camps')}
          className="p-4 bg-[#0c1013] hover:bg-[#121920] border border-[#192229] hover:border-[#f97316]/50 rounded-xl text-left transition-all group"
        >
          <Award className="w-5 h-5 text-[#c084fc] mb-2" />
          <div className="text-xs font-bold text-[#e6edf3] group-hover:text-[#c084fc]">Camp Training Cell</div>
          <div className="text-[10px] text-[#8b949e] mt-1">TSC, RDC, IDSSC syllabus, drills and zero-cost video guides.</div>
        </button>

        <button
          onClick={() => onNavigate('ssb-prep')}
          className="p-4 bg-[#0c1013] hover:bg-[#121920] border border-[#192229] hover:border-[#f97316]/50 rounded-xl text-left transition-all group"
        >
          <Shield className="w-5 h-5 text-[#38bdf8] mb-2" />
          <div className="text-xs font-bold text-[#e6edf3] group-hover:text-[#38bdf8]">SSB Officer Preparation</div>
          <div className="text-[10px] text-[#8b949e] mt-1">Stage I OIR / PPDT and Stage II Psych / GTO interview drills.</div>
        </button>
      </div>
    </div>
  );
};
