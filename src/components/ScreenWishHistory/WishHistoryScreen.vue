<script setup lang="ts">
import { ItemDatabase } from "@/state/Gacha";
import Inventory from "@/state/Inventory";
import { GachaState } from "@/types";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import BookOverlay from "../overlays/BookOverlay.vue";
import dayjs from "dayjs";

const store = useStore();
const props = defineProps<{
  inventory: Inventory;
  activeBannerStorage: string;
}>();
const emit = defineEmits(["exit"]);

const currentPage = ref(0);
const selectedWishType = ref(props.activeBannerStorage);
const MAX_PULLS_PER_PAGE = store.state.settings.unlimitedHistoryScroll
  ? 1000000000
  : 5;

const pulls = computed(() =>
  props.inventory.pullHistory
    .map((pull) => {
      return {
        item: ItemDatabase[pull.item],
        bannerStorage: pull.bannerStorage,
        description: pull.description,
        date: pull.date,
      };
    })
    .reverse()
);

const numPullPages = computed(() =>
  Math.ceil(
    pulls.value.filter((p) => p.bannerStorage === selectedWishType.value)
      .length / MAX_PULLS_PER_PAGE
  )
);

const wishTypes = computed(() => [
  ...new Set(props.inventory.pullHistory.map((p) => p.bannerStorage)),
]);
const gachaStates = computed(() => {
  let ob: Record<string, GachaState> = {};
  for (const id of wishTypes.value) {
    ob[id] = JSON.parse(localStorage.getItem(`gacha-${id}`) ?? "{}");
  }
  return ob;
});

const exit = () => emit("exit");

watch(selectedWishType, () => (currentPage.value = 0));
</script>

<template>
  <BookOverlay @exit="exit">
    <div class="details">
      <header>
        <img
          style="display: inline; height: 1.5em"
          src="@/assets/images/ui-wish.png"
        />
        Wish History
      </header>
      <p class="select-wish-type">
        <span>Wish Type:</span>
        <select v-model="selectedWishType">
          <option v-for="item in wishTypes" :key="item">{{ item }}</option>
        </select>
      </p>
      <p>
        * You can check the wishes you made. Wish records are updated instantly
        after the wish is made. If there is no record yet, please check again
        later. The times displayed below are according to local time.
      </p>
      <div
        v-if="$store.state.settings.showBannerPity"
        style="
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 1rem;
        "
      >
        <h2>Pity:</h2>
        <div
          :class="{
            'pity-box': true,
            guaranteed: gachaStates[selectedWishType].guaranteedFeatured4Star,
          }"
          style="--color: #a153e1"
        >
          {{ gachaStates[selectedWishType].pityCounter4 }}
        </div>
        <div
          :class="{
            'pity-box': true,
            guaranteed: gachaStates[selectedWishType].guaranteedFeatured5Star,
          }"
          style="--color: #bd6029"
        >
          {{ gachaStates[selectedWishType].pityCounter5 }}
        </div>
      </div>
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
              <span v-if="pull.item.rarity === 4" class="purple">
                (4-Star)
              </span>
              <span v-else-if="pull.item.rarity === 5" class="gold">
                (5-Star)
              </span>
            </td>
            <td>{{ pull.description }}</td>
            <td>{{ dayjs(pull.date).format("YYYY-MM-DD HH:mm:ss") }}</td>
          </tr>
        </template>
      </table>
      <div
        v-if="!$store.state.settings.unlimitedHistoryScroll"
        class="footer-buttons"
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
          :class="[
            'page-button-box',
            { disabled: currentPage == numPullPages },
          ]"
          @click="currentPage = Math.min(currentPage + 1, numPullPages)"
        >
          &gt;
        </div>
      </div>
    </div>
  </BookOverlay>
</template>

<style scoped>
header {
  font-size: 1.75em;
  display: flex;
  align-items: center;
  gap: 0.25em;
}
.pity-box {
  height: 3rem;
  width: 3rem;
  border-radius: 0.25rem;
  font-size: 1.5rem;
  color: white;
  display: grid;
  place-items: center;
  background-color: var(--color);
}

.pity-box.guaranteed {
  box-shadow: 0 0 0.4rem 0.4rem yellow;
}
.page-button-box {
  --box-size: 2em;
  width: var(--box-size);
  height: var(--box-size);
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 0.1em solid #d3bc8e;
}

.page-button-box.disabled {
  opacity: 0.5;
  box-shadow: none;
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
  font-size: 1.5em;
  border: none;
}

.select-wish-type {
  width: 97%;
  text-align: left;
  font-size: 1.25em;
  background: #ede1ca;
  border: 0.1em solid #d3bc8e;
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  padding: 0.25em;
  border-radius: 1em;
  justify-content: space-around;
}

.select-wish-type > span {
  flex-grow: 1;
  text-align: center;
}
select {
  height: 100%;
  padding: 0.5em;
  width: 40%;
  background-color: #eeebe4;
  border: none;
  border-radius: 0.75em;
  color: #4d4d4d;
  font-size: 1em;
  padding-left: 0.5rem;
  margin-left: 1rem;
  flex-grow: 2;
}

/* TODO: this is all copied straight from BannerDetails
 * so consider making the header/details bg a component
 * also setting font/colours
 */
.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;
}

p {
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
  line-height: 1.5rem;
  color: #4d4d4d;
}

table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

td,
th {
  padding: 0.75rem;
  border: 0.1rem solid #d3bc8e;
}

td {
  color: #8e8e8e;
}

th {
  background-color: #ede1ca;
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
  color: #4d4d4d;
}

.gold {
  color: #bd6029;
}

.purple {
  color: #a153e1;
}
</style>
