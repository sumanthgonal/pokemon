import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import TeamSlot from '../components/TeamSlot';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonList, fetchPokemonDetails } from '../services/pokemonService';
import { typeColors } from '../utils/typeColors';

const TeamBuilder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [team, setTeam] = useState<(Pokemon | null)[]>([null, null, null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('My Pokémon Team');
  const [savedTeams, setSavedTeams] = useState<{ name: string; team: (Pokemon | null)[] }[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch first 151 Pokemon (Gen 1)
        const data = await fetchPokemonList(151, 0);
        setPokemonList(data.results);
        
        // Check if we need to add a Pokemon to the team from URL params
        const addPokemonId = searchParams.get('add');
        if (addPokemonId) {
          const pokemonToAdd = await fetchPokemonDetails(addPokemonId);
          
          // Find first empty slot
          const emptySlotIndex = team.findIndex(slot => slot === null);
          if (emptySlotIndex !== -1) {
            const newTeam = [...team];
            newTeam[emptySlotIndex] = pokemonToAdd;
            setTeam(newTeam);
          }
        }
        
        // Load saved teams from localStorage
        const savedTeamsData = localStorage.getItem('pokemonTeams');
        if (savedTeamsData) {
          setSavedTeams(JSON.parse(savedTeamsData));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data. Please try again later.');
        setLoading(false);
        console.error('Error fetching Pokémon:', err);
      }
    };
    
    fetchPokemon();
  }, [searchParams]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, pokemon: Pokemon) => {
    e.dataTransfer.setData('pokemon', JSON.stringify(pokemon));
  };

  const handleDrop = (pokemon: Pokemon, slotIndex: number) => {
    const newTeam = [...team];
    newTeam[slotIndex] = pokemon;
    setTeam(newTeam);
  };

  const handleRemoveFromTeam = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const saveTeam = () => {
    if (team.every(slot => slot === null)) {
      alert('Cannot save an empty team!');
      return;
    }
    
    const newSavedTeams = [...savedTeams, { name: teamName, team: [...team] }];
    setSavedTeams(newSavedTeams);
    
    // Save to localStorage
    localStorage.setItem('pokemonTeams', JSON.stringify(newSavedTeams));
    
    alert(`Team "${teamName}" saved successfully!`);
  };

  const loadTeam = (index: number) => {
    setTeam([...savedTeams[index].team]);
    setTeamName(savedTeams[index].name);
  };

  const deleteTeam = (index: number) => {
    const newSavedTeams = [...savedTeams];
    newSavedTeams.splice(index, 1);
    setSavedTeams(newSavedTeams);
    
    // Update localStorage
    localStorage.setItem('pokemonTeams', JSON.stringify(newSavedTeams));
  };

  const calculateTeamStats = () => {
    // Count types in the team
    const typeCount: Record<string, number> = {};
    team.forEach(pokemon => {
      if (pokemon && pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;
          typeCount[typeName] = (typeCount[typeName] || 0) + 1;
        });
      }
    });
    
    return typeCount;
  };

  const typeCount = calculateTeamStats();

  if (loading) {
    return <LoadingSpinner message="Loading Pokémon data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="text-xl font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 focus:outline-none"
              />
              <button
                onClick={saveTeam}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              >
                Save Team
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {team.map((pokemon, index) => (
                <TeamSlot
                  key={index}
                  pokemon={pokemon}
                  index={index}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFromTeam}
                />
              ))}
            </div>
            
            {/* Team Analysis */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Team Analysis</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Type Distribution:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeCount).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <span 
                        className={`${typeColors[type] || 'bg-gray-400'} text-white text-xs px-2 py-1 rounded-full mr-1`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                      <span className="text-sm">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Team Status:</h4>
                <p className="text-sm">
                  {team.filter(p => p !== null).length} of 6 Pokémon selected
                </p>
              </div>
            </div>
          </div>
          
          {/* Saved Teams */}
          {savedTeams.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-3">Saved Teams</h3>
              <div className="space-y-3">
                {savedTeams.map((savedTeam, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-medium">{savedTeam.name}</span>
                    <div>
                      <button
                        onClick={() => loadTeam(index)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteTeam(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Available Pokémon</h3>
            <p className="text-sm text-gray-600 mb-4">Drag Pokémon to add them to your team</p>
            
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-2">
              {pokemonList.map((pokemon) => (
                <PokemonCard 
                  key={pokemon.id} 
                  pokemon={pokemon} 
                  isDraggable={true}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;