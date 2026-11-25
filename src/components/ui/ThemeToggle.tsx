import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        isDark
          ? 'bg-[#151515] border border-[#2A2A2A] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#DC2626]'
          : 'bg-gray-100 border border-gray-200 text-[#666666] hover:text-[#171717] hover:border-[#DC2626]'
      }`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
