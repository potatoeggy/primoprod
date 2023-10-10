<script setup lang="ts">
import { Item } from "@/types";
import { computed } from "vue";

const props = defineProps<{ character: Item }>();
const icons = (path: string) => {
  const i = require.context("@/assets/images/icons/", false, /\.webp$/);
  try {
    return i(path);
  } catch (err) {
    return path;
  }
};

const elementSrc = computed(() => {
  const images = require.context("@/assets/images/icons", false, /\.webp$/);
  try {
    return images(`./icon-element-${props.character.element}.webp`);
  } catch (error) {
    return `./icon-element-${props.character.element}.webp`;
  }
});

const raritySrc = computed(() => {
  const images = require.context("@/assets/images/icon-bgs", false, /\.webp$/);
  try {
    return `url(${images(`./${props.character.rarity}star.webp`)})`;
  } catch (error) {
    return `./${props.character.rarity}star.webp`;
  }
});
</script>

<template>
  <div class="item-pic-box">
    <img class="element" :src="elementSrc" />
    <img class="profile" :src="icons(`./${character.id}.webp`)" />
    <p>Lv. 1</p>
  </div>
</template>

<style scoped>
.element {
  position: absolute;
  width: 30%;
}
.item-pic-box {
  border: 0.15em solid rgba(128, 128, 128, 0.2);
  border-radius: 0.25em;
  aspect-ratio: 9/11;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.item-pic-box > p {
  padding: 2%;
  padding-bottom: -0.1rem;
  letter-spacing: 0;
  font-size: 1em;
  text-align: center;
}

img.profile {
  background: v-bind(raritySrc) center/cover no-repeat;
  border-radius: 0.2em 0.2em 1em 0;
  width: 100%;
  max-height: 100%;
  aspect-ratio: 1/1;
}

@media screen and (max-width: 600px) {
  .item-pic-box > p {
    font-size: 0.7em;
  }
}
</style>
