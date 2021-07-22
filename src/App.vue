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
import eventDrops from "./banners/wanderlust-invocation.json";

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
  standardBanner = new Gacha(eventDrops);

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
    black;
  min-height: max-content;
}

#app > div {
  display: flex;
  min-height: 0;
}

#header {
  animation: fadein 0.75s forwards, slide-from-top 0.75s forwards ease-out;
  animation-delay: 0.25s;
}

#div-banner {
  align-items: center;
  justify-content: center;
  animation: fadein 0.75s forwards, slide-from-left 0.75s forwards ease-out;
  animation-delay: 0.25s;
}

#banner {
  max-width: 90%;
  max-height: 100%;
  width: auto;
  height: auto;
}

#footer {
  margin-bottom: 0.5rem;
  animation: fadein 0.75s forwards, slide-from-bottom 0.75s forwards ease-out;
  animation-delay: 0.25s;
}

@keyframes slide-from-top {
  from {
    transform: translateY(-2rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-from-left {
  from {
    transform: translateX(2rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-from-bottom {
  from {
    transform: translateY(2rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadein {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

.footer-align-flex {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
}

.left-align-flex {
  justify-content: left;
}

#wish-label > img {
  width: 3rem;
  margin-right: 3rem;
}

.space-between {
  display: flex;
  justify-content: space-between;
  margin: 2rem;
  margin-bottom: 0;
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

#wish-label {
  color: #f6f2ee;
  text-shadow: 1px 1px rgba(2, 2, 2, 0.3);
  user-select: none;
  font-size: 16pt;
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
