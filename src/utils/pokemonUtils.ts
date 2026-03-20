import abilityDict from "../data/ability_names_en_de.json";
import englishToId from "../data/pokemon_names_en.json";
import germanToId from "../data/pokemon_names_de.json";

const idToGermanName: Record<number, string> = Object.fromEntries(
  Object.entries(germanToId).map(([name, id]) => [id, name]),
);

export const getPokewikiUrl = (
  name: string,
  type: "ability" | "pokemon",
): string => {
  if (type === "ability") {
    const germanAbility = (abilityDict as Record<string, string>)[name];
    return `https://www.pokewiki.de/${germanAbility || name}`;
  }

  if (type === "pokemon") {
    const pokemonId = (englishToId as Record<string, number>)[name];
    const germanName = pokemonId ? idToGermanName[pokemonId] : null;

    return `https://www.pokewiki.de/${germanName || name}`;
  }

  return `https://www.pokewiki.de/${name}`;
};
