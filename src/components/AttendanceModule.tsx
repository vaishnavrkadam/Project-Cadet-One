import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  Check, 
  X, 
  Save, 
  Clock, 
  AlertCircle,
  FileCheck,
  Users
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { CadetProfile, AttendanceRecord } from '../types';

export const AttendanceModule: React.FC = () => {
  const { role, cadetProfile, currentUser } = useAuth();
  const [cadets, setCadets] = useState<CadetProfile[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState<string>('Parade & Drill');
  const [presentCadetIds, setPresentCadetIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);

  // Cadet Attendance Summary state
  const [cadetStats, setCadetStats] = useState<{ total: number; present: number; percentage: number }>({
    total: 0,
    present: 0,
    percentage: 100
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. If ANO, fetch active cadets
        if (role === 'ANO') {
          const snap = await getDocs(collection(db, 'cadets'));
          const list: CadetProfile[] = snap.docs
            .map(d => ({ ...d.data() as CadetProfile, id: d.id }))
            .filter(c => c.status === 'Active');
          setCadets(list);
        }

        // 2. Fetch past attendance records
        const attQuery = query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(15));
        const attSnap = await getDocs(attQuery);
        const records: AttendanceRecord[] = attSnap.docs.map(d => ({
          ...d.data() as AttendanceRecord,
          id: d.id
        }));
        setRecentRecords(records);

        // 3. If viewing as Cadet, compute cadet attendance percentage
        if (role !== 'ANO' && cadetProfile) {
          const totalSessions = records.length;
          const attended = records.filter(r => r.presentCadetIds.includes(cadetProfile.id)).length;
          setCadetStats({
            total: totalSessions,
            present: attended,
            percentage: totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 100
          });
        }
      } catch (err) {
        console.error('Failed to load attendance data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [role, cadetProfile]);

  // Load specific day's record when date or session changes
  useEffect(() => {
    if (role !== 'ANO') return;

    const loadDayRecord = async () => {
      const docId = `${selectedDate}_${sessionType.replace(/\s+/g, '_')}`;
      try {
        const docSnap = await getDoc(doc(db, 'attendance', docId));
        if (docSnap.exists()) {
          const data = docSnap.data() as AttendanceRecord;
          setPresentCadetIds(new Set(data.presentCadetIds));
          setNotes(data.notes || '');
        } else {
          // Default: mark all active present initially or empty
          setPresentCadetIds(new Set());
          setNotes('');
        }
      } catch (err) {
        console.error('Error fetching day attendance:', err);
      }
    };

    loadDayRecord();
  }, [selectedDate, sessionType, role]);

  const toggleCadetAttendance = (cadetId: string) => {
    setPresentCadetIds(prev => {
      const next = new Set(prev);
      if (next.has(cadetId)) {
        next.delete(cadetId);
      } else {
        next.add(cadetId);
      }
      return next;
    });
  };

  const markAll = (status: 'present' | 'absent') => {
    if (status === 'present') {
      setPresentCadetIds(new Set(cadets.map(c => c.id)));
    } else {
      setPresentCadetIds(new Set());
    }
  };

  const handleSaveAttendance = async () => {
    const docId = `${selectedDate}_${sessionType.replace(/\s+/g, '_')}`;
    try {
      setSaving(true);
      const record: AttendanceRecord = {
        id: docId,
        date: selectedDate,
        sessionType,
        notes: notes.trim(),
        presentCadetIds: Array.from(presentCadetIds),
        totalCadets: cadets.length,
        markedBy: currentUser?.displayName || 'ANO',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'attendance', docId), record);
      setRecentRecords(prev => {
        const filtered = prev.filter(r => r.id !== docId);
        return [record, ...filtered];
      });
      alert('Attendance saved successfully.');
    } catch (err) {
      console.error('Failed to save attendance:', err);
      alert('Could not save attendance to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  // CADET VIEW: Clean attendance statistics
  if (role !== 'ANO') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 border-b border-[#192229] pb-3">
          <CalendarCheck className="w-5 h-5 text-[#f97316]" />
          <h2 className="text-xl font-bold text-[#e6edf3]">
            Personal Attendance Record
          </h2>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Total Training Sessions</div>
            <div className="text-3xl font-extrabold text-[#e6edf3] font-mono">{cadetStats.total}</div>
          </div>
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Sessions Present</div>
            <div className="text-3xl font-extrabold text-[#10b981] font-mono">{cadetStats.present}</div>
          </div>
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1">Attendance Percentage</div>
            <div className={`text-3xl font-extrabold font-mono ${cadetStats.percentage >= 75 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {cadetStats.percentage}%
            </div>
            <div className="text-[10px] text-[#8b949e] mt-1">75% required for Certificate Exam eligibility</div>
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase text-[#8b949e] mb-4">
            Recent Session Muster History
          </div>

          {recentRecords.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#8b949e] font-mono">
              No official attendance sessions logged yet by ANO.
            </div>
          ) : (
            <div className="space-y-2">
              {recentRecords.map(rec => {
                const isPresent = cadetProfile ? rec.presentCadetIds.includes(cadetProfile.id) : false;
                return (
                  <div key={rec.id} className="flex items-center justify-between p-3 bg-[#090d10] border border-[#192229] rounded-lg text-xs font-mono">
                    <div>
                      <div className="text-[#e6edf3] font-semibold">{rec.sessionType}</div>
                      <div className="text-[10px] text-[#484f58]">{rec.date} • Marked by {rec.markedBy}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      isPresent ? 'bg-[#10241b] text-[#10b981]' : 'bg-[#221515] text-[#ef4444]'
                    }`}>
                      {isPresent ? 'PRESENT' : 'ABSENT'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ANO VIEW: Full Attendance Marking System
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#192229] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-xl font-bold text-[#e6edf3] tracking-wide">
              Muster & Attendance Marking
            </h2>
          </div>
          <p className="text-xs text-[#8b949e]">
            Select date, session type and take muster roll. Changes are immediately recorded in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={saving || cadets.length === 0}
          className="py-2.5 px-5 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4 fill-black" />
          <span>{saving ? 'SAVING...' : 'SAVE ATTENDANCE'}</span>
        </button>
      </div>

      {/* Date & Session Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0c1013] border border-[#192229] rounded-xl p-4">
        <div>
          <label className="block text-[11px] font-mono text-[#8b949e] uppercase mb-1">SESSION DATE</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2 text-xs text-[#e6edf3] font-mono outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8b949e] uppercase mb-1">TRAINING / SESSION TYPE</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2 text-xs text-[#e6edf3] font-mono outline-none"
          >
            <option value="Parade & Drill">Parade & Drill</option>
            <option value="Weapon Training (INSAS/SLR)">Weapon Training (INSAS/SLR)</option>
            <option value="Theory Lecture (B/C Cert)">Theory Lecture (B/C Cert)</option>
            <option value="Physical Training & Obstacle">Physical Training & Obstacle</option>
            <option value="Camp Selection Cadre">Camp Selection Cadre</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8b949e] uppercase mb-1">NOTES / INSTRUCTOR</label>
          <input
            type="text"
            placeholder="e.g. Conducted by PI Staff"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2 text-xs text-[#e6edf3] font-mono outline-none"
          />
        </div>
      </div>

      {/* Quick Count & Batch Toggle Bar */}
      <div className="flex items-center justify-between bg-[#0c1013] border border-[#192229] rounded-xl px-5 py-3 text-xs font-mono">
        <div className="flex items-center gap-6">
          <span className="text-[#8b949e]">Total Active Cadets: <strong className="text-[#e6edf3]">{cadets.length}</strong></span>
          <span className="text-[#10b981]">Marked Present: <strong className="text-white">{presentCadetIds.size}</strong></span>
          <span className="text-[#ef4444]">Marked Absent: <strong className="text-white">{cadets.length - presentCadetIds.size}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('present')}
            className="px-3 py-1 bg-[#10241b] hover:bg-[#153426] text-[#10b981] border border-[#10b981]/30 rounded text-[11px]"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('absent')}
            className="px-3 py-1 bg-[#221515] hover:bg-[#331c1c] text-[#ef4444] border border-[#ef4444]/30 rounded text-[11px]"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Cadets Muster List */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#8b949e]">
            Loading nominal roll...
          </div>
        ) : cadets.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-[#484f58] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">Nominal Roll has no active cadets.</h4>
            <p className="text-xs text-[#8b949e]">
              Enroll cadets first in the Nominal Roll tab to take attendance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#192229] text-[#8b949e] bg-[#090d10]">
                  <th className="py-3 px-4 font-normal">CADET</th>
                  <th className="py-3 px-4 font-normal">RANK</th>
                  <th className="py-3 px-4 font-normal">REGIMENTAL NO.</th>
                  <th className="py-3 px-4 font-normal text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192229]/60">
                {cadets.map((cadet) => {
                  const isPresent = presentCadetIds.has(cadet.id);
                  return (
                    <tr 
                      key={cadet.id} 
                      onClick={() => toggleCadetAttendance(cadet.id)}
                      className={`cursor-pointer transition-colors ${
                        isPresent ? 'bg-[#0b1410]/50 hover:bg-[#0e1a14]' : 'hover:bg-[#090d10]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#e6edf3] text-sm">
                          {cadet.fullName}
                        </div>
                        <div className="text-[10px] text-[#8b949e]">
                          {cadet.email}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#f97316]">
                        {cadet.rank}
                      </td>

                      <td className="py-3 px-4 text-[#8b949e]">
                        {cadet.regimentalNumber}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCadetAttendance(cadet.id);
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                            isPresent 
                              ? 'bg-[#10b981] text-black shadow-md' 
                              : 'bg-[#192229] text-[#8b949e] hover:bg-[#273842]'
                          }`}
                        >
                          {isPresent ? 'PRESENT' : 'ABSENT'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
