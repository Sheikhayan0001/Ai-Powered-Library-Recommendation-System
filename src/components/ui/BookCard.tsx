import React, { useState } from 'react';
import { Book } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { Bookmark, BookmarkCheck, MapPin, Info } from 'lucide-react';
import BookModal from './BookModal';

interface BookCardProps {
  book: Book;
}

const difficultyColors: Record<string, string> = {
  Beginner: '#059669',
  Intermediate: '#D97706',
  Advanced: '#DC2626',
};

function getInitials(title: string): string {
  return title
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { theme } = useTheme();
  const { addBook, removeBook, isSelected } = useLibrary();
  const isDark = theme === 'dark';
  const selected = isSelected(book.id);
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const toggleSelect = () => {
    if (selected) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

  return (
    <>
      <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-all hover:border-[#DC2626]/40 ${
        isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        {/* Book cover + info row */}
        <div className="flex gap-3">
          {/* Cover thumbnail */}
          <div className="flex-shrink-0">
            {!imgError ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-14 h-20 object-cover rounded-lg"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-14 h-20 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: difficultyColors[book.difficulty] || '#DC2626' }}
              >
                {getInitials(book.title)}
              </div>
            )}
          </div>

          {/* Title / author / badges */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold line-clamp-2 leading-tight mb-1 ${
              isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'
            }`}>
              {book.title}
            </h3>
            <p className={`text-xs mb-2 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              {book.author}
            </p>
            <div className="flex flex-wrap gap-1">
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
                isDark ? 'border-[#2A2A2A] text-[#A3A3A3]' : 'border-gray-200 text-[#666666]'
              }`}>
                {book.subject}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
                style={{ backgroundColor: difficultyColors[book.difficulty] }}
              >
                {book.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Location quick view */}
        {showLocation && (
          <div className={`text-xs rounded-lg p-2.5 border ${
            isDark ? 'bg-[#0D0D0D] border-[#2A2A2A] text-[#A3A3A3]' : 'bg-gray-50 border-gray-200 text-[#666666]'
          }`}>
            <span className="text-[#DC2626] font-semibold">(DEMO DATA)</span>
            <div className="mt-1 space-y-0.5">
              <div>Floor {book.location.floor} · {book.location.section}</div>
              <div>Aisle {book.location.aisle} · Shelf {book.location.shelf}</div>
              <div>Rack {book.location.rack} · Bay {book.location.bay}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setModalOpen(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border transition-colors font-medium ${
              isDark
                ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626] hover:text-[#F5F5F5]'
                : 'border-gray-200 text-[#666666] hover:border-[#DC2626] hover:text-[#171717]'
            }`}
          >
            <Info size={13} />
            Details
          </button>
          <button
            onClick={() => setShowLocation(v => !v)}
            className={`flex items-center justify-center gap-1.5 px-3 text-xs py-2 rounded-lg border transition-colors font-medium ${
              showLocation
                ? 'border-[#DC2626] text-[#DC2626]'
                : isDark
                ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626] hover:text-[#F5F5F5]'
                : 'border-gray-200 text-[#666666] hover:border-[#DC2626] hover:text-[#171717]'
            }`}
          >
            <MapPin size={13} />
            Find
          </button>
          <button
            onClick={toggleSelect}
            className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selected
                ? 'bg-[#DC2626] text-white hover:bg-[#EF4444]'
                : isDark
                ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626] hover:text-[#F5F5F5]'
                : 'bg-gray-100 border border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            {selected ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </div>
      </div>

      {modalOpen && <BookModal book={book} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default BookCard;
