import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-16 w-16 border-4',
    large: 'h-24 w-24 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-red-600 border-b-red-600 border-r-transparent border-l-transparent`}></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;