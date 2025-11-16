import type { Dex } from "../../types.ts";

interface DexSelectorProps {
  dexes: Dex[];
  selectedDexId: string;
  onSelectDex: (dexId: string) => void;
}

export function DexSelector({ dexes, selectedDexId, onSelectDex }: DexSelectorProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Dexes">
        {dexes.map((dex) => {
          const isSelected = dex.id === selectedDexId;
          return (
            <button
              key={dex.id}
              onClick={() => onSelectDex(dex.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  isSelected
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              aria-current={isSelected ? "page" : undefined}
            >
              {dex.name}
              <span className="ml-2 text-xs text-gray-400">
                ({dex.pokemon_count})
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
