import { ExternalLink } from "./ExternalLink";

interface AbilityProp {
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
}

export function AbilityView({ abilities }: AbilityProp) {
  return (
    <div>
      {abilities.map((a) => (
        <div key={a.ability.name}>
          <span className="capitalize">
            <ExternalLink
              name={a.ability.name}
              type={"ability"}
              text={a.ability.name.replace(/-/g, " ")}
              className={
                "text-sm text-white hover:text-cyan-300 transition-colors mt-1 inline-flex items-center gap-1"
              }
            />
          </span>
          {a.is_hidden && (
            <sup className="text-[10px] font-bold text-cyan-400 ml-0.5 select-none">
              HA
            </sup>
          )}
        </div>
      ))}
    </div>
  );
}
