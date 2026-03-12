import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState";
import type { PlotState, Seed } from "../hooks/useGameState";

interface PlotTileProps {
  plotId: number;
  plot: PlotState;
  index: number;
}

function getNowNs(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Ready!";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function GrowingPlot({
  plot,
  seed,
}: { plot: Extract<PlotState, { __kind__: "growing" }>; seed?: Seed }) {
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const nowNs = getNowNs();
      const { plantedAt, harvestReady } = plot.growing;
      const total = harvestReady - plantedAt;
      const elapsed = nowNs - plantedAt;
      if (total <= 0n) {
        setProgress(100);
        setRemaining(0);
        return;
      }
      const pct = Number((elapsed * 100n) / total);
      setProgress(Math.min(100, Math.max(0, pct)));
      const remSecs = Number((harvestReady - nowNs) / 1_000_000_000n);
      setRemaining(Math.max(0, remSecs));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [plot.growing]);

  return (
    <div className="plot-growing rounded-lg w-full h-full flex flex-col items-center justify-center gap-1 p-1">
      <span className="text-2xl grow-bob">{seed?.emoji ?? "🌱"}</span>
      <div className="w-full px-1">
        <Progress value={progress} className="h-1.5 grow-progress" />
      </div>
      <span className="text-[9px] text-muted-foreground font-sans leading-tight">
        {formatTimeRemaining(remaining)}
      </span>
    </div>
  );
}

function HarvestablePlot({
  plotId,
  seed,
  onHarvest,
}: {
  plotId: number;
  seed?: Seed;
  onHarvest: () => void;
}) {
  return (
    <motion.div
      className="plot-harvestable harvest-glow rounded-lg w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer"
      onClick={onHarvest}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      data-ocid={`plot.item.${plotId + 1}`}
    >
      <span className="text-2xl">{seed?.emoji ?? "🌾"}</span>
      <span className="text-[9px] font-display text-amber-300 font-semibold">
        HARVEST!
      </span>
    </motion.div>
  );
}

export default function PlotTile({ plotId, plot, index }: PlotTileProps) {
  const {
    gameData,
    playerState,
    selectedSeedId,
    plantSeed,
    harvestPlot,
    isMutating,
  } = useGameState();
  const [showPlantModal, setShowPlantModal] = useState(false);

  const seeds = gameData?.seeds ?? [];

  // Seeds player has in inventory
  const inventorySeeds: Seed[] = (playerState?.seedInventory ?? [])
    .filter(([, qty]) => qty > 0n)
    .map(([id]) => seeds.find((s) => s.id === id))
    .filter(Boolean) as Seed[];

  const handleEmptyClick = useCallback(() => {
    if (selectedSeedId) {
      plantSeed(plotId, selectedSeedId);
    } else {
      setShowPlantModal(true);
    }
  }, [selectedSeedId, plantSeed, plotId]);

  const handlePlant = useCallback(
    (seedId: string) => {
      setShowPlantModal(false);
      plantSeed(plotId, seedId);
    },
    [plantSeed, plotId],
  );

  const seedForPlot =
    plot.__kind__ === "growing"
      ? seeds.find((s) => s.id === plot.growing.seedId)
      : plot.__kind__ === "harvestable"
        ? seeds.find((s) => s.id === plot.harvestable.seedId)
        : undefined;

  return (
    <>
      <motion.div
        className="relative aspect-square"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.03, duration: 0.25 }}
        data-ocid={`plot.item.${plotId + 1}`}
      >
        {plot.__kind__ === "empty" && (
          <motion.button
            className={`plot-soil rounded-lg w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ${
              selectedSeedId ? "plot-selected-target" : ""
            }`}
            onClick={handleEmptyClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isMutating}
            title={
              selectedSeedId ? "Plant selected seed here" : "Click to plant"
            }
          >
            <span className="text-xl opacity-50">＋</span>
          </motion.button>
        )}

        {plot.__kind__ === "growing" && (
          <GrowingPlot plot={plot} seed={seedForPlot} />
        )}

        {plot.__kind__ === "harvestable" && (
          <HarvestablePlot
            plotId={plotId}
            seed={seedForPlot}
            onHarvest={() => !isMutating && harvestPlot(plotId)}
          />
        )}

        {/* Plot number badge */}
        <span className="absolute top-0.5 left-1 text-[8px] text-muted-foreground/50 font-mono select-none">
          {plotId + 1}
        </span>
      </motion.div>

      {/* Plant Seed Modal */}
      <Dialog open={showPlantModal} onOpenChange={setShowPlantModal}>
        <DialogContent className="max-w-sm" data-ocid="plot.modal">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              🌱 Choose a Seed to Plant
            </DialogTitle>
          </DialogHeader>
          {inventorySeeds.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="plot.empty_state"
            >
              <p className="text-3xl mb-2">🪣</p>
              <p className="text-sm">No seeds in inventory.</p>
              <p className="text-xs mt-1">Buy seeds from the shop first!</p>
            </div>
          ) : (
            <ScrollArea className="max-h-64">
              <div className="grid grid-cols-2 gap-2 p-1">
                {inventorySeeds.map((seed) => {
                  const qty =
                    playerState?.seedInventory.find(
                      ([id]) => id === seed.id,
                    )?.[1] ?? 0n;
                  return (
                    <motion.button
                      key={seed.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-left transition-colors"
                      onClick={() => handlePlant(seed.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-ocid="plot.secondary_button"
                    >
                      <span className="text-2xl">{seed.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {seed.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          x{qty.toString()}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPlantModal(false)}
            data-ocid="plot.close_button"
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
