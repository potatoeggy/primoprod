<script setup lang="ts">
import { HeaderTransforms } from "@/state/Gacha";
import { Banner } from "@/types";
import { computed } from "vue";

const DEFAULT_BANNER_ICON_CHAR = "qiqi";

const props = withDefaults(
  defineProps<{
    banner: Banner;
    isSelected?: boolean;
  }>(),
  { isSelected: false }
);

// take first featured char
const iconChar =
  props.banner.headerCharacter ??
  props.banner.featuredDrops[0] ??
  DEFAULT_BANNER_ICON_CHAR;

const transforms = HeaderTransforms[iconChar];
const x = `${transforms?.x ?? 0}%`;
const y = `${transforms?.y ?? 0}%`;
const scale = `${transforms?.scale ?? 100}%`;

const iconCharSrc = computed(() => {
  const images = require.context(
    "@/assets/images/banner-headers/",
    false,
    /\.webp$/
  );
  try {
    return images(`./${iconChar}.webp`);
  } catch (error) {
    return `./${iconChar}.webp`;
  }
});

const emit = defineEmits(["click"]);
</script>

<template>
  <button :class="['button', { selected: isSelected }]" @click="emit('click')">
    <div class="outer-border">
      <div class="inner-border">
        <i class="gi-primo-star dull" />
        <i class="gi-companion duller" />
      </div>
    </div>

    <div class="img-container">
      <img :src="iconCharSrc" />
    </div>
  </button>
</template>

<style scoped lang="scss">
$selected-bg: #f7f3d7;
$default-bg: #4d6d95;

.outer-border {
  margin: 1.5%;
  border-radius: 0.25rem;
  border: 0.15rem solid var(--default-border);
  width: 100%;
  height: 85%;
  transition: border 0.2s ease-in-out;

  & > .inner-border {
    transition: border 0.2s ease-in-out;
    border-radius: 0.25rem;
    border: 0.15rem solid var(--default-border);
    border-radius: 5em;
    position: absolute;
    inset: 5% 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }
}

.button {
  aspect-ratio: 175/63;
  background: $default-bg;
  min-width: 10.5rem;
  max-width: calc(100% / 3);
  outline: none;
  border: none;
  display: flex;
  position: relative;
  align-items: flex-start;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out;
  --default-border: #6e91bc;

  &.selected,
  &:hover {
    background: $selected-bg;
    --default-border: #eee3c7;
    transform: scale(1.1);
  }

  & > .img-container {
    width: 100%;
    height: 150%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: hidden;
    border-radius: 0.25rem;
    top: -50%;
    left: 0;

    & > img {
      min-height: 100%;
      min-width: 150%;
      transform: scale(calc(0% + v-bind(scale)))
        translate(calc(v-bind(x)), calc(5% + v-bind(y)));
      object-fit: cover;
      transition: transform 0.2s ease-in-out;
    }
  }
  &.selected img {
    transform: scale(calc(0% + v-bind(scale)))
      translate(calc(v-bind(x)), calc(-1% + v-bind(y)));
  }
}

i.gi-primo-star {
  text-align: center;
  padding-left: 0.3rem;
  font-size: 0.75rem;
}

i.gi-companion {
  position: absolute;
  font-size: 5rem;
  right: -25%;
  top: -50%;
}

.dull {
  --highlight: #fff2;
  color: var(--highlight);

  .selected &,
  &:hover {
    --highlight: #f0eacd;
  }
}

.duller {
  --highlight: #fff1;
  color: var(--highlight);

  .selected &,
  &:hover {
    --highlight: #f0eacd;
  }
}

@media screen and (max-width: 600px) {
  .button {
    min-width: 10rem;
  }
}
</style>
