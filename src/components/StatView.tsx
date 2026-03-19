interface StatProps {
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

export function StatView({ stats }: StatProps) {
  const bst = stats.reduce((acc, s) => acc + s.base_stat, 0);

  const getBarColor = (value: number) => {
    if (value < 60) return "bg-red-500";
    if (value < 90) return "bg-yellow-500";
    if (value < 120) return "bg-green-500";
    return "bg-cyan-400";
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
        Base Stats
      </h3>

      <div className="space-y-3">
        {stats.map((item) => {
          const label = item.stat.name.replace("-", " ");
          const percentage = Math.min((item.base_stat / 255) * 100, 100);

          return (
            <div
              key={item.stat.name}
              className="grid grid-cols-12 items-center gap-2"
            >
              <span className="col-span-3 text-xs uppercase text-slate-400 font-bold truncate">
                {label === "special attack"
                  ? "Sp. Atk"
                  : label === "special defense"
                    ? "Sp. Def"
                    : label}
              </span>

              <span className="col-span-1 text-sm font-mono text-right pr-2">
                {item.base_stat}
              </span>

              <div className="col-span-8 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${getBarColor(item.base_stat)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-slate-700 flex justify-between items-center">
        <span className="text-slate-400 font-bold uppercase text-sm">
          Total
        </span>
        <span className="text-lg font-bold text-cyan-400">{bst}</span>
      </div>
    </div>
  );
}
