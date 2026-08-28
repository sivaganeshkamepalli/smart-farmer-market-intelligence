import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestionButtons({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
      <span className="text-xs font-semibold text-gray-400 flex items-center space-x-1 mr-1">
        <Sparkles className="h-3.5 w-3.5 text-agri-600" />
        <span>Suggested follow-up questions:</span>
      </span>
      {suggestions.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(opt)}
          className="rounded-full bg-agri-50 hover:bg-agri-100 px-3 py-1 text-xs font-semibold text-agri-800 border border-agri-200/80 transition"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
