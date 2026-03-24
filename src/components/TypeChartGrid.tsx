import { useMemo } from "react";
import { TYPE_CHART } from "../data/type_chart";
import { ALL_TYPES, PokemonType } from "../types/pokemon";
import { TypeBadge } from "./TypeBadge";

const POKEMON_TYPES = ALL_TYPES as PokemonType[];

export const TypeChartGrid = () => {
  const getCellColor = (multiplier: number) => {
    switch (multiplier) {
      case 2:
        return "#00AA00";
      case 0.5:
        return "#FF0000";
      case 0:
        return "#000000";
      default:
        return "transparent";
    }
  };

  const getFontColor = (multiplier: number) => {
    switch (multiplier) {
      case 2:
        return "#0A0A0A";
      case 0.5:
        return "#0A0A0A";
      case 0:
        return "#F2F2F2";
      default:
        return "transparent";
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto p-2 overflow-x-auto">
      <table className="border-collapse border-spacing-px w-max h-auto">
        <thead>
          <tr>
            <th>Atk \ Def</th>
            {POKEMON_TYPES.map((defender) => (
              <th
                key={`header-${defender}`}
                className="w-8 min-w-8 h-16 p-0 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center pb-1">
                  <div className="rotate-90 origin-center">
                    <TypeBadge type={defender} scale={2} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {POKEMON_TYPES.map((attacker) => (
            <tr key={`row-${attacker}`}>
              <th className="pr-0.5">
                <TypeBadge type={attacker} scale={2} />
              </th>

              {POKEMON_TYPES.map((defender) => {
                const multiplier = TYPE_CHART[defender]?.[attacker] ?? 1;

                return (
                  <td
                    key={`cell-${attacker}-${defender}`}
                    className="border border-slate-300 p-0 bg-slate-100"
                  >
                    <div
                      className="relative flex items-center justify-center w-8 h-8 text-[20px] font-medium text-slate-800"
                      style={{
                        backgroundColor: getCellColor(multiplier),
                        color: getFontColor(multiplier),
                      }}
                    >
                      {multiplier === 1 ? (
                        ""
                      ) : multiplier === 0.5 ? (
                        <>
                          <span className="absolute top-[10%] left-[15%] leading-none text-[20px]">
                            1
                          </span>
                          <span className="text-[20px]">/</span>
                          <span className="absolute bottom-[10%] right-[7%] leading-none text-[20px]">
                            2
                          </span>
                        </>
                      ) : (
                        multiplier
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
