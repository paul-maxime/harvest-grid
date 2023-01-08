const PLANTS: PlantType[] = [
  {
    name: "Weed",
    seedPrice: 0,
    plantPrice: 1,
    steps: ["weed_seed", "weed_plant"],
    ticksPerStep: 5,
  },
  {
    name: "Fire Flower",
    seedPrice: 10,
    plantPrice: 20,
    steps: ["fireflower_seed", "fireflower_plant"],
    ticksPerStep: 10,
  },
];

const IMAGES = new Map<string, string>();
IMAGES.set("EARTH", "sprites/earth_grid.png");
IMAGES.set("EMPTY", "sprites/empty_grid.png");
IMAGES.set("SELL", "sprites/sell_icon.png");
PLANTS.flatMap(x => x.steps).forEach(x => { IMAGES.set(x, `sprites/${x}.png`); });

export { PLANTS, IMAGES };
