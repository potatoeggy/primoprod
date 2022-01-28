<template>
  <div class="win" @click="exit">
    <svg viewBox="0 0 302.22 1333.94" height="0" width="0">
      <clipPath
        id="wishframe"
        transform="scale(0.003308 0.00074965)"
        clipPathUnits="objectBoundingBox"
      >
        <path
          d="M0.01 168.12l0 -9.64c4.32,-21.34 12,-32.33 25.46,-25.58 -2.35,-10.3 -1.53,-26.06 5.79,-25.96 19.18,0.25 29.95,-3.14 40.24,-13.16 -4.5,-66.43 51.39,-54.26 79.61,-93.78l0 0c28.22,39.52 84.1,27.34 79.61,93.78 10.29,10.02 21.06,13.41 40.24,13.16 7.32,-0.1 8.13,15.66 5.79,25.96 13.46,-6.75 21.14,4.24 25.46,25.58l0 9.64 0.01 0 0 1004.21 -0.01 0 0 3.13c-4.32,21.34 -12,32.33 -25.46,25.58 2.35,10.3 1.53,26.06 -5.79,25.96 -19.18,-0.25 -29.95,3.14 -40.24,13.16 4.5,66.43 -51.39,54.26 -79.61,93.78l0 0c-28.22,-39.52 -84.1,-27.34 -79.61,-93.78 -10.29,-10.02 -21.06,-13.41 -40.24,-13.16 -7.32,0.1 -8.13,-15.66 -5.79,-25.96 -13.46,6.75 -21.14,-4.24 -25.46,-25.58l0 -3.13 -0.01 0 0 -1004.21 0.01 0z"
        />
      </clipPath>
    </svg>
    <!-- bounding box to create the shape of the div -->
    <div class="align-wishes">
      <div class="asset-box" v-for="item in sortedLastRoll" :key="item.id">
        <img
          :class="['drop-img', { weapon: item.type === 'Weapon' }]"
          :src="require(`@/assets/images/drops/${item.id}.png`)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/state/Inventory";
import { Item, ItemTransform } from "@/types";
import { defineComponent } from "vue";
import ItemTF from "@/data/ItemTransforms.json";

const ItemTransforms: { [key: string]: ItemTransform } = ItemTF;

export default defineComponent({
  props: {
    lastRoll: {
      type: Object as () => Item[],
      required: true,
    },
    inventory: {
      type: Object as () => Inventory,
      required: true,
    },
  },
  computed: {
    sortedLastRoll(): Item[] {
      return this.lastRoll
        .map((e) => e)
        .sort((a, b) =>
          a.rarity - b.rarity || b.type === a.type
            ? a.id.localeCompare(b.id)
            : a.type.localeCompare(b.type)
        );
    },
  },
  methods: {
    exit(): void {
      this.$emit("exit");
    },
  },
  mounted() {
    // we don't have the assets required to make this screen yet
  },
  emits: ["exit"],
});
</script>

<style scoped>
.drop-img {
  position: absolute;
  top: -9999px;
  bottom: -9999px;
  left: -9999px;
  right: -9999px;
  margin: auto;
  height: 150%;
  object-fit: cover;
  transform: translate(0, 5%);
}

.drop-img.weapon {
  height: 100%;
  transform: none;
}
.asset-box {
  background-image: linear-gradient(
    to bottom,
    rgb(82, 107, 129),
    rgb(187, 197, 172),
    rgb(82, 107, 129)
  );
  width: 10%;
  aspect-ratio: 2 / 9;
  clip-path: url(#wishframe);
  overflow: hidden;
  position: relative;
}

.align-wishes {
  height: 100%;
  width: 85%;
  display: flex;
  align-items: center;
  gap: 0.1rem;
}
.win {
  display: flex;
  background: url("../../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
