<script lang="ts">
import type { PropType } from "vue";
import { PLANTS, IMAGES } from "@/Plants";

type CanvasVariables = {
  zoomIdx: number,
  position: Coord,
  downPosition?: Coord,
  dragPosition?: Coord,
  canvas?: HTMLCanvasElement,
  images: { [id: string]: HTMLImageElement }
}
const ZOOM_LEVELS: number[] = [1, 2, 3, 4, 5];

export default {
  data(): CanvasVariables {
    return {
      zoomIdx: 4,
      position: { x: 0, y: 0 },
      dragPosition: undefined,
      canvas: undefined,
      images: {}
    }
  },
  methods: {
    load() {
      this.canvas = (<HTMLCanvasElement>this.$refs.garden);
      for (const [key, value] of IMAGES) {
        const imgObj = new Image();
        imgObj.src = value;
        imgObj.onload = () => {
          this.images[key] = imgObj;
          if (Object.keys(this.images).length === IMAGES.size) {
            this.drawGarden();
          }
        }
      }
    },
    isOwned(pos: Coord, owned: Coord[]): boolean {
      return owned.filter((c) => c.x === pos.x && c.y === pos.y).length > 0;
    },
    getGardenSquare(): number {
      return 16 * ZOOM_LEVELS[this.zoomIdx];
    },
    drawGarden() {
      if (this.canvas) {
        const ctx = this.canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        const gardenSquare: number = this.getGardenSquare();
        //const cs = getComputedStyle(canvas);
        //const size: {width: number, height: number} = {width: parseInt(cs.getPropertyValue('width')), height: parseInt(cs.getPropertyValue('height'))};
        //console.log(size);
        for (let x = (this.canvas.width / 2 - gardenSquare / 2) % gardenSquare + this.position.x % gardenSquare - gardenSquare * 2; x < this.canvas.width; x += gardenSquare) {
          for (let y = (this.canvas.height / 2 - gardenSquare / 2) % gardenSquare + this.position.y % gardenSquare - gardenSquare * 2; y < this.canvas.height; y += gardenSquare) {
            const curPos: Coord = { x: Math.floor((x - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((y - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
            ctx.drawImage(this.images[this.isOwned(curPos, this.garden.unlocked) ? 'EARTH' : 'EMPTY'], x, y, gardenSquare, gardenSquare);
            const plant = this.garden.plants.filter((p) => p.x === curPos.x && p.y === curPos.y)[0];
            if (plant) {
              ctx.drawImage(this.images[PLANTS.filter((p) => p.name === plant.type)[0].steps[plant.currentStep]], x, y, gardenSquare, gardenSquare);
            }
          }
        }
      }
    },
    onWheel(event: WheelEvent) {
      this.zoomIdx = Math.min(ZOOM_LEVELS.length - 1, Math.max(0, this.zoomIdx - Math.sign(event.deltaY)));
      this.drawGarden();
    },
    onMouseDown(event: MouseEvent) {
      this.downPosition = { x: event.x, y: event.y };
      this.dragPosition = this.downPosition;
    },
    onMouseMove(event: MouseEvent) {
      if (this.dragPosition) {
        this.position.x += event.x - this.dragPosition.x;
        this.position.y += event.y - this.dragPosition.y;
        this.dragPosition = { x: event.x, y: event.y };
        this.drawGarden();
      }
    },
    onMouseUp(event: MouseEvent) {
      if (this.canvas && this.downPosition?.x === event.x && this.downPosition?.y === event.y) {
        const gardenSquare = this.getGardenSquare();
        const curPos: Coord = { x: Math.floor((event.x - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((event.y - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
        this.$emit('gardenClick', curPos);
      }
      this.dragPosition = undefined;
      this.downPosition = undefined;
    },
    onMouseLeave() {
      this.dragPosition = undefined;
    }
  },
  mounted() {
    this.load();
  },
  props: {
    garden: {
      type: Object as PropType<Garden>,
      required: true,
    }
  },
  watch: {
    garden: {
      immediate: true,
      deep: true,
      handler() {
        console.log("Garden changed", this.garden);
      }
    }
  },
}
</script>

<template>
  <canvas @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseLeave"
    @wheel="onWheel" ref="garden" width="512" height="512">
    Garden
  </canvas>
</template>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  image-rendering: pixelated;
}
</style>
