<script lang="ts">
import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';
import { PLANTS } from "@/Plants";

export default {
  components: { GameShop, GardenCanvas },
  data() {
    const garden: Garden = {
      money: 100,
      plants: [],
      unlocked: [
        { x: 0, y: 0 },
      ],
      isBuyingDirt: false,
      selectedPlant: undefined,
    };
    return {
      garden,
      lastUpdate: 0,
      pendingTime: 0,
      updateInterval: 0,
      dirtPrice: 0,
      mouseCell: null as Coord | null,
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
        if (plant.harvestable) continue;
        plant.ticks += 1;
        if (plant.ticks === plantType.ticksPerStep) {
          plant.currentStep += 1;
          plant.ticks = 0;
          if (plant.currentStep === plantType.steps.length - 1) {
            plant.harvestable = true;
          }
        }
      }
    },
    onPlantSelected(plantType: PlantType) {
      if (this.garden.selectedPlant === plantType) {
        this.garden.selectedPlant = undefined;
      } else {
        this.garden.selectedPlant = plantType;
      }
      this.garden.isBuyingDirt = false;
    },
    onDirtSelected() {
      this.garden.isBuyingDirt = !this.garden.isBuyingDirt;
      this.garden.selectedPlant = undefined;
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
    onGardenHover(pos: Coord) {
      if (this.mouseCell && this.mouseCell.x === pos.x && this.mouseCell.y === pos.y) return;
      this.mouseCell = pos;
      const unlocked = this.garden.unlocked.some(p => p.x === pos.x && p.y === pos.y);
      if (unlocked) {
        this.dirtPrice = 0;
        return;
      }
      const buyable = this.garden.unlocked.some(p => Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y) === 1);
      if (!buyable) {
        this.dirtPrice = -1;
        return;
      }
      this.dirtPrice = (Math.abs(pos.x) + Math.abs(pos.y)) * 10;
    },
    onGardenLeave() {
      this.dirtPrice = -2;
      this.mouseCell = null;
    },
    plantClick(plant: GardenPlant) {
      console.log("Click on plant", plant);
      const plantType = PLANTS.find(x => x.name === plant.type)!;
      if (plant.harvestable) {
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
        harvestable: false,
      });
    },
    voidClick(pos: Coord) {
      console.log("Click on void", pos);
      if (!this.garden.isBuyingDirt) return;
      const price = (Math.abs(pos.x) + Math.abs(pos.y)) * 10;
      if (this.garden.money < price) return;
      this.garden.money -= price;
      const buyable = this.garden.unlocked.some(p => Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y) === 1);
      if (buyable) {
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
      <GardenCanvas
        :garden="garden"
        @gardenClick="onGardenClick"
        @gardenHover="onGardenHover"
        @mouseleave="onGardenLeave"
      />
    </div>
    <div class="column-right">
      <GameShop
        :money="garden.money"
        :dirtPrice="dirtPrice"
        :isBuyingDirt="garden.isBuyingDirt"
        :selectedPlant="garden.selectedPlant"
        @plantSelected="onPlantSelected"
        @dirtSelected="onDirtSelected"
      />
    </div>
  </main>
</template>

<style>
body {
  background-color: #E0E0E0;
  margin-bottom: 0px;
}
main {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
