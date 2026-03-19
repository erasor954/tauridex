import { TYPE_CHART, ALL_TYPES } from "../data/type_chart";
import { ABILITY_MODIFIERS } from "../data/abilities";
import { PokemonType } from "../types/pokemon";
import { TypeBadge } from "./TypeBadge";

export function getDefenseProfile(
  defendingTypes: PokemonType[],
  activeAbilities: string[],
) {
  return (ALL_TYPES as PokemonType[]).map((attacker: PokemonType) => {
    let multiplier = defendingTypes.reduce(
      (acc: number, defender: PokemonType) => {
        // THE FIX: We look up the Defender's row in your chart
        const defenderRow = TYPE_CHART[defender];
        if (!defenderRow) return acc;

        // Then we check how much damage the Attacker does to that Defender
        const effectiveness = defenderRow[attacker] ?? 1;
        return acc * effectiveness;
      },
      1,
    );

    activeAbilities.forEach((abilityName: string) => {
      const abilityData = ABILITY_MODIFIERS[abilityName.toLowerCase()];
      if (abilityData) {
        const mod = abilityData[attacker];
        if (mod !== undefined) {
          multiplier *= mod;
        }
      }
    });

    return { type: attacker, multiplier };
  });
}

// --- The Missing Component --- //

interface TypeViewProps {
  types: PokemonType[];
  abilities?: string[];
}

export function TypeView({ types, abilities = [] }: TypeViewProps) {
  const profile = getDefenseProfile(types, abilities);

  const COLUMNS = [
    { label: "0x", value: 0, color: "text-slate-400" },
    { label: "1/4x", value: 0.25, color: "text-emerald-400" },
    { label: "1/2x", value: 0.5, color: "text-emerald-400" },
    { label: "1x", value: 1, color: "text-slate-500" },
    { label: "2x", value: 2, color: "text-red-400" },
    { label: "4x", value: 4, color: "text-red-500 font-bold" },
  ];

  // const quad_weaknesses = profile
  //   .filter((p) => p.multiplier > 2)
  //   .sort((a, b) => b.multiplier - a.multiplier);

  // const weaknesses = profile
  //   .filter((p) => p.multiplier > 1 && p.multiplier < 2)
  //   .sort((a, b) => b.multiplier - a.multiplier);

  // const resistances = profile
  //   .filter((p) => p.multiplier < 1 && p.multiplier > 0.25)
  //   .sort((a, b) => a.multiplier - b.multiplier);

  // const quad_resistances = profile
  //   .filter((p) => p.multiplier < 0.5 && p.multiplier > 0)
  //   .sort((a, b) => a.multiplier - b.multiplier);

  // const immunities = profile.filter((p) => p.multiplier === 0);

  // A small helper to keep our JSX DRY (Don't Repeat Yourself)
  // const renderSection = (
  //   title: string,
  //   data: { type: PokemonType; multiplier: number }[],
  // ) => {
  //   if (data.length === 0) return null;

  //   return (
  //     <div className="mb-4">
  //       <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
  //         {title}
  //       </h4>
  //       <div className="flex flex-wrap gap-2">
  //         {data.map(({ type }) => (
  //           <TypeBadge type={type} />
  //           // We wrap your TypeBadge in a small pill to display the multiplier number next to it
  //           // <div
  //           //   key={type}
  //           //   className="flex items-center bg-slate-900 rounded-full pr-3 border border-slate-700 shadow-sm"
  //           // >
  //           //   <TypeBadge type={type} />
  //           //   <span
  //           //     className={`text-xs font-bold ml-2 ${multiplier > 1 ? "text-red-400" : "text-emerald-400"}`}
  //           //   >
  //           //     {multiplier}x
  //           //   </span>
  //           // </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // return (
  //   <div className="mt-6">
  //     <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
  //       Defense Profile
  //     </h3>
  //     <div className="space-y-2">
  //       {renderSection("Quad Weak To", quad_weaknesses)}
  //       {renderSection("Weak To", weaknesses)}
  //       {renderSection("Resistant To", resistances)}
  //       {renderSection("Quad Resistant To", quad_resistances)}
  //       {renderSection("Immune To", immunities)}
  //     </div>
  //   </div>
  // );
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
        Defense Profile
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 divide-x divide-slate-700/50 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        {COLUMNS.map((col) => {
          const typesInColumn = profile.filter(
            (p) => p.multiplier === col.value,
          );

          return (
            <div key={col.label} className="flex flex-col items-center px-2">
              <div className={`text-sm tracking-wider mb-3 ${col.color}`}>
                {col.label}
              </div>

              <div className="flex flex-col gap-2 w-full items-center">
                {typesInColumn.length > 0 ? (
                  typesInColumn.map(({ type }) => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-slate-700 text-xs">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
