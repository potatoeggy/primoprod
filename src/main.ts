import { createApp } from "vue";
import { dragscrollNext } from "vue-dragscroll";
import App from "./App.vue";

// version upgrade handler

// end version upgrade

const app = createApp(App);
app.directive("dragscroll", dragscrollNext);
app.mount("#app");
