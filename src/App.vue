<template>
  <audio ref="audioBgm" preload autoplay loop>
    <source src="./assets/audio/bgm-wish.mp3" />
  </audio>
  <audio ref="audioExitDialog" preload>
    <source src="./assets/audio/exit-dialog.mp3" />
  </audio>
  <fate-purchase-dialog
    :fatesToPurchase="fatesToPurchase"
    v-if="pullNumber > fates"
    v-on:cancelWish="playDialogSfx(cancelWish)"
    v-on:wish="playDialogSfx(goWish, $event)"
  ></fate-purchase-dialog>
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
      <wish-button :wishes="1" :fates="fates" v-on:tryWish="wish"></wish-button>
      <wish-button
        :wishes="10"
        :fates="fates"
        v-on:tryWish="wish"
      ></wish-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MediaTest from "./components/MediaTest.vue";
import WishButton from "./components/WishButton.vue";
import TextButton from "./components/TextButton.vue";
import GemCounter from "./components/GemCounter.vue";
import FatePurchaseDialog from "./components/FatePurchaseDialog.vue";

@Options({
  components: {
    MediaTest,
    WishButton,
    TextButton,
    GemCounter,
    FatePurchaseDialog,
  },
})
export default class App extends Vue {
  fates = 3;
  primos = 111337;
  starglitter = 4;
  stardust = 700;

  pullNumber = 1;
  mounted(): void {
    const bgm: HTMLAudioElement = this.$refs.audioBgm as HTMLAudioElement;
    bgm.volume = 0.1;
  }

  wish(pulls: number): void {
    this.pullNumber = pulls;
    if (pulls <= this.fates) {
      this.goWish();
    }
  }

  goWish(): void {
    console.log("Wishing");
    this.fates -= this.pullNumber;
    this.pullNumber = 0;
  }

  cancelWish(): void {
    this.pullNumber = 0;
  }

  // hacky :/ but the audio element is unfortunately unmounted
  // before the audio fully plays
  playDialogSfx(fn: () => void, fatesNeeded: number): void {
    (this.$refs.audioExitDialog as HTMLAudioElement).play();
    if (fatesNeeded) {
      // if we need to pay for primos (if we hit confirm instead of cancel)

      // TODO: yikes you have to do primochecks here, consider renaming the func
      // to be something like endPrimoDialog
      this.primos -= fatesNeeded * 160;
      this.fates += fatesNeeded;
      // TODO: remake all events to be in kebab case because it's case sensitive
    }
    fn();
  }

  get fatesToPurchase(): number {
    return this.pullNumber - this.fates;
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

#div-banner {
  align-items: center;
  justify-content: center;
}

#banner {
  max-width: 90%;
  max-height: 100%;
  width: auto;
  height: auto;
}

#footer {
  margin-bottom: 0.5rem;
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
  overflow: auto;
}
</style>
