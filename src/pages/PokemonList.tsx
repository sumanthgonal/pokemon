import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Pokemon } from '../types/pokemon';
import { Filter } from '../types/filter';
import { fetchPokemonList, fetchPokemonByType, fetchPokemonByGeneration } from '../services/pokemonService';

const PokemonList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;
  
  const [filters, setFilters] = useState<Filter>({
    searchTerm: searchParams.get('search') || '',
    types: [],
    generation: null,
    sortBy: { value: 'id', label: 'ID (Default)' }
  });

  const pokemonTypes = [
    { value: 'normal', label: 'Normal' },
    { value: 'fire', label: 'Fire' },
    { value: 'water', label: 'Water' },
    { value: 'electric', label: 'Electric' },
    { value: 'grass', label: 'Grass' },
    { value: 'ice', label: 'Ice' },
    { value: 'fighting', label: 'Fighting' },
    { value: 'poison', label: 'Poison' },
    { value: 'ground', label: 'Ground' },
    { value: 'flying', label: 'Flying' },
    { value: 'psychic', label: 'Psychic' },
    { value: 'bug', label: 'Bug' },
    { value: 'rock', label: 'Rock' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'dragon', label: 'Dragon' },
    { value: 'dark', label: 'Dark' },
    { value: 'steel', label: 'Steel' },
    { value: 'fairy', label: 'Fairy' }
  ];

  const generations = [
    { value: 1, label: 'Generation I' },
    { value: 2, label: 'Generation II' },
    { value: 3, label: 'Generation III' },
    { value: 4, label: 'Generation IV' },
    { value: 5, label: 'Generation V' },
    { value: 6, label: 'Generation VI' },
    { value: 7, label: 'Generation VII' },
    { value: 8, label: 'Generation VIII' }
  ];

  // Update search term from URL params
  useEffect(() => {
    const searchTerm = searchParams.get('search') || '';
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchParams]);

  const fetchPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      let pokemonData: Pokemon[] = [];
      
      // Filter by type if selected
      if (filters.types && filters.types.length > 0) {
        const typeValues = filters.types.map(t => t.value);
        pokemonData = await fetchPokemonByType(typeValues);
      } 
      // Filter by generation if selected
      else if (filters.generation) {
        pokemonData = await fetchPokemonByGeneration(filters.generation.value);
      } 
      // Default fetch with pagination
      else {
        const offset = (currentPage - 1) * itemsPerPage;
        const data = await fetchPokemonList(itemsPerPage, offset);
        pokemonData = data.results;
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      }
      
      setPokemonList(pokemonData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Pokémon data. Please try again later.');
      setLoading(false);
      console.error('Error fetching Pokémon:', err);
    }
  }, [currentPage, filters.types, filters.generation]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Apply filters and search
  useEffect(() => {
    if (pokemonList.length === 0) return;
    
    let filtered = [...pokemonList];
    
    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'height':
            return (b.height || 0) - (a.height || 0);
          case 'weight':
            return (b.weight || 0) - (a.weight || 0);
          case 'id':
          default:
            return a.id - b.id;
        }
      });
    }
    
    setFilteredPokemonList(filtered);
  }, [pokemonList, filters.searchTerm, filters.sortBy]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Reset to first page when changing filters
    if (name !== 'searchTerm') {
      setCurrentPage(1);
    }
    
    // Update URL for search term
    if (name === 'searchTerm') {
      const debouncedSearch = debounce((term: string) => {
        if (term) {
          setSearchParams({ search: term });
        } else {
          setSearchParams({});
        }
      }, 500);
      
      debouncedSearch(value);
      
      return () => {
        debouncedSearch.cancel();
      };
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleRetry = () => {
    fetchPokemon();
  };

  return (
    <div>
      <FilterPanel 
        filters={filters}
        onFilterChange={handleFilterChange}
        pokemonTypes={pokemonTypes}
        generations={generations}
      />
      
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}
      
      {loading ? (
        <LoadingSpinner message="Loading Pokémon..." />
      ) : (
        <>
          {filteredPokemonList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No Pokémon found matching your criteria</p>
              <button 
                onClick={() => {
                  setFilters({
                    searchTerm: '',
                    types: [],
                    generation: null,
                    sortBy: { value: 'id', label: 'ID (Default)' }
                  });
                  setSearchParams({});
                }}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {!filters.types.length && !filters.generation && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default PokemonList;