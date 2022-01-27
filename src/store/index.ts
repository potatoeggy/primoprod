import Inventory from "@/state/Inventory";
import { State } from "vue";
import { createStore, Store } from "vuex";

const store: Store<State> = createStore({
  state() {
    return {
      inventory: new Inventory(),
      settings: {
        infinitePrimos: false,
        rollOnly: null,
        winGuarantee: null,
        unlimitedHistoryScroll: false,
        showBannerPity: false,
        everythingBanner: false,
      },
    };
  },
  mutations: {
    updateSettings(state, newSettings) {
      state.settings = newSettings;
    },
  },
});

export default store;
