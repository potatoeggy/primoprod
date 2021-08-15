<template>
  <div class="main">
    <p class="dim">Press anywhere in the blank area to continue</p>
  </div>
</template>

<script lang="ts">
import { Item, ItemDatabase } from "@/banners/Gacha";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
});
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url("../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
  /* once a certain screen size is hit change to align-items center I guess */
}

.dim {
  opacity: 0.5;
}
</style>
