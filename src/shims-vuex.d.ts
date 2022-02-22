import { Store } from "vuex";
import { Settings } from "./types";
import Inventory from "@/state/Inventory";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    inventory: Inventory;
    settings: Settings;
    API_ENDPOINT: string | null;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
