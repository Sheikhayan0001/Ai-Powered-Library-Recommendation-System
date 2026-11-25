import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Book } from '../../types';

interface BookFiltersProps {
  subjects: string[];
  selectedSubject: string;
  selectedDifficulty: string;
  onSubjectChange: (s: string) => void;
  onDifficultyChange: (d: string) => void;
}

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const BookFilters: React.FC<BookFiltersProps> = ({
  subjects,
  selectedSubject,
  selectedDifficulty,
  onSubjectChange,
  onDifficultyChange,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'}`}>
      <div className="mb-4">
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
          Subject
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubjectChange('All')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              selectedSubject === 'All'
                ? 'bg-[#DC2626] border-[#DC2626] text-white'
                : isDark
                ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]'
                : 'border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            All
          </button>
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => onSubjectChange(subject)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                selectedSubject === subject
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : isDark
                  ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]'
                  : 'border-gray-200 text-[#666666] hover:border-[#DC2626]'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
          Difficulty
        </h3>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                selectedDifficulty === d
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : isDark
                  ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]'
                  : 'border-gray-200 text-[#666666] hover:border-[#DC2626]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
