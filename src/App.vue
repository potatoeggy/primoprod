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
    :primoBalance="inv.primos"
    v-if="pullNumber > inv.fates && checkPullDialog"
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
    :primos="inv.primos"
    :fates="inv.fates"
    :starglitter="inv.starglitter"
    :stardust="inv.stardust"
    @wish="wish"
    v-if="screen === 'wish-banner'"
  ></wish-banners>
  <item-reveal-screen
    :lastRoll="lastRoll"
    :inventory="inv"
    v-if="screen === 'item-reveal'"
    @exit="screen = 'wish-banner'"
  ></item-reveal-screen>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import WishBanners from "@/components/WishBanners.vue";
import FatePurchaseDialog from "@/components/FatePurchaseDialog.vue";
import ItemRevealScreen from "@/components/ItemRevealScreen.vue";
import ItemAllRevealScreen from "@/components/ItemAllRevealScreen.vue";

// gacha
import Gacha, { Item } from "@/banners/Gacha";
import standardDrops from "@/banners/wanderlust-invocation.json";

// inventory
import Inventory from "@/banners/Inventory";

export default defineComponent({
  components: {
    WishBanners,
    FatePurchaseDialog,
    VideoPlayer: defineAsyncComponent(
      () => import("@/components/VideoPlayer.vue")
    ),
    ItemRevealScreen,
  },
  data() {
    return {
      // storage vars
      inv: new Inventory(),
      standardGacha: new Gacha(standardDrops),
      // state vars
      checkPullDialog: false,
      pullNumber: 1,
      pullRarity: 0,
      screen: "wish-banner",
      lastRoll: [] as Item[],
      lastRollSorted: [] as Item[],
    };
  },
  methods: {
    wish(pulls: number): void {
      this.pullNumber = pulls;
      if (pulls <= this.inv.fates) {
        this.goWish();
      } else {
        this.checkPullDialog = true;
      }
    },

    goWish(): void {
      this.inv.fates -= this.pullNumber;
      this.checkPullDialog = false;
      this.screen = "video-player";

      this.lastRoll =
        this.pullNumber === 1
          ? [this.standardGacha.rollOne()]
          : this.standardGacha.rollTen();
      this.lastRollSorted = [...this.lastRoll];
      this.lastRollSorted.sort((a, b) => b.rarity - a.rarity); // highest rarity to lowest

      console.log("Rolled:", this.lastRoll);
      this.pullRarity = this.lastRollSorted[0].rarity;
      this.inv.addItems(this.lastRollSorted.map((e) => e.id));
    },

    cancelWish(): void {
      this.checkPullDialog = false;
    },

    // hacky :/ but the audio element is unfortunately unmounted
    // before the audio fully plays
    exitConfirmCancelDialog(fn: () => void, fatesNeeded: number): void {
      (this.$refs.audioExitDialog as HTMLAudioElement).play();
      if (fatesNeeded) {
        this.inv.primos -= fatesNeeded * 160;
        this.inv.fates += fatesNeeded;
      }
      fn();
    },

    showResults(): void {
      this.screen = "item-reveal";
      // TODO: state variable for current pull?
    },

    showResultsEnd(): void {
      this.screen = "item-reveal";
      // TODO: yikes you have to check if it's 10 or not since i
      // think they have different uis
    },
  },
  computed: {
    fatesToPurchase(): number {
      return this.pullNumber - this.inv.fates;
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
  user-select: none;
}

body,
#app {
  height: 100%;
  overflow: hidden;
}
</style>
