<template>
  <div id="wish-videos">
    <!-- TODO: fix up skip button by referencing actual game
    and ensure it's aligned with the text, also ensure that
    the text is the correct size -->
    <button class="skip-button" type="button" @click="skipped">
      Skip
      <span class="caret right"></span>
    </button>
    <!-- no idea how to use v-for with assets -->
    <video
      id="video-3star-1"
      :class="{ playing: pulls === 1 && stars === 3 }"
      @ended="ended"
    >
      <source src="@/assets/video/3starwish-1.mp4" />
    </video>
    <video
      id="video-4star-1"
      :class="{ playing: pulls === 1 && stars === 4 }"
      @ended="ended"
    >
      <source src="@/assets/video/4starwish-1.mp4" />
    </video>
    <video
      id="video-4star-10"
      :class="{ playing: pulls === 10 && stars === 4 }"
      @ended="ended"
    >
      <source src="@/assets/video/4starwish-10.mp4" />
    </video>
    <video
      id="video-5star-1"
      :class="{ playing: pulls === 1 && stars === 5 }"
      @ended="ended"
    >
      <source src="@/assets/video/5starwish-1.mp4" />
    </video>
    <video
      id="video-5star-10"
      :class="{ playing: pulls === 10 && stars === 5 }"
      @ended="ended"
    >
      <source src="@/assets/video/5starwish-10.mp4" />
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
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 100%;
  min-width: 100%;
  z-index: 2;
}

.playing {
  display: block;
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
