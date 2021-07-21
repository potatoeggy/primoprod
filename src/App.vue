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
    v-if="playWishVideo"
    :pulls="pullNumber"
    :stars="pullRarity"
    v-on:video-ended="showResults"
    v-on:video-skipped="showResultsEnd"
  ></video-player>

  <!-- main -->
  <div id="header" class="space-between center">
    <div id="wish-label" class="space-between center">
      <img src="./assets/images/ui-wish-edited.png" />
      <p id="wish-label">Wish</p>
    </div>
    <div id="gems">
      <gem-counter icon="primogem.png" :text="primos" plusSign></gem-counter>
      <gem-counter icon="intertwined-fate.png" :text="fates"></gem-counter>
    </div>
  </div>
  <div id="div-banner">
    <img id="banner" src="./assets/images/wanderlust-banner.png" />
  </div>
  <div id="footer" class="space-between">
    <div>
      <div id="masterless-home" class="footer-align-flex left-align-flex">
        <gem-counter
          icon="starglitter.png"
          :text="starglitter"
          nobackground
        ></gem-counter>
        <gem-counter
          icon="stardust.png"
          :text="stardust"
          nobackground
        ></gem-counter>
      </div>
      <div id="shop-buttons" class="footer-align-flex">
        <text-button text="Shop"></text-button>
        <text-button text="Details"></text-button>
        <text-button text="History"></text-button>
      </div>
    </div>
    <div id="wish-buttons" class="footer-align-flex">
      <wish-button
        :wishes="1"
        :fates="fates"
        v-on:try-wish="wish"
      ></wish-button>
      <wish-button
        :wishes="10"
        :fates="fates"
        v-on:try-wish="wish"
      ></wish-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import WishButton from "./components/WishButton.vue";
import TextButton from "./components/TextButton.vue";
import GemCounter from "./components/GemCounter.vue";
import FatePurchaseDialog from "./components/FatePurchaseDialog.vue";
import VideoPlayer from "./components/VideoPlayer.vue";

@Options({
  components: {
    WishButton,
    TextButton,
    GemCounter,
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

  // state vars
  checkPullDialog = false;
  playWishVideo = false;
  pullNumber = 1;

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
    this.playWishVideo = true;
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
    this.playWishVideo = false;
  }

  showResultsEnd(): void {
    this.playWishVideo = false;
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
