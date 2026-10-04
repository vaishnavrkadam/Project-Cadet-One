import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Plus, 
  X, 
  CheckCircle,
  Megaphone
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { Announcement } from '../types';

export const AnnouncementsModule: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Create Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Important');
  const [targetAudience, setTargetAudience] = useState<'All' | '1st Year' | '2nd Year' | '3rd Year' | 'Camp Selects'>('All');
  const [publishing, setPublishing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'announcements'),
        orderBy('date', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      const list: Announcement[] = snap.docs.map(d => ({
        ...d.data() as Announcement,
        id: d.id
      }));
      setAnnouncements(list);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setPublishing(true);
      const newNotice: Omit<Announcement, 'id'> = {
        title: title.trim(),
        content: content.trim(),
        authorEmail: currentUser?.email || 'ano@ncc.gov.in',
        authorName: currentUser?.displayName || 'Lt. Vaishnav Kadam (ANO)',
        priority,
        targetAudience,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      const docRef = await addDoc(collection(db, 'announcements'), newNotice);
      setAnnouncements(prev => [{ ...newNotice, id: docRef.id }, ...prev]);
      setShowModal(false);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error publishing announcement:', err);
      alert('Failed to publish announcement.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#192229] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-xl font-bold text-[#e6edf3] tracking-wide">
              Official Announcements & Orders
            </h2>
          </div>
          <p className="text-xs text-[#8b949e]">
            Company notices, parade warnings, camp reporting orders and instructions issued by ANO.
          </p>
        </div>

        {role === 'ANO' && (
          <button
            onClick={() => setShowModal(true)}
            className="py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4 fill-black" />
            <span>NEW ANNOUNCEMENT</span>
          </button>
        )}
      </div>

      {/* Notices List or Clean Empty State */}
      {loading ? (
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-8 text-center text-xs font-mono text-[#8b949e]">
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-12 text-center">
          <Bell className="w-10 h-10 text-[#484f58] mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">No announcements published yet.</h4>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            {role === 'ANO'
              ? 'Publish your first company notification to inform cadets of drill timings or camp deadlines.'
              : 'Official company orders will appear here once published by the ANO.'}
          </p>
          {role === 'ANO' && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 py-2 px-4 bg-[#141b21] hover:bg-[#1f2830] text-[#f97316] border border-[#f97316]/50 rounded text-xs font-mono font-medium"
            >
              Publish First Notice →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => {
            const isUrgent = item.priority === 'Urgent';
            const isImportant = item.priority === 'Important';
            return (
              <div 
                key={item.id}
                className={`bg-[#0c1013] border rounded-xl p-5 shadow-lg transition-all ${
                  isUrgent 
                    ? 'border-[#ef4444]/40 bg-[#160d0d]' 
                    : isImportant 
                    ? 'border-[#f97316]/40' 
                    : 'border-[#192229]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isUrgent 
                        ? 'bg-[#ef4444] text-black' 
                        : isImportant 
                        ? 'bg-[#f97316] text-black' 
                        : 'bg-[#192229] text-[#8b949e]'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] font-mono text-[#8b949e] bg-[#090d10] px-2 py-0.5 rounded border border-[#192229]">
                      Target: {item.targetAudience}
                    </span>
                    <span className="text-[10px] font-mono text-[#484f58]">
                      {item.date}
                    </span>
                  </div>

                  {role === 'ANO' && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#484f58] hover:text-[#ef4444] p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#e6edf3] mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#c9d1d9] leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="mt-4 pt-3 border-t border-[#192229]/60 text-[10px] font-mono text-[#8b949e] flex justify-between">
                  <span>Issued by: {item.authorName}</span>
                  <span className="text-[#10b981]">Official Directorate Dispatch</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0c1013] border border-[#273842] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-[#192229] pb-3">
              <h3 className="text-base font-bold text-[#e6edf3]">Publish Official Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8b949e] hover:text-[#e6edf3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#8b949e] mb-1">NOTICE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reporting Orders: Republic Day Camp 2026 Selection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] mb-1">PRIORITY</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent / Immediate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">TARGET CADETS</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  >
                    <option value="All">All Cadets</option>
                    <option value="1st Year">1st Year Cadets</option>
                    <option value="2nd Year">2nd Year (B Cert)</option>
                    <option value="3rd Year">3rd Year (C Cert)</option>
                    <option value="Camp Selects">Camp Selectees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1">ANNOUNCEMENT TEXT *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed orders, reporting time, kit layout, instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#192229]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#141b21] text-[#8b949e] hover:text-[#e6edf3] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Publish to Cadets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
