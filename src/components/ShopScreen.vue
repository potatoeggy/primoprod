<template>
  <div class="main">
    <div class="header">
      <close-button @clicked="exit"></close-button>
      <div style="margin-right: 3rem">
        <gem-counter
          icon="primogem.png"
          :text="inventory.primos"
          plusSign
          outline
          nobackground
        >
        </gem-counter>
      </div>
      <gem-counter
        icon="starglitter.png"
        :text="inventory.starglitter"
        outline
        nobackground
      >
      </gem-counter>
      <gem-counter
        icon="stardust.png"
        :text="inventory.stardust"
        outline
        nobackground
      ></gem-counter>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/banners/Inventory";
import { defineComponent } from "vue";
import GemCounter from "./GemCounter.vue";
import CloseButton from "./CloseButton.vue";

// import a shop json

export default defineComponent({
  components: { GemCounter, CloseButton },
  props: {
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  methods: {
    exit() {
      // TODO: exit animation
      this.$emit("exit");
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  margin-right: 3rem;
}

/* TODO: re-use css via components this is super inefficient
 * right now since it's copied from QuestScreen
 */
.main {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  animation: main-entry 0.1s ease-in 0s forwards;
  padding: 1rem;
  box-sizing: border-box;
}

.exit-main {
  animation: main-exit 0.1s ease-in 0s reverse forwards;
}

@keyframes main-entry {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #2c3047, transparent);
    backdrop-filter: blur(1.5rem);
  }
}

@keyframes main-exit {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #2c3047, transparent);
    backdrop-filter: blur(1rem);
  }
}
</style>
