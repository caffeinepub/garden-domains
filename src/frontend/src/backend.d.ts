import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GameData {
    seeds: Array<Seed>;
    packs: Array<SeedPack>;
}
export interface Seed {
    id: string;
    growTimeSeconds: bigint;
    seedCost: bigint;
    name: string;
    sellPrice: bigint;
    emoji: string;
    category: string;
}
export interface SeedPack {
    id: string;
    name: string;
    description: string;
    seeds: Array<[string, bigint]>;
    price: bigint;
}
export type Time = bigint;
export type PlotState = {
    __kind__: "empty";
    empty: null;
} | {
    __kind__: "growing";
    growing: {
        plantedAt: Time;
        seedId: string;
        harvestReady: Time;
    };
} | {
    __kind__: "harvestable";
    harvestable: {
        plantedAt: Time;
        seedId: string;
    };
};
export interface PlayerState {
    balance: bigint;
    seedInventory: Array<[string, bigint]>;
    gardenPlots: Array<PlotState>;
}
export interface backendInterface {
    buyPack(packId: string): Promise<PlayerState>;
    buySeed(seedId: string): Promise<PlayerState>;
    getGameData(): Promise<GameData>;
    getPlayerState(): Promise<PlayerState>;
    harvestPlot(plotId: bigint): Promise<PlayerState>;
    plantSeed(plotId: bigint, seedId: string): Promise<PlayerState>;
    resetPlot(plotId: bigint): Promise<PlayerState>;
    sellCrop(seedId: string, quantity: bigint): Promise<PlayerState>;
}
