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
      <p>Everyone is here?</p>
      <input
        v-model="settings.everythingBanner"
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
  </div>
</template>

<script lang="ts">
import Paimon from "@/state/PaimonMoe";
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["exit"],
  data() {
    return {
      settings: {
        infinitePrimos: this.$store.state.settings.infinitePrimos,
        rollOnly: "" + (this.$store.state.settings.rollOnly ?? ""),
        winGuarantee: "" + (this.$store.state.settings.winGuarantee ?? ""),
        unlimitedHistoryScroll:
          this.$store.state.settings.unlimitedHistoryScroll,
        showBannerPity: this.$store.state.settings.showBannerPity,
        everythingBanner: this.$store.state.settings.everythingBanner,
      },
      paimon: Paimon.export(),
    };
  },
  computed: {
    paimonExportJson(): string {
      return `data:application/json;charset=utf-8,${encodeURIComponent(
        this.paimon
      )}`;
    },
  },
  methods: {
    exit(): void {
      const settings = {
        infinitePrimos: this.settings.infinitePrimos,
        rollOnly: parseInt(this.settings.rollOnly || "0") || null,
        winGuarantee: !!(this.settings.winGuarantee || false) || null,
        unlimitedHistoryScroll: this.settings.unlimitedHistoryScroll,
        showBannerPity: this.settings.showBannerPity,
        everythingBanner: this.settings.everythingBanner,
      };
      this.$store.commit("updateSettings", settings);
      this.$emit("exit");
    },
  },
});
</script>

<style scoped>
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
