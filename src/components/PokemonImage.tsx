import { PokemonType } from "../types/pokemon";
import { TypeBadge } from "./TypeBadge";
import { type PokemonSummary } from "../bindings";

interface PokemonImageProp {
  pokemon: PokemonSummary;
}

export function PokemonImage({ pokemon }: PokemonImageProp) {
  return (
    <div className="relative p-6 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center">
      <h2 className="absolute top-4 left-4 text-slate-500 font-mono font-bold">
        #{pokemon.id}
      </h2>
      <h2 className="text-2xl font-bold capitalize mb-4">{pokemon.name}</h2>

      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
        className="w-full max-w-xs h-auto drop-shadow-2xl mb-4"
      />
      <div className="flex gap-2">
        {pokemon.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name as PokemonType} />
        ))}
      </div>
    </div>
  );
}
