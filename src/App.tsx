import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PokemonList from './pages/PokemonList';
import PokemonDetailPage from './pages/PokemonDetailPage';
import TeamBuilder from './pages/TeamBuilder';
import ComparePokemon from './pages/ComparePokemon';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/compare" element={<ComparePokemon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;