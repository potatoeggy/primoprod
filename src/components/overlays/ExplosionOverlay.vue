<template>
  <div class="explosion-overlay"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>

<style scoped>
.explosion-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 5;
}
</style>
