import { createApp } from "vue";
import { Pull } from "@/types";
import { dragscrollNext } from "vue-dragscroll";
import App from "./App.vue";

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
    }
    console.log("Updated from pre-1.0.1 to 1.0.1");
}
localStorage.version = 1;
// end version upgrade

const app = createApp(App);
app.directive("dragscroll", dragscrollNext);
app.mount("#app");
