import Inventory from "@/state/Inventory";
import { State } from "vue";
import { createStore, Store } from "vuex";

const API_VERSION = 1;

const store: Store<State> = createStore({
  state() {
    return {
      inventory: new Inventory(),
      settings: JSON.parse(
        localStorage.settings ??
          JSON.stringify({
            // i'm sorry there has to be a nicer way to do this
            infinitePrimos: false,
            rollOnly: null,
            winGuarantee: null,
            unlimitedHistoryScroll: false,
            showBannerPity: false,
            everythingBanner: false,
          })
      ),
      API_ENDPOINT: process.env.VUE_APP_API_ENDPOINT
        ? `${process.env.VUE_APP_API_ENDPOINT}/v${API_VERSION}`
        : null,
    };
  },
  mutations: {
    updateSettings(state, newSettings) {
      state.settings = newSettings;
      localStorage.settings = JSON.stringify(state.settings);
    },
  },
});

export default store;
