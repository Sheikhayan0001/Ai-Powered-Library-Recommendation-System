import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Check, X, Sparkles } from 'lucide-react';

const approaches = [
  {
    name: 'Keyword Search',
    description: 'Traditional exact-match and BM25 search',
    semanticUnderstanding: false,
    contextAware: false,
    groundedAnswers: false,
    realtime: true,
    complexity: 'Low',
    accuracy: 'Medium',
    scalability: 'High',
    activeBadge: null,
  },
  {
    name: 'Vector Search',
    description: 'Embedding-based semantic similarity search',
    semanticUnderstanding: true,
    contextAware: false,
    groundedAnswers: false,
    realtime: true,
    complexity: 'Medium',
    accuracy: 'High',
    scalability: 'High',
    activeBadge: null,
  },
  {
    name: 'RAG (Retrieval-Augmented Generation)',
    description: 'Combines catalogue knowledge retrieval with Google Gemini 1.5 Flash generation',
    semanticUnderstanding: true,
    contextAware: true,
    groundedAnswers: true,
    realtime: true,
    complexity: 'High',
    accuracy: 'Very High',
    scalability: 'High',
    activeBadge: 'Active in AI Librarian (Google Gemini)',
  },
  {
    name: 'Rule-Based QA',
    description: 'Hand-crafted deterministic fallback rules & catalog queries',
    semanticUnderstanding: false,
    contextAware: false,
    groundedAnswers: true,
    realtime: true,
    complexity: 'Low',
    accuracy: 'Medium',
    scalability: 'Medium',
    activeBadge: null,
  },
  {
    name: 'Fine-tuned LLM',
    description: 'Domain-specific fine-tuned language model',
    semanticUnderstanding: true,
    contextAware: true,
    groundedAnswers: false,
    realtime: false,
    complexity: 'Very High',
    accuracy: 'High',
    scalability: 'Medium',
    activeBadge: null,
  },
  {
    name: 'Knowledge Graph QA',
    description: 'Graph-based reasoning over structured knowledge (Active on Knowledge Graph page)',
    semanticUnderstanding: false,
    contextAware: true,
    groundedAnswers: true,
    realtime: true,
    complexity: 'High',
    accuracy: 'High',
    scalability: 'Medium',
    activeBadge: 'Active in Knowledge Graph',
  },
  {
    name: 'Hybrid RAG + Graph',
    description: 'Combines vector retrieval, Gemini generation, and graph relations',
    semanticUnderstanding: true,
    contextAware: true,
    groundedAnswers: true,
    realtime: true,
    complexity: 'High',
    accuracy: 'Very High',
    scalability: 'High',
    activeBadge: null,
  },
];

const BoolCell: React.FC<{ value: boolean }> = ({ value }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${value ? 'bg-[#059669]/20 text-[#059669]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
    {value ? <Check size={12} /> : <X size={12} />}
  </span>
);

const ComparisonTable: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: isDark ? '#2A2A2A' : '#E5E7EB' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className={isDark ? 'bg-[#111111]' : 'bg-gray-50'}>
              <th className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Approach
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Semantic
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Context
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Grounded
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Realtime
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Complexity
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Accuracy
              </th>
              <th className={`text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                Scalability
              </th>
            </tr>
          </thead>
          <tbody>
            {approaches.map((approach) => (
              <tr
                key={approach.name}
                className={`border-t ${isDark ? 'border-[#2A2A2A]' : 'border-gray-100'} ${
                  approach.activeBadge ? (isDark ? 'bg-[#151515]' : 'bg-green-50/40') : ''
                }`}
              >
                <td className={`px-4 py-3 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {approach.name}
                    {approach.activeBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-semibold border border-green-500/20 flex items-center gap-1">
                        <Sparkles size={10} /> Active
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                    {approach.description}
                  </div>
                </td>
                <td className="px-3 py-3 text-center"><BoolCell value={approach.semanticUnderstanding} /></td>
                <td className="px-3 py-3 text-center"><BoolCell value={approach.contextAware} /></td>
                <td className="px-3 py-3 text-center"><BoolCell value={approach.groundedAnswers} /></td>
                <td className="px-3 py-3 text-center"><BoolCell value={approach.realtime} /></td>
                <td className={`px-3 py-3 text-center text-xs font-medium ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  {approach.complexity}
                </td>
                <td className={`px-3 py-3 text-center text-xs font-medium ${
                  approach.accuracy === 'Very High'
                    ? 'text-[#059669]'
                    : approach.accuracy === 'High'
                    ? 'text-[#D97706]'
                    : isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'
                }`}>
                  {approach.accuracy}
                </td>
                <td className={`px-3 py-3 text-center text-xs font-medium ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                  {approach.scalability}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
