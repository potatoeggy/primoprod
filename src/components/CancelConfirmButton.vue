<template>
  <div class="cancel-confirm-selector">
    <button type="button" class="cancel-confirm-button" @click="onclick">
      <span class="icon">
        <span
          :class="{ icon_x: text === 'Cancel', icon_o: text === 'Confirm' }"
        >
          <div></div>
          <div></div>
        </span>
      </span>
      {{ text }}
    </button>
  </div>
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
    onclick(): void {
      this.$emit("pressed");
    },
  },
  emits: ["pressed"],
});
</script>

<style>
.cancel-confirm-button {
  position: relative;
  display: flex;
  justify-content: center;
  color: rgb(228, 226, 220);
  background-color: rgb(74, 83, 101);
  margin: 1rem 1rem;
  padding: 0.5rem 2rem 1rem 2.5rem;
  border-radius: 1.5rem;
  border: 0px solid transparent;
  width: 18rem;
  height: 3rem;
  font-size: 70%;
  transition: box-shadow 0.3s;
  letter-spacing: -0.1rem;
}

.icon {
  position: absolute;
  display: grid;
  place-items: center;
  background-color: rgb(49, 49, 49);
  margin: 0.75rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  left: -0.3rem;
  top: -0.3rem;
}

.cancel-confirm-button:hover,
.cancel-confirm-button:active {
  box-shadow: #ffe8b3 0px 0px 0px 0.3rem;
  transition: none;
}

.cancel-confirm-button:active {
  animation-name: colourchangedialog;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes colourchangedialog {
  0% {
  }
  50% {
    color: #ffffda;
    background: #ede9cc;
  }
  100% {
    box-shadow: rgb(74, 83, 101) 0px 0px 0px 0.1rem;
    background-color: #ffe8b3;
    color: rgb(74, 83, 101);
  }
}

.icon_x {
  position: relative;
  transform-origin: center center 0px;
  display: grid;
  place-items: center;
}

.icon_x div {
  position: absolute;
  background-color: rgb(55, 161, 227);
  width: 1.25rem;
  height: 0.2rem;
  transform: rotate(45deg);
  border-radius: 0.5rem;
}

.icon_x div:nth-child(2) {
  transform: rotate(-45deg);
}

.icon_o {
  border: 0.2rem solid rgb(226, 182, 50);
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}
</style>
