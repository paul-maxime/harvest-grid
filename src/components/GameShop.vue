<script lang="ts">
import type { PropType } from "vue";
import { PLANTS } from "@/Plants";

export default {
  data() {
    return {
      PLANTS,
    };
  },
  props: {
    money: Number,
    dirtPrice: Number,
    isBuyingDirt: Boolean,
    selectedPlant: Object as PropType<PlantType>,
  },
  methods: {
    plantSelected(type: PlantType) {
      this.$emit("plantSelected", type);
    },
    dirtSelected() {
      this.$emit("dirtSelected");
    }
  },
}
</script>

<template>
  <div class="shop-container">
    <h2>Shop</h2>
    <p class="shop-money">{{ money }}<img src="sprites/currency.png"></p>
    <div class="shop-plant" v-bind:class="{ 'shop-plant-selected': isBuyingDirt }" @click="dirtSelected()">
      <div class="shop-plant-icon">
        <img src="sprites/earth_grid.png">
      </div>
      <div class="shop-plant-price">
        Dirt
        <span v-if="!isBuyingDirt">(variable price)</span>
        <span v-else-if="dirtPrice === 0">(already bought)</span>
        <span v-else-if="dirtPrice === -1">(too far)</span>
        <span v-else>({{ dirtPrice }}<img src="sprites/currency.png">)</span>
      </div>
    </div>
    <div v-for="plant of PLANTS" :key="plant.name" class="shop-plant" v-bind:class="{ 'shop-plant-selected': selectedPlant === plant }" @click="plantSelected(plant)">
      <div class="shop-plant-icon" style="z-index: 1;">
        <img src="sprites/earth_grid.png" style="position: absolute; z-index: -1;">
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
.shop-money {
  margin-top: 0px;
  margin-bottom: 10px;
  text-align: center;
  font-size: 1.2em;
}
.shop-money img {
  margin-left: 3px;
}
.shop-plant {
  display: flex;
  align-items: center;
  border: 1px solid black;
  margin-bottom: 4px;
  cursor: pointer;
  user-select: none;
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
