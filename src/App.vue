<template>
  <div id="header">
    <p class="white">Wish</p>
  </div>
  <div id="banner">
  </div>
  <div id="bottom-row">
    <wish-button wishes="1"></wish-button>
    <wish-button wishes="10"></wish-button>
  </div>
  <media-test></media-test>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MediaTest from "./components/MediaTest.vue";
import WishButton from "./components/WishButton.vue";

@Options({
  components: {
    MediaTest,
    WishButton,
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
  font-family: Genshin, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: url("./assets/images/wish-background.png") center/cover no-repeat
      fixed,
    black;
  cursor: url("./assets/images/cursor.png"), auto;
  min-height: max-content;
}

.white {
  color: white;
}

/* reset css TODO: the wish bg is animated :/ */
* {
  margin: 0;
  padding: 0;
}
</style>
