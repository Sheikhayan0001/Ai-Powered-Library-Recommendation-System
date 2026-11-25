import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, Bookmark, User, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import AuthModal from '../auth/AuthModal';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Explore Books', path: '/explore' },
  { label: 'Subjects', path: '/subjects' },
  { label: 'Knowledge Graph', path: '/graph' },
  { label: 'AI Librarian', path: '/librarian' },
  { label: 'AI Comparison', path: '/comparison' },
  { label: 'About', path: '/about' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { theme } = useTheme();
  const { selectedCount } = useLibrary();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isDark = theme === 'dark';

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b ${
          isDark
            ? 'bg-[#080808]/95 border-[#2A2A2A] backdrop-blur-md'
            : 'bg-white/95 border-gray-200 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center shadow-md shadow-[#DC2626]/20">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className={`text-lg font-bold tracking-wider ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                LPU <span className="text-[#DC2626] text-xs font-semibold tracking-normal">LIBRARY</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#DC2626] text-white'
                      : isDark
                      ? 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#151515]'
                      : 'text-[#666666] hover:text-[#171717] hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* My Books with badge */}
              <Link
                to="/my-books"
                className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/my-books'
                    ? 'bg-[#DC2626] text-white'
                    : isDark
                    ? 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#151515]'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-gray-100'
                }`}
              >
                <Bookmark size={14} />
                My Shelf
                {selectedCount > 0 && (
                  <span className="bg-[#DC2626] text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {selectedCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Right side Profile & Theme controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#151515] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.full_name?.slice(0, 2) || 'U'}
                    </div>
                    <span className={`hidden md:block text-xs font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                      {user.full_name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-xl z-50 ${
                        isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
                      }`}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-[#2A2A2A]/40 mb-1">
                        <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>{user.full_name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-[#DC2626]/10 text-[#DC2626] font-semibold">
                          {user.role} {user.student_id ? `· ${user.student_id}` : ''}
                        </span>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#DC2626]/10 text-[#DC2626] font-semibold"
                        >
                          <Shield size={14} /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-[#202020] text-gray-300"
                        >
                          <User size={14} /> Student Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-red-500/10 text-red-500 font-medium text-left mt-1"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-semibold transition-all shadow-md shadow-[#DC2626]/20"
                >
                  Sign In
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-md ${
                  isDark ? 'text-[#A3A3A3] hover:text-[#F5F5F5]' : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className={`lg:hidden border-t pb-4 ${isDark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
              <div className="pt-3 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-[#DC2626] text-white'
                        : isDark
                        ? 'text-[#A3A3A3] hover:text-[#F5F5F5]'
                        : 'text-[#666666] hover:text-[#171717]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-[#DC2626]"
                  >
                    {isAdmin ? 'Admin Console' : 'My Student Dashboard'}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
