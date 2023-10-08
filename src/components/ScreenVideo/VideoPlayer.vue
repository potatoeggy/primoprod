<script setup lang="ts">
import { Item } from "@/types";
import { computed, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    pulls: number;
    stars: number;
    preloader?: boolean;
    preloadDrops: Item[];
  }>(),
  { preloadDrops: () => [] }
);
const emit = defineEmits(["video-ended", "video-skipped"]);

const videoId = computed(() => `video-${props.stars}star-${props.pulls}`);
const videoSrcWebm = computed(() => {
  const videos = require.context("@/assets/video/", false, /\.webm$/);
  try {
    return videos(`./${props.stars}starwish-${props.pulls}.webm`);
  } catch (error) {
    console.error(error);
    return `${props.stars}starwish-${props.pulls}.webm`;
  }
});

const allVideo = [
  "3starwish-1.webm",
  "4starwish-1.webm",
  "4starwish-10.webm",
  "5starwish-1.webm",
  "5starwish-10.webm",
];

function ended() {
  emit("video-ended");
}

function skipped() {
  emit("video-skipped");
}

onMounted(() => {
  if (!props.preloader)
    (
      document.getElementById(
        `video-${props.stars}star-${props.pulls}`
      ) as HTMLAudioElement
    ).play();
});
</script>

<template>
  <div v-if="preloader" style="display: none">
    <video v-for="(v, index) in allVideo" :key="index">
      <source
        :src="require(`@/assets/video/${v}`)"
        type="video/webm"
        rel="prefetch"
      />
    </video>
  </div>
  <div v-else id="wish-videos">
    <!-- TODO: fix up skip button by referencing actual game
    and ensure it's aligned with the text, also ensure that
    the text is the correct size -->
    <button class="skip-button" type="button" @click="skipped">
      Skip
      <span class="caret right"></span>
    </button>
    <video :id="videoId" @ended="ended">
      <source :src="videoSrcWebm" type="video/webm" />
    </video>
    <!-- prefetch drops ahead of time here -->
    <!-- also prefetch obtain overlay background -->
    <div style="display: none">
      <img ref="prefetch" src="@/assets/images/wish-reveal-background.webp" />
      <img
        v-for="(i, index) in preloadDrops"
        :key="index"
        ref="prefetch"
        :src="require(`@/assets/images/drops/${i.id}.webp`)"
      />
      <img
        v-for="(i, index) in preloadDrops"
        :key="index"
        ref="prefetch"
        :src="require(`@/assets/images/icons/icon-element-${i.element}.webp`)"
      />
    </div>
  </div>
</template>

<style scoped>
#wish-videos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

video {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 100%;
  min-width: 100%;
  z-index: 2;
}

.skip-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  font-size: 2rem;
  z-index: 3;
  border: none;
  background-color: transparent;
  letter-spacing: -2px;
}

.caret {
  width: 0;
  height: 0;
  display: inline-block;
  border: 0.75rem solid transparent;
}

.caret.right {
  border-left-color: white;
}
</style>
