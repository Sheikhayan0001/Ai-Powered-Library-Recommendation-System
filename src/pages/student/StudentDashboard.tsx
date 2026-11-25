import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';
import {
  User, BookOpen, Clock, Calendar, AlertTriangle,
  BookmarkCheck, Camera, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState<any>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profData, borrowData, resData] = await Promise.all([
        apiRequest('/users/profile'),
        apiRequest('/borrowing/my-books'),
        apiRequest('/reservations/my-reservations'),
      ]);
      setProfile(profData);
      setBorrowedBooks(borrowData);
      setReservations(resData);
      setFullName(profData.full_name || '');
      setPhone(profData.phone || '');
      setDepartment(profData.department || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: fullName,
          phone,
          department,
        }),
      });
      updateUser({ full_name: fullName, phone, department });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    }
  };

  if (!user) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
        <div className="text-center p-8 max-w-md">
          <User size={48} className="mx-auto text-[#DC2626] mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Student Authentication Required</h2>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>Please sign in with your student credentials to view your personal dashboard.</p>
        </div>
      </div>
    );
  }

  const activeBorrows = borrowedBooks.filter(b => b.status === 'ISSUED');
  const pastHistory = borrowedBooks.filter(b => b.status === 'RETURNED');

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Bar */}
        <div className={`rounded-2xl border p-6 mb-8 transition-all ${
          isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center text-xl font-bold uppercase shadow-lg shadow-[#DC2626]/20">
                  {user.full_name?.slice(0, 2) || 'ST'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                    {user.full_name}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626] font-semibold border border-[#DC2626]/20">
                    {user.role}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  Student ID: <strong className="text-[#DC2626]">{user.student_id || 'Not Assigned'}</strong> · {user.email}
                </p>
                {user.department && (
                  <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                    Department: {user.department}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isDark
                  ? 'border-[#2A2A2A] bg-[#1A1A1A] text-white hover:border-[#DC2626]'
                  : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-[#DC2626]'
              }`}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleProfileSave} className="mt-6 pt-6 border-t border-[#2A2A2A]/40 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1 text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-[#DC2626] hover:bg-[#EF4444] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#DC2626]/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {saveSuccess && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-500">
              <CheckCircle2 size={14} /> Profile details saved successfully.
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Currently Issued', val: activeBorrows.length, icon: BookOpen, color: '#DC2626' },
            { label: 'Reading History', val: pastHistory.length, icon: Clock, color: '#2563EB' },
            { label: 'Active Reservations', val: reservations.filter(r => r.status === 'PENDING').length, icon: Calendar, color: '#D97706' },
            { label: 'Pending Fines', val: `₹${profile?.stats?.total_fines || 0}`, icon: AlertTriangle, color: '#10B981' },
          ].map((s, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>{s.label}</span>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Currently Issued Books */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              Currently Borrowed Books
            </h2>
            <Link to="/explore" className="text-xs text-[#DC2626] hover:underline flex items-center gap-1">
              Borrow More Books <ChevronRight size={14} />
            </Link>
          </div>

          {activeBorrows.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center ${
              isDark ? 'bg-[#111111] border-[#2A2A2A] text-[#A3A3A3]' : 'bg-white border-gray-200 text-gray-500'
            }`}>
              <BookOpen size={32} className="mx-auto text-[#DC2626] mb-2 opacity-50" />
              <p className="text-sm font-medium">No books currently borrowed.</p>
              <p className="text-xs mt-1">Visit our catalogue to borrow physical or digital academic copies.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBorrows.map(b => (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border flex gap-4 ${
                    isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  {b.book_cover && (
                    <img src={b.book_cover} alt="" className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{b.book_title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Issued: {new Date(b.issue_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#DC2626] font-semibold">
                      Due Date: {new Date(b.due_date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-semibold border border-green-500/20">
                        {b.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reservations & Reading History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              My Reservations
            </h2>
            {reservations.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-gray-500'}`}>No active reservations.</p>
            ) : (
              <div className="space-y-3">
                {reservations.map(r => (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <h4 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{r.book_title}</h4>
                      <p className="text-[11px] text-gray-400">Requested: {new Date(r.request_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      r.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                      r.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              Completed Reading History
            </h2>
            {pastHistory.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-gray-500'}`}>No returned book history yet.</p>
            ) : (
              <div className="space-y-3">
                {pastHistory.map(h => (
                  <div
                    key={h.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <h4 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{h.book_title}</h4>
                      <p className="text-[11px] text-gray-400">Returned on: {new Date(h.return_date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">Archived</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
