type Coord = {
  x: number,
  y: number,
}

type PlantType = {
  name: string,
  seedPrice: number,
  plantPrice: number,
  steps: string[],
  timePerStep: number,
};

type GardenPlant = {
  type: string,
  x: number,
  y: number,
  currentStep: number,
}

type Garden = {
  money: number,
  plants: GardenPlant[],
  unlocked: Coord[],
  selectedPlant: PlantType | undefined,
}
