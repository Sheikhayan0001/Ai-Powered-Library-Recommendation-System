import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLibrary } from '../contexts/LibraryContext';
import BookCard from '../components/ui/BookCard';
import LocationCard from '../components/navigation/LocationCard';
import FloorMap from '../components/navigation/FloorMap';
import { Bookmark, Trash2, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

const MyBooksPage: React.FC = () => {
  const { theme } = useTheme();
  const { selectedBooks, removeBook } = useLibrary();
  const isDark = theme === 'dark';
  const [navigatingBook, setNavigatingBook] = useState<Book | null>(null);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626] flex items-center justify-center text-white">
                <Bookmark size={18} />
              </div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                My Selected Books
              </h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Your personal reading list saved in local storage ({selectedBooks.length} books)
            </p>
          </div>

          {selectedBooks.length > 0 && (
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1.5 rounded-full border ${isDark ? 'border-[#2A2A2A] text-[#A3A3A3] bg-[#151515]' : 'border-gray-200 text-[#666666] bg-white'}`}>
                {selectedBooks.length} saved
              </span>
            </div>
          )}
        </div>

        {/* Selected books empty state */}
        {selectedBooks.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center max-w-lg mx-auto ${
            isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="w-16 h-16 bg-[#DC2626]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark size={32} className="text-[#DC2626]" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              No books selected yet
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Explore our vast academic catalog and click the Bookmark icon on any book to add it to your personal shelf.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#EF4444] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#DC2626]/20"
            >
              Explore Catalogue <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedBooks.map(book => (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setNavigatingBook(book)}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border font-medium transition-colors ${
                        navigatingBook?.id === book.id
                          ? 'bg-[#DC2626] border-[#DC2626] text-white'
                          : isDark
                          ? 'border-[#2A2A2A] bg-[#111111] text-[#A3A3A3] hover:border-[#DC2626] hover:text-[#F5F5F5]'
                          : 'border-gray-200 bg-white text-[#666666] hover:border-[#DC2626]'
                      }`}
                    >
                      <MapPin size={12} />
                      Locate in Library
                    </button>
                    <button
                      onClick={() => {
                        removeBook(book.id);
                        if (navigatingBook?.id === book.id) setNavigatingBook(null);
                      }}
                      title="Remove from collection"
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDark
                          ? 'border-[#2A2A2A] bg-[#111111] text-[#A3A3A3] hover:text-[#DC2626] hover:border-[#DC2626]/40'
                          : 'border-gray-200 bg-white text-[#666666] hover:text-[#DC2626] hover:border-[#DC2626]/40'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* In-depth Physical navigation section if a book is selected for location */}
            {navigatingBook && (
              <div className={`mt-10 rounded-2xl border p-6 ${
                isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-4 border-b pb-4 border-[#2A2A2A]/40">
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                      Physical Navigation: {navigatingBook.title}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                      Real-time interactive routing and shelf highlighting
                    </p>
                  </div>
                  <button
                    onClick={() => setNavigatingBook(null)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      isDark ? 'border-[#2A2A2A] text-[#A3A3A3] hover:text-white' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Close Map
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LocationCard book={navigatingBook} />
                  <FloorMap book={navigatingBook} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;
