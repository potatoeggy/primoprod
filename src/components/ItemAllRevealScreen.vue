<template><div class="win"></div></template>

<script lang="ts">
import Inventory from "@/banners/Inventory";
import { Item } from "electron";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    lastRoll: {
      type: Object as () => Item[],
      required: true,
    },
    inventory: {
      type: Object as () => Inventory,
      required: true,
    },
  },
  mounted() {
    // we don't have the assets required to make this screen yet
    this.$emit("exit");
  },
  emits: ["exit"],
});
</script>

<style scoped>
.win {
  display: flex;
  background: url("../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
}
</style>
