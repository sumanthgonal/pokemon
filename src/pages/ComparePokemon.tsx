import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import StatChart from '../components/StatChart';
import TypeEffectiveness from '../components/TypeEffectiveness';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonList, fetchPokemonDetails } from '../services/pokemonService';
import { typeColors } from '../utils/typeColors';

const ComparePokemon: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemonOptions, setPokemonOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState<Pokemon | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonOptions = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all Pokemon for the dropdown
        const data = await fetchPokemonList(1000, 0);
        const options = data.results.map((pokemon: any) => ({
          value: pokemon.id.toString(),
          label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        }));
        
        setPokemonOptions(options);
        
        // Check URL params for Pokemon to compare
        const pokemon1Id = searchParams.get('pokemon');
        const pokemon2Id = searchParams.get('compare');
        
        if (pokemon1Id) {
          const pokemon1Data = await fetchPokemonDetails(pokemon1Id);
          setSelectedPokemon1(pokemon1Data);
        }
        
        if (pokemon2Id) {
          const pokemon2Data = await fetchPokemonDetails(pokemon2Id);
          setSelectedPokemon2(pokemon2Data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data. Please try again later.');
        setLoading(false);
        console.error('Error fetching Pokémon:', err);
      }
    };
    
    fetchPokemonOptions();
  }, [searchParams]);

  const handlePokemon1Change = async (selected: any) => {
    if (!selected) {
      setSelectedPokemon1(null);
      updateSearchParams(null, selectedPokemon2?.id.toString());
      return;
    }
    
    try {
      setLoading(true);
      const pokemon = await fetchPokemonDetails(selected.value);
      setSelectedPokemon1(pokemon);
      updateSearchParams(selected.value, selectedPokemon2?.id.toString());
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Pokémon details.');
      setLoading(false);
    }
  };

  const handlePokemon2Change = async (selected: any) => {
    if (!selected) {
      setSelectedPokemon2(null);
      updateSearchParams(selectedPokemon1?.id.toString(), null);
      return;
    }
    
    try {
      setLoading(true);
      const pokemon = await fetchPokemonDetails(selected.value);
      setSelectedPokemon2(pokemon);
      updateSearchParams(selectedPokemon1?.id.toString(), selected.value);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Pokémon details.');
      setLoading(false);
    }
  };

  const updateSearchParams = (pokemon1Id: string | null, pokemon2Id: string | null) => {
    const params: any = {};
    if (pokemon1Id) params.pokemon = pokemon1Id;
    if (pokemon2Id) params.compare = pokemon2Id;
    setSearchParams(params);
  };

  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading && (!selectedPokemon1 && !selectedPokemon2)) {
    return <LoadingSpinner message="Loading Pokémon data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Compare Pokémon</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Pokémon</label>
            <Select
              options={pokemonOptions}
              value={selectedPokemon1 ? { 
                value: selectedPokemon1.id.toString(), 
                label: capitalizeFirstLetter(selectedPokemon1.name) 
              } : null}
              onChange={handlePokemon1Change}
              placeholder="Select a Pokémon..."
              isClearable
              className="mb-4"
            />
            
            {selectedPokemon1 && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={selectedPokemon1.sprites?.other['official-artwork'].front_default || selectedPokemon1.sprites?.front_default} 
                    alt={selectedPokemon1.name}
                    className="w-24 h-24 object-contain mr-4"
                  />
                  <div>
                    <p className="text-gray-500 text-sm">{formatPokemonId(selectedPokemon1.id)}</p>
                    <h2 className="text-xl font-semibold">{capitalizeFirstLetter(selectedPokemon1.name)}</h2>
                    <div className="flex mt-1 gap-1">
                      {selectedPokemon1.types?.map((typeInfo, index) => (
                        <span 
                          key={index} 
                          className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white text-xs px-2 py-0.5 rounded-full`}
                        >
                          {capitalizeFirstLetter(typeInfo.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Second Pokémon</label>
            <Select
              options={pokemonOptions}
              value={selectedPokemon2 ? { 
                value: selectedPokemon2.id.toString(), 
                label: capitalizeFirstLetter(selectedPokemon2.name) 
              } : null}
              onChange={handlePokemon2Change}
              placeholder="Select a Pokémon..."
              isClearable
              className="mb-4"
            />
            
            {selectedPokemon2 && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={selectedPokemon2.sprites?.other['official-artwork'].front_default || selectedPokemon2.sprites?.front_default} 
                    alt={selectedPokemon2.name}
                    className="w-24 h-24 object-contain mr-4"
                  />
                  <div>
                    <p className="text-gray-500 text-sm">{formatPokemonId(selectedPokemon2.id)}</p>
                    <h2 className="text-xl font-semibold">{capitalizeFirstLetter(selectedPokemon2.name)}</h2>
                    <div className="flex mt-1 gap-1">
                      {selectedPokemon2.types?.map((typeInfo, index) => (
                        <span 
                          key={index} 
                          className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white text-xs px-2 py-0.5 rounded-full`}
                        >
                          {capitalizeFirstLetter(typeInfo.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedPokemon1 && selectedPokemon2 && (
        <>
          {/* Stats Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Stats Comparison</h2>
            
            {selectedPokemon1.stats && selectedPokemon2.stats && (
              <StatChart 
                stats={selectedPokemon1.stats} 
                comparisonStats={selectedPokemon2.stats}
                pokemonName={capitalizeFirstLetter(selectedPokemon1.name)}
                comparisonName={capitalizeFirstLetter(selectedPokemon2.name)}
              />
            )}
          </div>
          
          {/* Type Effectiveness Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPokemon1.types && selectedPokemon1.types.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">{capitalizeFirstLetter(selectedPokemon1.name)} Type Effectiveness</h3>
                <TypeEffectiveness types={selectedPokemon1.types.map(t => t.type.name)} />
              </div>
            )}
            
            {selectedPokemon2.types && selectedPokemon2.types.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">{capitalizeFirstLetter(selectedPokemon2.name)} Type Effectiveness</h3>
                <TypeEffectiveness types={selectedPokemon2.types.map(t => t.type.name)} />
              </div>
            )}
          </div>
          
          {/* Physical Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-4">Physical Comparison</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">{capitalizeFirstLetter(selectedPokemon1.name)}</h3>
                <p>Height: {(selectedPokemon1.height || 0) / 10}m</p>
                <p>Weight: {(selectedPokemon1.weight || 0) / 10}kg</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{capitalizeFirstLetter(selectedPokemon2.name)}</h3>
                <p>Height: {(selectedPokemon2.height || 0) / 10}m</p>
                <p>Weight: {(selectedPokemon2.weight || 0) / 10}kg</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePokemon;