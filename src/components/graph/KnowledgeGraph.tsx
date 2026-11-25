import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { graphData } from '../../data/graphData';
import { X, Info } from 'lucide-react';

interface NodeObject {
  id: string;
  label: string;
  type: 'book' | 'subject' | 'topic';
  color?: string;
  size?: number;
  x?: number;
  y?: number;
}

const KnowledgeGraph: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [ForceGraph, setForceGraph] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('react-force-graph-2d').then(mod => {
      setForceGraph(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const filteredData = {
    nodes: filterType === 'All'
      ? graphData.nodes
      : graphData.nodes.filter(n => n.type === filterType.toLowerCase()),
    links: filterType === 'All'
      ? graphData.links
      : graphData.links.filter(l => {
          const sourceId = typeof l.source === 'object' ? (l.source as NodeObject).id : l.source;
          const targetId = typeof l.target === 'object' ? (l.target as NodeObject).id : l.target;
          return graphData.nodes
            .filter(n => n.type === filterType.toLowerCase())
            .some(n => n.id === sourceId || n.id === targetId);
        }),
  };

  const handleNodeClick = useCallback((node: NodeObject) => {
    setSelectedNode(node);
  }, []);

  const nodeCanvasObject = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label || '';
    const fontSize = Math.max(10 / globalScale, 2);
    const size = node.size || 6;
    const color = node.color || '#DC2626';

    ctx.beginPath();
    if (node.type === 'book') {
      ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    } else if (node.type === 'subject') {
      const s = size * 1.5;
      ctx.rect((node.x || 0) - s, (node.y || 0) - s * 0.7, s * 2, s * 1.4);
    } else {
      // diamond
      const d = size * 1.2;
      ctx.moveTo(node.x || 0, (node.y || 0) - d);
      ctx.lineTo((node.x || 0) + d, node.y || 0);
      ctx.lineTo(node.x || 0, (node.y || 0) + d);
      ctx.lineTo((node.x || 0) - d, node.y || 0);
      ctx.closePath();
    }
    ctx.fillStyle = color;
    ctx.fill();

    // Label
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = isDark ? '#F5F5F5' : '#171717';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, node.x || 0, (node.y || 0) + size + fontSize + 2);
  }, [isDark]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Controls */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
        {['All', 'Book', 'Subject', 'Topic'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              filterType === t
                ? 'bg-[#DC2626] border-[#DC2626] text-white'
                : isDark
                ? 'bg-[#151515] border-[#2A2A2A] text-[#A3A3A3] hover:border-[#DC2626]'
                : 'bg-white border-gray-200 text-[#666666] hover:border-[#DC2626]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className={`absolute top-3 right-3 z-10 p-3 rounded-xl border text-xs ${
        isDark ? 'bg-[#111111] border-[#2A2A2A] text-[#A3A3A3]' : 'bg-white border-gray-200 text-[#666666]'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block"></span> Books
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-2 bg-[#2563EB] inline-block"></span> Subjects
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block" style={{ background: '#10B981', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></span> Topics
        </div>
      </div>

      {/* Graph */}
      {ForceGraph && (
        <ForceGraph
          graphData={filteredData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor={isDark ? '#080808' : '#F7F7F8'}
          nodeCanvasObject={nodeCanvasObject}
          nodeCanvasObjectMode={() => 'replace'}
          onNodeClick={handleNodeClick}
          linkColor={() => isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          linkWidth={1}
          nodeId="id"
          linkSource="source"
          linkTarget="target"
          cooldownTicks={100}
        />
      )}

      {/* Selected node panel */}
      {selectedNode && (
        <div className={`absolute bottom-4 left-4 max-w-xs w-full rounded-xl border p-4 ${
          isDark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-[#DC2626]" />
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
                {selectedNode.type}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className={`${isDark ? 'text-[#A3A3A3] hover:text-[#F5F5F5]' : 'text-[#666666] hover:text-[#171717]'}`}
            >
              <X size={14} />
            </button>
          </div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
            {selectedNode.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
