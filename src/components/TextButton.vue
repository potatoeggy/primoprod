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
  background-color: #dfdcd3;
  height: 2rem;
  width: 7rem;
  margin: 0.5rem;
  border-radius: 1rem;
  border-width: 0px;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2), 0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 11pt;
  color: black;
  text-align: center;
}
</style>
