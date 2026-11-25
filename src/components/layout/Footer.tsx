import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t mt-auto ${
      isDark ? 'bg-[#080808] border-[#2A2A2A]' : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className={`text-base font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>LPU Library</span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Where Knowledge Comes Alive. An intelligent library management platform for Lovely Professional University.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Explore Books', path: '/explore' },
                { label: 'Knowledge Graph', path: '/graph' },
                { label: 'AI Librarian', path: '/librarian' },
                { label: 'About', path: '/about' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm hover:text-[#DC2626] transition-colors ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>Platform</h4>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Built with React 18, TypeScript, Tailwind CSS, and Framer Motion.
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              RAG integration point available via <code className="text-[#DC2626]">src/services/ragService.ts</code>
            </p>
          </div>
        </div>

        <div className={`mt-8 pt-6 border-t flex items-center justify-between ${isDark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
          <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            © 2024 LPU Library. Demo Application.
          </p>
          <div className="flex items-center gap-3 text-xs text-[#DC2626]">
            Where Knowledge Comes Alive
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
