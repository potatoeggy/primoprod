<template>
  <table>
    <tr>
      <th>Item Type</th>
      <th>Item Name</th>
      <th>Item Type</th>
      <th>Item Name</th>
    </tr>
    <tr v-for="row in Math.ceil((table[rarity].length - 1) / 2)" :key="row">
      <!-- Vue is one-indexed for whatever so we subtract one
           and then multiply by two to get to current row index -->
      <!-- TODO: consider using v-for over these two -->
      <td>{{ table[rarity][(row - 1) * 2].type }}</td>
      <td>
        <span v-if="table[rarity][(row - 1) * 2].featured">
          <img src="@/assets/images/rate-up-check.png" alt="rate_up" />
        </span>
        {{ table[rarity][(row - 1) * 2].name }}
      </td>
      <td v-if="table[rarity][(row - 1) * 2 + 1]">
        {{ table[rarity][(row - 1) * 2 + 1].type }}
      </td>
      <td v-if="table[rarity][(row - 1) * 2 + 1]">
        <span v-if="table[rarity][(row - 1) * 2 + 1].featured">
          <img src="@/assets/images/rate-up-check.png" alt="rate_up" />
        </span>
        {{ table[rarity][(row - 1) * 2 + 1].name }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Banner, Item } from "@/types";
import { ItemDatabase } from "@/state/Gacha";

export default defineComponent({
  props: {
    banner: {
      type: Object as () => Banner,
      required: true,
    },
    rarity: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      table: (() => {
        const drops: Item[][] = [[], [], [], [], [], []];
        for (const i of this.banner.featuredDrops) {
          const item = ItemDatabase[i];
          drops[item.rarity].push({ featured: true, ...item });
        }
        for (const i of this.banner.drops) {
          if (
            ((i: Item) => {
              for (const it of drops[i.rarity]) {
                if (it.id === i.id) {
                  return false;
                }
              }
              return true;
            })(ItemDatabase[i])
          ) {
            // aiya ram go boom
            drops[ItemDatabase[i].rarity].push(ItemDatabase[i]);
          }
        }
        return drops;
      })(),
    };
  },
});
</script>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 1.25rem;
}

td,
th {
  padding: 0.75rem;
  border: 0.1rem solid #c4c2bf;
}

td {
  color: #a38052;
}

th {
  font-weight: bolder;
  background-color: #dbd7d3;
  color: #4d4d4d;
}

img {
  width: 1rem;
}
</style>
