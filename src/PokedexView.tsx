import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";

import germanMap from "./assets/pokemon_names_de.json";
import englishMap from "./assets/pokemon_names_en.json";
import { Pokemon, PokemonType } from "./types/pokemon";
import { StatView } from "./components/StatView";
import { TypeBadge } from "./components/TypeBadge";
import { TypeView } from "./components/TypeView";

const nameToIdIndex: Record<string, number | string> = {
  ...Object.fromEntries(
    Object.entries(englishMap).map(([k, v]) => [k.toLowerCase(), v]),
  ),
  ...Object.fromEntries(
    Object.entries(germanMap).map(([k, v]) => [k.toLowerCase(), v]),
  ),
};

const allPokemonNames = Object.keys(nameToIdIndex);

export function PokedexView() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedIndex(-1);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allPokemonNames
      .filter((name) => name.includes(value.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        const selectedName = suggestions[selectedIndex];
        setSearchInput(selectedName);
        handleSearch(undefined, selectedName);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearch = async (e?: React.FormEvent, manualInput?: string) => {
    if (e) e.preventDefault();

    const query = (manualInput || searchInput).trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    try {
      const resolvedId = nameToIdIndex[query] || query;

      const data = await invoke<Pokemon>("get_pokemon", {
        id: resolvedId.toString(),
      });

      setPokemonData(data);
      setSearchInput(manualInput || searchInput);
    } catch (err) {
      console.error("Search error:", err);
      setError("Pokémon not found. Try another name or ID.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(undefined, "sudowoodo");
  }, []);

  const wikiUrl = pokemonData
    ? `https://www.pokewiki.de/${pokemonData.name}`
    : "";

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-md mx-auto mb-8 relative">
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search by name or ID"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onMouseDown={() => {
                  setSearchInput(suggestion);
                  handleSearch(undefined, suggestion);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`p-3 flex items-center gap-3 cursor-pointer capitalize transition-colors ${
                  index === selectedIndex
                    ? "bg-cyan-900 border-l-4 border-cyan-400"
                    : "hover:bg-slate-700 border-l-4 border-transparent"
                }`}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameToIdIndex[suggestion.toLowerCase()]}.png`}
                  alt={suggestion}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <span className="font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="text-cyan-400 text-center animate-pulse">
            Searching Data Banks...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {pokemonData && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center">
              <h2 className="text-2xl font-bold capitalize mb-4">
                {pokemonData.name}
              </h2>

              <img
                src={
                  pokemonData.sprites.other["official-artwork"].front_default
                }
                alt={pokemonData.name}
                className="w-full max-w-xs h-auto drop-shadow-2xl mb-4"
              />
              <div className="flex gap-2">
                {pokemonData.types.map((t) => (
                  <TypeBadge
                    key={t.type.name}
                    type={t.type.name as PokemonType}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
              <StatView stats={pokemonData.stats} />
              <a
                href={wikiUrl}
                onClick={async (e) => {
                  e.preventDefault();
                  await open(wikiUrl);
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-1"
              >
                View on PokéWiki ↗
              </a>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 md:col-span-2">
              <TypeView
                types={pokemonData.types.map((t) => t.type.name as PokemonType)}
                abilities={pokemonData.abilities.map((a) => a.ability.name)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
