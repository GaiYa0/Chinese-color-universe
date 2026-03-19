"use client";

import type { ChineseColor } from "@/shared/types";

interface GalaxyGridViewProps {
  filteredColors: ChineseColor[];
  focusedColor: ChineseColor | null;
  setFocusedColor: (value: ChineseColor | null) => void;
}

export default function GalaxyGridView({
  filteredColors,
  focusedColor,
  setFocusedColor,
}: GalaxyGridViewProps) {
  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredColors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() =>
              setFocusedColor(focusedColor?.name === color.name ? null : color)
            }
            className="glass-card overflow-hidden rounded-xl text-left transition hover:scale-[1.02]"
          >
            <div className="h-24" style={{ backgroundColor: color.hex }} />
            <div className="p-3">
              <p className="font-medium text-white">{color.name}</p>
              <p className="text-xs text-white/60">{color.hex}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
