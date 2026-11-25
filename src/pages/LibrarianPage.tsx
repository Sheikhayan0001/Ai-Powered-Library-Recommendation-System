import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LibrarianChat from '../components/librarian/LibrarianChat';
import { Bot } from 'lucide-react';

const LibrarianPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#DC2626] rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-0.5 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              AI Librarian
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Ask about books, locations, subjects, and reading paths
            </p>
          </div>
        </div>
        <LibrarianChat />
      </div>
    </div>
  );
};

export default LibrarianPage;
