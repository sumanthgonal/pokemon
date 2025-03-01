import React from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { typeColors } from '../utils/typeColors';

interface PokemonCardProps {
  pokemon: Pokemon;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, pokemon: Pokemon) => void;
  onRemove?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  isDraggable = false,
  onDragStart,
  onRemove
}) => {
  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDraggable && onDragStart) {
      onDragStart(e, pokemon);
    }
  };

  const cardContent = (
    <div className="p-4 flex flex-col items-center">
      <img 
        src={pokemon.sprites?.other['official-artwork'].front_default || pokemon.sprites?.front_default} 
        alt={pokemon.name}
        className="w-32 h-32 object-contain"
      />
      <p className="text-gray-500 text-sm">{formatPokemonId(pokemon.id)}</p>
      <h2 className="text-xl font-semibold mt-2">{capitalizeFirstLetter(pokemon.name)}</h2>
      
      <div className="flex mt-2 gap-2">
        {pokemon.types?.map((typeInfo, index) => (
          <span 
            key={index} 
            className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white text-xs px-2 py-1 rounded-full`}
          >
            {capitalizeFirstLetter(typeInfo.type.name)}
          </span>
        ))}
      </div>

      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Remove
        </button>
      )}
    </div>
  );

  if (isDraggable) {
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden pokemon-card-transition cursor-grab"
        draggable={true}
        onDragStart={handleDragStart}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      to={`/pokemon/${pokemon.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden pokemon-card-transition"
    >
      {cardContent}
    </Link>
  );
};

export default PokemonCard;