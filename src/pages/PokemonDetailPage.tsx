import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Zap, Activity, Dumbbell, Ruler } from 'lucide-react';
import StatChart from '../components/StatChart';
import TypeEffectiveness from '../components/TypeEffectiveness';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain } from '../services/pokemonService';
import { typeColors } from '../utils/typeColors';

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [description, setDescription] = useState<string>('');
  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'moves'>('info');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Fetch basic Pokemon data
        const pokemonData = await fetchPokemonDetails(id);
        setPokemon(pokemonData);
        
        // Fetch species data for description
        if (pokemonData.species?.url) {
          const speciesData = await fetchPokemonSpecies(pokemonData.species.url);
          
          // Get English description
          const englishDescription = speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === 'en'
          );
          
          if (englishDescription) {
            setDescription(englishDescription.flavor_text.replace(/\f/g, ' '));
          }
          
          // Fetch evolution chain
          if (speciesData.evolution_chain?.url) {
            const evolutionData = await fetchEvolutionChain(speciesData.evolution_chain.url);
            setEvolutionChain(evolutionData);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon details. Please try again later.');
        setLoading(false);
        console.error('Error fetching Pokémon details:', err);
      }
    };
    
    fetchData();
  }, [id]);

  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatHeight = (height?: number) => {
    if (!height) return 'Unknown';
    const meters = height / 10;
    const feet = Math.floor(meters * 3.281);
    const inches = Math.round((meters * 3.281 - feet) * 12);
    return `${meters.toFixed(1)}m (${feet}'${inches}")`;
  };

  const formatWeight = (weight?: number) => {
    if (!weight) return 'Unknown';
    const kg = weight / 10;
    const lbs = (kg * 2.205).toFixed(1);
    return `${kg.toFixed(1)}kg (${lbs}lbs)`;
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp':
        return <Heart size={18} />;
      case 'attack':
        return <Dumbbell size={18} />;
      case 'defense':
        return <Shield size={18} />;
      case 'special-attack':
        return <Zap size={18} />;
      case 'special-defense':
        return <Shield size={18} />;
      case 'speed':
        return <Activity size={18} />;
      default:
        return null;
    }
  };

  const getStatName = (statName: string) => {
    switch (statName) {
      case 'hp':
        return 'HP';
      case 'attack':
        return 'Attack';
      case 'defense':
        return 'Defense';
      case 'special-attack':
        return 'Sp. Atk';
      case 'special-defense':
        return 'Sp. Def';
      case 'speed':
        return 'Speed';
      default:
        return statName;
    }
  };

  const getStatColor = (value: number) => {
    if (value < 50) return 'bg-red-500';
    if (value < 80) return 'bg-yellow-500';
    if (value < 120) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const handleRetry = () => {
    if (id) {
      setLoading(true);
      setError('');
      fetchPokemonDetails(id)
        .then(data => {
          setPokemon(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch Pokémon details. Please try again later.');
          setLoading(false);
          console.error('Error fetching Pokémon details:', err);
        });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Pokémon details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!pokemon) {
    return <div>No Pokémon found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Link 
        to="/"
        className="flex items-center text-gray-600 hover:text-red-600 mb-4 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to list
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <img 
            src={pokemon.sprites?.other['official-artwork'].front_default || pokemon.sprites?.front_default} 
            alt={pokemon.name}
            className="w-64 h-64 object-contain"
          />
          
          <div className="mt-4 text-center">
            <p className="text-gray-500">{formatPokemonId(pokemon.id)}</p>
            <h1 className="text-3xl font-bold mt-2">{capitalizeFirstLetter(pokemon.name)}</h1>
            
            <div className="flex justify-center mt-3 gap-2">
              {pokemon.types?.map((typeInfo, index) => (
                <span 
                  key={index} 
                  className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full`}
                >
                  {capitalizeFirstLetter(typeInfo.type.name)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full">
            <h2 className="text-xl font-semibold mb-2">Pokédex Entry</h2>
            <p className="text-gray-700">{description || 'No description available.'}</p>
          </div>
          
          {/* Add to Team button */}
          <Link 
            to={`/team-builder?add=${pokemon.id}`}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition-colors flex items-center justify-center"
          >
            Add to Team
          </Link>
          
          {/* Compare button */}
          <Link 
            to={`/compare?pokemon=${pokemon.id}`}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors flex items-center justify-center"
          >
            Compare
          </Link>
        </div>
        
        <div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('info')}
              >
                Info
              </button>
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('stats')}
              >
                Stats
              </button>
              <button
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'moves'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('moves')}
              >
                Moves
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          {activeTab === 'info' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Physical Traits</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Ruler size={18} className="mr-2 text-gray-600" />
                      <span className="font-medium mr-2">Height:</span>
                      <span>{formatHeight(pokemon.height)}</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell size={18} className="mr-2 text-gray-600" />
                      <span className="font-medium mr-2">Weight:</span>
                      <span>{formatWeight(pokemon.weight)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Abilities</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {pokemon.abilities?.map((ability, index) => (
                      <li key={index}>{capitalizeFirstLetter(ability.ability.name.replace('-', ' '))}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {pokemon.types && pokemon.types.length > 0 && (
                <TypeEffectiveness types={pokemon.types.map(t => t.type.name)} />
              )}
              
              {evolutionChain.length > 1 && (
                <div className="bg-gray-100 p-4 rounded-lg mt-6">
                  <h2 className="text-xl font-semibold mb-4">Evolution Chain</h2>
                  <div className="flex flex-wrap items-center justify-center">
                    {evolutionChain.map((evolution, index) => (
                      <React.Fragment key={evolution.id}>
                        <div className="flex flex-col items-center">
                          <Link to={`/pokemon/${evolution.id}`}>
                            <img 
                              src={evolution.image} 
                              alt={evolution.name}
                              className="w-20 h-20 object-contain"
                            />
                            <p className="text-sm mt-1 text-center">{capitalizeFirstLetter(evolution.name)}</p>
                          </Link>
                        </div>
                        {index < evolutionChain.length - 1 && (
                          <div className="mx-2 text-gray-400">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'stats' && (
            <>
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
                <div className="space-y-3">
                  {pokemon.stats?.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 flex items-center">
                        <span className="mr-2 text-gray-600">{getStatIcon(stat.stat.name)}</span>
                        <span className="font-medium">{getStatName(stat.stat.name)}</span>
                      </div>
                      <div className="ml-2 w-12 text-right font-mono">{stat.base_stat}</div>
                      <div className="ml-3 flex-1 bg-gray-300 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getStatColor(stat.base_stat)}`} 
                          style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {pokemon.stats && (
                <StatChart stats={pokemon.stats} pokemonName={capitalizeFirstLetter(pokemon.name)} />
              )}
            </>
          )}
          
          {activeTab === 'moves' && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Moves</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pokemon.moves?.slice(0, 20).map((move, index) => (
                  <div key={index} className="bg-white p-2 rounded border border-gray-200">
                    {capitalizeFirstLetter(move.move.name.replace('-', ' '))}
                  </div>
                ))}
              </div>
              {pokemon.moves && pokemon.moves.length > 20 && (
                <p className="text-gray-500 text-sm mt-4 text-center">
                  Showing 20 of {pokemon.moves.length} moves
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <h3 className="col-span-full text-xl font-semibold mb-2">Sprites</h3>
        {pokemon.sprites?.front_default && (
          <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center">
            <img src={pokemon.sprites.front_default} alt="Front Default" className="w-24 h-24" />
            <p className="text-sm text-gray-600 mt-1">Front Default</p>
          </div>
        )}
        {pokemon.sprites?.back_default && (
          <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center">
            <img src={pokemon.sprites.back_default} alt="Back Default" className="w-24 h-24" />
            <p className="text-sm text-gray-600 mt-1">Back Default</p>
          </div>
        )}
        {pokemon.sprites?.front_shiny && (
          <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center">
            <img src={pokemon.sprites.front_shiny} alt="Front Shiny" className="w-24 h-24" />
            <p className="text-sm text-gray-600 mt-1">Front Shiny</p>
          </div>
        )}
        {pokemon.sprites?.back_shiny && (
          <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center">
            <img src={pokemon.sprites.back_shiny} alt="Back Shiny" className="w-24 h-24" />
            <p className="text-sm text-gray-600 mt-1">Back Shiny</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetailPage;