import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { books as allBooks } from '../data/books';
import { useTheme } from '../contexts/ThemeContext';
import BookGrid from '../components/books/BookGrid';
import BookFilters from '../components/books/BookFilters';
import SearchBar from '../components/ui/SearchBar';
import { SlidersHorizontal } from 'lucide-react';

const subjects = [...new Set(allBooks.map(b => b.subject))].sort();

const ExplorePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const filtered = allBooks.filter(book => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.subject.toLowerCase().includes(query.toLowerCase()) ||
      book.topics.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || book.difficulty === selectedDifficulty;
    return matchesQuery && matchesSubject && matchesDifficulty;
  });

  useEffect(() => {
    setPage(1);
  }, [query, selectedSubject, selectedDifficulty]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            Explore Books
          </h1>
          <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            {allBooks.length} books catalogued · {filtered.length} matching
          </p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <div className={`flex-shrink-0 w-64 hidden lg:block`}>
            <BookFilters
              subjects={subjects}
              selectedSubject={selectedSubject}
              selectedDifficulty={selectedDifficulty}
              onSubjectChange={setSelectedSubject}
              onDifficultyChange={setSelectedDifficulty}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors ${
                  isDark ? 'border-[#2A2A2A] text-[#A3A3A3]' : 'border-gray-200 text-[#666666]'
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
              {showFilters && (
                <div className="mt-3">
                  <BookFilters
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    selectedDifficulty={selectedDifficulty}
                    onSubjectChange={setSelectedSubject}
                    onDifficultyChange={setSelectedDifficulty}
                  />
                </div>
              )}
            </div>

            <BookGrid
              books={filtered}
              page={page}
              onPageChange={setPage}
              pageSize={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
