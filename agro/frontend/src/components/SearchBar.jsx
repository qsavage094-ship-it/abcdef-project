import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ search, setSearch, onSearchSubmit, placeholder = "Search crops, farmer, or mandi location..." }) => {
  const handleClear = () => {
    setSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <FiSearch className="absolute left-4 text-slate-400 text-lg pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            title="Clear search"
          >
            <FiX className="text-base" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
