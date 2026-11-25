import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { useTheme } from '../../contexts/ThemeContext';
import BookCard from '../ui/BookCard';

const FeaturedBooks: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const featured = books.slice(0, 4);

  return (
    <section className={`py-16 ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              Featured Books
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Curated selections from the collection
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-sm text-[#DC2626] hover:text-[#EF4444] font-medium transition-colors"
          >
            View All →
          </button>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((book, i) => (
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
      </div>
    </section>
  );
};

export default FeaturedBooks;
