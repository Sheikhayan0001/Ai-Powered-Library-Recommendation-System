import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { useTheme } from '../../contexts/ThemeContext';
import BookCard from '../ui/BookCard';

const RecommendationSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const beginnerBooks = books.filter(b => b.difficulty === 'Beginner').slice(0, 3);
  const advancedBooks = books.filter(b => b.difficulty === 'Advanced').slice(0, 3);

  return (
    <section className={`py-16 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recommended for You */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                Recommended for You
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Start your journey — Beginner friendly books
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beginnerBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                Advanced Reading
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Deep dive into complex topics
              </p>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="text-sm text-[#DC2626] hover:text-[#EF4444] font-medium transition-colors"
            >
              See All Advanced →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendationSection;
