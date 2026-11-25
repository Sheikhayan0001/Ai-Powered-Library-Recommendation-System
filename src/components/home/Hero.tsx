import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(220,38,38,0.08) 0%, transparent 60%), #080808',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: '#DC2626' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[#DC2626] mb-6 px-3 py-1 border border-[#DC2626]/30 rounded-full">
            Lovely Professional University
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-[#F5F5F5]"
        >
          LPU{' '}
          <span className="text-[#DC2626]">LIBRARY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-xl sm:text-2xl font-light text-[#A3A3A3] mb-4 tracking-wide"
        >
          Where Knowledge Comes Alive
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="text-sm text-[#666666] mb-10 max-w-xl mx-auto leading-relaxed"
        >
          An intelligent library management platform with AI-powered search, knowledge graph
          exploration, and physical navigation assistance.
        </motion.p>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          onSubmit={handleSearch}
          className="relative max-w-xl mx-auto mb-10"
        >
          <div className="flex items-center bg-[#151515] border border-[#2A2A2A] rounded-xl focus-within:border-[#DC2626] transition-colors">
            <Search size={18} className="ml-4 text-[#A3A3A3] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, subjects, topics..."
              className="flex-1 px-4 py-4 bg-transparent text-[#F5F5F5] placeholder-[#A3A3A3] text-sm outline-none"
            />
            <button
              type="submit"
              className="m-1.5 px-4 py-2.5 bg-[#DC2626] hover:bg-[#EF4444] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DC2626] hover:bg-[#EF4444] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Explore Books
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/librarian')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-[#2A2A2A] hover:border-[#DC2626] text-[#A3A3A3] hover:text-[#F5F5F5] rounded-xl text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} />
            Meet Your AI Librarian
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
          className="mt-16 flex flex-wrap justify-center gap-10"
        >
          {[
            { label: 'Books Catalogued', value: '15+' },
            { label: 'Subjects', value: '12' },
            { label: 'AI Features', value: '5' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-[#DC2626]">{value}</div>
              <div className="text-xs text-[#666666] mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
