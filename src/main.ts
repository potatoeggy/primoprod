import { createApp } from "vue";
import { dragscrollNext } from "vue-dragscroll";
import App from "./App.vue";

const app = createApp(App);
app.directive("dragscroll", dragscrollNext);
app.mount("#app");
