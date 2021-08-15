<template>
  <div class="main">
    <p class="dim">Press anywhere in the blank area to continue</p>
  </div>
</template>

<script lang="ts">
import { Item, ItemDatabase } from "@/banners/Gacha";
import { defineComponent } from "vue";

export interface ItemStringQuantity {
  id: string;
  quantity: number;
}

export interface ItemQuantity {
  item: Item;
  quantity: number;
}

export default defineComponent({
  props: {
    obtainedItems: {
      type: Object as () => Array<ItemStringQuantity>,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  computed: {
    items(): Array<ItemQuantity> {
      return this.obtainedItems.map((i) => {
        return { item: ItemDatabase[i.id], quantity: i.quantity };
      });
    },
  },
});
</script>

<style scoped>
.main {
  position: fixed;
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
