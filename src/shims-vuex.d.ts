import { Store } from "vuex";
import Inventory from "@/state/Inventory";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    inventory: Inventory;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
