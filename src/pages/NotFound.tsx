import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
        alt="Psyduck" 
        className="w-48 h-48 mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Looks like this page doesn't exist.</p>
      <Link 
        to="/" 
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;