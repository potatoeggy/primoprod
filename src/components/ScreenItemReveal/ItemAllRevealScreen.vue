<template>
  <audio autoplay preload="true">
    <source src="@/assets/audio/result-list.ogg" />
  </audio>
  <div class="win">
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
    <div
      style="
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        width: 100%;
        z-index: 2;
      "
    >
      <close-button @clicked="exit"></close-button>
    </div>
    <div class="align-wishes">
      <div
        class="asset-box-holder"
        v-for="(item, index) of sortedLastRoll"
        :key="index"
        :style="{
          '--ani-delay': `${index * 0.1}s`,
          '--border-color': glowStyles[item.rarity].outline,
          '--glow-color': glowStyles[item.rarity].glow,
        }"
      >
        <div class="asset-box-border">
          <div class="asset-box">
            <div class="detail-box">
              <div></div>
              <div class="metadata-box">
                <img
                  :src="
                    require(`@/assets/images/icons/icon-element-${item.element}.png`)
                  "
                  :class="{ weapon: item.type === 'Weapon', element: true }"
                />
                <div class="star-box">
                  <img
                    v-for="n in item.rarity"
                    :key="n"
                    src="@/assets/images/star.svg"
                  />
                </div>
              </div>
            </div>
            <img
              :class="['drop-img', { weapon: item.type === 'Weapon' }]"
              :src="require(`@/assets/images/drops/${item.id}.png`)"
              :style="{
                //@ts-ignore
                '--x': `${ItemTransforms[item.id]?.x ?? 0}%`,
                '--y': `${ItemTransforms[item.id]?.y ?? 0}%`,
                '--scale': `${ItemTransforms[item.id]?.scale ?? 100}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/state/Inventory";
import { Item, ItemStringQuantity, ItemTransform } from "@/types";
import { defineComponent } from "vue";
import ItemTF from "@/data/ItemTransforms.json";
import CloseButton from "../shared/CloseButton.vue";

const ItemTransforms: { [key: string]: ItemTransform } = ItemTF;

export default defineComponent({
  components: { CloseButton },
  props: {
    lastRoll: {
      type: Object as () => Item[],
      required: true,
    },
    inventory: {
      type: Object as () => Inventory,
      required: true,
    },
    extraRewards: {
      // TODO: combine this information into lastRoll
      // along with if things are new
      type: Object as () => ItemStringQuantity[],
      required: true,
    },
  },
  data() {
    return {
      ItemTransforms: ItemTransforms,
      glowStyles: {
        3: { outline: "#a2cdf5", glow: "royalblue", intensity: "" },
        4: { outline: "white", glow: "#8275ff", intensity: "" },
        5: { outline: "white", glow: "#ffd479", intensity: "" },
      } as {
        [key: number]: { glow: string; outline: string; intensity: string };
      },
    };
  },
  computed: {
    sortedLastRoll(): Item[] {
      const item = (star: number) =>
        this.lastRoll
          .filter(({ rarity }) => rarity === star)
          .sort(
            (a, b) =>
              // whichever one is newer goes first
              // (if there's only one in inv)
              // TODO: add support for dedicated isNew flag
              // because there's no way you can practically
              // check it
              // TODO: sort by first occurence and then
              // group names instead of sorting by name
              +(this.inventory.inventory[a.id] === 1) -
              +(this.inventory.inventory[b.id] === 1)
          )
          .sort((a, b) => a.type.localeCompare(b.type))
          .sort((a, b) => a.name.localeCompare(b.name));
      return [...item(5), ...item(4), ...item(3)];
    },
  },
  methods: {
    exit(): void {
      this.$emit("exit");
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.detail-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-top: 30%;
  padding-bottom: 40%;
  box-sizing: border-box;
}

.metadata-box > img {
  width: 80%;
}

.metadata-box > img.weapon {
  filter: brightness(200%);
}

.metadata-box {
  width: 100%;
  z-index: 1;
}

.star-box {
  width: 100%;
}

.star-box > img {
  width: 12.5%;
  padding: 0.05rem;
}

.drop-img {
  position: absolute;
  top: -9999px;
  bottom: -9999px;
  left: -9999px;
  right: -9999px;
  margin: auto;
  height: 180%;
  object-fit: cover;
  transform: scale(var(--scale)) translate(calc(var(--x)), calc(12% + var(--y)));
}

.drop-img.weapon {
  width: auto;
  height: 70%;
  transform: none;
}

img.element {
  width: 50%;
  margin-bottom: 0.5rem;
}
.asset-box {
  background-image: linear-gradient(
    to bottom,
    rgb(82, 107, 129),
    rgb(187, 197, 172),
    rgb(82, 107, 129)
  );
  width: 97%;
  height: 99%;
  clip-path: url(#wishframe);
  overflow: hidden;
  position: relative;
}

.asset-box-holder {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  animation: all-glow 0.2s ease-in-out calc(0.3s + var(--ani-delay)) forwards;
}

@keyframes all-glow {
  from {
  }
  to {
    filter: drop-shadow(0 0 1rem var(--glow-color));
  }
}

.asset-box-border {
  width: 100%;
  aspect-ratio: 2 / 9;
  background-color: var(--border-color);
  clip-path: url(#wishframe);
  display: grid;
  place-items: center;
  opacity: 0;
  color: rgb(136, 98, 238);
  animation: all-slide-left 0.5s ease-out var(--ani-delay) forwards;
}

@keyframes all-slide-left {
  from {
    opacity: 0;
    transform: translateX(200%);
  }
  to {
    opacity: 1;
  }
}

.align-wishes {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 10%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 0.25rem;
}
.win {
  display: flex;
  background: url("../../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
}
</style>
