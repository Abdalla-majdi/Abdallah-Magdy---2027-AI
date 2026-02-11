
import React from 'react';
import { AnalysisResult, EvaluationStatus } from '../types';
import EvaluationBadge from './EvaluationBadge';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Executive Reasoning Summary</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">{result.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Data Confidence</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-indigo-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{ width: `${result.overallConfidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-indigo-700">{Math.round(result.overallConfidence * 100)}%</span>
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-emerald-900 mb-1 uppercase tracking-wider">Strategic Recommendation</h3>
              <p className="text-sm text-emerald-800 font-medium">{result.keyDecisionRecommendation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-xl font-bold text-gray-900 px-1">Assumption Breakdown</h2>
        {result.evaluations.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="mb-2">
                <EvaluationBadge status={item.status} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">"{item.assumption}"</h3>
              <p className="text-sm text-gray-600 italic">
                {item.reasoning}
              </p>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase mb-2">Supporting Facts</h4>
                {item.supportingFacts.length > 0 ? (
                  <ul className="space-y-1">
                    {item.supportingFacts.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-400 italic">None identified</span>
                )}
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-red-700 uppercase mb-2">Conflicts</h4>
                {item.conflictingFacts.length > 0 ? (
                  <ul className="space-y-1">
                    {item.conflictingFacts.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">✕</span> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-400 italic">None identified</span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">Missing Info</h4>
                {item.missingDataPoints.length > 0 ? (
                  <ul className="space-y-1">
                    {item.missingDataPoints.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-indigo-400 mt-0.5">?</span> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-400 italic">Data seems complete</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisView;
