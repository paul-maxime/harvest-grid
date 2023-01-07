<script lang="ts">
import { PLANTS } from "@/Plants";

export default {
  data() {
    return {
      PLANTS
    };
  },
  props: {
    money: Number,
  },
}
</script>

<template>
  <div class="shop-container">
    <h2>Shop</h2>
    <button>Yo</button>
  </div>
</template>

<style scoped>
.shop-container {
  padding: 6px;
  border: 1px solid black;
}
h2 {
  margin: 0px;
}
</style>
