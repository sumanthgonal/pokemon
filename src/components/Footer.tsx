import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>Pokémon data provided by <a href="https://pokeapi.co/" className="text-red-400 hover:underline">PokéAPI</a></p>
        <p className="text-sm mt-1">This is a fan project and is developed SUMANTH GONAL</p>
      </div>
    </footer>
  );
};

export default Footer;