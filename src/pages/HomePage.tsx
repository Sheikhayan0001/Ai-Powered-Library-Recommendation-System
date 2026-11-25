import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedBooks from '../components/home/FeaturedBooks';
import RecommendationSection from '../components/recommendations/RecommendationSection';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Network, MessageCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Network,
    title: 'Knowledge Graph',
    description: 'Visualize connections between books, subjects, and topics in an interactive force-directed graph.',
    path: '/graph',
  },
  {
    icon: MessageCircle,
    title: 'AI Librarian',
    description: 'A rule-based assistant to help you find books, locations, and reading paths. RAG integration point included.',
    path: '/librarian',
  },
  {
    icon: BarChart2,
    title: 'AI Comparison',
    description: 'Compare different AI approaches (RAG, vector search, fine-tuned LLMs) used in intelligent library systems.',
    path: '/comparison',
  },
];

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  return (
    <div className={isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}>
      <Hero />
      <FeaturedBooks />

      {/* Features section */}
      <section className={`py-16 ${isDark ? 'bg-[#060606]' : 'bg-[#F0F0F2]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              Platform Features
            </h2>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Intelligent tools to enhance your library experience
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(feature.path)}
                className={`group cursor-pointer rounded-xl border p-6 transition-all hover:border-[#DC2626]/50 ${
                  isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 bg-[#DC2626]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#DC2626]/20 transition-colors">
                  <feature.icon size={20} className="text-[#DC2626]" />
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RecommendationSection />
    </div>
  );
};

export default HomePage;
