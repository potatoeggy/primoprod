import Inventory from "@/state/Inventory";
import { State } from "vue";
import { createStore, Store } from "vuex";

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
          })
      ),
      activeBanners: [
        "decree-of-the-deeps",
        "moment-of-bloom-4",
        "wanderlust-invocation",
        "everything",
      ],
    };
  },
  mutations: {
    updateSettings(state, newSettings) {
      state.settings = newSettings;
      localStorage.settings = JSON.stringify(state.settings);
    },
    resetData() {
      localStorage.clear();
    },
    updateActiveBanners(state, newBanners) {
      state.activeBanners = newBanners;
    },
  },
});

export default store;
