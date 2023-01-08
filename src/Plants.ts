const PLANTS: PlantType[] = [
  {
    name: "Herba",
    seedPrice: 0,
    plantPrice: 1,
    unlockPrice: 0,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 3,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Igniflos",
    seedPrice: 3,
    plantPrice: 8,
    unlockPrice: 3,
    steps: ["fireflower_seed", "fireflower_growth", "fireflower_plant"],
    ticksPerStep: 5,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Longifel",
    seedPrice: 10,
    plantPrice: 8,
    unlockPrice: 10,
    steps: ["longifel_seed", "longifel_step1", "longifel_step2", "longifel_final"],
    ticksPerStep: 5,
    shape: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
  },
  {
    name: "Glacruxiem",
    seedPrice: 30,
    plantPrice: 10,
    unlockPrice: 5,
    steps: ["glacruxiem_seed", "glacruxiem_step1", "glacruxiem_step2", "glacruxiem_final"],
    ticksPerStep: 5,
    shape: [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
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
      { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
    ],
  },
];

PLANTS.forEach(plant => {
  const requiredTicks = plant.ticksPerStep * (plant.steps.length - 1);
  const benefits = plant.plantPrice * plant.shape.length - plant.seedPrice;
  console.log(plant.name, benefits / requiredTicks, "gold per ticks");
});

const IMAGES = new Map<string, string>();
IMAGES.set("EARTH", "sprites/earth_grid.png");
IMAGES.set("EMPTY", "sprites/empty_grid.png");
IMAGES.set("EARTH-0-0-0-0-0-0-0-0", "sprites/earth-0-0-0-0-0-0-0-0.png");
IMAGES.set("EARTH-1-0-0-0-1-1-0-0", "sprites/earth-1-0-0-0-1-1-0-0.png");
IMAGES.set("EARTH-0-1-0-0-0-0-1-1", "sprites/earth-0-1-0-0-0-0-1-1.png");
IMAGES.set("EARTH-0-0-1-0-1-0-1-0", "sprites/earth-0-0-1-0-1-0-1-0.png");
IMAGES.set("EARTH-0-0-0-1-0-1-0-1", "sprites/earth-0-0-0-1-0-1-0-1.png");
IMAGES.set("EARTH-1-1-0-0-1-1-1-1", "sprites/earth-1-1-0-0-1-1-1-1.png");
IMAGES.set("EARTH-1-0-1-0-1-1-1-0", "sprites/earth-1-0-1-0-1-1-1-0.png");
IMAGES.set("EARTH-1-0-0-1-1-1-0-1", "sprites/earth-1-0-0-1-1-1-0-1.png");
IMAGES.set("EARTH-0-1-1-0-1-0-1-1", "sprites/earth-0-1-1-0-1-0-1-1.png");
IMAGES.set("EARTH-0-1-0-1-0-1-1-1", "sprites/earth-0-1-0-1-0-1-1-1.png");
IMAGES.set("EARTH-0-0-1-1-1-1-1-1", "sprites/earth-0-0-1-1-1-1-1-1.png");
IMAGES.set("EARTH-1-1-1-0-1-1-1-1", "sprites/earth-1-1-1-0-1-1-1-1.png");
IMAGES.set("EARTH-1-1-0-1-1-1-1-1", "sprites/earth-1-1-0-1-1-1-1-1.png");
IMAGES.set("EARTH-1-0-1-1-1-1-1-1", "sprites/earth-1-0-1-1-1-1-1-1.png");
IMAGES.set("EARTH-0-1-1-1-1-1-1-1", "sprites/earth-0-1-1-1-1-1-1-1.png");
IMAGES.set("EARTH-0-0-0-0-1-0-0-0", "sprites/earth-0-0-0-0-1-0-0-0.png");
IMAGES.set("EARTH-0-0-0-0-0-1-0-0", "sprites/earth-0-0-0-0-0-1-0-0.png");
IMAGES.set("EARTH-0-0-0-0-0-0-1-0", "sprites/earth-0-0-0-0-0-0-1-0.png");
IMAGES.set("EARTH-0-0-0-0-0-0-0-1", "sprites/earth-0-0-0-0-0-0-0-1.png");
IMAGES.set("EARTH-0-0-0-0-1-1-1-0", "sprites/earth-0-0-0-0-1-1-1-0.png");
IMAGES.set("EARTH-0-0-0-0-1-1-0-1", "sprites/earth-0-0-0-0-1-1-0-1.png");
IMAGES.set("EARTH-0-0-0-0-1-0-1-1", "sprites/earth-0-0-0-0-1-0-1-1.png");
IMAGES.set("EARTH-0-0-0-0-0-1-1-1", "sprites/earth-0-0-0-0-0-1-1-1.png");
IMAGES.set("EARTH-0-0-0-0-1-1-1-1", "sprites/earth-0-0-0-0-1-1-1-1.png");
IMAGES.set("EARTH-0-0-0-0-1-1-0-0", "sprites/earth-0-0-0-0-1-1-0-0.png");
IMAGES.set("EARTH-0-0-0-0-1-0-1-0", "sprites/earth-0-0-0-0-1-0-1-0.png");
IMAGES.set("EARTH-0-0-0-0-1-0-0-1", "sprites/earth-0-0-0-0-1-0-0-1.png");
IMAGES.set("EARTH-0-0-0-0-0-1-1-0", "sprites/earth-0-0-0-0-0-1-1-0.png");
IMAGES.set("EARTH-0-0-0-0-0-1-0-1", "sprites/earth-0-0-0-0-0-1-0-1.png");
IMAGES.set("EARTH-0-0-0-0-0-0-1-1", "sprites/earth-0-0-0-0-0-0-1-1.png");
IMAGES.set("EARTH-1-0-0-0-1-1-1-0", "sprites/earth-1-0-0-0-1-1-1-0.png");
IMAGES.set("EARTH-1-0-0-0-1-1-0-1", "sprites/earth-1-0-0-0-1-1-0-1.png");
IMAGES.set("EARTH-1-0-0-0-1-1-1-1", "sprites/earth-1-0-0-0-1-1-1-1.png");
IMAGES.set("EARTH-0-1-0-0-1-0-1-1", "sprites/earth-0-1-0-0-1-0-1-1.png");
IMAGES.set("EARTH-0-1-0-0-0-1-1-1", "sprites/earth-0-1-0-0-0-1-1-1.png");
IMAGES.set("EARTH-0-1-0-0-1-1-1-1", "sprites/earth-0-1-0-0-1-1-1-1.png");
IMAGES.set("EARTH-0-0-1-0-1-1-1-0", "sprites/earth-0-0-1-0-1-1-1-0.png");
IMAGES.set("EARTH-0-0-1-0-1-0-1-1", "sprites/earth-0-0-1-0-1-0-1-1.png");
IMAGES.set("EARTH-0-0-1-0-1-1-1-1", "sprites/earth-0-0-1-0-1-1-1-1.png");
IMAGES.set("EARTH-0-0-0-1-1-1-0-1", "sprites/earth-0-0-0-1-1-1-0-1.png");
IMAGES.set("EARTH-0-0-0-1-0-1-1-1", "sprites/earth-0-0-0-1-0-1-1-1.png");
IMAGES.set("EARTH-0-0-0-1-1-1-1-1", "sprites/earth-0-0-0-1-1-1-1-1.png");
IMAGES.set("EARTH-1-0-1-0-1-1-1-1", "sprites/earth-1-0-1-0-1-1-1-1.png");
IMAGES.set("EARTH-1-0-0-1-1-1-1-1", "sprites/earth-1-0-0-1-1-1-1-1.png");
IMAGES.set("EARTH-0-1-1-0-1-1-1-1", "sprites/earth-0-1-1-0-1-1-1-1.png");
IMAGES.set("EARTH-0-1-0-1-1-1-1-1", "sprites/earth-0-1-0-1-1-1-1-1.png");
IMAGES.set("SELL", "sprites/sell_icon.png");
PLANTS.flatMap(x => x.steps).forEach(x => { IMAGES.set(x, `sprites/${x}.png`); });

export { PLANTS, IMAGES };
