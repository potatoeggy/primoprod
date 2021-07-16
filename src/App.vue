<template>
  <media-test></media-test>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MediaTest from "./components/MediaTest.vue";

@Options({
  components: {
    MediaTest,
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
}

/* reset css TODO: the wish bg is animated :/ */
* {
  margin: 0;
  padding: 0;
}
</style>
