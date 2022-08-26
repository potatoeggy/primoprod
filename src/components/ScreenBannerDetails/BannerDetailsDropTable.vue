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
        <span v-if="table[rarity][(row - 1) * 2].featured" class="up" />
        {{ table[rarity][(row - 1) * 2].name }}
      </td>
      <td v-if="table[rarity][(row - 1) * 2 + 1]">
        {{ table[rarity][(row - 1) * 2 + 1].type }}
      </td>
      <td v-if="table[rarity][(row - 1) * 2 + 1]">
        <span v-if="table[rarity][(row - 1) * 2 + 1].featured" class="up" />
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
table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 1.25em;
}

td,
th {
  padding: 0.75rem;
  border: 0.1rem solid #d3bc8e;
  position: relative;
  background-clip: padding-box; /* fixes th borders on firefox */
}

th {
  background-color: #ede1ca;
}

span.up::after {
  content: "";
  display: inline-block;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAcCAMAAAAQssz4AAAAe1BMVEX////////ioA3flQf////////kpxD////xxDftvC7joST52Ej////osjzzyz3rtCfkpR3kqCH20ULswWLjpS7kqDbhnw/gmhDflxHiox/9303dlAjjoxbqwGTnqyDfmxjfmRfvyW7ru2Pz3Kzrw3rdlArmriT226b/51ZBXqVYAAAAKHRSTlMTCcvGJTbOHOLbafIucuXXo5nsUF9Ivp6Pjvm4s0XRhHhfOiglrKo5bs6LUQAAAapJREFUOMuNlOmSgyAQhHXGBRQNHrnvTbJJ3v8Jd2YwoOZH0lY5CP3RYCnJSzoTleXPVGXph3QSpROtg3+ElHx5QvdE+hYwCZkAn1dEQFUDNIcIzFdIWjaPrKuVUsvmrrzuTcVIBSw8BD+KAPYd9aux9tVP2YB9Pg0WL2CN7ZPloIIZNwzdRdbmSjVlHYCQYGk0lwRijVL83DNK/U6B5Iw8JcAjkwinVM4TKGWozKB5Awo0AmQeUAFQMtHya+BXqoMxkH4GPiXAl0vCAMBk080QSCOAAYB88FqhGwPpGDBDwLY5wCb7EsiBta+k11qHix5Ie+CIBYXPhkC9mWekA7J2twAs0JGhRRLQOqAGJ0CXeRWI7oghgYg/bJnIndmy8SSAg4P36xUPG1yzXQD/+fUyuOzASZC3a41I/VvcRSA5UejMPretAcRLR0tsASpv18kOKdhyQiqA7HuHvTYXfUUAamRaxD/M0RjEgswBSG6L8wr/1gXvTG8QV3Mxi27yC5/YK4DUsa7XeABxWZyLS2/090hovmJTitcQ8M0IBXN0R1es4VQL5mCPwD/VrjiwIF0k7QAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: cover;
  height: 1em;
  aspect-ratio: 5/3;
  position: absolute;
  right: 5%;
  top: 10%;
}
</style>
