<script lang="ts">
import { PLANTS } from "@/Plants";

export default {
  data() {
    return {
      PLANTS,
    };
  },
  props: {
    money: Number,
  },
  mounted() {
  }
}
</script>

<template>
  <div class="shop-container">
    <h2>Shop</h2>
    <div v-for="plant of PLANTS" :key="plant.name" class="shop-plant">
      <div class="shop-plant-icon">
        <img :src="`sprites/earth_grid.png`" style="position: absolute; z-index: -1;">
        <img :src="`sprites/${plant.steps[0]}.png`">
      </div>
      <div class="shop-plant-price">
        {{ plant.name }}
        <span v-if="plant.seedPrice > 0">({{ plant.seedPrice }} g)</span>
        <span v-else>(free)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  padding: 6px;
}
h2 {
  text-align: center;
  margin: 0px;
}
.shop-plant {
  display: flex;
  align-items: center;
  border: 1px solid black;
  margin-bottom: 4px;
}
.shop-plant-icon {
  width: 48px;
  height: 48px;
}
.shop-plant-icon img {
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
}
.shop-plant-price {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
