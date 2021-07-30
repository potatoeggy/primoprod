<template>
  <div class="header" @keyup.esc="exit">
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="undo"
      class="exit-button"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      @click="exit"
    >
      <path
        fill="currentColor"
        d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"
      ></path>
    </svg>
  </div>
  <div class="details">
    <h2>Select Wish Type:</h2>
    <p>
      * You can check the wishes you made. Wish records are updated instantly
      after the wish is made. If there is no record yet, please check again
      later. The times displayed below are according to local time.
    </p>
    <!-- largely from BannerDetailsDropTable -->
    <table>
      <tr>
        <th>Item Type</th>
        <th>Item Name</th>
        <th>Time Received</th>
      </tr>
      <tr v-for="(pull, index) of pulls" :key="-index">
        <td>{{ pull.item.type }}</td>
        <td>
          <span
            :class="{
              purple: pull.item.rarity === 4,
              gold: pull.item.rarity === 5,
            }"
            >{{ pull.item.name }}</span
          >
          <span class="purple" v-if="pull.item.rarity === 4"> (4-star) </span>
          <span class="gold" v-else-if="pull.item.rarity === 5">
            (5-star)
          </span>
        </td>
        <td>{{ dayjs(pull.date).format("YYYY-MM-DD HH:mm:ss") }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Item, ItemDatabase } from "@/banners/Gacha";
import Inventory, { Pull } from "@/banners/Inventory";
import { defineComponent } from "vue";
import dayjs from "dayjs";

interface DetailedPull extends Omit<Pull, "item"> {
  item: Item;
}

export default defineComponent({
  props: {
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 0,
      dayjs: dayjs,
    };
  },
  computed: {
    pulls(): DetailedPull[] {
      return this.inventory.pullHistory.map((pull) => {
        return {
          item: ItemDatabase[pull.item],
          bannerStorage: pull.bannerStorage,
          date: pull.date,
        };
      });
    },
  },
  methods: {
    exit(): void {
      this.$emit("exit");
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
/* TODO: this is all copied straight from BannerDetails
 * so consider making the header/details bg a component
 * also setting font/colours
 */
.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #ebebeb;
  padding: 2rem;
  padding-left: 6rem;
  padding-right: 6rem;
  /* viewport - header + padding*2 so that the page doesn't
     extend to the bottom cutting off content */
  height: calc(100% - 7rem);
  overflow: auto;
}

.header {
  background-color: #111315;
  height: 3rem;
  display: flex;
  align-items: flex-start;
}

.exit-button {
  width: 1.1rem;
  margin: 1rem;
}

.exit-button:hover,
.exit-button:active {
  color: goldenrod;
}

p {
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
  line-height: 1.5rem;
  color: #4d4d4d;
}

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

.gold {
  color: #bd6029;
}

.purple {
  color: #a153e1;
}
</style>
