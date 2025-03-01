import React from 'react';
import { typeColors } from '../utils/typeColors';
import { typeEffectivenessChart } from '../utils/typeEffectiveness';

interface TypeEffectivenessProps {
  types: string[];
}

const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({ types }) => {
  const calculateEffectiveness = () => {
    const effectiveness: Record<string, number> = {};
    
    // Initialize all types with 1x effectiveness
    Object.keys(typeEffectivenessChart).forEach(type => {
      effectiveness[type] = 1;
    });
    
    // Calculate effectiveness based on each of the Pokémon's types
    types.forEach(defenderType => {
      Object.entries(typeEffectivenessChart).forEach(([attackerType, relations]) => {
        const multiplier = relations[defenderType] || 1;
        effectiveness[attackerType] *= multiplier;
      });
    });
    
    return effectiveness;
  };
  
  const effectiveness = calculateEffectiveness();
  
  const renderEffectivenessSection = (title: string, multiplier: number) => {
    const typesWithMultiplier = Object.entries(effectiveness)
      .filter(([_, value]) => value === multiplier)
      .map(([type]) => type);
    
    if (typesWithMultiplier.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {typesWithMultiplier.map(type => (
            <span 
              key={type} 
              className={`${typeColors[type] || 'bg-gray-400'} text-white text-xs px-2 py-1 rounded-full`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Type Effectiveness</h2>
      
      {renderEffectivenessSection('4× Damage From', 4)}
      {renderEffectivenessSection('2× Damage From', 2)}
      {renderEffectivenessSection('1× Damage From', 1)}
      {renderEffectivenessSection('½× Damage From', 0.5)}
      {renderEffectivenessSection('¼× Damage From', 0.25)}
      {renderEffectivenessSection('0× Damage From', 0)}
    </div>
  );
};

export default TypeEffectiveness;