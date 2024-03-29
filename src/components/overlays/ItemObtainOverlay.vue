<script setup lang="ts">
import { ItemStringQuantity } from "@/types";
import { ItemDatabase } from "@/state/Gacha";
import { computed, ref, Ref } from "vue";
import ItemDescriptionOverlay from "./ItemDescriptionOverlay.vue";

const props = defineProps<{
  obtainedItems: ItemStringQuantity[];
  description?: string;
}>();
const emit = defineEmits(["exit"]);
const activeItemId = ref("");
const active = ref(true);
const audioExitOverlay: Ref<HTMLAudioElement | null> = ref(null);

const items = computed(() =>
  props.obtainedItems
    .map((i) => {
      return {
        item: ItemDatabase[i.id],
        quantity: i.quantity,
      };
    })
    .filter((i) => i.quantity > 0)
);
const activeItem = computed(() => ItemDatabase[activeItemId.value]);

const exitOutsideCheck = (e: Event) => {
  if (
    e.target === document.getElementById("item-obtain-overlay-bg") ||
    e.target === document.getElementById("item-obtain-overlay-center-box")
  ) {
    active.value = false;
    audioExitOverlay.value?.play();
  }
};
const exit = () => {
  if (!active.value) emit("exit");
};
</script>

<template>
  <audio autoplay>
    <source src="@/assets/audio/item-obtain.ogg" type="audio/ogg" />
    <source src="@/assets/audio/item-obtain.mp3" type="audio/mp3" />
  </audio>
  <audio ref="audioExitOverlay" preload="auto">
    ]
    <source src="@/assets/audio/close-overlay.ogg" type="audio/ogg" />
    <source src="@/assets/audio/close-overlay.mp3" type="audio/mp3" />
  </audio>
  <item-description-overlay
    v-if="activeItem"
    :item="activeItem"
    @exit="activeItemId = ''"
  ></item-description-overlay>
  <transition name="zoom-fade" @after-leave="exit">
    <div
      v-if="active"
      id="item-obtain-overlay-bg"
      class="main"
      @click="exitOutsideCheck"
    >
      <p class="obtained">Obtained</p>
      <div id="item-obtain-overlay-center-box" class="center-box">
        <p class="description">{{ description }}</p>
        <div
          id="item-obtain-overlay-items-box"
          v-dragscroll.x
          class="items-box"
        >
          <div
            v-for="(i, index) in items"
            :key="index"
            class="box-for-one-item"
          >
            <div class="item-box-graphics" @click="activeItemId = i.item.id">
              <div
                :class="[
                  [0, 'gray', 'green', 'blue', 'purple', 'orange'][
                    i.item.rarity
                  ],
                  'item-pic-box',
                ]"
              >
                <img
                  :src="require(`@/assets/images/${i.item.id}.webp`)"
                  class="icon-img"
                />
              </div>
              <div class="star-box">
                <template v-for="ind in i.item.rarity" :key="ind">
                  <img class="star-img" src="@/assets/images/star.svg" />
                </template>
              </div>
              <p class="quantity-text">{{ i.quantity }}</p>
            </div>
            <p class="item-name">{{ i.item.name }}</p>
          </div>
        </div>
      </div>
      <p class="dim">Press anywhere in the blank area to continue</p>
    </div>
  </transition>
</template>

<style scoped>
#item-obtain-overlay-bg {
  --obtain-overlay-width: 6rem;
  --obtain-overlay-height: calc(1.2 * var(--obtain-overlay-width));
}

.item-name {
  color: white;
  font-size: calc(var(--obtain-overlay-width) / 6.25);
  margin-top: calc(var(--obtain-overlay-height) / 24);
  letter-spacing: -0.05rem;
}

.icon-img {
  width: calc(var(--obtain-overlay-width) * 0.95);
  filter: drop-shadow(0px 1px 1px #666);
  transform: translateY(calc(var(--obtain-overlay-height) / -24));
}

.box-for-one-item {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: var(--obtain-overlay-width);
  height: var(
    --obtain-overlay-height
  ); /* count on the browser to not shift the whole thing up or down based on text length */
}

.item-box-graphics {
  /* observations indicate height is 1.2x width */
  height: var(--obtain-overlay-height);
  width: 100%;
  background-color: #e6e1da;
  border-radius: 0.25rem;
  box-shadow: 0 0 0.125rem 0.125rem #555;
  font-size: calc(var(--obtain-overlay-width) / 6.25);
  position: relative;
  transition-duration: 0.05s;
}

.item-box-graphics:hover {
  outline: 0.175rem solid white;
  transform: scale(1.05);
  transition-duration: 0.05s;
}

.item-box-graphics:active {
  filter: brightness(110%);
  transition-duration: 0.1s;
}

.star-box {
  position: absolute;
  top: 68%;
  width: 100%;
}

.star-img {
  width: calc(var(--obtain-overlay-width) / 6.25);
  filter: drop-shadow(0px 1px 1px #777);
}

.quantity-text {
  margin-top: 0.1rem;
}

.item-pic-box {
  height: 80%;
  border-radius: inherit;
  border-bottom-right-radius: 1.25rem;
}

.items-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  width: 80%;
  min-width: 20rem;
  height: calc(var(--obtain-overlay-height) + 3rem);
  padding-top: 1rem;
  overflow: hidden;
}

.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  border-top: 0.25rem solid #d4c38f44;
  border-bottom: 0.25rem solid #d4c38f44;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 60%;
}

.main {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 100;
  /* once a certain screen size is hit change to align-items center I guess */
}

.zoom-fade-enter-active {
  animation-duration: 0.05s;
  animation-name: obtain-overlay-fadein;
}

.zoom-fade-leave-active {
  animation-duration: 0.05s;
  animation-name: obtain-overlay-fadein;
  animation-direction: reverse;
}

@keyframes obtain-overlay-fadein {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 1;
  }
}

.main > * {
  animation-duration: 0.1s;
  animation-name: obtain-overlay-zoomin;
}

@keyframes obtain-overlay-zoomin {
  from {
    transform: scale(75%);
  }
  to {
    transform: scale(100%);
  }
}

.main::before {
  content: "";
  background: url("../../assets/images/wish-reveal-background.webp")
      center/cover no-repeat fixed,
    #4a4a52;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  opacity: 0.98;
  position: absolute;
  animation: none;
}

.dim {
  color: #9a9994;
}

.obtained {
  color: #d3be8d;
  font-size: 1.5rem;
}

.description {
  color: white;
  font-size: 1.1rem;
  height: 1.25rem;
}

.orange {
  background: linear-gradient(#936031, #b27730);
}

.purple {
  background: linear-gradient(#565282, #9f6eb9);
}

.blue {
  background: linear-gradient(#577291, #5495b2);
}

.green {
  background-color: #53756a;
}

.gray {
  background-color: #505863;
}
</style>
