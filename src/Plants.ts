type Plant = {
  name: string,
  seedPrice: number,
  plantPrice: number,
  steps: string[],
  timePerStep: number,
};

const PLANTS: Plant[] = [
  {
    name: "Fire Flower",
    seedPrice: 10,
    plantPrice: 20,
    steps: ["fireflower_seed", "fireflower_plant"],
    timePerStep: 5,
  },
];

const IMAGES = new Map<string, string>();
IMAGES.set("EARTH", "sprites/earth_grid.png");
IMAGES.set("EMPTY", "sprites/empty_grid.png");
PLANTS.flatMap(x => x.steps).forEach(x => { IMAGES.set(x, `sprites/${x}.png`); });

export { PLANTS, IMAGES };
