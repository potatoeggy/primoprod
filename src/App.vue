<template>
  <div id="header" class="flex">
    <p id="wish-label" class="white">Wish</p>
    <gem-counter icon="primogem.webp" text="112399"></gem-counter>
  </div>
  <div id="div-banner">
    <img id="banner" src="./assets/images/wanderlust-banner.png" />
  </div>
  <nav id="footer" class="flex">
    <div id="shop-buttons">
      <text-button text="Shop"></text-button>
      <text-button text="Details"></text-button>
      <text-button text="History"></text-button>
    </div>
    <div id="wish-buttons">
      <wish-button wishes="1"></wish-button>
      <wish-button wishes="10"></wish-button>
    </div>
  </nav>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  background: url("./assets/images/wish-background.png") center/cover no-repeat
      fixed,
    black;
  min-height: max-content;
}

#banner {
  width: 70%;
}

#shop-buttons,
#wish-buttons {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
}

.flex {
  display: flex;
  justify-content: space-between;
  margin: 2rem;
  /* the below aligns the text buttons above the wish buttons */
  /* flex-wrap: wrap; */
}

.center > * {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.wish-container + .wish-container {
  padding-left: 1rem;
  padding-right: 1rem;
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

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
</style>
