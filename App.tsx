
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { analyzeDataReasoning, suggestAssumptions } from './services/geminiService';
import DataInput from './components/DataInput';
import AssumptionsInput from './components/AssumptionsInput';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    data: '',
    assumptions: '',
    isAnalyzing: false,
    result: null,
    error: null
  });
  
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleAnalyze = async () => {
    if (!state.data.trim() || !state.assumptions.trim()) {
      setState(prev => ({ ...prev, error: "Please provide both data and assumptions to begin evaluation." }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));

    try {
      const result = await analyzeDataReasoning(state.data, state.assumptions);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isAnalyzing: false }));
    }
  };

  const handleSuggestAssumptions = async () => {
    if (!state.data.trim()) return;

    setIsSuggesting(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      const suggestions = await suggestAssumptions(state.data);
      const formattedSuggestions = suggestions.map(s => `- ${s}`).join('\n');
      
      setState(prev => ({
        ...prev,
        assumptions: prev.assumptions.trim() 
          ? `${prev.assumptions}\n${formattedSuggestions}`
          : formattedSuggestions
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "Could not generate suggestions: " + err.message }));
    } finally {
      setIsSuggesting(false);
    }
  };

  const clearSession = () => {
    setState({
      data: '',
      assumptions: '',
      isAnalyzing: false,
      result: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Data Reasoning Assistant</h1>
          </div>
          <button 
            onClick={clearSession}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear Session
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Instructions */}
        {!state.result && !state.isAnalyzing && !isFileLoading && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700">
            <p><strong>How to use:</strong> Upload a <strong>PDF, CSV, or Excel</strong> file, or paste your dataset directly. Then, list the assumptions you want to test. The assistant will evaluate them strictly against the evidence provided.</p>
          </div>
        )}

        {/* Input Section */}
        {!state.result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px] mb-8">
            <DataInput 
              value={state.data} 
              onChange={(val) => setState(prev => ({ ...prev, data: val, error: null }))} 
              onLoading={(loading) => setIsFileLoading(loading)}
            />
            <AssumptionsInput 
              value={state.assumptions} 
              onChange={(val) => setState(prev => ({ ...prev, assumptions: val, error: null }))} 
              onSuggest={handleSuggestAssumptions}
              isSuggesting={isSuggesting}
              hasData={state.data.trim().length > 0}
            />
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {state.error}
          </div>
        )}

        {/* Loading States */}
        {(state.isAnalyzing || isFileLoading) && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium animate-pulse">
              {isFileLoading ? "Extracting document contents..." : "Assistant is cross-referencing evidence..."}
            </p>
          </div>
        )}

        {/* Results View */}
        {state.result && !state.isAnalyzing && (
          <div className="space-y-6">
            <button 
              onClick={() => setState(prev => ({ ...prev, result: null }))}
              className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Inputs
            </button>
            <AnalysisView result={state.result} />
          </div>
        )}

        {/* Floating Action Button for Analysis */}
        {!state.result && !state.isAnalyzing && !isFileLoading && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4">
            <button
              onClick={handleAnalyze}
              disabled={!state.data || !state.assumptions || isSuggesting}
              className={`
                px-8 py-4 rounded-full shadow-xl flex items-center gap-3 text-lg font-bold transition-all transform hover:scale-105 active:scale-95
                ${!state.data || !state.assumptions || isSuggesting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              `}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Evaluate Assumptions
            </button>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2024 Data Reasoning Assistant. Powered by Gemini 3.</p>
          <div className="flex gap-6">
            <span>Critical Thinking Mode: Active</span>
            <span>Fact-Check Bias: Neutral</span>
            <span>Logic Engine: V2.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
