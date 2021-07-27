<template>
  <table>
    <tr>
      <th>Item Type</th>
      <th>Item Name</th>
      <th>Item Type</th>
      <th>Item Name</th>
    </tr>
    <tr v-for="row in Math.floor((table[rarity].length - 1) / 2)" :key="row">
      <td>{{ table[rarity][row * 2].type }}</td>
      <td>{{ table[rarity][row * 2].name }}</td>
      <td v-if="table[rarity][row * 2 + 1]">
        {{ table[rarity][row * 2 + 1].type }}
      </td>
      <td v-if="table[rarity][row * 2 + 1]">
        {{ table[rarity][row * 2 + 1].name }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Banner, Item } from "../banners/Gacha";
import ItemDatabase from "../banners/ItemDatabase.json";

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
        for (const i of this.banner.drops) {
          const item = (ItemDatabase as { [name: string]: Item })[i];
          // aiya ram go boom
          drops[item.rarity].push(item);
        }
        for (const i of this.banner.featuredDrops) {
          const item = (ItemDatabase as { [name: string]: Item })[i];
          drops[item.rarity].push({ featured: true, ...item });
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
</style>
