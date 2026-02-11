
import React from 'react';

interface AssumptionsInputProps {
  value: string;
  onChange: (val: string) => void;
  onSuggest: () => void;
  isSuggesting: boolean;
  hasData: boolean;
}

const AssumptionsInput: React.FC<AssumptionsInputProps> = ({ 
  value, 
  onChange, 
  onSuggest, 
  isSuggesting,
  hasData 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">
          Assumptions / Hypotheses
        </label>
        <button
          onClick={onSuggest}
          disabled={isSuggesting || !hasData}
          className={`
            text-xs font-medium flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all
            ${isSuggesting || !hasData 
              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 hover:border-purple-200 shadow-sm'}
          `}
        >
          {isSuggesting ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          {isSuggesting ? 'Suggesting...' : 'Suggest Smart Assumptions'}
        </button>
      </div>
      <textarea
        className="flex-1 w-full p-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter assumptions line by line or click 'Suggest' above...
Example:
- Sales in the North region are growing month-over-month.
- We have enough data to predict Q4 trends."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {!hasData && (
        <p className="mt-1.5 text-[10px] text-gray-400 italic">
          * Provide source data first to enable AI suggestions.
        </p>
      )}
    </div>
  );
};

export default AssumptionsInput;
