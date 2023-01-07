<script lang="ts">
import type { PropType } from 'vue'

type CanvasVariables = {
  zoomIdx: number,
  position: Coord,
  dragPosition?: Coord,
  canvas?: HTMLCanvasElement,
  images: { [id: string]: HTMLImageElement }
}
const IMAGES_REF: { [id: string]: string } = {
  'EARTH': 'sprites/earth_grid.png',
  'EMPTY': 'sprites/empty_grid.png'
};
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
      for (const key in IMAGES_REF) {
        const imgObj = new Image();
        imgObj.src = IMAGES_REF[key];
        imgObj.onload = () => {
          this.images[key] = imgObj;
          if (Object.keys(this.images).length === Object.keys(IMAGES_REF).length) {
            this.drawGarden();
          }
        }
      }
    },
    isOwned(pos: Coord, owned: Coord[]): boolean {
      return owned.filter((c) => c.x === pos.x && c.y === pos.y).length > 0;
    },
    drawGarden() {
      if (this.canvas) {
        const ctx = this.canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        const owned: Coord[] = [{ x: 0, y: 0 }];
        const GARDEN_SQUARE: number = 16 * ZOOM_LEVELS[this.zoomIdx];
        //const cs = getComputedStyle(canvas);
        //const size: {width: number, height: number} = {width: parseInt(cs.getPropertyValue('width')), height: parseInt(cs.getPropertyValue('height'))};
        //console.log(size);
        for (let x = (this.canvas.width / 2 - GARDEN_SQUARE / 2) % GARDEN_SQUARE + this.position.x % GARDEN_SQUARE - GARDEN_SQUARE * 2; x < this.canvas.width; x += GARDEN_SQUARE) {
          for (let y = (this.canvas.height / 2 - GARDEN_SQUARE / 2) % GARDEN_SQUARE + this.position.y % GARDEN_SQUARE - GARDEN_SQUARE * 2; y < this.canvas.height; y += GARDEN_SQUARE) {
            const curPos: Coord = { x: Math.floor((x - this.position.x + GARDEN_SQUARE / 2 - this.canvas.width / 2) / GARDEN_SQUARE), y: Math.floor((y - this.position.y + GARDEN_SQUARE / 2 - this.canvas.height / 2) / GARDEN_SQUARE) };
            ctx.drawImage(this.images[this.isOwned(curPos, owned) ? 'EARTH' : 'EMPTY'], x, y, GARDEN_SQUARE, GARDEN_SQUARE);
          }
        }
      }
    },
    onWheel(event: WheelEvent) {
      this.zoomIdx = Math.min(ZOOM_LEVELS.length - 1, Math.max(0, this.zoomIdx - Math.sign(event.deltaY)));
      this.drawGarden();
    },
    onMouseDown(event: MouseEvent) {
      this.dragPosition = { x: event.screenX, y: event.screenY };
    },
    onMouseMove(event: MouseEvent) {
      if (this.dragPosition) {
        this.position.x += event.screenX - this.dragPosition.x;
        this.position.y += event.screenY - this.dragPosition.y;
        this.dragPosition = { x: event.screenX, y: event.screenY };
        this.drawGarden();
      }
    },
    onMouseUp(event: MouseEvent) {
      this.dragPosition = undefined;
    },
    onMouseLeave(event: MouseEvent) {
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
