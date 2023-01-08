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
    unlockedPlants: {
      type: Number,
      required: true,
    },
    selectedPlant: Object as PropType<PlantType>,
  },
  methods: {
    plantSelected(type: PlantType) {
      this.$emit("plantSelected", type);
    },
    dirtSelected() {
      this.$emit("dirtSelected");
    },
    unlockNextPlant() {
      this.$emit("plantUnlocked");
    },
  },
}
</script>

<template>
  <div class="shop-container">
    <h2>Shop</h2>
    <p class="shop-money">{{ money }}<img src="/sprites/currency.png"></p>

    <table>
      <tr @click="dirtSelected()" v-bind:class="{ 'shop-plant-selected': isBuyingDirt }">
        <td>
          <div class="shop-plant-icon">
            <img src="/sprites/earth_grid.png">
          </div>
        </td>
        <td class="name-cell" :colspan="isBuyingDirt && dirtPrice && dirtPrice > 0 ? 1 : 2">
          Dirt block<br>
          <span v-if="!isBuyingDirt || dirtPrice === -2"></span>
          <span v-else-if="dirtPrice === 0">(already bought)</span>
          <span v-else-if="dirtPrice === -1">(too far)</span>
        </td>
        <td class="price-cell" v-if="isBuyingDirt && dirtPrice && dirtPrice > 0">
          {{ dirtPrice }}<img src="/sprites/currency.png">
        </td>
      </tr>
      <tr v-for="plant of PLANTS.slice(0, unlockedPlants)" :key="plant.name" @click="plantSelected(plant)">
        <td>
          <div class="shop-plant-icon">
            <img src="/sprites/earth_grid.png" style="position: absolute; z-index: -1;">
            <img :src="`sprites/${plant.steps[0]}.png`" style="">
          </div>
        </td>
        <td class="name-cell" v-bind:class="{ 'shop-plant-selected': selectedPlant === plant }">
          {{ plant.name }}
        </td>
        <td class="price-cell" v-bind:class="{ 'shop-plant-selected': selectedPlant === plant }">
          {{ plant.seedPrice }}<img src="/sprites/currency.png">
        </td>
      </tr>
      <tr v-if="unlockedPlants < PLANTS.length">
        <td>
          <div class="shop-plant-icon">
            <img src="/sprites/earth_grid.png" style="position: absolute; z-index: -1;">
            <img :src="`sprites/secret.png`" style="">
          </div>
        </td>
        <td class="name-cell" colspan="2" @click="unlockNextPlant()">
          Unlock for {{ PLANTS[unlockedPlants].unlockPrice }}<img src="/sprites/currency.png">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
img {
  image-rendering: pixelated;
}
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
table {
  border-collapse: collapse;
}
table tr {
  cursor: pointer;
  user-select: none;
}
table tr:hover > .name-cell, table tr:hover > .price-cell {
  background-color: #c0c0c0;
}
table tr td {
  border: 1px solid black;
  padding: 0;
}
.shop-plant-selected {
  background-color: #a0a0a0 !important;
}
.shop-plant-icon {
  width: 48px;
  height: 48px;
}
.shop-plant-icon img {
  width: 48px;
  height: 48px;
}
.name-cell {
  text-align: left;
  padding: 6px;
}
.price-cell {
  text-align: right;
  padding: 6px;
}
.name-cell img, .price-cell img {
  margin-left: 3px;
}
</style>
