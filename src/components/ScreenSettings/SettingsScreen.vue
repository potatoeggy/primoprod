<script setup lang="ts">
import Paimon from "@/state/PaimonMoe";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import CancelConfirmButton from "../shared/CancelConfirmButton.vue";
import MultiSelect from "@/components/shared/MultiSelect.vue";
import { banners } from "@/state/Banners";
import { ItemDatabase } from "@/state/Gacha";

const bannerOptions = Object.values(banners).map((banner) => ({
  id: banner.id,
  label: `${banner.id} (${
    ItemDatabase[banner.featuredDrops[0]]?.name ?? "no featured"
  })`,
}));

const $store = useStore();

const emit = defineEmits(["exit"]);
const settings = ref({
  infinitePrimos: $store.state.settings.infinitePrimos,
  rollOnly: "" + ($store.state.settings.rollOnly ?? ""),
  winGuarantee: "" + ($store.state.settings.winGuarantee ?? ""),
  unlimitedHistoryScroll: $store.state.settings.unlimitedHistoryScroll,
  showBannerPity: $store.state.settings.showBannerPity,
});
const showConfirmReset = ref(false);
const paimon = Paimon.export();

const paimonExportJson = computed(
  () => `data:application/json;charset=utf-8,${encodeURIComponent(paimon)}`
);

function exit() {
  const newSettings = {
    infinitePrimos: settings.value.infinitePrimos,
    rollOnly: parseInt(settings.value.rollOnly || "0") || null,
    winGuarantee: !!(settings.value.winGuarantee || false) || null,
    unlimitedHistoryScroll: settings.value.unlimitedHistoryScroll,
    showBannerPity: settings.value.showBannerPity,
  };
  $store.commit("updateSettings", newSettings);
  emit("exit");
}

function resetAndRefresh() {
  if (!showConfirmReset.value) {
    showConfirmReset.value = true;
    return;
  }
  $store.commit("resetData");
  window.location.reload();
}

function updateActiveBanners(selected: string[]) {
  console.log("NEW BANNERS", selected);
  $store.commit("updateActiveBanners", selected);
}
</script>

<template>
  <div class="header" @keyup.esc="exit">
    <img
      src="@/assets/images/exit-browser.png"
      class="exit-button"
      @click="exit"
    />
  </div>
  <div class="details">
    <div class="setting">
      <p>Infinite Fates</p>
      <input
        v-model="settings.infinitePrimos"
        type="checkbox"
        class="checkbox"
      />
    </div>
    <div class="setting">
      <p>Roll</p>
      <select v-model="settings.rollOnly" class="combobox">
        <option value="">Normally</option>
        <option value="5">Only 5-star items</option>
        <option value="4">Only 4- and 5-star items</option>
      </select>
    </div>
    <div class="setting">
      <p>Win 50/50</p>
      <select v-model="settings.winGuarantee" class="combobox">
        <option value="">Normally</option>
        <option value="1">Always</option>
        <option value="0">Never</option>
      </select>
    </div>
    <div class="setting">
      <p>Unlimited history scrolling</p>
      <input
        v-model="settings.unlimitedHistoryScroll"
        type="checkbox"
        class="checkbox"
      />
    </div>
    <div class="setting">
      <p>Show banner pity in history</p>
      <input
        v-model="settings.showBannerPity"
        type="checkbox"
        class="checkbox"
      />
    </div>
    <div class="setting">
      <p>Export <a href="https://paimon.moe">paimon.moe</a> wish data</p>
      <a :href="paimonExportJson" download="paimon.json">Download</a>
    </div>
    <div class="setting vertical">
      <p>Active banners</p>
      <MultiSelect
        :options="bannerOptions"
        :selected="$store.state.activeBanners"
        @update-selected="updateActiveBanners"
      />
    </div>
    <div class="center">
      <CancelConfirmButton
        :text="showConfirmReset ? 'Confirm reset' : 'Reset all data'"
        @pressed="resetAndRefresh"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  justify-content: center;
  width: 100%;
}

.combobox {
  font-size: 1.3rem;
}
.checkbox {
  width: 2rem;
  height: 2rem;
}
.setting {
  min-width: 45rem;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
}

.setting.vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

/* TODO: this is all copied straight from BannerDetails
 * so consider making the header/details bg a component
 * also setting font/colours
 */
.details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
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
</style>
