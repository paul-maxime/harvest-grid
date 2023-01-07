type Coord = {
  x: number,
  y: number,
}

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
  mouse: {
    x: number,
    y: number,
  },
}
