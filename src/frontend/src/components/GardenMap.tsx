import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useGameState } from "../hooks/useGameState";
import type { PlotState } from "../hooks/useGameState";
import PlotTile from "./PlotTile";

const GARDEN_DECORATIONS = [
  { id: "d1", emoji: "🌸", top: "5%", left: "3%" },
  { id: "d2", emoji: "🦋", top: "10%", right: "5%" },
  { id: "d3", emoji: "🌼", bottom: "8%", left: "5%" },
  { id: "d4", emoji: "🐝", top: "15%", left: "48%" },
  { id: "d5", emoji: "🌻", bottom: "5%", right: "6%" },
  { id: "d6", emoji: "🍃", top: "5%", right: "20%" },
  { id: "d7", emoji: "🐛", bottom: "12%", left: "22%" },
  { id: "d8", emoji: "🌿", top: "8%", left: "25%" },
];

const PLOT_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29,
];
const EMPTY_PLOT: PlotState = { __kind__: "empty", empty: null };

export default function GardenMap() {
  const { playerState, selectedSeedId, setSelectedSeedId, gameData } =
    useGameState();

  const plots = playerState?.gardenPlots ?? [];
  const selectedSeed = selectedSeedId
    ? gameData?.seeds.find((s) => s.id === selectedSeedId)
    : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Active seed banner */}
      {selectedSeedId && (
        <motion.div
          className="flex items-center gap-2 bg-accent/20 border border-accent/50 rounded-lg px-3 py-2 text-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-lg">{selectedSeed?.emoji}</span>
          <span className="font-semibold text-accent">
            {selectedSeed?.name}
          </span>
          <span className="text-muted-foreground text-xs">
            selected — click any empty plot to plant
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-6 px-2 text-xs"
            onClick={() => setSelectedSeedId(null)}
            data-ocid="garden.cancel_button"
          >
            ✕ Cancel
          </Button>
        </motion.div>
      )}

      {/* Garden Container */}
      <div
        className="garden-wrap rounded-2xl p-4 flex-1 overflow-hidden"
        data-ocid="garden.canvas_target"
      >
        {/* Decorative floating elements */}
        {GARDEN_DECORATIONS.map((dec, i) => (
          <span
            key={dec.id}
            className="absolute text-xl pointer-events-none select-none z-10 leaf-sway"
            style={{
              top: dec.top,
              left: dec.left,
              right: (dec as any).right,
              bottom: (dec as any).bottom,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {dec.emoji}
          </span>
        ))}

        {/* Garden bed label */}
        <div className="relative z-20 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🌾</span>
            <span className="font-display text-sm font-semibold text-foreground/80">
              My Garden — {plots.filter((p) => p.__kind__ !== "empty").length}
              /30 plots active
            </span>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-700/80 inline-block" />{" "}
              Empty
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500/80 inline-block" />{" "}
              Growing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400/80 inline-block" />{" "}
              Ready!
            </span>
          </div>
        </div>

        {/* 5×6 Grid — fixed 30 plot IDs */}
        <div className="relative z-20 grid grid-cols-5 gap-2">
          {PLOT_IDS.map((plotId) => (
            <PlotTile
              key={`plot-${plotId}`}
              plotId={plotId}
              plot={plots[plotId] ?? EMPTY_PLOT}
              index={plotId}
            />
          ))}
        </div>

        {/* Fence decoration bottom */}
        <div className="relative z-10 mt-3 text-center text-2xl tracking-widest select-none opacity-40">
          🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵
        </div>
      </div>
    </div>
  );
}
