<template>
  <audio ref="textClickAudio" preload="true">
    <source src="@/assets/audio/text-click.mp3" type="audio/mpeg" />
  </audio>
  <button class="menu-button" @click="play" type="button">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    play() {
      (this.$refs.textClickAudio as HTMLAudioElement).play();
      this.$emit("clicked");
    },
  },
  emits: ["clicked"],
});
</script>

<style>
.menu-button {
  background: #e0ddd4;
  height: 2.5rem;
  width: 10rem;
  margin: 0.5rem;
  border-radius: 2rem;
  border: solid transparent;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2),
    0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 1.25rem;
  color: black;
  text-align: center;
  transition: border 0.3s;
  outline: none;
}

.menu-button:hover,
.menu-button:focus {
  border: 3px solid white;
  transition: none;
}

.menu-button:active {
  animation-name: colourchange;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes colourchange {
  0% {
  }
  50% {
    color: #ffffda;
    background: #ede9cc;
  }
  100% {
    border: 3px solid darkgray;
    color: white;
    background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
      #e0ddd4;
  }
}

@media screen and (max-width: 850px) and (orientation: portrait),
  (orientation: landscape) and (max-height: 850px) {
  .menu-button {
    transform: scale(75%);
    margin: 0;
  }
}
</style>
