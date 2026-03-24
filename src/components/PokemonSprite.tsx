import { nameToIdIndex } from "../utils/pokemonUtils";
import { useSearch } from "../context/SearchContext";

interface PokemonSpriteProp {
  name: string;
  className?: string;
}

export function PokemonSprite({ name, className }: PokemonSpriteProp) {
  const { handleSearch } = useSearch();
  return (
    <div className="relative group">
      <button onClick={() => handleSearch(undefined, name)}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameToIdIndex[name.toLowerCase()]}.png`}
          alt={name}
          className={"w-8 h-8 object-contain " + className}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </button>

      <span className="absolute mt-2 left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-max px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 shadow-xl pointer-events-none z-20">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </span>
    </div>
  );
}
