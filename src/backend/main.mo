import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  public type Seed = {
    id : Text;
    name : Text;
    seedCost : Int;
    growTimeSeconds : Int;
    sellPrice : Int;
    emoji : Text;
    category : Text;
  };

  public type SeedPack = {
    id : Text;
    name : Text;
    description : Text;
    price : Int;
    seeds : [(Text, Int)];
  };

  public type PlotState = {
    #empty;
    #growing : {
      seedId : Text;
      plantedAt : Time.Time;
      harvestReady : Time.Time;
    };
    #harvestable : {
      seedId : Text;
      plantedAt : Time.Time;
    };
  };

  public type PlayerState = {
    balance : Int;
    seedInventory : [(Text, Int)];
    gardenPlots : [PlotState];
  };

  public type GameData = {
    seeds : [Seed];
    packs : [SeedPack];
  };

  let seeds : [Seed] = [
    {
      id = "tomato";
      name = "Tomato";
      seedCost = 200;
      growTimeSeconds = 3600;
      sellPrice = 500;
      emoji = "🍅";
      category = "veggie";
    },
    {
      id = "carrot";
      name = "Carrot";
      seedCost = 150;
      growTimeSeconds = 3000;
      sellPrice = 400;
      emoji = "🥕";
      category = "veggie";
    },
    {
      id = "sunflower";
      name = "Sunflower";
      seedCost = 100;
      growTimeSeconds = 2400;
      sellPrice = 300;
      emoji = "🌻";
      category = "flower";
    },
    {
      id = "pumpkin";
      name = "Pumpkin";
      seedCost = 300;
      growTimeSeconds = 5400;
      sellPrice = 800;
      emoji = "🎃";
      category = "veggie";
    },
    {
      id = "strawberry";
      name = "Strawberry";
      seedCost = 250;
      growTimeSeconds = 3600;
      sellPrice = 600;
      emoji = "🍓";
      category = "fruit";
    },
    {
      id = "watermelon";
      name = "Watermelon";
      seedCost = 400;
      growTimeSeconds = 7200;
      sellPrice = 1000;
      emoji = "🍉";
      category = "fruit";
    },
    {
      id = "corn";
      name = "Corn";
      seedCost = 200;
      growTimeSeconds = 3600;
      sellPrice = 500;
      emoji = "🌽";
      category = "veggie";
    },
    {
      id = "pepper";
      name = "Pepper";
      seedCost = 180;
      growTimeSeconds = 3300;
      sellPrice = 450;
      emoji = "🌶️";
      category = "veggie";
    },
    {
      id = "eggplant";
      name = "Eggplant";
      seedCost = 220;
      growTimeSeconds = 3900;
      sellPrice = 550;
      emoji = "🍆";
      category = "veggie";
    },
    {
      id = "potato";
      name = "Potato";
      seedCost = 160;
      growTimeSeconds = 3200;
      sellPrice = 420;
      emoji = "🥔";
      category = "veggie";
    },
    {
      id = "cucumber";
      name = "Cucumber";
      seedCost = 180;
      growTimeSeconds = 3400;
      sellPrice = 460;
      emoji = "🥒";
      category = "veggie";
    },
    {
      id = "lettuce";
      name = "Lettuce";
      seedCost = 140;
      growTimeSeconds = 2800;
      sellPrice = 380;
      emoji = "🥬";
      category = "veggie";
    },
    {
      id = "beet";
      name = "Beet";
      seedCost = 170;
      growTimeSeconds = 3100;
      sellPrice = 410;
      emoji = "🫛";
      category = "veggie";
    },
    {
      id = "radish";
      name = "Radish";
      seedCost = 130;
      growTimeSeconds = 2700;
      sellPrice = 370;
      emoji = "🌽";
      category = "veggie";
    },
    {
      id = "onion";
      name = "Onion";
      seedCost = 150;
      growTimeSeconds = 2900;
      sellPrice = 390;
      emoji = "🥒";
      category = "veggie";
    },
    {
      id = "garlic";
      name = "Garlic";
      seedCost = 160;
      growTimeSeconds = 3000;
      sellPrice = 400;
      emoji = "🥬";
      category = "veggie";
    },
    {
      id = "blueberry";
      name = "Blueberry";
      seedCost = 300;
      growTimeSeconds = 4800;
      sellPrice = 700;
      emoji = "🫐";
      category = "fruit";
    },
    {
      id = "rose";
      name = "Rose";
      seedCost = 200;
      growTimeSeconds = 3600;
      sellPrice = 500;
      emoji = "🌹";
      category = "flower";
    },
    {
      id = "lavender";
      name = "Lavender";
      seedCost = 180;
      growTimeSeconds = 3300;
      sellPrice = 450;
      emoji = "🪻";
      category = "flower";
    },
    {
      id = "basil";
      name = "Basil";
      seedCost = 120;
      growTimeSeconds = 2400;
      sellPrice = 320;
      emoji = "🌿";
      category = "herb";
    },
    {
      id = "mint";
      name = "Mint";
      seedCost = 130;
      growTimeSeconds = 2500;
      sellPrice = 330;
      emoji = "🌱";
      category = "herb";
    },
    {
      id = "pea";
      name = "Pea";
      seedCost = 160;
      growTimeSeconds = 3000;
      sellPrice = 400;
      emoji = "🫛";
      category = "veggie";
    },
    {
      id = "bean";
      name = "Bean";
      seedCost = 170;
      growTimeSeconds = 3100;
      sellPrice = 410;
      emoji = "🌱";
      category = "veggie";
    },
    {
      id = "zucchini";
      name = "Zucchini";
      seedCost = 210;
      growTimeSeconds = 3700;
      sellPrice = 520;
      emoji = "🥒";
      category = "veggie";
    },
  ];

  let packs : [SeedPack] = [
    {
      id = "starter";
      name = "Starter Pack";
      description = "A mix of veggies to get you started";
      price = 500;
      seeds = [("tomato", 3), ("carrot", 3), ("pumpkin", 2)];
    },
    {
      id = "veggie";
      name = "Veggie Pack";
      description = "A selection of fresh vegetables";
      price = 800;
      seeds = [
        ("tomato", 2),
        ("carrot", 2),
        ("pumpkin", 2),
        ("corn", 2),
        ("pepper", 2),
        ("potato", 2),
      ];
    },
    {
      id = "fruit";
      name = "Fruit Pack";
      description = "Sweet and delicious fruits";
      price = 1200;
      seeds = [("strawberry", 3), ("watermelon", 3), ("blueberry", 2)];
    },
    {
      id = "herb";
      name = "Herb Pack";
      description = "Aromatic herbs for your garden";
      price = 700;
      seeds = [("basil", 4), ("mint", 4)];
    },
    {
      id = "flower";
      name = "Flower Pack";
      description = "Beautiful flowers for your garden";
      price = 1000;
      seeds = [("sunflower", 3), ("rose", 3), ("lavender", 2)];
    },
  ];

  let playerStates = Map.empty<Principal, PlayerState>();

  public shared ({ caller }) func getGameData() : async GameData {
    { seeds; packs };
  };

  func initializeGardenPlots() : [PlotState] {
    Array.tabulate<PlotState>(
      30,
      func(_) { #empty },
    );
  };

  func initializeInventory() : [(Text, Int)] {
    [("tomato", 3), ("carrot", 3), ("pumpkin", 2)];
  };

  func createEmptyPlayerState() : PlayerState {
    {
      balance = 5000;
      seedInventory = initializeInventory();
      gardenPlots = initializeGardenPlots();
    };
  };

  public shared ({ caller }) func getPlayerState() : async PlayerState {
    switch (playerStates.get(caller)) {
      case (null) {
        let newState = createEmptyPlayerState();
        playerStates.add(caller, newState);
        newState;
      };
      case (?state) { state };
    };
  };

  func findSeedById(seeds : [Seed], seedId : Text) : ?Seed {
    switch (seeds.find(func(s) { s.id == seedId })) {
      case (null) { null };
      case (?seed) { ?seed };
    };
  };

  func findPackById(packs : [SeedPack], packId : Text) : ?SeedPack {
    switch (packs.find(func(p) { p.id == packId })) {
      case (null) { null };
      case (?pack) { ?pack };
    };
  };

  func getSeedQuantity(inventory : [(Text, Int)], seedId : Text) : Int {
    switch (inventory.find(func((id, _)) { id == seedId })) {
      case (?(_, quantity)) { quantity };
      case (null) { 0 };
    };
  };

  func updateSeedQuantity(inventory : [(Text, Int)], seedId : Text, newQuantity : Int) : [(Text, Int)] {
    if (newQuantity <= 0) {
      inventory.filter(func((id, _)) { id != seedId });
    } else {
      let filtered = inventory.filter(func((id, _)) { id != seedId });
      filtered.concat([(seedId, newQuantity)]);
    };
  };

  public shared ({ caller }) func buySeed(seedId : Text) : async PlayerState {
    let gameData = await getGameData();
    let seed = switch (findSeedById(gameData.seeds, seedId)) {
      case (null) { Runtime.trap("Seed not found.") };
      case (?s) { s };
    };

    let currentState = switch (playerStates.get(caller)) {
      case (null) { createEmptyPlayerState() };
      case (?state) { state };
    };

    if (currentState.balance < seed.seedCost) {
      Runtime.trap("Insufficient balance!");
    };

    let newInventory = updateSeedQuantity(
      currentState.seedInventory,
      seedId,
      getSeedQuantity(currentState.seedInventory, seedId) + 1,
    );

    let newState = {
      balance = currentState.balance - seed.seedCost;
      seedInventory = newInventory;
      gardenPlots = currentState.gardenPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };

  public shared ({ caller }) func buyPack(packId : Text) : async PlayerState {
    let gameData = await getGameData();
    let pack = switch (findPackById(gameData.packs, packId)) {
      case (null) { Runtime.trap("Pack not found.") };
      case (?p) { p };
    };

    let currentState = switch (playerStates.get(caller)) {
      case (null) { createEmptyPlayerState() };
      case (?state) { state };
    };

    if (currentState.balance < pack.price) {
      Runtime.trap("Insufficient balance for pack!");
    };

    var newInventory = currentState.seedInventory;
    for ((seedId, quantity) in pack.seeds.values()) {
      let currentQty = getSeedQuantity(newInventory, seedId);
      newInventory := updateSeedQuantity(newInventory, seedId, currentQty + quantity);
    };

    let newState = {
      balance = currentState.balance - pack.price;
      seedInventory = newInventory;
      gardenPlots = currentState.gardenPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };

  public shared ({ caller }) func plantSeed(plotId : Int, seedId : Text) : async PlayerState {
    let gameData = await getGameData();
    let seed = switch (findSeedById(gameData.seeds, seedId)) {
      case (null) { Runtime.trap("Seed not found.") };
      case (?s) { s };
    };

    let currentState = switch (playerStates.get(caller)) {
      case (null) { createEmptyPlayerState() };
      case (?state) { state };
    };

    if (plotId < 0 or plotId >= 30) {
      Runtime.trap("Invalid plot ID");
    };

    if (getSeedQuantity(currentState.seedInventory, seedId) < 1) {
      Runtime.trap("Insufficient seed quantity");
    };

    let newInventory = updateSeedQuantity(
      currentState.seedInventory,
      seedId,
      getSeedQuantity(currentState.seedInventory, seedId) - 1,
    );

    let newPlots = Array.tabulate(
      30,
      func(i) {
        if (i == plotId.toNat()) {
          #growing(
            {
              seedId;
              plantedAt = Time.now();
              harvestReady = Time.now() + (seed.growTimeSeconds * 1_000_000_000);
            },
          );
        } else {
          currentState.gardenPlots[i];
        };
      },
    );

    let newState = {
      balance = currentState.balance;
      seedInventory = newInventory;
      gardenPlots = newPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };

  public shared ({ caller }) func harvestPlot(plotId : Int) : async PlayerState {
    let currentState = switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) { state };
    };

    if (plotId < 0 or plotId >= 30) {
      Runtime.trap("Invalid plot ID");
    };

    let plotValue = currentState.gardenPlots[plotId.toNat()];
    let (seedId, crop) = switch (plotValue) {
      case (
        #growing({
          seedId;
          plantedAt;
          harvestReady;
        })
      ) {
        if (Time.now() >= harvestReady) {
          (seedId, #harvestable({ seedId; plantedAt = Time.now() }));
        } else { Runtime.trap("Not ready for harvest") };
      };
      case (_) { Runtime.trap("Plot not harvestable") };
    };

    let newPlots = Array.tabulate(
      30,
      func(i) {
        if (i == plotId.toNat()) { crop } else {
          currentState.gardenPlots[i];
        };
      },
    );

    let newInventory = updateSeedQuantity(
      currentState.seedInventory,
      seedId,
      getSeedQuantity(currentState.seedInventory, seedId) + 1,
    );

    let newState = {
      balance = currentState.balance;
      seedInventory = newInventory;
      gardenPlots = newPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };

  public shared ({ caller }) func sellCrop(seedId : Text, quantity : Int) : async PlayerState {
    if (quantity <= 0) { Runtime.trap("Invalid quantity") };

    let gameData = await getGameData();
    let seed = switch (findSeedById(gameData.seeds, seedId)) {
      case (null) { Runtime.trap("Seed not found") };
      case (?s) { s };
    };

    let currentState = switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) { state };
    };

    if (getSeedQuantity(currentState.seedInventory, seedId) < quantity) {
      Runtime.trap("Insufficient crop quantity");
    };

    let newInventory = updateSeedQuantity(
      currentState.seedInventory,
      seedId,
      getSeedQuantity(currentState.seedInventory, seedId) - quantity,
    );

    let newBalance = currentState.balance + (seed.sellPrice * quantity);

    let newState = {
      balance = newBalance;
      seedInventory = newInventory;
      gardenPlots = currentState.gardenPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };

  public shared ({ caller }) func resetPlot(plotId : Int) : async PlayerState {
    let currentState = switch (playerStates.get(caller)) {
      case (null) { Runtime.trap("Player state not found") };
      case (?state) { state };
    };

    if (plotId < 0 or plotId >= 30) {
      Runtime.trap("Invalid plot ID");
    };

    let newPlots = Array.tabulate(
      30,
      func(i) {
        if (i == plotId.toNat()) { #empty } else {
          currentState.gardenPlots[i];
        };
      },
    );

    let newState = {
      balance = currentState.balance;
      seedInventory = currentState.seedInventory;
      gardenPlots = newPlots;
    };

    playerStates.add(caller, newState);
    newState;
  };
};
