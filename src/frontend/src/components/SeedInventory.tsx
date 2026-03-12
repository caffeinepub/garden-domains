import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useGameState } from "../hooks/useGameState";

export default function SeedInventory() {
  const { gameData, playerState, selectedSeedId, setSelectedSeedId } =
    useGameState();
  const seeds = gameData?.seeds ?? [];

  const inventoryItems = (playerState?.seedInventory ?? [])
    .filter(([, qty]) => qty > 0n)
    .map(([id, qty]) => ({ seed: seeds.find((s) => s.id === id), qty }))
    .filter((item) => item.seed !== undefined) as {
    seed: NonNullable<(typeof seeds)[0]>;
    qty: bigint;
  }[];

  return (
    <div className="flex flex-col gap-2" data-ocid="inventory.list">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎒</span>
        <h3 className="font-display text-sm font-semibold">Seed Bag</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {inventoryItems.length} types
        </Badge>
      </div>

      {inventoryItems.length === 0 ? (
        <div
          className="text-center py-4 text-muted-foreground"
          data-ocid="inventory.empty_state"
        >
          <p className="text-2xl mb-1">🪣</p>
          <p className="text-xs">No seeds yet</p>
          <p className="text-[10px] mt-0.5 opacity-70">Buy some in the shop!</p>
        </div>
      ) : (
        <ScrollArea className="max-h-48">
          <div className="flex flex-col gap-1 pr-1">
            <AnimatePresence>
              {inventoryItems.map(({ seed, qty }) => (
                <motion.button
                  key={seed.id}
                  className={`seed-card flex items-center gap-2 rounded-lg px-2 py-1.5 text-left border transition-colors ${
                    selectedSeedId === seed.id
                      ? "selected bg-accent/10 border-accent/50"
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedSeedId(
                      selectedSeedId === seed.id ? null : seed.id,
                    )
                  }
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  data-ocid="inventory.toggle"
                >
                  <span className="text-lg">{seed.emoji}</span>
                  <span className="text-xs font-semibold flex-1 truncate">
                    {seed.name}
                  </span>
                  <Badge
                    className={`text-[10px] h-5 ${
                      selectedSeedId === seed.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary/20 text-primary border-primary/30"
                    }`}
                  >
                    x{qty.toString()}
                  </Badge>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {selectedSeedId && (
        <motion.p
          className="text-[10px] text-accent text-center py-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✨ Click any empty plot to plant
        </motion.p>
      )}
    </div>
  );
}
