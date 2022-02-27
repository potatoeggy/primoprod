<template>
  <audio ref="audioDescriptionOverlayExit" preload="auto">
    <source src="@/assets/audio/description-exit.ogg" type="audio/ogg" />
    <source src="@/assets/audio/description-exit.mp3" type="audio/mp3" />
  </audio>
  <audio preload="auto" autoplay>
    <source src="@/assets/audio/description-enter.ogg" type="audio/ogg" />
    <source src="@/assets/audio/description-enter.mp3" type="audio/mp3" />
  </audio>
  <div
    :class="{ bg: true, 'zoom-fade-in': active, 'zoom-fade-out': !active }"
    @animationend="exit"
  >
    <div :class="{ 'main-box': true, 'zoom-in': active, 'zoom-out': !active }">
      <br />
      <p>The server has encountered an error. Please try again later.</p>
      <cancel-confirm-button :text="retryText" @pressed="retry" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CancelConfirmButton from "../shared/CancelConfirmButton.vue";

export default defineComponent({
  components: { CancelConfirmButton },
  data() {
    return {
      active: false,
      numRetries: 0,
    };
  },
  computed: {
    retryText(): string {
      if (this.numRetries === 0) return "Retry";
      return `Retry (${this.numRetries})`;
    },
  },
  methods: {
    exitOutsideCheck(e: Event) {
      if (e.target === document.getElementById("server-error-overlay-bg")) {
        (this.$refs.audioDescriptionOverlayExit as HTMLAudioElement).play();
        this.active = true;
      }
    },
    exit() {
      if (!this.active) {
        this.$emit("exit");
      }
    },
    retry() {
      this.$store.dispatch("fetchBanners");
      if (this.$store.state.isServerAccessible) {
        this.active = false;
      } else {
        this.numRetries++;
      }
    },
  },
});
</script>

<style scoped>
p {
  color: #4a5365;
  font-size: 1.5rem;
  margin: 2rem;
}
.bg {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.main-box {
  --description-box-width: 40rem;
  --description-box-height: calc(0.6 * var(--description-box-width));
  color: #6b6c6e;
  background-color: #ebe5d9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: open-dialog 0.1s forwards;
  width: var(--description-box-width);
  height: var(--description-box-height);
  box-sizing: content-box;
  padding: 1rem;
  align-items: center;
  gap: 0.5rem;
}

/* ahahaha copy :( */
.zoom-fade-in {
  animation: desc-overlay-fadein 0.1s;
}

.zoom-fade-out {
  animation: desc-overlay-fadeout 0.1s;
}

@keyframes desc-overlay-fadein {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 1;
  }
}

@keyframes desc-overlay-fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.zoom-in {
  animation: desc-overlay-zoomin 0.1s;
}

.zoom-out {
  animation: desc-overlay-zoomout 0.1s;
}

@keyframes desc-overlay-zoomin {
  from {
    transform: scale(75%);
  }
  to {
    transform: scale(100%);
  }
}

@keyframes desc-overlay-zoomout {
  from {
    transform: scale(100%);
  }
  to {
    transform: scale(75%);
  }
}
</style>
