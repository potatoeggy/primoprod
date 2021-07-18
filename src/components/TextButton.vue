<template>
  <button class="menu-button">{{ text }}</button>
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
});
</script>

<style scoped>
.menu-button {
  background-color: #e0ddd4;
  height: 2.5rem;
  width: 10rem;
  margin: 0.5rem;
  border-radius: 2rem;
  border: solid transparent;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2),
    0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 14pt;
  color: black;
  text-align: center;
  transition: border 0.3s;
  outline: none;
}

.menu-button:hover,
.menu-button:focus {
  border: 4px solid white;
  transition: none;
}
</style>
