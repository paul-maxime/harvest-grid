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
    selectedPlant: String,
  },
  methods: {
    onSelectedPlant(type: string) {
      this.$emit("plantSelected", type);
    }
  },
}
</script>

<template>
  <div class="shop-container">
    <h2>Shop</h2>
    <div v-for="plant of PLANTS" :key="plant.name" class="shop-plant" v-bind:class="{ 'shop-plant-selected': selectedPlant == plant.name }" @click="onSelectedPlant(plant.name)">
      <div class="shop-plant-icon" style="z-index: 1;">
        <img :src="`sprites/earth_grid.png`" style="position: absolute; z-index: -1;">
        <img :src="`sprites/${plant.steps[0]}.png`" style="">
      </div>
      <div class="shop-plant-price">
        {{ plant.name }}
        <span v-if="plant.seedPrice > 0">({{ plant.seedPrice }}<img src="sprites/currency.png">)</span>
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
  cursor: pointer;
}
.shop-plant-selected {
  background-color: #a0a0a0;
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
.shop-plant-price img {
  margin-left: 3px;
  image-rendering: pixelated;
}
</style>
