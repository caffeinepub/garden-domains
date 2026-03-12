import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useGameState } from "../hooks/useGameState";
import type { Seed, SeedPack } from "../hooks/useGameState";

function formatTime(seconds: bigint): string {
  const s = Number(seconds);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

function SeedCard({ seed }: { seed: Seed }) {
  const { buySeed, playerState, isMutating, formatDollars } = useGameState();
  const canAfford = playerState ? playerState.balance >= seed.seedCost : false;
  const ownedQty =
    playerState?.seedInventory.find(([id]) => id === seed.id)?.[1] ?? 0n;

  return (
    <motion.div
      className="seed-card bg-card border border-border rounded-xl p-3 flex flex-col gap-2"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{seed.emoji}</span>
          <div>
            <p className="font-display text-xs font-semibold leading-tight">
              {seed.name}
            </p>
            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
              {seed.category}
            </Badge>
          </div>
        </div>
        {ownedQty > 0n && (
          <Badge className="text-[9px] px-1.5 h-4 bg-primary/20 text-primary border-primary/30">
            x{ownedQty.toString()}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>⏱</span>
          <span>{formatTime(seed.growTimeSeconds)}</span>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <span>💰</span>
          <span>{formatDollars(seed.sellPrice)}</span>
        </div>
      </div>

      <Button
        size="sm"
        className="w-full h-7 text-xs"
        variant={canAfford ? "default" : "secondary"}
        disabled={!canAfford || isMutating}
        onClick={() => buySeed(seed.id)}
        data-ocid="shop.primary_button"
      >
        {isMutating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        Buy {formatDollars(seed.seedCost)}
      </Button>
    </motion.div>
  );
}

function PackCard({ pack }: { pack: SeedPack }) {
  const { buyPack, playerState, isMutating, formatDollars, gameData } =
    useGameState();
  const canAfford = playerState ? playerState.balance >= pack.price : false;
  const seeds = gameData?.seeds ?? [];

  return (
    <motion.div
      className="seed-card bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start gap-2">
        <span className="text-3xl">📦</span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm font-semibold">{pack.name}</p>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">
            {pack.description}
          </p>
        </div>
      </div>

      {/* Pack contents */}
      <div className="bg-muted/30 rounded-lg p-2">
        <p className="text-[10px] text-muted-foreground font-semibold mb-1.5">
          CONTAINS:
        </p>
        <div className="flex flex-wrap gap-1">
          {pack.seeds.map(([seedId, qty]) => {
            const seed = seeds.find((s) => s.id === seedId);
            return seed ? (
              <span
                key={seedId}
                className="flex items-center gap-0.5 text-[10px] bg-card rounded px-1.5 py-0.5 border border-border"
              >
                {seed.emoji} x{qty.toString()}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <Button
        className="w-full"
        variant={canAfford ? "default" : "secondary"}
        disabled={!canAfford || isMutating}
        onClick={() => buyPack(pack.id)}
        data-ocid="shop.primary_button"
      >
        {isMutating ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <span className="mr-1">🛒</span>
        )}
        Buy Pack — {formatDollars(pack.price)}
      </Button>
    </motion.div>
  );
}

export default function Shop() {
  const { gameData } = useGameState();
  const seeds = gameData?.seeds ?? [];
  const packs = gameData?.packs ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🏪</span>
        <h2 className="font-display text-base font-semibold">Garden Shop</h2>
      </div>

      <Tabs defaultValue="seeds" className="flex flex-col flex-1 min-h-0">
        <TabsList className="grid grid-cols-2 mb-3" data-ocid="shop.tab">
          <TabsTrigger value="seeds" data-ocid="shop.tab">
            🌱 Seeds ({seeds.length})
          </TabsTrigger>
          <TabsTrigger value="packs" data-ocid="shop.tab">
            📦 Packs ({packs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seeds" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div
              className="grid grid-cols-2 gap-2 pb-4"
              data-ocid="shop.seeds.list"
            >
              {seeds.length === 0 ? (
                <div
                  className="col-span-2 text-center py-8 text-muted-foreground"
                  data-ocid="shop.empty_state"
                >
                  <p className="text-3xl mb-2">🌫️</p>
                  <p className="text-sm">Loading seeds...</p>
                </div>
              ) : (
                seeds.map((seed) => <SeedCard key={seed.id} seed={seed} />)
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="packs" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div
              className="flex flex-col gap-3 pb-4"
              data-ocid="shop.packs.list"
            >
              {packs.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="shop.empty_state"
                >
                  <p className="text-3xl mb-2">🌫️</p>
                  <p className="text-sm">Loading packs...</p>
                </div>
              ) : (
                packs.map((pack) => <PackCard key={pack.id} pack={pack} />)
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
