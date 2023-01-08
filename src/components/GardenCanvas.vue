<script lang="ts">
import type { PropType } from "vue";
import { PLANTS, IMAGES } from "@/Plants";

type CanvasVariables = {
  zoomIdx: number,
  position: Coord,
  mousePosition?: Coord,
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
      mousePosition: { x: 0, y: 0 },
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
        const ctx = this.canvas.getContext("2d", { willReadFrequently : true })!;
        ctx.imageSmoothingEnabled = false;
        const gardenSquare: number = this.getGardenSquare();
        //const cs = getComputedStyle(canvas);
        //const size: {width: number, height: number} = {width: parseInt(cs.getPropertyValue('width')), height: parseInt(cs.getPropertyValue('height'))};
        //console.log(size);
        for (let x = (this.canvas.width / 2 - gardenSquare / 2) % gardenSquare + this.position.x % gardenSquare - gardenSquare * 2; x < this.canvas.width; x += gardenSquare) {
          for (let y = (this.canvas.height / 2 - gardenSquare / 2) % gardenSquare + this.position.y % gardenSquare - gardenSquare * 2; y < this.canvas.height; y += gardenSquare) {
            const curPos: Coord = { x: Math.floor((x - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((y - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
            const owned = this.isOwned(curPos, this.garden.unlocked);
            ctx.drawImage(this.images[owned ? 'EARTH' : 'EMPTY'], x, y, gardenSquare, gardenSquare);
            const plant = this.garden.plants.filter((p) => p.x === curPos.x && p.y === curPos.y)[0];
            if (plant) {
              ctx.drawImage(this.images[PLANTS.filter((p) => p.name === plant.type)[0].steps[plant.currentStep]], x, y, gardenSquare, gardenSquare);
            }
            if (this.garden.selectedPlant !== undefined && this.mousePosition !== undefined && this.mousePosition.x === curPos.x && this.mousePosition.y === curPos.y) {
              const image = this.images[this.garden.selectedPlant.steps[0]];
              ctx.drawImage(image, x, y, gardenSquare, gardenSquare);
              if (!owned || plant) {
                const test = ctx.getImageData(x, y, gardenSquare, gardenSquare);
                for (let i = 0; i < Math.pow(gardenSquare, 2) * 4; i += 4) {
                  test.data[i+1] = 0;
                  test.data[i+2] = 0;
                }
                ctx.putImageData(test, x, y);
              }
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
      this.downPosition = { x: event.offsetX, y: event.offsetY };
      this.dragPosition = this.downPosition;
    },
    onMouseMove(event: MouseEvent) {
      let redraw = false;
      if (this.canvas) {
        const gardenSquare = this.getGardenSquare();
        const curPos = { x: Math.floor((event.offsetX - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((event.offsetY - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
        redraw = this.garden.selectedPlant !== undefined && (curPos.x !== this.mousePosition?.x || curPos.y !== this.mousePosition?.y);
        this.mousePosition = curPos;
      }
      if (this.dragPosition) {
        this.position.x += event.offsetX - this.dragPosition.x;
        this.position.y += event.offsetY - this.dragPosition.y;
        this.dragPosition = { x: event.offsetX, y: event.offsetY };
        redraw = true;
      }
      if (redraw) {
        this.drawGarden();
      }
    },
    onMouseUp(event: MouseEvent) {
      if (this.canvas && this.downPosition?.x === event.offsetX && this.downPosition?.y === event.offsetY) {
        this.$emit('gardenClick', this.mousePosition);
      }
      this.dragPosition = undefined;
      this.downPosition = undefined;
    },
    onMouseLeave() {
      this.dragPosition = undefined;
      this.mousePosition = undefined;
      this.downPosition = undefined;
      if (this.garden.selectedPlant) {
        this.drawGarden();
      }
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
        this.drawGarden();
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
