<template>
  <audio ref="textClickAudio" preload="auto">
    <source src="@/assets/audio/wish-button.ogg" type="audio/ogg" />
    <source src="@/assets/audio/wish-button.mp3" type="audio/mpeg" />
  </audio>
  <div class="wish-container" tabindex="0" @click="play">
    <img class="wish-button" src="@/assets/images/wish-button.png" />
    <div class="wish-text">
      <p>Wish ×{{ wishes }}</p>
      <p
        :class="{
          red: fates < wishes && !$store.state.settings.infinitePrimos,
        }"
      >
        <img
          class="fate-image"
          :src="
            require(`@/assets/images/${
              standard ? 'acquaint' : 'intertwined'
            }-fate.webp`)
          "
          alt="fate"
        />
        <span>x {{ wishes }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    wishes: {
      type: Number,
      required: true,
    },
    fates: {
      type: Number,
      required: true,
    },
    standard: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["try-wish"],
  methods: {
    play() {
      (this.$refs.textClickAudio as HTMLAudioElement).play();
      this.$emit(`try-wish`, this.wishes);
    },
  },
});
</script>

<style scoped>
.wish-container {
  position: relative;
  display: inline-block;
  color: #b3a08c;
  transition-duration: 0.3s;
}

.wish-container:active {
  filter: brightness(85%);
}

.wish-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

p {
  font-size: 1.3rem;
  user-select: none;
}

.fate-image {
  vertical-align: middle;
  display: inline;
  filter: drop-shadow(0px 1px 1px #222);
  width: 2.25rem;
}

.red {
  color: red;
}

@media screen and (max-width: 850px) and (orientation: portrait),
  screen and (max-height: 700px) and (orientation: landscape) {
  .wish-button {
    width: 22rem;
  }
}

@media screen and (max-width: 600px) and (orientation: portrait),
  screen and (max-height: 500px) and (orientation: landscape) {
  p {
    font-size: 1rem;
  }
  .fate-image {
    width: 1.75rem;
  }
  .wish-button {
    width: 15rem;
  }
}
</style>
