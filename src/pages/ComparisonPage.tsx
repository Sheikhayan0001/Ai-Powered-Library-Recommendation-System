import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import { BarChart2, CheckCircle2 } from 'lucide-react';

const explanations = [
  { name: 'Keyword Search', desc: 'Exact match and BM25 algorithms. Fast and reliable for known terms, but misses semantic meaning.' },
  { name: 'Vector Search', desc: 'Encodes text as vectors; finds semantically similar content. Requires embedding model and vector index.' },
  { name: 'RAG (Google Gemini)', desc: 'Retrieves relevant document chunks from library catalog, then uses Google Gemini 1.5 Flash to generate grounded, accurate answers with citations. Active in AI Librarian.' },
  { name: 'Rule-Based QA', desc: 'Hand-crafted deterministic templates. Transparent fallback for catalog queries and book locations.' },
  { name: 'Fine-tuned LLM', desc: 'Domain-adapted language model. High quality but requires expensive training and frequent fine-tuning.' },
  { name: 'Knowledge Graph QA', desc: 'Traverses structured relationships across books, subjects, and topics. Active on the Knowledge Graph page.' },
  { name: 'Hybrid RAG + Graph', desc: 'Combines retrieval, generative synthesis, and relational graph reasoning for maximum accuracy.' },
];

const ComparisonPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start gap-3">
          <div className="w-10 h-10 bg-[#DC2626] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-[#DC2626]/20">
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
              AI Approach Comparison
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
              Benchmark evaluating 7 AI information retrieval architectures in intelligent library systems
            </p>
          </div>
        </div>

        {/* Active System Status */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border mb-8 ${
          isDark ? 'bg-[#151515] border-[#2A2A2A] text-[#A3A3A3]' : 'bg-green-50/60 border-green-200 text-gray-700'
        }`}>
          <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <strong className={isDark ? 'text-white' : 'text-black'}>Active Production Implementation: </strong>
            Our AI Librarian uses <strong className="text-[#DC2626]">RAG (Retrieval-Augmented Generation)</strong> powered by Google Gemini and local vector metadata chunks to provide fully factual answers, prerequisite paths, and shelf locations with verified source citations.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mb-10">
          <ComparisonTable />
        </div>

        {/* Explanation cards */}
        <h2 className={`text-xl font-bold mb-5 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
          Approach Explanations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {explanations.map(exp => (
            <div
              key={exp.name}
              className={`rounded-xl border p-4 ${isDark ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-gray-200'}`}
            >
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                {exp.name}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
