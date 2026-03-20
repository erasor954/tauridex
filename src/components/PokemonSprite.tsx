import { nameToIdIndex } from "../utils/pokemonUtils";

interface PokemonSpriteProp {
  name: string;
  className?: string;
}

export function PokemonSprite({ name, className }: PokemonSpriteProp) {
  return (
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameToIdIndex[name.toLowerCase()]}.png`}
      alt={name}
      className={"w-8 h-8 object-contain " + className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
