<template>
  <button type="button" class="cancel-confirm-button" v-on:click="onclick">
    <span class="icon">
      <span :class="{ icon_x: text === 'Cancel', icon_o: text === 'Confirm' }">
        <div></div>
        <div></div>
      </span>
    </span>
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
  border-radius: 1.25rem;
  border: 0px solid transparent;
  width: 15rem;
  height: 2.5rem;
  font-size: 75%;
}

.icon {
  position: absolute;
  display: grid;
  place-items: center;
  background-color: rgb(49, 49, 49);
  margin: 0.75rem;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  left: -0.3rem;
  top: -0.3rem;
}

.cancel-confirm-button:hover {
  box-shadow: rgb(244, 156, 0) 0px 0px 0px 0.2rem;
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
  width: 0.8rem;
  height: 0.15rem;
  transform: rotate(45deg);
  border-radius: 0.5rem;
}

.icon_x div:nth-child(2) {
  transform: rotate(-45deg);
}

.icon_o {
  border: 0.15rem solid rgb(226, 182, 50);
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
}
</style>
