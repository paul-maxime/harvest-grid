<script lang="ts">
import type { PropType } from "vue";
import { PLANTS, IMAGES } from "@/Plants";

type CanvasVariables = {
  isLoaded: boolean,
  zoomIdx: number,
  position: Coord,
  mousePosition?: Coord,
  downPosition?: Coord,
  dragPosition?: Coord,
  canvas?: HTMLCanvasElement,
  images: { [id: string]: HTMLImageElement },
  canvasSize: number
}
const ZOOM_LEVELS: number[] = [2, 3, 4, 5];
const MOUSE_LENIENCE: number = 5;

export default {
  data(): CanvasVariables {
    return {
      isLoaded: false,
      zoomIdx: 3,
      position: { x: 0, y: 0 },
      mousePosition: { x: 0, y: 0 },
      dragPosition: undefined,
      canvas: undefined,
      images: {},
      canvasSize: 512,
    }
  },
  methods: {
    setCanvasSize() {
      this.canvasSize = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) - 16;
    },
    load() {
      this.canvas = (<HTMLCanvasElement>this.$refs.garden);
      this.setCanvasSize();
      for (const [key, value] of IMAGES) {
        const imgObj = new Image();
        imgObj.src = value;
        imgObj.onload = () => {
          this.images[key] = imgObj;
          if (Object.keys(this.images).length === IMAGES.size) {
            this.isLoaded = true;
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
    colorContext(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, mask: (number | undefined)[]) {
      const imgData = ctx.getImageData(x, y, width, height);
      for (let i = 0; i < width * height * 4; i++) {
        imgData.data[i] = mask[i % 4] ?? imgData.data[i];
      }
      ctx.putImageData(imgData, x, y);
    },
    drawGarden() {
      if (this.canvas) {
        const ctx = this.canvas.getContext("2d", { willReadFrequently : true })!;
        ctx.imageSmoothingEnabled = false;
        const gardenSquare: number = this.getGardenSquare();
        for (let x = (this.canvas.width / 2 - gardenSquare / 2) % gardenSquare + this.position.x % gardenSquare - gardenSquare * 2; x < this.canvas.width; x += gardenSquare) {
          for (let y = (this.canvas.height / 2 - gardenSquare / 2) % gardenSquare + this.position.y % gardenSquare - gardenSquare * 2; y < this.canvas.height; y += gardenSquare) {
            const curPos: Coord = { x: Math.floor((x - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((y - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
            const owned = this.isOwned(curPos, this.garden.unlocked);
            ctx.drawImage(this.images[owned ? 'EARTH' : 'EMPTY'], x, y, gardenSquare, gardenSquare);
            const plant = this.garden.plants.filter((p) => p.x === curPos.x && p.y === curPos.y)[0];
            const plantRef = PLANTS.filter((p) => p.name === plant?.type)[0];
            if (plantRef) {
              ctx.drawImage(this.images[plantRef.steps[plant.currentStep]], x, y, gardenSquare, gardenSquare);
            }
            if (this.garden.selectedCell.pos?.x === curPos.x && this.garden.selectedCell.pos?.y === curPos.y) {
              if (this.garden.selectedCell.isHarvestable) {
                ctx.drawImage(this.images['SELL'], x, y, gardenSquare, gardenSquare);
              } else if (this.garden.isBuyingDirt) {
                this.colorContext(ctx, x, y, gardenSquare, gardenSquare, this.garden.selectedCell.isBuyable ? [0, undefined, 0] : [undefined, 0, 0])
              } else if (this.garden.selectedPlant !== undefined) {
                const image = this.images[this.garden.selectedPlant.steps[0]];
                ctx.drawImage(image, x, y, gardenSquare, gardenSquare);
                if (!owned || plant) {
                  this.colorContext(ctx, x, y, gardenSquare, gardenSquare, [undefined, 0, 0])
                }
              }
            }
          }
        }
      }
    },
    onWheel(event: WheelEvent) {
      this.zoomIdx = Math.min(ZOOM_LEVELS.length - 1, Math.max(0, this.zoomIdx - Math.sign(event.deltaY)));
      this.drawGarden();
      event.preventDefault();
    },
    onMouseDown(event: MouseEvent) {
      this.downPosition = { x: event.offsetX, y: event.offsetY };
      this.dragPosition = this.downPosition;
    },
    onMouseMove(event: MouseEvent) {
      let redraw = false;
      if (this.canvas) {
        const gardenSquare = this.getGardenSquare();
        const curPos = { x: Math.floor((event.offsetX / this.canvasSize * this.canvas.width - this.position.x + gardenSquare / 2 - this.canvas.width / 2) / gardenSquare), y: Math.floor((event.offsetY / this.canvasSize * this.canvas.height - this.position.y + gardenSquare / 2 - this.canvas.height / 2) / gardenSquare) };
        redraw = (curPos.x !== this.mousePosition?.x || curPos.y !== this.mousePosition?.y);
        this.mousePosition = curPos;
        this.$emit('gardenHover', this.mousePosition);
      }
      if (this.dragPosition && this.downPosition && (Math.abs(this.downPosition.x - event.offsetX) >= MOUSE_LENIENCE || Math.abs(this.downPosition.y - event.offsetY) >= MOUSE_LENIENCE)) {
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
      if (this.canvas && this.downPosition && Math.abs(this.downPosition.x - event.offsetX) < MOUSE_LENIENCE && Math.abs(this.downPosition.y - event.offsetY) < MOUSE_LENIENCE) {
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
    },
    onResize() {
      this.setCanvasSize();
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.load();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
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
        try {
          if (this.isLoaded) {
            this.drawGarden();
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
}
</script>

<template>
  <canvas @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseLeave"
    @wheel="onWheel" ref="garden" width="512" height="512" :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }">
    Garden
  </canvas>
</template>

<style scoped>
canvas {
  image-rendering: pixelated;
}
</style>
