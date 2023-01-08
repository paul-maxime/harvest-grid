type Coord = {
  x: number,
  y: number,
}

type PlantType = {
  name: string,
  seedPrice: number,
  plantPrice: number,
  steps: string[],
  ticksPerStep: number,
};

type GardenPlant = {
  type: string,
  x: number,
  y: number,
  currentStep: number,
  ticks: number,
}

type Garden = {
  money: number,
  plants: GardenPlant[],
  unlocked: Coord[],
  selectedPlant: PlantType | undefined,
}
