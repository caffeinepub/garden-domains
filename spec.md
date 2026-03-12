# Garden Domains

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full gardening simulation game called "GARDEN DOMAINS"
- Garden grid map where player plants/grows/harvests crops
- 20+ unique seeds/plants (tomato, carrot, sunflower, pumpkin, strawberry, watermelon, corn, pepper, eggplant, potato, cucumber, lettuce, beet, radish, onion, garlic, blueberry, rose, lavender, basil, mint, pea, bean, zucchini)
- Seed packs: Starter Pack, Veggie Pack, Fruit Pack, Herb Pack, Flower Pack — each containing multiple seeds at a bundle discount
- Plant lifecycle: Plant seed -> Growing -> Ready to harvest
- Sell harvested crops to an in-game Seller for $ dollars
- Shop to buy individual seeds or seed packs using $
- Starting balance of $50
- Garden map with 5x6 plot grid (30 plots)
- Lush, green, nature-themed UI — garden aesthetic
- Each crop has unique grow time, sell price, and seed cost

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Player state (balance, inventory, garden plots), seed/crop data, plant/harvest/sell/buy actions
2. Frontend: Garden map grid, seed shop with packs, seller panel, crop lifecycle UI with timers, garden-themed visual design
3. Game loop: Plant seed on plot -> wait grow time -> harvest -> sell -> buy more seeds
