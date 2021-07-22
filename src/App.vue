<template>
  <!-- audio -->
  <audio ref="audioBgm" preload autoplay loop>
    <source src="./assets/audio/bgm-wish.mp3" />
  </audio>
  <audio ref="audioExitDialog" preload>
    <source src="./assets/audio/exit-dialog.mp3" />
  </audio>

  <!-- overlay -->
  <fate-purchase-dialog
    :fatesToPurchase="fatesToPurchase"
    :primoBalance="primos"
    v-if="pullNumber > fates && checkPullDialog"
    v-on:cancel-wish="exitConfirmCancelDialog(cancelWish)"
    v-on:wish="exitConfirmCancelDialog(goWish, $event)"
  ></fate-purchase-dialog>
  <video-player
    v-if="screen === 'video-player'"
    :pulls="pullNumber"
    :stars="pullRarity"
    v-on:video-ended="showResults"
    v-on:video-skipped="showResultsEnd"
  ></video-player>

  <!-- main -->
  <wish-banners
    :primos="primos"
    :fates="fates"
    :starglitter="starglitter"
    :stardust="stardust"
    @wish="wish"
    v-if="screen === 'wish-banner'"
  ></wish-banners>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineAsyncComponent } from "vue"; // TODO: migrate entirely to normal vue
import WishBanners from "./components/WishBanners.vue";
import FatePurchaseDialog from "./components/FatePurchaseDialog.vue";
const VideoPlayer = defineAsyncComponent(
  () => import("./components/VideoPlayer.vue")
);

// gacha
import Gacha from "./banners/Gacha";
import standardDrops from "./banners/wanderlust-invocation.json";

@Options({
  components: {
    WishBanners,
    FatePurchaseDialog,
    VideoPlayer,
  },
})
export default class App extends Vue {
  // save vars
  // TODO: implement localStorage json storage
  fates = 3;
  primos = 5337;
  starglitter = 4;
  stardust = 700;
  standardBanner = new Gacha(standardDrops);

  // state vars
  checkPullDialog = false;
  pullNumber = 1;

  // the element names of a top-level element (like video-player)
  // don't put overlays here!
  screen = "wish-banner";

  mounted(): void {
    const bgm: HTMLAudioElement = this.$refs.audioBgm as HTMLAudioElement;
    bgm.volume = 0.1;
  }

  wish(pulls: number): void {
    this.pullNumber = pulls;
    if (pulls <= this.fates) {
      this.goWish();
    } else {
      this.checkPullDialog = true;
    }
  }

  goWish(): void {
    this.fates -= this.pullNumber;
    this.checkPullDialog = false;
    this.screen = "video-player";
  }

  cancelWish(): void {
    this.checkPullDialog = false;
  }

  // hacky :/ but the audio element is unfortunately unmounted
  // before the audio fully plays
  exitConfirmCancelDialog(fn: () => void, fatesNeeded: number): void {
    (this.$refs.audioExitDialog as HTMLAudioElement).play();
    if (fatesNeeded) {
      this.primos -= fatesNeeded * 160;
      this.fates += fatesNeeded;
    }
    fn();
  }

  showResults(): void {
    this.screen = "wish-banner";
  }

  showResultsEnd(): void {
    this.screen = "wish-banner";
  }

  get fatesToPurchase(): number {
    return this.pullNumber - this.fates;
  }

  get pullRarity(): number {
    // TODO: make a pull handler object handling pity and all that then
    // pass the function directly to videoplayer
    return 4;
  }
}
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
    white;
  min-height: max-content;
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
