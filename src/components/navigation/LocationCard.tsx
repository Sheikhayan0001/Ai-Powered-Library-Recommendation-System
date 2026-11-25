import React from 'react';
import { Book } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { MapPin, Navigation } from 'lucide-react';

interface LocationCardProps {
  book: Book;
}

const LocationCard: React.FC<LocationCardProps> = ({ book }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const steps = [
    `Enter the LPU Library main entrance`,
    book.location.floor === 1
      ? `Stay on Floor 1 — ground level`
      : `Take the stairs or elevator to Floor ${book.location.floor}`,
    `Navigate to the ${book.location.section} section`,
    `Find Aisle ${book.location.aisle}`,
    `Look for Shelf ${book.location.shelf}`,
    `Locate Rack ${book.location.rack}, Bay ${book.location.bay}`,
    `Your book should be right there!`,
  ];

  return (
    <div className={`rounded-xl border p-5 ${isDark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-[#DC2626]" />
        <h3 className={`text-sm font-semibold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>
          Physical Location
        </h3>
        <span className="text-xs font-medium text-[#DC2626]">(DEMO DATA)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Building', value: 'Main Library' },
          { label: 'Floor', value: `Floor ${book.location.floor}` },
          { label: 'Section', value: book.location.section },
          { label: 'Aisle', value: book.location.aisle },
          { label: 'Shelf', value: book.location.shelf },
          { label: 'Rack / Bay', value: `${book.location.rack} / ${book.location.bay}` },
        ].map(({ label, value }) => (
          <div key={label} className={`p-2.5 rounded-lg text-sm ${isDark ? 'bg-[#0D0D0D]' : 'bg-gray-50'}`}>
            <span className={`block text-xs ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>{label}</span>
            <span className={`font-semibold ${isDark ? 'text-[#F5F5F5]' : 'text-[#171717]'}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Step-by-step directions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Navigation size={14} className="text-[#DC2626]" />
          <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}`}>
            Step-by-Step Directions
          </h4>
        </div>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#DC2626] text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className={isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default LocationCard;
