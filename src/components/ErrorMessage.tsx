import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex flex-col items-center">
      <div className="flex items-center mb-2">
        <AlertTriangle className="mr-2" />
        <p>{message}</p>
      </div>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;