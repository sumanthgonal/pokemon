import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-red-300' : 'text-white';
  };

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-bold flex items-center">
            Pokédex Explorer
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`hover:text-red-300 transition-colors ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/team-builder" className={`hover:text-red-300 transition-colors ${isActive('/team-builder')}`}>
              Team Builder
            </Link>
            <Link to="/compare" className={`hover:text-red-300 transition-colors ${isActive('/compare')}`}>
              Compare
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-64 p-2 pl-10 rounded-lg text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </form>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-500">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-full p-2 pl-10 rounded-lg text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </form>
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`hover:text-red-300 transition-colors ${isActive('/')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/team-builder" 
                className={`hover:text-red-300 transition-colors ${isActive('/team-builder')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Team Builder
              </Link>
              <Link 
                to="/compare" 
                className={`hover:text-red-300 transition-colors ${isActive('/compare')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;