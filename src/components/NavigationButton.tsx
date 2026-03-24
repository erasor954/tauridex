import { ChevronLeft, ChevronRight } from "lucide-react";

const HIGHEST_POKEDEX_ID: number = 1025 as const;

interface NavButtonProps {
  direction: "left" | "right";
  currentId: number | undefined;
  onNavigate: (newId: string) => void;
}

export function NavigationButton({
  direction,
  currentId,
  onNavigate,
}: NavButtonProps) {
  if (!currentId) {
    return <div className="flex-none aspect-square w-12" />;
  }

  const isLeft = direction === "left";
  const text = isLeft ? "Previous Pokémon" : "Next Pokémon";
  const canMove = isLeft ? currentId > 1 : currentId < HIGHEST_POKEDEX_ID;
  const targetId = isLeft ? currentId - 1 : currentId + 1;
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <div className="flex-none aspect-square w-12">
      {canMove && (
        <div className="relative group">
          <button
            type="button"
            onClick={() => onNavigate(targetId.toString())}
            className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-cyan-400 transition-colors flex items-center justify-center"
            aria-label={text}
          >
            <Icon size={24} />
          </button>

          <span className="absolute mt-2 left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-max px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 shadow-xl pointer-events-none z-20">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
