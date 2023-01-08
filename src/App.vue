<script lang="ts">
import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';
import { PLANTS } from "@/Plants";

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
    return {
      garden,
      lastUpdate: 0,
      pendingTime: 0,
      updateInterval: 0,
    };
  },
  mounted() {
    this.lastUpdate = Date.now(),
    this.updateInterval = setInterval(() => this.update(), 250);
  },
  unmounted() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  methods: {
    update() {
      const now = Date.now();
      const elapsed = Math.min(Math.max(now - this.lastUpdate, 0), 5000);
      this.lastUpdate = now;
      this.pendingTime += elapsed;
      while (this.pendingTime > 1000) {
        this.pendingTime -= 1000;
        this.tickPlants();
      }
    },
    tickPlants() {
      for (const plant of this.garden.plants) {
        const plantType = PLANTS.find(x => x.name === plant.type)!;
        if (plant.currentStep >= plantType.steps.length - 1) continue;
        plant.ticks += 1;
        if (plant.ticks === plantType.ticksPerStep) {
          plant.currentStep += 1;
          plant.ticks = 0;
        }
      }
    },
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
      const plantType = PLANTS.find(x => x.name === plant.type)!;
      if (plant.currentStep === plantType.steps.length - 1) {
        this.garden.plants.splice(this.garden.plants.indexOf(plant), 1);
        this.garden.money += plantType.plantPrice;
      }
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
        ticks: 0,
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
      <GameShop :money="garden.money" :selectedPlant="garden.selectedPlant" @plantSelected="onPlantSelected" />
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
