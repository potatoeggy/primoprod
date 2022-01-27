<template>
  <div class="cancel-confirm-selector" :style="styles">
    <button
      type="button"
      :class="['cancel-confirm-button', { disabled: disabled }]"
      @click="onclick"
    >
      <span class="icon">
        <span
          :class="{
            icon_x: text === 'Cancel',
            icon_o: text !== 'Cancel' && text !== 'Delete',
          }"
        >
          <img
            class="icon_delete"
            src="@/assets/images/delete.svg"
            v-if="text === 'Delete'"
          />
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
    invert: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    styles(this) {
      return {
        "--bg-color":
          this.invert || this.disabled
            ? "rgb(228, 226, 220)"
            : "rgb(74, 83, 101)",
        "--text-color":
          this.invert || this.disabled
            ? "rgb(74, 83, 101)"
            : "rgb(228, 226, 220)",
        "--length": this.invert ? "13rem" : "18rem",
      };
    },
  },
  methods: {
    onclick(): void {
      if (!this.disabled) this.$emit("pressed");
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
  color: var(--text-color);
  background-color: var(--bg-color);
  margin: 1rem 1rem;
  padding: 0.5rem 2rem 1rem 2.5rem;
  border-radius: 1.5rem;
  border: 0px solid transparent;
  width: var(--length);
  height: 3rem;
  font-size: 1.5rem;
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

.cancel-confirm-button:hover:not(.disabled),
.cancel-confirm-button:active:not(.disabled) {
  box-shadow: #ffe8b3 0px 0px 0px 0.3rem;
  transition: none;
}

.disabled {
  box-shadow: rgb(49, 49, 49) 0px 0px 0px 0.1rem;
  opacity: 0.4;
}

.cancel-confirm-button:active:not(.disabled) {
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
    box-shadow: var(--bg-color) 0px 0px 0px 0.1rem;
    background-color: #ffe8b3;
    color: var(--bg-color);
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

.icon_delete {
  color: red;
  margin-top: 0.3rem;
  width: 80%;
}

@media screen and (max-width: 850px) and (orientation: portrait),
  (orientation: landscape) and (max-height: 850px) {
  .cancel-confirm-button {
    font-size: 1.5rem;
    width: calc(var(--length) * 0.9);
  }
}
</style>
