import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        login(res.access_token, res.user);
        onClose();
      } else {
        const res = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            student_id: studentId || undefined,
            role,
          }),
        });
        login(res.access_token, res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('student@lpu.in');
    setPassword('Student@123');
    setMode('login');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@lpu.in');
    setPassword('Admin@123');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#202020]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#DC2626]/10 text-[#DC2626] rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={24} />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            {mode === 'login' ? 'Sign in to LPU Library' : 'Create Student Account'}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            Access your personalized bookshelf, AI Librarian, and circulation records
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-500">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>
                  Full Name
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-black'
                }`}>
                  <UserIcon size={16} className="text-[#A3A3A3]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ayan Sheikh"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>
                  Student ID
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-black'
                }`}>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. 12104589"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>
              University Email
            </label>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-black'
            }`}>
              <Mail size={16} className="text-[#A3A3A3]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@lpu.in"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#A3A3A3]' : 'text-gray-600'}`}>
              Password
            </label>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-black'
            }`}>
              <Lock size={16} className="text-[#A3A3A3]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#EF4444] text-white font-semibold text-sm transition-all shadow-lg shadow-[#DC2626]/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className={`mt-5 pt-4 border-t ${isDark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
          <p className={`text-[11px] text-center mb-2 font-medium ${isDark ? 'text-[#A3A3A3]' : 'text-gray-500'}`}>
            Quick Demo Login:
          </p>
          <div className="flex gap-2">
            <button
              onClick={fillDemoStudent}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                isDark ? 'border-[#2A2A2A] bg-[#111111] hover:border-[#DC2626] text-white' : 'border-gray-200 bg-gray-50 hover:border-[#DC2626] text-black'
              }`}
            >
              Demo Student
            </button>
            <button
              onClick={fillDemoAdmin}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                isDark ? 'border-[#2A2A2A] bg-[#111111] hover:border-[#DC2626] text-white' : 'border-gray-200 bg-gray-50 hover:border-[#DC2626] text-black'
              }`}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-xs text-[#DC2626] hover:underline font-medium"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
