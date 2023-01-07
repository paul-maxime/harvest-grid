type Plant = {
  name: string,
  seedPrice: number,
  plantPrice: number,
  steps: string[],
  timePerStep: number,
};

const test = new Map<string, string>();

const plants: Plant[] = [
  {
    name: "Fire Flower",
    seedPrice: 10,
    plantPrice: 20,
    steps: ["fire-flower-seed", "fire-flower-1", "fire-flower-2"],
    timePerStep: 5,
  },
];

export default plants;
