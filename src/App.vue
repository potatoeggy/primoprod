<template>
  <div id="header">
    <p id="wish-label" class="white">Wish</p>
    <gem-counter icon="primogem.webp" text="112399"></gem-counter>
  </div>
  <div id="banner"></div>
  <div id="bottom-row">
    <text-button text="Shop"></text-button>
    <text-button text="Details"></text-button>
    <text-button text="History"></text-button>
    <wish-button wishes="1"></wish-button>
    <wish-button wishes="10"></wish-button>
  </div>
  <media-test></media-test>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MediaTest from "./components/MediaTest.vue";
import WishButton from "./components/WishButton.vue";
import TextButton from "./components/TextButton.vue";
import GemCounter from "./components/GemCounter.vue";

@Options({
  components: {
    MediaTest,
    WishButton,
    TextButton,
    GemCounter,
  },
})
export default class App extends Vue {}
</script>

<style>
@font-face {
  font-family: "Genshin";
  src: local("Genshin"), url(./assets/fonts/Genshin.ttf) format("truetype");
}

#app {
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  background: url("./assets/images/wish-background.png") center/cover no-repeat
      fixed,
    black;
  min-height: max-content;
}

.white {
  color: #f6f2ee;
  text-shadow: 1px 0px black;
}

/* reset css */
* {
  margin: 0;
  padding: 0;
  font-family: Genshin, serif;
  cursor: url("./assets/images/cursor.png"), auto;
}
</style>
