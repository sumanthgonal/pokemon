import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Shield, Zap, Activity, Dumbbell, Ruler } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  sprites?: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types?: {
    type: {
      name: string;
    }
  }[];
  stats?: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  height?: number;
  weight?: number;
  abilities?: {
    ability: {
      name: string;
    }
  }[];
  species?: {
    url: string;
  };
}

interface PokemonDetailProps {
  pokemon: Pokemon;
  onBack: () => void;
}

interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    }
  }[];
  evolution_chain: {
    url: string;
  };
}

interface EvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
      }[];
    }[];
  };
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onBack }) => {
  const [description, setDescription] = useState<string>('');
  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemonSpecies = async () => {
      try {
        if (pokemon.species?.url) {
          const response = await fetch(pokemon.species.url);
          const data: PokemonSpecies = await response.json();
          
          // Get English description
          const englishDescription = data.flavor_text_entries.find(
            entry => entry.language.name === 'en'
          );
          
          if (englishDescription) {
            setDescription(englishDescription.flavor_text.replace(/\f/g, ' '));
          }
          
          // Fetch evolution chain
          if (data.evolution_chain?.url) {
            const evolutionResponse = await fetch(data.evolution_chain.url);
            const evolutionData: EvolutionChain = await evolutionResponse.json();
            
            const chain = [];
            let currentEvolution = evolutionData.chain;
            
            // Add first form
            chain.push({
              name: currentEvolution.species.name,
              url: currentEvolution.species.url
            });
            
            // Add second form if exists
            if (currentEvolution.evolves_to.length > 0) {
              currentEvolution.evolves_to.forEach(evolution => {
                chain.push({
                  name: evolution.species.name,
                  url: evolution.species.url
                });
                
                // Add third form if exists
                if (evolution.evolves_to.length > 0) {
                  evolution.evolves_to.forEach(finalEvolution => {
                    chain.push({
                      name: finalEvolution.species.name,
                      url: finalEvolution.species.url
                    });
                  });
                }
              });
            }
            
            // Fetch details for each evolution
            const evolutionDetails = await Promise.all(
              chain.map(async (evolution) => {
                const id = evolution.url.split('/').filter(Boolean).pop();
                const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const detailData = await detailResponse.json();
                
                return {
                  id: detailData.id,
                  name: detailData.name,
                  image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default
                };
              })
            );
            
            setEvolutionChain(evolutionDetails);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon species data:', error);
        setLoading(false);
      }
    };
    
    fetchPokemonSpecies();
  }, [pokemon]);

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 mb-4 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to list
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        </div>
      ) : (
        <>
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
            </div>
            
            <div>
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
              
              {evolutionChain.length > 1 && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Evolution Chain</h2>
                  <div className="flex flex-wrap items-center justify-center">
                    {evolutionChain.map((evolution, index) => (
                      <React.Fragment key={evolution.id}>
                        <div className="flex flex-col items-center">
                          <img 
                            src={evolution.image} 
                            alt={evolution.name}
                            className="w-20 h-20 object-contain"
                          />
                          <p className="text-sm mt-1">{capitalizeFirstLetter(evolution.name)}</p>
                        </div>
                        {index < evolutionChain.length - 1 && (
                          <div className="mx-2 text-gray-400">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
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
        </>
      )}
    </div>
  );
};

export default PokemonDetail;