import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Always show first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded hover:bg-gray-200"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? 'bg-red-600 text-white' : 'hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded hover:bg-gray-200"
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center mr-2 px-3 py-1 rounded ${
          currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'
        }`}
      >
        <ChevronLeft size={18} />
        Prev
      </button>
      
      <div className="flex items-center">
        {renderPageNumbers()}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center ml-2 px-3 py-1 rounded ${
          currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'
        }`}
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;