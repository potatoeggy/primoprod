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
import { defineAsyncComponent, defineComponent } from "vue";
import WishBanners from "./components/WishBanners.vue";
import FatePurchaseDialog from "./components/FatePurchaseDialog.vue";

// gacha
import Gacha, { State } from "./banners/Gacha";
import standardDrops from "./banners/wanderlust-invocation.json";

export default defineComponent({
  components: {
    WishBanners,
    FatePurchaseDialog,
    VideoPlayer: defineAsyncComponent(
      () => import("./components/VideoPlayer.vue")
    ),
  },
  data() {
    return {
      // storage vars
      fates: 3,
      primos: 5337,
      starglitter: 4,
      stardust: 700,
      standardGacha: new Gacha(standardDrops),
      // state vars
      checkPullDialog: false,
      pullNumber: 1,
      pullRarity: 0,
      screen: "wish-banner",
    };
  },
  methods: {
    wish(pulls: number): void {
      this.pullNumber = pulls;
      if (pulls <= this.fates) {
        this.goWish();
      } else {
        this.checkPullDialog = true;
      }
    },

    goWish(): void {
      this.fates -= this.pullNumber;
      this.checkPullDialog = false;
      this.screen = "video-player";

      const roll =
        this.pullNumber === 1
          ? [this.standardGacha.rollOne()]
          : this.standardGacha.rollTen();
      roll.sort((a, b) => b.rarity - a.rarity); // highest rarity to lowest
      console.log("Rolled:", roll);
      this.pullRarity = roll[0].rarity;
      // TODO: set rarity variable here
      // also calc current pull here
      // note our safety is guaranteed because
      // the gacha class automatically stores on roll
      // now we have to store primos/fates *separately*??
    },

    cancelWish(): void {
      this.checkPullDialog = false;
    },

    // hacky :/ but the audio element is unfortunately unmounted
    // before the audio fully plays
    exitConfirmCancelDialog(fn: () => void, fatesNeeded: number): void {
      (this.$refs.audioExitDialog as HTMLAudioElement).play();
      if (fatesNeeded) {
        this.primos -= fatesNeeded * 160;
        this.fates += fatesNeeded;
      }
      fn();
    },

    showResults(): void {
      this.screen = "wish-banner";
      // TODO: state variable for current pull?
    },

    showResultsEnd(): void {
      this.screen = "wish-banner";
      // TODO: yikes you have to check if it's 10 or not since i
      // think they have different uis
    },
  },
  computed: {
    fatesToPurchase(): number {
      return this.pullNumber - this.fates;
    },
  },
  mounted() {
    const bgm: HTMLAudioElement = this.$refs.audioBgm as HTMLAudioElement;
    bgm.volume = 0.1;
  },
});
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
