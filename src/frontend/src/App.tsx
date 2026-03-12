import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Leaf, ShoppingBag, Sprout } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useMemo } from "react";
import GardenMap from "./components/GardenMap";
import SeedInventory from "./components/SeedInventory";
import SellPanel from "./components/SellPanel";
import Shop from "./components/Shop";
import GameStateContext, { useGameStateProvider } from "./hooks/useGameState";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2 },
  },
});

function GameUI() {
  const state = useGameStateProvider();
  const { playerState, isLoading, formatDollars } = state;

  const balance = playerState?.balance ?? 0n;
  const isBroke =
    !isLoading &&
    playerState &&
    playerState.balance < 100n &&
    playerState.seedInventory.every(([, q]) => q === 0n) &&
    playerState.gardenPlots.every((p) => p.__kind__ === "empty");

  return (
    <GameStateContext.Provider value={state}>
      <div className="min-h-screen flex flex-col">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.12 0.03 148 / 0.95), oklch(0.12 0.03 148 / 0.80))",
            }}
          />
          <div className="relative max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <motion.div
                className="text-3xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                🌿
              </motion.div>
              <div>
                <h1 className="font-display text-xl font-bold title-shimmer leading-tight">
                  GARDEN DOMAINS
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Grow · Harvest · Prosper
                </p>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="hidden md:flex items-center gap-2 text-muted-foreground/40 mx-2">
              <span>🌸</span>
              <span>🦋</span>
              <span>🌼</span>
            </div>

            {/* Balance */}
            <motion.div
              className="ml-auto flex items-center gap-2 bg-card/80 border border-border rounded-xl px-4 py-2"
              whileHover={{ scale: 1.02 }}
              data-ocid="header.balance"
            >
              <span className="coin-bounce text-lg">💰</span>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Balance
                </p>
                <p className="font-display text-lg font-bold text-accent leading-tight">
                  {isLoading ? "—" : formatDollars(balance)}
                </p>
              </div>
            </motion.div>

            {/* Status icons */}
            <div className="hidden lg:flex items-center gap-2 text-muted-foreground text-sm">
              <span title="Your Garden" className="flex items-center gap-1">
                <Sprout className="h-4 w-4 text-primary" />
                <span className="text-xs">
                  {playerState?.gardenPlots.filter(
                    (p) => p.__kind__ !== "empty",
                  ).length ?? 0}
                  /30
                </span>
              </span>
              <span title="Seeds" className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">
                  {playerState?.seedInventory
                    .reduce((s, [, q]) => s + q, 0n)
                    .toString() ?? "0"}
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* ── Broke State ── */}
        {isBroke && (
          <motion.div
            className="mx-4 mt-4 p-4 bg-destructive/20 border border-destructive/50 rounded-xl text-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="header.error_state"
          >
            <p className="text-2xl mb-1">😢</p>
            <p className="font-display font-semibold text-sm">
              Uh oh! Your garden is empty and your wallet is dry.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You need at least $1.00 to buy a seed. Plant more next time!
            </p>
          </motion.div>
        )}

        {/* ── Main 3-Panel Layout ── */}
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-4 flex gap-4 min-h-0">
          {/* Left Sidebar */}
          <aside className="w-56 shrink-0 flex flex-col gap-4">
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 pr-1">
                {/* Wallet Card */}
                <motion.div
                  className="bg-card border border-border rounded-2xl p-4 shadow-garden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-4 w-4 text-accent" />
                    <span className="font-display text-sm font-semibold">
                      Wallet
                    </span>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      Balance
                    </p>
                    <p className="font-display text-2xl font-bold text-accent">
                      {isLoading ? "..." : formatDollars(balance)}
                    </p>
                  </div>
                </motion.div>

                {/* Seed Inventory */}
                <motion.div
                  className="bg-card border border-border rounded-2xl p-4 shadow-garden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <SeedInventory />
                </motion.div>

                <Separator className="opacity-30" />

                {/* Sell Panel */}
                <motion.div
                  className="bg-card border border-border rounded-2xl p-4 shadow-garden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SellPanel />
                </motion.div>

                {/* Quick Tips */}
                <motion.div
                  className="bg-muted/20 border border-border/50 rounded-2xl p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-[10px] font-display font-semibold text-muted-foreground mb-2">
                    💡 TIPS
                  </p>
                  <ul className="space-y-1 text-[10px] text-muted-foreground">
                    <li>• Buy seeds from the shop →</li>
                    <li>• Click a seed to select it</li>
                    <li>• Click an empty plot to plant</li>
                    <li>• Glowing plots are ready!</li>
                    <li>• Sell crops for profit 💰</li>
                  </ul>
                </motion.div>
              </div>
            </ScrollArea>
          </aside>

          {/* Center: Garden Map */}
          <motion.section
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {isLoading ? (
              <div
                className="h-full flex items-center justify-center text-muted-foreground"
                data-ocid="garden.loading_state"
              >
                <div className="text-center">
                  <motion.p
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    🌱
                  </motion.p>
                  <p className="font-display text-lg">Tending your garden...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Loading game data
                  </p>
                </div>
              </div>
            ) : (
              <GardenMap />
            )}
          </motion.section>

          {/* Right Sidebar: Shop */}
          <aside className="w-64 shrink-0">
            <motion.div
              className="bg-card border border-border rounded-2xl p-4 shadow-garden h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Shop />
            </motion.div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 py-3 text-center">
          <p className="text-[10px] text-muted-foreground/50">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="underline hover:text-muted-foreground transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <Toaster position="bottom-right" richColors />
    </GameStateContext.Provider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameUI />
    </QueryClientProvider>
  );
}
