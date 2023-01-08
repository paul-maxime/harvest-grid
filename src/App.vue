<script lang="ts">
import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';
import { PLANTS } from './Plants';

export default {
  components: { GameShop, GardenCanvas },
  data() {
    const garden: Garden = {
      money: 0,
      plants: [],
      unlocked: [
        { x: 0, y: 0 },
      ],
      selectedPlant: undefined,
    };
    return { garden: garden as Garden };
  },
  methods: {
    onPlantSelected(plantType: PlantType) {
      if (this.garden.selectedPlant === plantType) {
        this.garden.selectedPlant = undefined;
      } else {
        this.garden.selectedPlant = plantType;
      }
    },
    onGardenClick(pos: Coord) {
      const plant = this.garden.plants.find(p => p.x === pos.x && p.y === pos.y);
      const unlocked = this.garden.unlocked.some(p => p.x === pos.x && p.y === pos.y);
      if (plant) {
        this.plantClick(plant);
      } else if (unlocked) {
        this.dirtClick(pos);
      } else {
        this.voidClick(pos);
      }
    },
    plantClick(plant: GardenPlant) {
      console.log("Click on plant", plant);
    },
    dirtClick(pos: Coord) {
      console.log("Click on dirt", pos);
      if (!this.garden.selectedPlant) {
        return;
      }
      if (this.garden.money < this.garden.selectedPlant.seedPrice) {
        return;
      }
      this.garden.money -= this.garden.selectedPlant.seedPrice;
      this.garden.plants.push({
        type: this.garden.selectedPlant.name,
        x: pos.x,
        y: pos.y,
        currentStep: 0,
      });
    },
    voidClick(pos: Coord) {
      console.log("Click on void", pos);
      if (this.garden.unlocked.some(p => Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y) === 1)) {
        this.garden.unlocked.push({
          x: pos.x,
          y: pos.y,
        });
      }
    },
  },
}
</script>

<template>
  <main>
    <div class="column-left">
      <GardenCanvas :garden="garden" @gardenClick="onGardenClick" />
    </div>
    <div class="column-right">
      <GameShop :selectedPlant="garden.selectedPlant" @plantSelected="onPlantSelected" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
