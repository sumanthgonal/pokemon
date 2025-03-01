import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Stat } from '../types/pokemon';

interface StatChartProps {
  stats: Stat[];
  comparisonStats?: Stat[];
  pokemonName: string;
  comparisonName?: string;
}

const StatChart: React.FC<StatChartProps> = ({ stats, comparisonStats, pokemonName, comparisonName }) => {
  const getStatName = (statName: string) => {
    switch (statName) {
      case 'hp': return 'HP';
      case 'attack': return 'Atk';
      case 'defense': return 'Def';
      case 'special-attack': return 'Sp.Atk';
      case 'special-defense': return 'Sp.Def';
      case 'speed': return 'Speed';
      default: return statName;
    }
  };

  const formatData = () => {
    return stats.map((stat) => {
      const comparisonStat = comparisonStats?.find(s => s.stat.name === stat.stat.name);
      
      return {
        name: getStatName(stat.stat.name),
        [pokemonName]: stat.base_stat,
        ...(comparisonStat ? { [comparisonName || 'Comparison']: comparisonStat.base_stat } : {})
      };
    });
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={pokemonName} fill="#ef4444" />
          {comparisonStats && comparisonName && (
            <Bar dataKey={comparisonName} fill="#3b82f6" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatChart;