
import React from 'react';
import { EvaluationStatus } from '../types';

interface EvaluationBadgeProps {
  status: EvaluationStatus;
}

const EvaluationBadge: React.FC<EvaluationBadgeProps> = ({ status }) => {
  const styles = {
    [EvaluationStatus.SUPPORTED]: "bg-green-100 text-green-800 border-green-200",
    [EvaluationStatus.REFUTED]: "bg-red-100 text-red-800 border-red-200",
    [EvaluationStatus.INSUFFICIENT_DATA]: "bg-gray-100 text-gray-800 border-gray-200",
    [EvaluationStatus.PARTIALLY_SUPPORTED]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default EvaluationBadge;
