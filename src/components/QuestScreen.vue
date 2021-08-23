<template>
  <div :class="{ main: true, 'exit-main': !active }" @animationend="exit">
    <div class="header">
      <p>
        {{ currentTab }}
      </p>
      <close-button @clicked="exitAnimation"></close-button>
    </div>
    <div class="body">
      <div class="quest-selector"></div>
      <div class="quest-details"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CloseButton from "./CloseButton.vue";
import Quests from "@/banners/Quests";

export default defineComponent({
  data() {
    return {
      active: true,
      currentTab: "All Quests",
      quests: new Quests(),
    };
  },
  components: { CloseButton },
  methods: {
    exitAnimation() {
      this.active = false;
    },
    exit() {
      if (!this.active) {
        this.$emit("exit");
      }
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
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

.body {
  margin-bottom: 2rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  width: 80vw;
}

.quest-selector,
.quest-details {
  height: auto;
  width: auto;
  background-color: red;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #d2bd8d;
  font-size: 1.25rem;
  width: 100%;
  margin-left: 4rem;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #00000055;
  height: 5rem;
}

.header > div {
  margin-left: auto;
  margin-right: 4rem; /* ??? header padding no work why */
}

@keyframes main-entry {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #383d53, transparent);
    backdrop-filter: blur(2rem);
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
