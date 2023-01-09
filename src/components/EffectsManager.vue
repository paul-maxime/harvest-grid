<template>
  <div>
    <div
      class="fadeout-text"
      v-for="text of fadeoutTexts" :key="text.id"
      :style="{ 'left': text.x + 'px', 'top': text.y + 'px' }"
      :class="{ 'fading-out': text.opacity === 0 }"
    >
      {{ text.text }} <img v-if="text.hasIcon" src="/sprites/currency.png">
    </div>
  </div>
</template>

<script lang="ts">
type FadeoutText = {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  hasIcon: boolean;
}

export default {
  data() {
    return {
      fadeoutTexts: [] as FadeoutText[],
      updateInterval: 0,
    };
  },
  methods: {
    addFadeoutText(text: string, x: number, y: number, hasIcon: boolean) {
      this.fadeoutTexts.push({
        id: Math.random(), text, x, y, opacity: 1, hasIcon
      });
      const fadeoutText = this.fadeoutTexts[this.fadeoutTexts.length - 1];
      setTimeout(() => {
        fadeoutText.opacity = 0;
      }, 1);
      setTimeout(() => {
        this.fadeoutTexts.splice(this.fadeoutTexts.indexOf(fadeoutText), 1);
      }, 2001);
    }
  }
}
</script>

<style scoped>
.fadeout-text {
  pointer-events: none;
  white-space: nowrap;
  font-size: 1.1em;
  position: absolute;
  color: white;
  text-shadow:
    1px 1px 1px #101010,
    -1px 1px 1px #101010,
    1px -1px 1px #101010,
    -1px -1px 1px #101010,
    0px -1px 1px #101010,
    0px 1px 1px #101010,
    1px 0px 1px #101010,
    -1px 0px 1px #101010;
  transform: translate(-50%, -50%);
  opacity: 1;
}
.fadeout-text.fading-out {
  transition: opacity 2s linear, transform 2s linear;
  transform: translate(-50%, -300%);
  opacity: 0;
}
.fadeout-text img {
  vertical-align: middle;
  margin-bottom: 1px;
}
</style>