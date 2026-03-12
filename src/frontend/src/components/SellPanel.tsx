import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useGameState } from "../hooks/useGameState";

export default function SellPanel() {
  const { gameData, cropInventory, sellAllCrop, isMutating, formatDollars } =
    useGameState();
  const seeds = gameData?.seeds ?? [];

  const cropItems = Object.entries(cropInventory)
    .filter(([, qty]) => qty > 0n)
    .map(([id, qty]) => ({
      seed: seeds.find((s) => s.id === id),
      qty,
    }))
    .filter((item) => item.seed !== undefined) as {
    seed: NonNullable<(typeof seeds)[0]>;
    qty: bigint;
  }[];

  const totalValue = cropItems.reduce(
    (sum, { seed, qty }) => sum + seed.sellPrice * qty,
    0n,
  );

  const handleSellAll = () => {
    for (const { seed } of cropItems) {
      sellAllCrop(seed.id);
    }
  };

  return (
    <div className="flex flex-col gap-2" data-ocid="sell.panel">
      <div className="flex items-center gap-2">
        <span className="text-lg">🏬</span>
        <h3 className="font-display text-sm font-semibold">Sell Crops</h3>
        {cropItems.length > 0 && (
          <span className="ml-auto text-xs text-accent font-semibold">
            {formatDollars(totalValue)}
          </span>
        )}
      </div>

      {cropItems.length === 0 ? (
        <div
          className="text-center py-4 text-muted-foreground"
          data-ocid="sell.empty_state"
        >
          <p className="text-2xl mb-1">🌿</p>
          <p className="text-xs">No crops to sell</p>
          <p className="text-[10px] mt-0.5 opacity-70">
            Harvest from your garden!
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-48">
          <div className="flex flex-col gap-1.5 pr-1">
            <AnimatePresence>
              {cropItems.map(({ seed, qty }, idx) => (
                <motion.div
                  key={seed.id}
                  className="flex items-center gap-2 bg-muted/30 rounded-lg px-2 py-1.5 border border-border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  data-ocid={`sell.item.${idx + 1}`}
                >
                  <span className="text-lg">{seed.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {seed.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      x{qty.toString()} · {formatDollars(seed.sellPrice)}/ea
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] text-accent font-semibold">
                      {formatDollars(seed.sellPrice * qty)}
                    </span>
                    <Button
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => sellAllCrop(seed.id)}
                      disabled={isMutating}
                      data-ocid="sell.primary_button"
                    >
                      {isMutating ? (
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      ) : (
                        "Sell All"
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {cropItems.length > 1 && (
        <Button
          variant="default"
          className="w-full text-xs h-8 mt-1"
          onClick={handleSellAll}
          disabled={isMutating}
          data-ocid="sell.primary_button"
        >
          {isMutating ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <span className="mr-1">💰</span>
          )}
          Sell Everything — {formatDollars(totalValue)}
        </Button>
      )}
    </div>
  );
}
