import { useState, useEffect } from "react";
import { commands, type PokemonSummary } from "./bindings";

import { PokemonType } from "./types/pokemon";
import { StatView } from "./components/StatView";
import { TypeView } from "./components/TypeView";
import { Search } from "lucide-react";
import { AbilityView } from "./components/AbilityView";
import { ExternalLink } from "./components/ExternalLink";
import { PokemonImage } from "./components/PokemonImage";
import { EvolutionTree } from "./components/EvolutionTree";
import { nameToIdIndex } from "./utils/pokemonUtils";
import { PopoutButton } from "./components/PopoutButton";
import { NavigationButton } from "./components/NavigationButton";
import { SearchContext } from "./context/SearchContext";

const allPokemonNames = Object.keys(nameToIdIndex);

export function PokedexView() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonSummary | null>(null);

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

  const handleSearch = async (e?: React.SubmitEvent, manualInput?: string) => {
    if (e) e.preventDefault();

    const query = (manualInput || searchInput).trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    try {
      const resolvedId = nameToIdIndex[query] || query;

      const result = await commands.getPokemon(resolvedId.toString());

      if (result.status === "ok") {
        setPokemonData(result.data);
        if (manualInput && e !== undefined) {
          setSearchInput(manualInput);
        }
      } else {
        console.error("Search error:", result.error);
        setError("Pokémon not found. Try another name or ID.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Pokémon not found. Try another name or ID.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(undefined, "Mogelbaum");
  }, []);

  return (
    <SearchContext.Provider value={{ handleSearch }}>
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-xl mx-auto mb-8 relative flex">
          <form onSubmit={handleSearch} className="w-full mx-auto mb-2">
            <div className="flex items-stretch justify-center gap-3 max-w-full mx-auto">
              <PopoutButton />
              <NavigationButton
                direction="left"
                currentId={pokemonData?.id}
                onNavigate={(id) => handleSearch(undefined, id)}
              />
              <div className="flex flex-none min-w-75 md:w-112.5 group focus-within:ring-1 focus-within:ring-cyan-400 rounded-lg transition-all">
                <input
                  id="doesntmatter"
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search by name or ID"
                  className="flex-1 px-4 rounded-l-lg w-full p-3 bg-slate-800 border border-slate-700 border-r-0 focus:border-cyan-400 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="flex-none px-5 rounded-r-lg bg-slate-800 border border-slate-700 border-l-0 hover:bg-slate-700 text-cyan-400 group-focus-within:border-cyan-400 transition-colors flex items-center justify-center group"
                >
                  <Search size={24} />
                </button>
              </div>
              <NavigationButton
                direction="right"
                currentId={pokemonData?.id}
                onNavigate={(id) => handleSearch(undefined, id)}
              />
              <div
                className="flex-none aspect-square p-3 w-12 invisible"
                aria-hidden="true"
              />
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
              <PokemonImage pokemon={pokemonData} />

              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <StatView stats={pokemonData.stats} />
                <AbilityView abilities={pokemonData.abilities} />
                <ExternalLink
                  name={pokemonData.name}
                  type="pokemon"
                  text="View on PokéWiki ↗"
                />
              </div>

              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 md:col-span-2">
                <TypeView
                  types={pokemonData.types.map(
                    (t) => t.type.name as PokemonType,
                  )}
                  abilities={pokemonData.abilities.map((a) => a.ability.name)}
                />
              </div>

              {pokemonData.evolution_chain &&
                pokemonData.evolution_chain.evolves_to &&
                pokemonData.evolution_chain.evolves_to.length > 0 && (
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 md:col-span-2">
                    <EvolutionTree node={pokemonData.evolution_chain} />
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </SearchContext.Provider>
  );
}
