import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';
import {
  Users, BookOpen, Repeat, AlertCircle, Plus,
  MapPin, Check, X, ShieldAlert, Search, Trash2, Edit3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'users' | 'circulation' | 'maps'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [booksList, setBooksList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Book Add Form State
  const [showAddBook, setShowAddBook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(1);
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newCopies, setNewCopies] = useState(5);
  const [newDesc, setNewDesc] = useState('');

  // Issue Book State
  const [issueUserId, setIssueUserId] = useState('');
  const [issueBookId, setIssueBookId] = useState('');
  const [issueDays, setIssueDays] = useState(14);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [m, b, u, t, r, h] = await Promise.all([
        apiRequest('/admin/metrics'),
        apiRequest('/books?include_archived=true'),
        apiRequest('/admin/users'),
        apiRequest('/admin/borrowing/transactions'),
        apiRequest('/admin/reservations'),
        apiRequest('/navigation/hierarchy'),
      ]);
      setMetrics(m);
      setBooksList(b);
      setUsersList(u);
      setTransactions(t);
      setReservations(r);
      setHierarchy(h);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/books', {
        method: 'POST',
        body: JSON.stringify({
          isbn: newIsbn,
          title: newTitle,
          author: newAuthor,
          subject_id: Number(newSubjectId),
          difficulty: newDifficulty,
          total_copies: Number(newCopies),
          available_copies: Number(newCopies),
          description: newDesc,
          cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        }),
      });
      alert('Book successfully added and RAG chunks updated!');
      setShowAddBook(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error adding book');
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/borrowing/issue', {
        method: 'POST',
        body: JSON.stringify({
          user_id: Number(issueUserId),
          book_id: Number(issueBookId),
          due_days: Number(issueDays),
        }),
      });
      alert('Book issued successfully!');
      setIssueUserId('');
      setIssueBookId('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error issuing book');
    }
  };

  const handleReturnBook = async (txId: number) => {
    if (!confirm('Confirm return of this book?')) return;
    try {
      await apiRequest(`/admin/borrowing/return/${txId}`, { method: 'POST' });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error returning book');
    }
  };

  const handleToggleUser = async (userId: number, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
    }
  };

  if (!isAdmin) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
        <div className="text-center p-8 max-w-md">
          <ShieldAlert size={48} className="mx-auto text-[#DC2626] mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Admin Access Restricted</h2>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>
            You must be logged in as an Administrator (e.g. <code>admin@lpu.in</code>) to manage system records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-extrabold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              LPU Central Administration
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Role-Based Access Control · Circulation Management · Library Navigation Layouts
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddBook(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#DC2626]/20"
            >
              <Plus size={16} /> Add New Book
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b mb-8 overflow-x-auto ${isDark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
          {[
            { id: 'overview', label: 'Overview Metrics', icon: Repeat },
            { id: 'books', label: 'Book Management', icon: BookOpen },
            { id: 'circulation', label: 'Issue / Return Circulation', icon: Repeat },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'maps', label: 'Library Map & Shelves', icon: MapPin },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : isDark
                  ? 'border-transparent text-[#A3A3A3] hover:text-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Books Catalogued', val: metrics.total_books, icon: BookOpen, color: '#DC2626' },
                { label: 'Registered Students/Users', val: metrics.total_users, icon: Users, color: '#2563EB' },
                { label: 'Currently Issued Copies', val: metrics.issued_books, icon: Repeat, color: '#D97706' },
                { label: 'Pending Reservations', val: metrics.pending_reservations, icon: AlertCircle, color: '#10B981' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{m.label}</span>
                    <m.icon size={18} style={{ color: m.color }} />
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Recent Audit Activities */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h2 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                Recent System Audit Activities
              </h2>
              <div className="space-y-3">
                {metrics.recent_activities?.map((a: any) => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-[#0D0D0D] border-[#2A2A2A]' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#DC2626] mr-2">[{a.action}]</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{a.details}</span>
                    </div>
                    <span className="text-gray-500 text-[11px]">{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKS MANAGEMENT TAB */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${isDark ? 'bg-[#111111] border-[#2A2A2A] text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="p-3.5">Book Title</th>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">ISBN</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Available Copies</th>
                      <th className="p-3.5">Shelf Location</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/40">
                    {booksList.map(b => (
                      <tr key={b.id} className={isDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-50'}>
                        <td className="p-3.5 font-semibold text-[#DC2626]">{b.title}</td>
                        <td className="p-3.5">{b.author}</td>
                        <td className="p-3.5 font-mono">{b.isbn}</td>
                        <td className="p-3.5">{b.subject_name}</td>
                        <td className="p-3.5">
                          <span className="font-bold">{b.available_copies}</span> / {b.total_copies}
                        </td>
                        <td className="p-3.5">
                          {b.location_details ? `F${b.location_details.floor}·Aisle ${b.location_details.aisle}·${b.location_details.shelf}` : 'Unassigned'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            b.is_archived ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                          }`}>
                            {b.is_archived ? 'Archived' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CIRCULATION TAB */}
        {activeTab === 'circulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Issue Panel */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h2 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                Issue Book to Student
              </h2>
              <form onSubmit={handleIssueBook} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Select Student</label>
                  <select
                    value={issueUserId}
                    onChange={e => setIssueUserId(e.target.value)}
                    required
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="">Select a student...</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.student_id || u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Select Book</label>
                  <select
                    value={issueBookId}
                    onChange={e => setIssueBookId(e.target.value)}
                    required
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="">Select a book...</option>
                    {booksList.filter(b => b.available_copies > 0).map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} (Avail: {b.available_copies})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Loan Period (Days)</label>
                  <input
                    type="number"
                    value={issueDays}
                    onChange={e => setIssueDays(Number(e.target.value))}
                    min={1}
                    max={60}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#EF4444] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#DC2626]/20"
                >
                  Record Book Loan
                </button>
              </form>
            </div>

            {/* Active Transactions List */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h2 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                Active Circulation Records ({transactions.filter(t => t.status === 'ISSUED').length})
              </h2>
              <div className="space-y-3">
                {transactions.filter(t => t.status === 'ISSUED').map(tx => (
                  <div
                    key={tx.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-[#0D0D0D] border-[#2A2A2A]' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-semibold text-white">{tx.book_title}</h4>
                      <p className="text-gray-400 mt-0.5">
                        Issued to: <span className="text-[#DC2626]">{tx.student_name}</span> ({tx.student_id})
                      </p>
                      <p className="text-gray-400 text-[11px]">Due: {new Date(tx.due_date).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleReturnBook(tx.id)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg text-xs transition-colors"
                    >
                      Process Return
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
          }`}>
            <table className="w-full text-left text-xs">
              <thead className={`border-b ${isDark ? 'bg-[#111111] border-[#2A2A2A] text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <tr>
                  <th className="p-3.5">Student / User Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Student ID</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Active Borrows</th>
                  <th className="p-3.5">Account Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/40">
                {usersList.map(u => (
                  <tr key={u.id} className={isDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-50'}>
                    <td className="p-3.5 font-semibold text-white">{u.full_name}</td>
                    <td className="p-3.5">{u.email}</td>
                    <td className="p-3.5 font-mono">{u.student_id || 'N/A'}</td>
                    <td className="p-3.5 font-semibold text-[#DC2626]">{u.role}</td>
                    <td className="p-3.5">{u.active_borrows_count} books</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleUser(u.id, u.is_active)}
                        className={`text-[11px] underline font-medium ${
                          u.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {u.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MAPS & SHELVES TAB */}
        {activeTab === 'maps' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h2 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                Physical Library Layout Hierarchy
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Real-time database-driven floor, section, rack, and shelf coordinates
              </p>

              <div className="space-y-4">
                {hierarchy.map(bldg => (
                  <div key={bldg.id} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#0D0D0D]">
                    <h3 className="text-sm font-bold text-[#DC2626]">{bldg.name}</h3>
                    <div className="mt-3 pl-4 space-y-3">
                      {bldg.floors?.map((fl: any) => (
                        <div key={fl.id} className="border-l-2 border-[#DC2626]/40 pl-3">
                          <h4 className="text-xs font-semibold text-white">{fl.name}</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {fl.sections?.map((sec: any) => (
                              <div key={sec.id} className="p-2.5 rounded-lg border border-[#2A2A2A] bg-[#151515] text-[11px]">
                                <span className="font-bold text-white">{sec.name}</span> ({sec.code})
                                <div className="text-gray-400 mt-1">
                                  {sec.shelves?.length || 0} Shelves registered
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Book */}
        {showAddBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className={`w-full max-w-lg rounded-2xl border p-6 ${
              isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Add New Academic Book</h3>
                <button onClick={() => setShowAddBook(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleAddBook} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">ISBN</label>
                    <input
                      type="text"
                      required
                      value={newIsbn}
                      onChange={e => setNewIsbn(e.target.value)}
                      placeholder="978-..."
                      className="w-full p-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Copies</label>
                    <input
                      type="number"
                      required
                      value={newCopies}
                      onChange={e => setNewCopies(Number(e.target.value))}
                      min={1}
                      className="w-full p-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#EF4444] text-white font-semibold rounded-xl mt-4"
                >
                  Create Book & Index into RAG
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
