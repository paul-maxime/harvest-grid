const PLANTS: PlantType[] = [
  {
    name: "Weed",
    seedPrice: 0,
    plantPrice: 1,
    unlockPrice: 0,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 3,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Fireflower",
    seedPrice: 10,
    plantPrice: 20,
    unlockPrice: 1,
    steps: ["fireflower_seed", "fireflower_plant"],
    ticksPerStep: 10,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Test line 1",
    seedPrice: 1,
    plantPrice: 2,
    unlockPrice: 2,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 2,
    shape: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
  },
  {
    name: "Test line 2",
    seedPrice: 1,
    plantPrice: 2,
    unlockPrice: 3,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 2,
    shape: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }],
  },
  {
    name: "Test donut",
    seedPrice: 1,
    plantPrice: 2,
    unlockPrice: 4,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 2,
    shape: [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ],
  },
  {
    name: "Test plus",
    seedPrice: 1,
    plantPrice: 2,
    unlockPrice: 5,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 2,
    shape: [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
  },
];

PLANTS.forEach(plant => {
  const requiredTicks = plant.ticksPerStep * plant.steps.length;
  const benefits = plant.plantPrice * plant.shape.length - plant.seedPrice;
  console.log(plant.name, benefits / requiredTicks, "gold per ticks");
});

const IMAGES = new Map<string, string>();
IMAGES.set("EARTH", "sprites/earth_grid.png");
IMAGES.set("EMPTY", "sprites/empty_grid.png");
IMAGES.set("SELL", "sprites/sell_icon.png");
PLANTS.flatMap(x => x.steps).forEach(x => { IMAGES.set(x, `sprites/${x}.png`); });

export { PLANTS, IMAGES };
