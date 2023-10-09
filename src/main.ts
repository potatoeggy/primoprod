import { createApp } from "vue";
import { Pull } from "@/types";
import { dragscrollNext } from "vue-dragscroll";
import App from "./App.vue";
import store from "./store";

const currencyInventoryMap: Record<string, string | undefined> = {
  primos: "primogem",
  fates: "intertwined-fate",
  standardFates: "acquaint-fate",
};

// version upgrade handler
switch (localStorage.version) {
  case undefined: // pre-1.0.1: Add descriptions
    if (localStorage.pullHistory) {
      localStorage.pullHistory = JSON.stringify(
        JSON.parse(localStorage.pullHistory).map((pull: Pull) => {
          pull.description =
            pull.bannerStorage === "event"
              ? "Character Event Wish"
              : "Permanent Wish";
          return pull;
        })
      );
      console.log("Updated from pre-1.0.1 to 1.0.1");
    }
    break;
  case 1: // pre-1.3.0 to 1.4.0: Move currency back into inventory
    if (localStorage.currency) {
      const currency = JSON.parse(localStorage.currency);
      const inventory = localStorage.inventory
        ? JSON.parse(localStorage.inventory)
        : {};
      for (const key in currency) {
        inventory[currencyInventoryMap[key] ?? key] = currency[key];
      }
      localStorage.inventory = JSON.stringify(inventory);
      delete localStorage.currency;
      console.log("Updated from pre-1.4.0 to 1.4.0");
    }
}
localStorage.version = 2;
// end version upgrade

const app = createApp(App).use(store);
app.directive("dragscroll", dragscrollNext);
app.mount("#app");
