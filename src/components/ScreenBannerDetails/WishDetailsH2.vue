<template>
  <div class="h2">
    <p>{{ text }}</p>
    <span></span>
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
});
</script>

<style scoped>
div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

p {
  color: #4d4d4d;
  font-size: 1.5rem;
  font-family: Arial, sans-serif;
  margin-right: 3rem;
}

span {
  background-color: #c9c7c4;
  color: #333;
  height: 0.15rem;
  flex: 1 1 auto;
}
</style>
