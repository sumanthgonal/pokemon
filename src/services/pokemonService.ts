import { Pokemon } from '../types/pokemon';

export const fetchPokemonList = async (limit: number, offset: number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Fetch details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          id: detailData.id,
          name: detailData.name,
          url: pokemon.url,
          sprites: detailData.sprites,
          types: detailData.types,
          height: detailData.height,
          weight: detailData.weight
        };
      })
    );
    
    return {
      count: data.count,
      results: pokemonWithDetails
    };
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (id: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data as Pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    throw error;
  }
};

export const fetchPokemonSpecies = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon species:', error);
    throw error;
  }
};

export const fetchEvolutionChain = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const chain = [];
    let currentEvolution = data.chain;
    
    // Add first form
    chain.push({
      name: currentEvolution.species.name,
      url: currentEvolution.species.url
    });
    
    // Add second form if exists
    if (currentEvolution.evolves_to.length > 0) {
      currentEvolution.evolves_to.forEach((evolution: any) => {
        chain.push({
          name: evolution.species.name,
          url: evolution.species.url
        });
        
        // Add third form if exists
        if (evolution.evolves_to.length > 0) {
          evolution.evolves_to.forEach((finalEvolution: any) => {
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
      chain.map(async (evolution: any) => {
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
    
    return evolutionDetails;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    throw error;
  }
};

export const fetchPokemonByType = async (types: string[]) => {
  try {
    // Get Pokemon for the first type
    const response = await fetch(`https://pokeapi.co/api/v2/type/${types[0]}`);
    const data = await response.json();
    
    let pokemonList = data.pokemon.map((p: any) => p.pokemon);
    
    // Filter by additional types if provided
    if (types.length > 1) {
      for (let i = 1; i < types.length; i++) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${types[i]}`);
        const typeData = await typeResponse.json();
        const typePokemons = typeData.pokemon.map((p: any) => p.pokemon.name);
        
        // Keep only Pokemon that have all the selected types
        pokemonList = pokemonList.filter((p: any) => typePokemons.includes(p.name));
      }
    }
    
    // Fetch details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      pokemonList.slice(0, 50).map(async (pokemon: any) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          id: detailData.id,
          name: detailData.name,
          url: pokemon.url,
          sprites: detailData.sprites,
          types: detailData.types,
          height: detailData.height,
          weight: detailData.weight
        };
      })
    );
    
    return pokemonWithDetails;
  } catch (error) {
    console.error('Error fetching Pokemon by type:', error);
    throw error;
  }
};

export const fetchPokemonByGeneration = async (generation: number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
    const data = await response.json();
    
    // Get all Pokemon species in this generation
    const pokemonSpecies = data.pokemon_species;
    
    // Fetch details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      pokemonSpecies.map(async (species: any) => {
        const id = species.url.split('/').filter(Boolean).pop();
        const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const detailData = await detailResponse.json();
        return {
          id: detailData.id,
          name: detailData.name,
          sprites: detailData.sprites,
          types: detailData.types,
          height: detailData.height,
          weight: detailData.weight
        };
      })
    );
    
    return pokemonWithDetails;
  } catch (error) {
    console.error('Error fetching Pokemon by generation:', error);
    throw error;
  }
};