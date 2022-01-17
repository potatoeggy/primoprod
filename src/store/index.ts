import Inventory from "@/state/Inventory";
import { State } from "vue";
import { createStore, Store } from "vuex";

const store: Store<State> = createStore({
  state() {
    return {
      inventory: new Inventory(),
    };
  },
});

export default store;
