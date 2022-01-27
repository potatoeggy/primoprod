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
        <th>Wish Type</th>
        <th>Time Received</th>
      </tr>
      <template
        v-for="(pull, index) of pulls
          .filter((p) => p.bannerStorage === selectedWishType)
          .slice(
            currentPage * MAX_PULLS_PER_PAGE,
            currentPage * MAX_PULLS_PER_PAGE + MAX_PULLS_PER_PAGE
          )"
        :key="index"
      >
        <tr>
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
          <td>{{ pull.description }}</td>
          <td>{{ dayjs(pull.date).format("YYYY-MM-DD HH:mm:ss") }}</td>
        </tr>
      </template>
    </table>
    <div
      class="footer-buttons"
      v-if="!$store.state.settings.unlimitedHistoryScroll"
    >
      <!-- I know that buttons exist but they come
           with so much extra stuff I don't want to
           deal with -->
      <div
        :class="['page-button-box', { disabled: currentPage == 0 }]"
        @click="currentPage = Math.max(currentPage - 1, 0)"
      >
        &lt;
      </div>
      <div class="page-button-box page-number-indicator">
        {{ currentPage + 1 }}
      </div>
      <div
        :class="['page-button-box', { disabled: currentPage == numPullPages }]"
        @click="currentPage = Math.min(currentPage + 1, numPullPages)"
      >
        &gt;
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ItemDatabase } from "@/state/Gacha";
import Inventory from "@/state/Inventory";
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { Item, Pull } from "@/types";

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
      MAX_PULLS_PER_PAGE: this.$store.state.settings.unlimitedHistoryScroll
        ? 1000000000
        : 6,
    };
  },
  computed: {
    pulls(): DetailedPull[] {
      return this.inventory.pullHistory
        .map((pull) => {
          return {
            item: ItemDatabase[pull.item],
            bannerStorage: pull.bannerStorage,
            description: pull.description,
            date: pull.date,
          };
        })
        .reverse();
    },
    numPullPages(): number {
      return (
        Math.ceil(
          this.pulls.filter((p) => p.bannerStorage === this.selectedWishType)
            .length / this.MAX_PULLS_PER_PAGE
        ) - 1
      );
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
  watch: {
    selectedWishType: function () {
      this.currentPage = 0;
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
.page-button-box {
  --box-size: 3rem;
  width: var(--box-size);
  height: var(--box-size);
  background-color: #c3a280;
  color: white;
  display: grid;
  place-items: center;
  border-radius: 0.25rem;
}

.page-button-box.disabled {
  background-color: gray;
}

.footer-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
}

.footer-buttons > * {
  margin-left: 1rem;
  margin-right: 1rem;
}

.page-number-indicator {
  background-color: #918981;
  margin: 0;
}

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
  max-width: 10rem;
}

th:nth-child(2) {
  /* Select the second column */
  width: auto;
}

th:nth-child(3) {
  /* Select the second column */
  max-width: 14rem;
}

th:nth-child(4) {
  max-width: 14rem;
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
