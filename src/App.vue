<script lang="ts">
import pako from "pako";
import * as base64 from "byte-base64";

import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';
import { PLANTS } from "@/Plants";
import playSound from '@/Sounds';

export default {
  components: { GameShop, GardenCanvas },
  data() {
    const garden: Garden = {
      money: 100,
      plants: [],
      unlocked: [
        { x: 0, y: 0, borders: { up: false, down: false, left: false, right: false, upRight: false, upLeft: false, downRight: false, downLeft: false } },
      ],
      unlockedPlants: 1,
      isBuyingDirt: false,
      selectedPlant: undefined,
      selectedCell: {
        pos: null,
        isBuyable: false,
        isPlantable: false,
        isHarvestable: false,
      }
    };
    return {
      garden,
      lastUpdate: 0,
      pendingTime: 0,
      updateInterval: 0,
      dirtPrice: 0,
      lastSave: 0,
    };
  },
  mounted() {
    this.lastUpdate = Date.now();
    this.updateInterval = setInterval(() => this.update(), 250);
    this.load();
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
      let growth = false;
      let harvestable = false;
      for (const plant of this.garden.plants) {
        const plantType = PLANTS.find(x => x.name === plant.type)!;
        if (plant.harvestable) continue;
        plant.ticks += 1;
        if (plant.ticks === plantType.ticksPerStep) {
          growth = true;
          plant.currentStep += 1;
          plant.ticks = 0;
          if (plant.currentStep === plantType.steps.length - 1) {
            plant.harvestable = true;
            harvestable = true;
          }
        }
      }
      if (harvestable) {
        playSound('POUF');
      } else if (growth) {
        playSound('POP');
      }
      this.updateSelectedCell();
      this.saveIfRequired();
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
    onPlantUnlocked() {
      if (this.garden.unlockedPlants >= PLANTS.length) return;
      const next = PLANTS[this.garden.unlockedPlants];
      if (this.garden.money >= next.unlockPrice) {
        this.garden.money -= next.unlockPrice;
        this.garden.unlockedPlants += 1;
        playSound("SELL");
        this.save();
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
    onGardenHover(pos: Coord) {
      if (this.garden.selectedCell.pos &&
        this.garden.selectedCell.pos.x === pos.x &&
        this.garden.selectedCell.pos.y === pos.y) return;

      this.garden.selectedCell.pos = pos;
      this.updateSelectedCell();
    },
    updateSelectedCell() {
      const pos = this.garden.selectedCell.pos;
      this.garden.selectedCell.isBuyable = false;
      this.garden.selectedCell.isPlantable = false;
      this.garden.selectedCell.isHarvestable = false;

      if (!pos) {
        return;
      }

      const plant = this.garden.plants.find(p => p.x === pos.x && p.y === pos.y);
      if (plant) {
        this.garden.selectedCell.isHarvestable = plant.harvestable;
        return;
      }

      const unlocked = this.garden.unlocked.some(p => p.x === pos.x && p.y === pos.y);
      if (unlocked) {
        this.dirtPrice = 0;
        this.garden.selectedCell.isPlantable = this.canPlacePlantAt(pos, this.garden.selectedPlant);
        return;
      }

      const buyable = this.garden.unlocked.some(p => Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y) === 1);
      if (!buyable) {
        this.dirtPrice = -1;
        return;
      }
      this.garden.selectedCell.isBuyable = true;
      this.dirtPrice = (Math.abs(pos.x) + Math.abs(pos.y)) * 10;
    },
    onGardenLeave() {
      this.dirtPrice = -2;
      this.garden.selectedCell.pos = null;
      this.updateSelectedCell();
    },
    plantClick(plant: GardenPlant) {
      const plantType = PLANTS.find(x => x.name === plant.type)!;
      if (plant.harvestable) {
        playSound('SELL');
        this.garden.plants.splice(this.garden.plants.indexOf(plant), 1);
        this.garden.money += plantType.plantPrice;
        this.updateSelectedCell();
        this.save();
      }
    },
    dirtClick(pos: Coord) {
      if (!this.garden.selectedPlant) {
        return;
      }
      if (this.garden.money < this.garden.selectedPlant.seedPrice) {
        return;
      }
      if (!this.canPlacePlantAt(pos, this.garden.selectedPlant)) {
        return;
      }
      playSound('FROUF');
      this.garden.money -= this.garden.selectedPlant.seedPrice;
      for (const relative of this.garden.selectedPlant.shape) {
        const point = { x: pos.x + relative.x, y: pos.y + relative.y };
        this.garden.plants.push({
          type: this.garden.selectedPlant.name,
          x: point.x,
          y: point.y,
          currentStep: 0,
          ticks: 0,
          harvestable: false,
        });
      }
      this.updateSelectedCell();
      this.save();
    },
    canPlacePlantAt(pos: Coord, type?: PlantType) {
      if (!type) return false;
      return type.shape.every(relative => {
        const point = { x: pos.x + relative.x, y: pos.y + relative.y };
        if (this.garden.plants.some(p => p.x === point.x && p.y === point.y)) {
          return false;
        }
        if (!this.garden.unlocked.some(p => p.x === point.x && p.y === point.y)) {
          return false;
        }
        return true;
      });
    },
    voidClick(pos: Coord) {
      if (!this.garden.isBuyingDirt) return;
      const price = (Math.abs(pos.x) + Math.abs(pos.y)) * 10;
      if (this.garden.money < price) return;
      this.garden.money -= price;
      const buyable = this.garden.unlocked.some(p => Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y) === 1);
      if (buyable) {
        this.garden.unlocked.push({
          x: pos.x,
          y: pos.y,
          borders: { up: false, down: false, left: false, right: false, upRight: false, upLeft: false, downRight: false, downLeft: false },
        });
        this.recomputeAllBorders();
        this.updateSelectedCell();
        this.save();
      }
    },
    recomputeAllBorders() {
      this.garden.unlocked.forEach(unlocked => {
        unlocked.borders.up = this.garden.unlocked.some(p => p.x === unlocked.x && p.y === unlocked.y - 1);
        unlocked.borders.down = this.garden.unlocked.some(p => p.x === unlocked.x && p.y === unlocked.y + 1);
        unlocked.borders.left = this.garden.unlocked.some(p => p.x === unlocked.x - 1 && p.y === unlocked.y);
        unlocked.borders.right = this.garden.unlocked.some(p => p.x === unlocked.x + 1 && p.y === unlocked.y);
        unlocked.borders.upLeft = this.garden.unlocked.some(p => p.x === unlocked.x - 1 && p.y === unlocked.y - 1);
        unlocked.borders.upRight = this.garden.unlocked.some(p => p.x === unlocked.x + 1 && p.y === unlocked.y - 1);
        unlocked.borders.downLeft = this.garden.unlocked.some(p => p.x === unlocked.x - 1 && p.y === unlocked.y + 1);
        unlocked.borders.downRight = this.garden.unlocked.some(p => p.x === unlocked.x + 1 && p.y === unlocked.y + 1);
      });
    },
    saveIfRequired() {
      const elapsed = Date.now() - this.lastSave;
      if (elapsed >= 10000) this.save();
    },
    save() {
      this.lastSave = Date.now();
      const json = JSON.stringify({
        money: this.garden.money,
        plants: this.garden.plants,
        unlocked: this.garden.unlocked.map(p => ({ x: p.x, y: p.y })),
        unlockedPlants: this.garden.unlockedPlants,
      });
      const compressed = pako.deflate(new TextEncoder().encode(json));
      localStorage.setItem("harvest-save", base64.bytesToBase64(compressed));
    },
    load() {
      this.lastSave = Date.now();
      const compressedData = localStorage.getItem("harvest-save");
      try {
        if (compressedData) {
          const uncompressed = pako.inflate(base64.base64ToBytes(compressedData));
          const storedJson = new TextDecoder("utf-8").decode(uncompressed);
          const storedData = JSON.parse(storedJson);
          this.garden.money = storedData.money || 0;
          this.garden.plants = storedData.plants || [];
          this.garden.unlocked = (storedData.unlocked || []).map((p: Coord) => ({
            ...p,
            borders: { up: false, down: false, left: false, right: false, upRight: false, upLeft: false, downRight: false, downLeft: false }
          }));
          this.garden.unlockedPlants = storedData.unlockedPlants || 1;
          this.recomputeAllBorders();
        }
      } catch (e) {
        console.error("Could not load the save", e);
      }
      this.updateSelectedCell();
    },
  },
  computed: {
    isGameClickable() {
      return (this.garden.selectedPlant && this.garden.selectedCell.isPlantable) ||
        (this.garden.selectedCell.isBuyable && this.garden.isBuyingDirt) ||
        this.garden.selectedCell.isHarvestable;
    }
  }
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
        :class="{ 'garden-clickable': isGameClickable }"
      />
    </div>
    <div class="column-right">
      <GameShop
        :money="garden.money"
        :dirtPrice="dirtPrice"
        :isBuyingDirt="garden.isBuyingDirt"
        :selectedPlant="garden.selectedPlant"
        :unlockedPlants="garden.unlockedPlants"
        @plantSelected="onPlantSelected"
        @dirtSelected="onDirtSelected"
        @plantUnlocked="onPlantUnlocked"
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
.garden-clickable {
  cursor: pointer;
}
</style>
