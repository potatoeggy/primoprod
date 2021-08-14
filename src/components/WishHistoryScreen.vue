<template>
  <div class="header" @keyup.esc="exit">
    <img
      src="@/assets/images/exit-browser.png"
      class="exit-button"
      @click="exit"
    />
  </div>
  <div class="details">
    <p class="select-wish-type">
      Select Wish Type:
      <select v-model="selectedWishType">
        <option v-for="item in wishTypes" :key="item">{{ item }}</option>
      </select>
    </p>
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
      <template v-for="(pull, index) of pulls.slice().reverse()" :key="index">
        <tr v-if="pull.bannerStorage === selectedWishType">
          <td>{{ pull.item.type }}</td>
          <td>
            <span
              :class="{
                purple: pull.item.rarity === 4,
                gold: pull.item.rarity === 5,
              }"
              >{{ pull.item.name }}</span
            >
            <span class="purple" v-if="pull.item.rarity === 4"> (4-Star) </span>
            <span class="gold" v-else-if="pull.item.rarity === 5">
              (5-Star)
            </span>
          </td>
          <td>{{ dayjs(pull.date).format("YYYY-MM-DD HH:mm:ss") }}</td>
        </tr>
      </template>
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
      selectedWishType: "",
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
    wishTypes(): string[] {
      // get all unique bannerStorages
      return [
        ...new Set(
          this.inventory.pullHistory.map((pull) => pull.bannerStorage)
        ),
      ];
    },
  },
  methods: {
    exit(): void {
      this.$emit("exit");
    },
  },
  emits: ["exit"],
  created() {
    this.selectedWishType = this.pulls[0]?.bannerStorage;
  },
});
</script>

<style scoped>
.select-wish-type {
  width: 100%;
  text-align: left;
  font-size: 1.5rem;
}
select {
  height: 3rem;
  width: 40%;
  background-color: #dbd7d3;
  border: 2px solid #afaba7;
  border-radius: 0.25rem;
  color: #4d4d4d;
  font-size: 1rem;
  padding-left: 0.5rem;
  margin-left: 1rem;
}

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
  width: 1.5rem;
  height: 1.5rem;
  margin: auto;
  margin-left: 1rem;
  filter: brightness(30%);
}

.exit-button:hover,
.exit-button:active {
  filter: brightness(100%);
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
  color: #8e8e8e;
}

th:nth-child(1) {
  /* Select the second column */
  width: 10rem;
}

th:nth-child(2) {
  /* Select the second column */
  width: auto;
}

th:nth-child(3) {
  /* Select the second column */
  width: 14rem;
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
