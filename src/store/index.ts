import Inventory from "@/state/Inventory";
import { Banner, Settings } from "@/types";
import { State } from "vue";
import { createStore, Store } from "vuex";
import { BANNERS } from "@/data/DefaultConfig";

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
      // technically you can just use API_ENDPOINT but this makes
      // it a little clearer
      serverMode: !!process.env.VUE_APP_API_ENDPOINT,
      isServerAccessible: true,
      banners: BANNERS.map((id) =>
        require(`@/custom/banners/${id}.json`)
      ) as Banner[],
    };
  },
  mutations: {
    updateSettings(state, newSettings: Settings) {
      state.settings = newSettings;
      localStorage.settings = JSON.stringify(state.settings);
    },
    updateBanners(state, newBanners: Banner[]) {
      state.banners = newBanners;
    },
    setServerAccessible(state, newStatus: boolean) {
      state.isServerAccessible = newStatus;
    },
  },
  actions: {
    fetchBanners() {
      if (this.state.serverMode) {
        fetch(`${this.state.API_ENDPOINT}/banners`)
          .then(
            (res) => res.json(),
            (err) => {
              console.log(err);
              this.commit("setServerAccessible", false);
            }
          )
          .then(
            (data) => {
              this.commit("updateBanners", data);
              this.commit("setServerAccessible", true);
            },
            (err) => {
              console.log(err);
              this.commit("setServerAccessible", false);
            }
          );
      }
    },
  },
});

export default store;
