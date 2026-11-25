import React from 'react';
import { Book } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface FloorMapProps {
  book: Book;
}

const FloorMap: React.FC<FloorMapProps> = ({ book }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { floor, aisle, section } = book.location;

  // Simple 2D SVG floor plan
  const sections = floor === 2
    ? [
        { id: 'CS', label: 'Computer Science', x: 20, y: 20, w: 220, h: 120, aisles: ['A3', 'A4'] },
        { id: 'EE', label: 'Electrical Eng.', x: 260, y: 20, w: 150, h: 120, aisles: ['A5', 'A6'] },
        { id: 'READING', label: 'Reading Area', x: 20, y: 160, w: 390, h: 60, aisles: [] },
      ]
    : [
        { id: 'CS', label: 'Computer Science', x: 20, y: 20, w: 180, h: 120, aisles: ['B1', 'B2', 'B3', 'B4'] },
        { id: 'MATH', label: 'Mathematics', x: 220, y: 20, w: 140, h: 120, aisles: ['D1', 'D2'] },
        { id: 'NET', label: 'Networks', x: 380, y: 20, w: 100, h: 120, aisles: ['C1', 'C2'] },
        { id: 'READING', label: 'Reading Area', x: 20, y: 160, w: 460, h: 60, aisles: [] },
      ];

  const bgColor = isDark ? '#0D0D0D' : '#F7F7F8';
  const sectionFill = isDark ? '#151515' : '#FFFFFF';
  const sectionStroke = isDark ? '#2A2A2A' : '#E5E7EB';
  const textColor = isDark ? '#A3A3A3' : '#666666';
  const highlightFill = 'rgba(220,38,38,0.15)';
  const highlightStroke = '#DC2626';

  return (
    <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
        Floor {floor} — 2D Map{' '}
        <span className="text-xs text-[#DC2626] font-normal">(DEMO DATA)</span>
      </h3>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 500 240"
          width="100%"
          style={{ background: bgColor, borderRadius: 12, border: `1px solid ${sectionStroke}` }}
        >
          {/* Entrance */}
          <text x="230" y="225" textAnchor="middle" fontSize="10" fill={textColor}>
            ← ENTRANCE
          </text>

          {sections.map(sec => {
            const isHighlighted = sec.aisles.includes(aisle) || sec.id === 'CS' && section === 'Computer Science' && sec.aisles.includes(aisle);
            const highlighted = isHighlighted && sec.aisles.includes(aisle);
            return (
              <g key={sec.id}>
                <rect
                  x={sec.x}
                  y={sec.y}
                  width={sec.w}
                  height={sec.h}
                  fill={highlighted ? highlightFill : sectionFill}
                  stroke={highlighted ? highlightStroke : sectionStroke}
                  strokeWidth={highlighted ? 2 : 1}
                  rx={6}
                />
                <text
                  x={sec.x + sec.w / 2}
                  y={sec.y + 18}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={highlighted ? '#DC2626' : textColor}
                >
                  {sec.label}
                </text>
                {/* Aisle labels */}
                {sec.aisles.map((a, ai) => {
                  const ax = sec.x + 20 + (ai * (sec.w - 40)) / Math.max(sec.aisles.length - 1, 1);
                  return (
                    <g key={a}>
                      <rect
                        x={ax - 12}
                        y={sec.y + 30}
                        width={24}
                        height={sec.h - 40}
                        fill={a === aisle ? '#DC2626' : isDark ? '#1A1A1A' : '#F3F4F6'}
                        stroke={a === aisle ? '#EF4444' : sectionStroke}
                        strokeWidth={1}
                        rx={3}
                      />
                      <text
                        x={ax}
                        y={sec.y + sec.h / 2 + 5}
                        textAnchor="middle"
                        fontSize="8"
                        fill={a === aisle ? '#FFFFFF' : textColor}
                        fontWeight={a === aisle ? '700' : '400'}
                      >
                        {a}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Legend */}
          <rect x="20" y="195" width="12" height="12" fill="#DC2626" rx="2" />
          <text x="36" y="205" fontSize="8" fill={textColor}>Your Book</text>
        </svg>
      </div>
      <p className={`text-xs mt-2 ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
        Red-highlighted aisle: <strong className="text-[#DC2626]">{aisle}</strong> in {section}
      </p>
    </div>
  );
};

export default FloorMap;
