<script lang="ts">
import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';

export default {
  data() {
    const garden: Garden = {
      money: 0,
      plants: [
        { type: "Fire Flower", x: 0, y: 0, currentStep: 0 },
        { type: "Fire Flower", x: 2, y: -3, currentStep: 0 },
      ],
      unlocked: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: -2 },
        { x: 0, y: -3 },
        { x: 1, y: -3 },
        { x: 2, y: -3 },
      ],
      selectedPlant: undefined,
    };
    return { garden: garden as Garden };
  },
  components: { GameShop, GardenCanvas },
  methods: {
    onPlantSelected(type: string) {
      if (this.garden.selectedPlant === type) {
        this.garden.selectedPlant = undefined;
      } else {
        this.garden.selectedPlant = type;
      }
    },
    onGardenClick(pos: Coord) {
      console.log(`Click at ${pos.x}, ${pos.y}`);
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
