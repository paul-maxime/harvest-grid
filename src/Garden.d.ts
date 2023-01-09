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
  shape: Coord[],
};

type GardenPlant = Coord & {
  type: string,
  currentStep: number,
  ticks: number,
  harvestable: boolean,
}

type UnlockedCell = Coord & {
  borders: {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    upRight: boolean,
    upLeft: boolean,
    downRight: boolean,
    downLeft: boolean,
  }
}

type Garden = {
  money: number,
  plants: GardenPlant[],
  unlocked: UnlockedCell[],
  unlockedPlants: number,
  isBuyingDirt: boolean,
  selectedPlant: PlantType | undefined,
  selectedCell: {
    pos: Coord | null,
    isBuyable: boolean,
    isPlantable: boolean,
    isHarvestable: boolean,
  }
}
