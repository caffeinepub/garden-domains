import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import type { GameData, PlayerState, Seed, SeedPack } from "../backend";
import { useActor } from "./useActor";

export type { Seed, SeedPack, GameData, PlayerState };
export type { PlotState } from "../backend";

export interface GameStateCtx {
  gameData: GameData | null;
  playerState: PlayerState | null;
  cropInventory: Record<string, bigint>;
  selectedSeedId: string | null;
  setSelectedSeedId: (id: string | null) => void;
  isLoading: boolean;
  isMutating: boolean;
  buySeed: (seedId: string) => Promise<void>;
  buyPack: (packId: string) => Promise<void>;
  plantSeed: (plotId: number, seedId: string) => Promise<void>;
  harvestPlot: (plotId: number) => Promise<void>;
  sellCrop: (seedId: string, quantity: bigint) => Promise<void>;
  sellAllCrop: (seedId: string) => Promise<void>;
  resetPlot: (plotId: number) => Promise<void>;
  formatDollars: (cents: bigint) => string;
}

const GameStateContext = createContext<GameStateCtx | null>(null);

export function useGameState(): GameStateCtx {
  const ctx = useContext(GameStateContext);
  if (!ctx)
    throw new Error("useGameState must be used inside GameStateProvider");
  return ctx;
}

export { GameStateContext };

export function formatDollars(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export function useGameStateProvider(): GameStateCtx {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [cropInventory, setCropInventory] = useState<Record<string, bigint>>(
    {},
  );
  const [isMutating, setIsMutating] = useState(false);

  // Game data (seeds + packs) — fetch once
  const { data: gameData, isLoading: gameDataLoading } = useQuery<GameData>({
    queryKey: ["gameData"],
    queryFn: async () => {
      if (!actor) return { seeds: [], packs: [] };
      return actor.getGameData();
    },
    enabled: !!actor && !actorFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Player state — poll every 5s
  const { data: playerState, isLoading: playerLoading } = useQuery<PlayerState>(
    {
      queryKey: ["playerState"],
      queryFn: async () => {
        if (!actor) return null as unknown as PlayerState;
        return actor.getPlayerState();
      },
      enabled: !!actor && !actorFetching,
      refetchInterval: 5000,
    },
  );

  const isLoading =
    (gameDataLoading || playerLoading) && !gameData && !playerState;

  const invalidatePlayer = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["playerState"] });
  }, [queryClient]);

  const withMutation = useCallback(
    async <T>(
      fn: () => Promise<T>,
      onSuccess?: (result: T) => void,
    ): Promise<T> => {
      setIsMutating(true);
      try {
        const result = await fn();
        invalidatePlayer();
        onSuccess?.(result);
        return result;
      } finally {
        setIsMutating(false);
      }
    },
    [invalidatePlayer],
  );

  const buySeed = useCallback(
    async (seedId: string) => {
      if (!actor) return;
      await withMutation(
        () => actor.buySeed(seedId),
        () => {
          const seed = gameData?.seeds.find((s) => s.id === seedId);
          toast.success(`Bought ${seed?.emoji ?? ""} ${seed?.name ?? "seed"}!`);
        },
      );
    },
    [actor, withMutation, gameData],
  );

  const buyPack = useCallback(
    async (packId: string) => {
      if (!actor) return;
      await withMutation(
        () => actor.buyPack(packId),
        () => {
          const pack = gameData?.packs.find((p) => p.id === packId);
          toast.success(`📦 Bought ${pack?.name ?? "pack"}!`);
        },
      );
    },
    [actor, withMutation, gameData],
  );

  const plantSeed = useCallback(
    async (plotId: number, seedId: string) => {
      if (!actor) return;
      await withMutation(
        () => actor.plantSeed(BigInt(plotId), seedId),
        () => {
          const seed = gameData?.seeds.find((s) => s.id === seedId);
          toast.success(
            `🌱 Planted ${seed?.name ?? "seed"} in plot ${plotId + 1}!`,
          );
          setSelectedSeedId(null);
        },
      );
    },
    [actor, withMutation, gameData],
  );

  const harvestPlot = useCallback(
    async (plotId: number) => {
      if (!actor || !playerState) return;
      const plot = playerState.gardenPlots[plotId];
      if (plot.__kind__ !== "harvestable") return;
      const seedId = plot.harvestable.seedId;
      await withMutation(
        () => actor.harvestPlot(BigInt(plotId)),
        () => {
          const seed = gameData?.seeds.find((s) => s.id === seedId);
          setCropInventory((prev) => ({
            ...prev,
            [seedId]: (prev[seedId] ?? 0n) + 1n,
          }));
          toast.success(
            `🌾 Harvested ${seed?.emoji ?? ""} ${seed?.name ?? "crop"}!`,
          );
        },
      );
    },
    [actor, withMutation, playerState, gameData],
  );

  const sellCrop = useCallback(
    async (seedId: string, quantity: bigint) => {
      if (!actor) return;
      await withMutation(
        () => actor.sellCrop(seedId, quantity),
        () => {
          const seed = gameData?.seeds.find((s) => s.id === seedId);
          const earnings = (seed?.sellPrice ?? 0n) * quantity;
          setCropInventory((prev) => {
            const remaining = (prev[seedId] ?? 0n) - quantity;
            const next = { ...prev };
            if (remaining <= 0n) delete next[seedId];
            else next[seedId] = remaining;
            return next;
          });
          toast.success(
            `💰 Sold ${quantity}x ${seed?.name ?? "crop"} for ${formatDollars(earnings)}!`,
          );
        },
      );
    },
    [actor, withMutation, gameData],
  );

  const sellAllCrop = useCallback(
    async (seedId: string) => {
      const qty = cropInventory[seedId] ?? 0n;
      if (qty <= 0n) return;
      await sellCrop(seedId, qty);
    },
    [cropInventory, sellCrop],
  );

  const resetPlot = useCallback(
    async (plotId: number) => {
      if (!actor) return;
      await withMutation(
        () => actor.resetPlot(BigInt(plotId)),
        () => toast("Plot cleared"),
      );
    },
    [actor, withMutation],
  );

  return {
    gameData: gameData ?? null,
    playerState: playerState ?? null,
    cropInventory,
    selectedSeedId,
    setSelectedSeedId,
    isLoading,
    isMutating,
    buySeed,
    buyPack,
    plantSeed,
    harvestPlot,
    sellCrop,
    sellAllCrop,
    resetPlot,
    formatDollars,
  };
}

export default GameStateContext;
