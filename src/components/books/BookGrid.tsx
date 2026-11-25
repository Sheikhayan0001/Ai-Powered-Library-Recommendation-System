import React from 'react';
import { Book } from '../../types';
import BookCard from '../ui/BookCard';
import { useTheme } from '../../contexts/ThemeContext';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  page: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

const BookGrid: React.FC<BookGridProps> = ({ books, page, onPageChange, pageSize = 12 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalPages = Math.ceil(books.length / pageSize);
  const paginatedBooks = books.slice((page - 1) * pageSize, page * pageSize);

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <BookOpen size={48} className={isDark ? 'text-[#2A2A2A]' : 'text-gray-200'} />
        <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>No books found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-30 ${
              isDark ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]' : 'border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-[#DC2626] text-white'
                  : isDark
                  ? 'border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]'
                  : 'border border-gray-200 text-[#666666] hover:border-[#DC2626]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-30 ${
              isDark ? 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]' : 'border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
