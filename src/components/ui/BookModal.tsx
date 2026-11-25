import React, { useState } from 'react';
import { X, Bookmark, BookmarkCheck, MapPin, Tag, Calendar, FileText, Hash } from 'lucide-react';
import { Book } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLibrary } from '../../contexts/LibraryContext';

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

const difficultyColors: Record<string, string> = {
  Beginner: '#059669',
  Intermediate: '#D97706',
  Advanced: '#DC2626',
};

const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
  const { theme } = useTheme();
  const { addBook, removeBook, isSelected } = useLibrary();
  const isDark = theme === 'dark';
  const selected = isSelected(book.id);
  const [imgError, setImgError] = useState(false);

  const toggleSelect = () => {
    if (selected) removeBook(book.id);
    else addBook(book);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className={`relative max-w-2xl w-full rounded-2xl border overflow-hidden max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-start gap-4 p-6 border-b ${isDark ? 'border-[#2A2A2A]' : 'border-gray-100'}`}>
          <div className="flex-shrink-0">
            {!imgError ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-20 h-28 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: difficultyColors[book.difficulty] }}
              >
                {book.title.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className={`text-lg font-bold leading-tight mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              {book.title}
            </h2>
            <p className={`text-sm mb-3 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>{book.author}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                isDark ? 'border-[#2A2A2A] text-[#A3A3A3]' : 'border-gray-200 text-[#666666]'
              }`}>
                {book.subject}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: difficultyColors[book.difficulty] }}
              >
                {book.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]' : 'text-[#666666] hover:text-[#171717] hover:bg-gray-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              {book.description}
            </p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Year', value: book.year },
              { icon: FileText, label: 'Pages', value: book.pages },
              { icon: Hash, label: 'ISBN', value: book.isbn },
              { icon: Tag, label: 'Subject', value: book.subject },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                isDark ? 'bg-[#0D0D0D]' : 'bg-gray-50'
              }`}>
                <Icon size={14} className="text-[#DC2626]" />
                <span className={isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}>{label}:</span>
                <span className={`font-medium ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Topics */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Topics Covered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {book.topics.map(topic => (
                <span key={topic} className={`text-xs px-2 py-0.5 rounded border ${
                  isDark ? 'border-[#2A2A2A] text-[#A3A3A3]' : 'border-gray-200 text-[#666666]'
                }`}>
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {book.prerequisites.length > 0 && (
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Prerequisites
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {book.prerequisites.map(prereq => (
                  <span key={prereq} className="text-xs px-2 py-0.5 rounded border border-[#DC2626]/30 text-[#DC2626]">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className={`rounded-xl border p-4 ${isDark ? 'border-[#2A2A2A] bg-[#0D0D0D]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-[#DC2626]" />
              <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                Physical Location
              </h4>
              <span className="text-xs text-[#DC2626] font-medium">(DEMO DATA)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Floor', value: book.location.floor },
                { label: 'Section', value: book.location.section },
                { label: 'Aisle', value: book.location.aisle },
                { label: 'Shelf', value: book.location.shelf },
                { label: 'Rack', value: book.location.rack },
                { label: 'Bay', value: book.location.bay },
              ].map(({ label, value }) => (
                <div key={label} className={`${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  <span className={`block font-medium ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>{label}</span>
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isDark ? 'border-[#2A2A2A]' : 'border-gray-100'}`}>
          <button
            onClick={toggleSelect}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              selected
                ? 'bg-[#DC2626] text-white hover:bg-[#EF4444]'
                : isDark
                ? 'border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626] hover:text-[#F5F5F5]'
                : 'border border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            {selected ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {selected ? 'Remove from My Books' : 'Save to My Books'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
