<script lang="ts">
import GameShop from './components/GameShop.vue'
import GardenCanvas from './components/GardenCanvas.vue';

export default {
  data() {
    const garden: Garden = {
      money: 1000,
      plants: [
        { type: "Fire Flower", x: 0, y: 0, currentStep: 0 },
        { type: "Fire Flower", x: 2, y: -3, currentStep: 0 },
      ],
      mouse: { x: 0, y: 0 },
      unlocked: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: -2 },
        { x: 0, y: -3 },
        { x: 1, y: -3 },
        { x: 2, y: -3 },
      ],
    };
    return { garden };
  },
  components: { GameShop, GardenCanvas }
}
</script>

<template>
  <main>
    <div class="column-left">
      <GardenCanvas :garden="garden" />
    </div>
    <div class="column-right">
      <GameShop />
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
