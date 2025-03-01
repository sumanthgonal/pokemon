import React from 'react';
import Select from 'react-select';
import { Filter } from '../types/filter';

interface FilterPanelProps {
  filters: Filter;
  onFilterChange: (name: string, value: any) => void;
  pokemonTypes: { value: string; label: string }[];
  generations: { value: number; label: string }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange,
  pokemonTypes,
  generations
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Select
            isMulti
            name="types"
            options={pokemonTypes}
            className="basic-multi-select"
            classNamePrefix="select"
            value={filters.types}
            onChange={(selected) => onFilterChange('types', selected)}
            placeholder="Filter by type..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Generation</label>
          <Select
            name="generation"
            options={generations}
            className="basic-select"
            classNamePrefix="select"
            value={filters.generation}
            onChange={(selected) => onFilterChange('generation', selected)}
            placeholder="Filter by generation..."
            isClearable
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <Select
            name="sortBy"
            options={[
              { value: 'id', label: 'ID (Default)' },
              { value: 'name', label: 'Name' },
              { value: 'height', label: 'Height' },
              { value: 'weight', label: 'Weight' }
            ]}
            className="basic-select"
            classNamePrefix="select"
            value={filters.sortBy}
            onChange={(selected) => onFilterChange('sortBy', selected)}
            placeholder="Sort by..."
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;