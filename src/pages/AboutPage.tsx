import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Compass, Brain, Layers, GitBranch, MapPin, Cpu, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pillars = [
    {
      icon: Layers,
      title: 'Knowledge Representation',
      desc: 'Structured modeling of books, prerequisite relationships, foundational subjects, and specific academic topics organized into an interactive knowledge network.'
    },
    {
      icon: Compass,
      title: 'Intelligent Discovery & Search',
      desc: 'Multi-attribute search engine indexing titles, authors, categories, ISBNs, and thematic topics with progressive filtering and instant responsive feedback.'
    },
    {
      icon: Brain,
      title: 'Catalogue-Based AI Librarian',
      desc: 'Context-aware library assistant providing factual, grounded book guidance, prerequisite mapping, difficulty-ranked learning paths, and shelf locations without hallucination.'
    },
    {
      icon: MapPin,
      title: 'Physical Library Indoor Navigation',
      desc: 'Precision indoor mapping and 2D floor plans highlighting building, floor, section, aisle, shelf, rack, and bay coordinates with step-by-step turn directions.'
    },
    {
      icon: Cpu,
      title: 'Comparative AI Architecture',
      desc: 'Analytical benchmark comparing 7 information retrieval paradigms ranging from classical BM25 to Graph QA, Vector Similarity, and modern RAG pipelines.'
    },
    {
      icon: GitBranch,
      title: 'Modular Codex RAG Integration Point',
      desc: 'Designed with clean architecture separating catalogue data and external RAG endpoints, maintaining full compatibility with the separately integrated Codex assistant.'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10 text-[#DC2626] text-xs font-semibold mb-4">
            <BookOpen size={14} />
            Academic Platform Architecture
          </div>
          <h1 className={`text-4xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            About LPU LIBRARY
          </h1>
          <p className="text-xl font-medium text-[#DC2626] mb-4">
            Where Knowledge Comes Alive
          </p>
          <p className={`text-base leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            LPU Library is an advanced digital discovery and intelligent catalog management platform engineered to connect students with physical and conceptual academic resources through modern interactive knowledge representations.
          </p>
        </div>

        {/* Vision Statement */}
        <div className={`rounded-2xl border p-8 mb-16 ${
          isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                The Intelligent Academic Library
              </h2>
              <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Traditional university catalogues function as static relational databases with basic keyword filters. LPU Library reimagines the academic resource experience by modeling the semantic connections between foundational textbooks, subject domains, and student learning paths.
              </p>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                From interactive knowledge graph exploration and catalogue-grounded conversational librarianship to 2D shelf-level indoor wayfinding, our system bridges the physical library space with digital cognitive tools.
              </p>
            </div>
            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-[#0D0D0D] border-[#2A2A2A]' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                Core System Standards
              </h3>
              <ul className="space-y-3">
                {[
                  'Strict source grounding with zero fabricated inventory or ratings',
                  'Dark-first cinematic design system with crimson accent identity',
                  'Client-side state persistence with zero privacy-invasive tracking',
                  '2D Vector floor maps with verified shelf and aisle indexing schemas',
                  'Isolated RAG adapter interface (preserving external AI services)'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Architecture Pillars */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            Platform Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all hover:border-[#DC2626]/40 ${
                  isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626] mb-4">
                  <pillar.icon size={20} />
                </div>
                <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Callout */}
        <div className={`rounded-2xl border p-8 text-center ${
          isDark ? 'bg-gradient-to-b from-[#151515] to-[#0A0A0A] border-[#2A2A2A]' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            Ready to Explore Knowledge?
          </h3>
          <p className={`text-sm max-w-xl mx-auto mb-6 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            Discover our curated textbooks across Artificial Intelligence, Algorithms, Neural Networks, Database Systems, and Mathematics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="bg-[#DC2626] hover:bg-[#EF4444] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#DC2626]/20"
            >
              Browse Catalogue
            </Link>
            <Link
              to="/graph"
              className={`border text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors ${
                isDark ? 'border-[#2A2A2A] text-[#F5F5F5] hover:border-[#DC2626]' : 'border-gray-300 text-[#171717] hover:border-[#DC2626]'
              }`}
            >
              Open Knowledge Graph
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
