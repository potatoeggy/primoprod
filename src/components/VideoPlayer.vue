<template>
  <div id="wish-videos">
    <!-- TODO: fix up skip button by referencing actual game
    and ensure it's aligned with the text, also ensure that
    the text is the correct size -->
    <button class="skip-button" type="button" @click="skipped">
      Skip
      <span class="caret right"></span>
    </button>
    <video :id="videoId" @ended="ended">
      <source :src="videoSrc" />
    </video>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    pulls: {
      type: Number,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    (
      document.getElementById(
        `video-${this.stars}star-${this.pulls}`
      ) as HTMLAudioElement
    ).play();
  },
  computed: {
    videoId(): string {
      return `video-${this.stars}star-${this.pulls}`;
    },
    videoSrc(): string {
      const videos = require.context("../assets/video/", false, /\.mp4$/);
      try {
        return videos(`./${this.stars}starwish-${this.pulls}.mp4`);
      } catch (error) {
        console.error(error);
        return `${this.stars}starwish-${this.pulls}.mp4`;
      }
    },
  },
  methods: {
    ended(): void {
      this.$emit("video-ended");
    },
    skipped(): void {
      this.$emit("video-skipped");
    },
  },
  emits: ["video-ended", "video-skipped"],
});
</script>

<style scoped>
#wish-videos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
