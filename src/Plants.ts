const PLANTS: PlantType[] = [
  {
    name: "Herba",
    seedPrice: 0,
    plantPrice: 1,
    steps: ["weed_seed", "weed_growth", "weed_plant"],
    ticksPerStep: 3,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Igniflos",
    seedPrice: 3,
    plantPrice: 8,
    steps: ["fireflower_seed", "fireflower_growth", "fireflower_plant"],
    ticksPerStep: 5,
    shape: [{ x: 0, y: 0 }],
  },
  {
    name: "Longifel",
    seedPrice: 12,
    plantPrice: 8,
    steps: ["longifel_seed", "longifel_step1", "longifel_step2", "longifel_final"],
    ticksPerStep: 5,
    shape: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
  },
  {
    name: "Quadcapsa",
    seedPrice: 25,
    plantPrice: 18,
    steps: ["box_seed", "box_step1", "box_step2", "box_final"],
    ticksPerStep: 14,
    shape: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
  },
  {
    name: "Skaltyus",
    seedPrice: 50,
    plantPrice: 28,
    steps: ["cloud_seed", "cloud_step1", "cloud_step2", "cloud_final"],
    ticksPerStep: 7,
    shape: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }],
  },
  {
    name: "Glacruxiem",
    seedPrice: 90,
    plantPrice: 24,
    steps: ["glacruxiem_seed", "glacruxiem_step1", "glacruxiem_step2", "glacruxiem_final"],
    ticksPerStep: 5,
    shape: [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
  },
  {
    name: "Viridipiou",
    seedPrice: 80,
    plantPrice: 35,
    steps: ["viridipiou_seed", "viridipiou_step", "viridipiou_final"],
    ticksPerStep: 15,
    shape: [
      { x: -1, y: -1 }, { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 },
    ],
  },
  {
    name: "Doughnut",
    seedPrice: 120,
    plantPrice: 22,
    steps: ["doughnut_seed", "doughnut_growth", "doughnut_plant"],
    ticksPerStep: 12,
    shape: [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
    ],
  },
];

// Uncomment when trying to balance the difficulty
//
// PLANTS.forEach(plant => {
//   const requiredTicks = plant.ticksPerStep * (plant.steps.length - 1);
//   const benefits = plant.plantPrice * plant.shape.length - plant.seedPrice;
//   console.log(plant.name, benefits / requiredTicks, "gold per ticks");
// });

// Preload all images
const IMAGES = new Map<string, string>();
IMAGES.set("EARTH", "sprites/earth_grid.png");
IMAGES.set("EMPTY", "sprites/empty_grid.png");
IMAGES.set("SELL", "sprites/sell_icon.png");
PLANTS.flatMap(x => x.steps).forEach(x => IMAGES.set(x, `sprites/${x}.png`));

// God help us
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

export { PLANTS, IMAGES };
