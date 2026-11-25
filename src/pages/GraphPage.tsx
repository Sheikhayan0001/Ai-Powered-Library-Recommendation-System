import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import KnowledgeGraph from '../components/graph/KnowledgeGraph';

const GraphPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#080808]' : 'bg-[#F7F7F8]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            Knowledge Graph
          </h1>
          <p className={`text-sm ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            Interactive visualization of books, subjects, and topics. Click nodes to inspect.
          </p>
        </div>
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}
          style={{ height: '70vh' }}>
          <KnowledgeGraph />
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
