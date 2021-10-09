<template>
  <audio ref="audioDescriptionOverlayExit" preload="true">
    <source src="@/assets/audio/description-exit.mp3" />
  </audio>
  <audio preload="true" autoplay>
    <source src="@/assets/audio/description-enter.mp3" />
  </audio>
  <div
    :class="{ bg: true, 'zoom-fade-in': active, 'zoom-fade-out': !active }"
    id="item-purchase-overlay-bg"
    @click="exitOutsideCheck"
    @animationend="exit"
  >
    <div
      :class="{ 'main-box': true, 'zoom-in': active, 'zoom-out': !active }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Item } from "@/banners/Gacha";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
  data() {
    return {
      active: true,
    };
  },
  methods: {
    exitOutsideCheck(e: Event) {
      if (e.target === document.getElementById("item-purchase-overlay-bg")) {
        (this.$refs.audioDescriptionOverlayExit as HTMLAudioElement).play();
        this.active = false;
      }
    },
    exit() {
      if (!this.active) {
        this.$emit("exit");
      }
    },
  },
});
</script>

<style scoped>
.bg {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
