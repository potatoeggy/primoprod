<template>
  <div class="main">
    {{ inventory.primos }}
  </div>
</template>

<script lang="ts">
import Inventory from "@/banners/Inventory";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
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
    background: linear-gradient(to bottom, #383d53, transparent);
    backdrop-filter: blur(1.5rem);
  }
}

@keyframes main-exit {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #383d53, transparent);
    backdrop-filter: blur(1rem);
  }
}
</style>
