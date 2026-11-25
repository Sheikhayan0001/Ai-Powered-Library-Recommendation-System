import React, { useState } from 'react';
import { books as allBooks } from '../data/books';
import { subjects as allSubjects } from '../data/subjects';
import { useTheme } from '../contexts/ThemeContext';
import BookCard from '../components/ui/BookCard';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const SubjectsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const subjectBookCounts: Record<string, number> = {};
  allBooks.forEach(b => {
    subjectBookCounts[b.subject] = (subjectBookCounts[b.subject] || 0) + 1;
  });

  const filteredBooks = activeSubject
    ? allBooks.filter(b => b.subject === activeSubject)
    : [];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          {activeSubject && (
            <button
              onClick={() => setActiveSubject(null)}
              className={`p-2 rounded-lg border transition-colors ${
                isDark ? 'border-[#2A2A2A] text-[#A3A3A3] hover:text-[#F5F5F5]' : 'border-gray-200 text-[#666666]'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              {activeSubject || 'Subjects'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              {activeSubject
                ? `${filteredBooks.length} books in ${activeSubject}`
                : `${allSubjects.length} subject areas`}
            </p>
          </div>
        </div>

        {!activeSubject ? (
          /* Subject grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allSubjects.map((subject, i) => {
              const count = subjectBookCounts[subject.name] || 0;
              return (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveSubject(subject.name)}
                  className={`group text-left rounded-xl border p-4 transition-all hover:border-[#DC2626]/50 hover:-translate-y-0.5 ${
                    isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="text-2xl mb-2">{subject.icon}</div>
                  <h3 className={`text-sm font-semibold mb-1 leading-tight ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                    {subject.name}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                    {count} {count === 1 ? 'book' : 'books'}
                  </p>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Books for selected subject */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
            {filteredBooks.length === 0 && (
              <p className={`text-sm col-span-full text-center py-10 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                No books found for this subject.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
