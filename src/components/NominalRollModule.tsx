import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Check, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2,
  Filter
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { CadetProfile } from '../types';

export const NCC_RANKS = [
  'Cadet',
  'Lance Corporal',
  'Corporal',
  'Sergeant',
  'Company Quartermaster Sergeant (CQMS)',
  'Company Sergeant Major (CSM)',
  'Junior Under Officer (JUO)',
  'Senior Under Officer (SUO)'
];

export const NominalRollModule: React.FC = () => {
  const [cadets, setCadets] = useState<CadetProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState('All');
  
  // Add Cadet Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regimentalNumber, setRegimentalNumber] = useState('');
  const [rank, setRank] = useState('Cadet');
  const [yearBatch, setYearBatch] = useState('2024-2027');
  const [institution, setInstitution] = useState('RVCE');
  const [unit, setUnit] = useState('1 KAR BN NCC');
  const [role, setRole] = useState<'Cadet' | 'Senior'>('Cadet');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Rank Inline State
  const [editingCadetId, setEditingCadetId] = useState<string | null>(null);
  const [newSelectedRank, setNewSelectedRank] = useState<string>('Cadet');

  const fetchCadets = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'cadets'), orderBy('fullName', 'asc'));
      const snap = await getDocs(q);
      const list: CadetProfile[] = snap.docs.map(d => ({
        ...d.data() as CadetProfile,
        id: d.id
      }));
      setCadets(list);
    } catch (err) {
      console.error('Failed to load Nominal Roll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCadets();
  }, []);

  const handleAddCadet = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !name.trim()) {
      setFormError('Name and valid Google Email are required.');
      return;
    }

    // Check duplicate email
    if (cadets.some(c => c.email.toLowerCase() === cleanEmail)) {
      setFormError('A cadet with this email already exists in the Nominal Roll.');
      return;
    }

    try {
      setSaving(true);
      const newCadetData: Omit<CadetProfile, 'id'> = {
        fullName: name.trim(),
        email: cleanEmail,
        regimentalNumber: regimentalNumber.trim() || `KA/${new Date().getFullYear().toString().slice(-2)}/SDA/${Math.floor(100000 + Math.random() * 900000)}`,
        rank,
        unit: unit.trim() || '1 KAR BN NCC',
        institution: institution.trim() || 'RVCE',
        yearBatch: yearBatch.trim(),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        role,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'cadets'), newCadetData);
      setCadets(prev => [...prev, { ...newCadetData, id: docRef.id }]);

      // Reset form
      setShowAddModal(false);
      setName('');
      setEmail('');
      setRegimentalNumber('');
      setRank('Cadet');
    } catch (err: any) {
      console.error('Error adding cadet:', err);
      setFormError(err.message || 'Failed to save cadet to Nominal Roll.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRank = async (cadetId: string) => {
    try {
      const cadetRef = doc(db, 'cadets', cadetId);
      await updateDoc(cadetRef, {
        rank: newSelectedRank
      });
      setCadets(prev => prev.map(c => c.id === cadetId ? { ...c, rank: newSelectedRank } : c));
      setEditingCadetId(null);
    } catch (err) {
      console.error('Failed to update cadet rank:', err);
      alert('Could not update rank. Verify Firestore connection.');
    }
  };

  const handleToggleStatus = async (cadet: CadetProfile) => {
    const nextStatus = cadet.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const cadetRef = doc(db, 'cadets', cadet.id);
      await updateDoc(cadetRef, { status: nextStatus });
      setCadets(prev => prev.map(c => c.id === cadet.id ? { ...c, status: nextStatus } : c));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteCadet = async (cadetId: string, cadetName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${cadetName} from the Nominal Roll? This will revoke their platform access.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'cadets', cadetId));
      setCadets(prev => prev.filter(c => c.id !== cadetId));
    } catch (err) {
      console.error('Error deleting cadet:', err);
    }
  };

  const filteredCadets = cadets.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.regimentalNumber && c.regimentalNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRank = filterRank === 'All' || c.rank === filterRank;

    return matchesSearch && matchesRank;
  });

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Nominal Roll Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#192229] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-xl font-bold text-[#e6edf3] tracking-wide">
              Nominal Roll & Cadet Management
            </h2>
          </div>
          <p className="text-xs text-[#8b949e]">
            Official company muster roll. Cadets registered here gain authenticated access to their training modules via Google Sign-In.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg"
        >
          <UserPlus className="w-4 h-4 fill-black" />
          <span>ENROLL NEW CADET</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or regimental number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c1013] border border-[#192229] focus:border-[#f97316] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#e6edf3] outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#0c1013] border border-[#192229] rounded-lg px-3 py-2">
          <Filter className="w-4 h-4 text-[#8b949e]" />
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="bg-transparent text-xs text-[#e6edf3] font-mono outline-none"
          >
            <option value="All" className="bg-[#0c1013]">All Ranks</option>
            {NCC_RANKS.map(r => (
              <option key={r} value={r} className="bg-[#0c1013]">{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cadets Table or Clean Empty State */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#8b949e]">
            Loading Nominal Roll from Cloud Firestore...
          </div>
        ) : filteredCadets.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-[#273842] mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">
              {cadets.length === 0 ? 'Nominal Roll is empty.' : 'No matching cadets found.'}
            </h4>
            <p className="text-xs text-[#8b949e] max-w-sm mx-auto mb-4">
              {cadets.length === 0 
                ? 'Enroll your cadets with their Google account email so they can log in and access weapon drills and exam simulations.'
                : 'Try adjusting your search criteria.'}
            </p>
            {cadets.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="py-2 px-4 bg-[#141b21] hover:bg-[#1f2830] text-[#f97316] border border-[#f97316]/50 rounded text-xs font-mono font-medium"
              >
                Enroll First Cadet →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#192229] text-[#8b949e] bg-[#090d10]">
                  <th className="py-3 px-4 font-normal">CADET NAME & EMAIL</th>
                  <th className="py-3 px-4 font-normal">REGIMENTAL NO.</th>
                  <th className="py-3 px-4 font-normal">RANK</th>
                  <th className="py-3 px-4 font-normal">BATCH</th>
                  <th className="py-3 px-4 font-normal">STATUS</th>
                  <th className="py-3 px-4 font-normal text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192229]/60">
                {filteredCadets.map((cadet) => {
                  const isEditing = editingCadetId === cadet.id;
                  return (
                    <tr key={cadet.id} className="hover:bg-[#090d10]/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#e6edf3] text-sm">
                          {cadet.fullName}
                        </div>
                        <div className="text-[11px] text-[#8b949e]">
                          {cadet.email}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#c9d1d9]">
                        {cadet.regimentalNumber || '—'}
                      </td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={newSelectedRank}
                              onChange={(e) => setNewSelectedRank(e.target.value)}
                              className="bg-[#141b21] border border-[#f97316] rounded px-2 py-1 text-xs text-[#e6edf3] outline-none"
                            >
                              {NCC_RANKS.map(r => (
                                <option key={r} value={r} className="bg-[#0c1013]">{r}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleUpdateRank(cadet.id)}
                              className="p-1 text-[#10b981] hover:bg-[#141b21] rounded"
                              title="Save Rank"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCadetId(null)}
                              className="p-1 text-[#ef4444] hover:bg-[#141b21] rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[#f97316] font-semibold bg-[#1a120e] px-2 py-0.5 rounded border border-[#f97316]/20">
                              {cadet.rank}
                            </span>
                            <button
                              onClick={() => {
                                setEditingCadetId(cadet.id);
                                setNewSelectedRank(cadet.rank);
                              }}
                              className="text-[#484f58] hover:text-[#8b949e] p-1"
                              title="Change Rank"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#8b949e]">
                        {cadet.yearBatch}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(cadet)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border ${
                            cadet.status === 'Active'
                              ? 'bg-[#10241b] text-[#10b981] border-[#10b981]/30'
                              : 'bg-[#221515] text-[#ef4444] border-[#ef4444]/30'
                          }`}
                        >
                          {cadet.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCadet(cadet.id, cadet.fullName)}
                          className="p-1.5 text-[#484f58] hover:text-[#ef4444] hover:bg-[#1c1414] rounded transition-colors"
                          title="Remove Cadet"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Cadet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0c1013] border border-[#273842] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-[#192229] pb-3">
              <h3 className="text-base font-bold text-[#e6edf3] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#f97316]" />
                Enroll Cadet in Nominal Roll
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8b949e] hover:text-[#e6edf3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-[#1f1315] border border-[#ef4444]/40 rounded-lg text-xs text-[#fca5a5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddCadet} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#8b949e] mb-1">CADET FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1">CADET GOOGLE EMAIL ID *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.cadet@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#090d10] border border-[#192229] focus:border-[#f97316] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                />
                <span className="text-[10px] text-[#484f58] block mt-1">
                  The cadet will authenticate into their dashboard using this exact Google email address.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] mb-1">INITIAL RANK</label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  >
                    {NCC_RANKS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">SYSTEM ROLE</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  >
                    <option value="Cadet">Cadet</option>
                    <option value="Senior">Senior (Can add resources)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] mb-1">REGIMENTAL NUMBER</label>
                  <input
                    type="text"
                    placeholder="KA/24/SDA/123456"
                    value={regimentalNumber}
                    onChange={(e) => setRegimentalNumber(e.target.value)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">YEAR / BATCH</label>
                  <input
                    type="text"
                    placeholder="2024-2027"
                    value={yearBatch}
                    onChange={(e) => setYearBatch(e.target.value)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] mb-1">INSTITUTION</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">NCC UNIT</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#090d10] border border-[#192229] rounded-lg p-2.5 text-[#e6edf3] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#192229]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#141b21] text-[#8b949e] hover:text-[#e6edf3] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Registering...' : 'Enroll Cadet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
