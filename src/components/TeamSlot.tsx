import React from 'react';
import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface TeamSlotProps {
  pokemon: Pokemon | null;
  index: number;
  onDrop: (pokemon: Pokemon, index: number) => void;
  onRemove: (index: number) => void;
}

const TeamSlot: React.FC<TeamSlotProps> = ({ pokemon, index, onDrop, onRemove }) => {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const pokemonData = JSON.parse(e.dataTransfer.getData('pokemon'));
    onDrop(pokemonData, index);
  };

  return (
    <div 
      className={`team-slot rounded-lg ${pokemon ? 'filled' : 'border-2 border-dashed border-gray-300'} 
        ${isDraggingOver ? 'dragging-over' : ''} 
        h-72 flex items-center justify-center`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {pokemon ? (
        <PokemonCard 
          pokemon={pokemon} 
          onRemove={() => onRemove(index)} 
        />
      ) : (
        <p className="text-gray-500">Drop Pokémon here</p>
      )}
    </div>
  );
};

export default TeamSlot;