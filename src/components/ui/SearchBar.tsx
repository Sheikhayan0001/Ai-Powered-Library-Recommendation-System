import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search books, subjects, topics...',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative flex items-center rounded-xl border ${
      isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'
    } focus-within:border-[#DC2626] transition-colors`}>
      <Search
        size={18}
        className={`absolute left-3 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 bg-transparent rounded-xl text-sm outline-none ${
          isDark ? 'text-[#F5F5F5] placeholder-[#A3A3A3]' : 'text-[#171717] placeholder-[#666666]'
        }`}
      />
    </div>
  );
};

export default SearchBar;
