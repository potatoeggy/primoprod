<template>
  <!-- audio -->
  <audio ref="audioBgm" preload="true" autoplay loop>
    <source src="./assets/audio/bgm-wish.mp3" />
  </audio>
  <audio ref="audioExitDialog" id="audioExitDialogDEPRECATED" preload="true">
    <source src="./assets/audio/exit-dialog.mp3" />
  </audio>

  <!-- overlay -->
  <fate-purchase-dialog
    :fatesToPurchase="fatesToPurchase"
    :useStandardFates="useStandardFates"
    :primoBalance="inv.primos"
    v-if="
      pullNumber > (useStandardFates ? inv.standardFates : inv.fates) &&
      checkPullDialog
    "
    @cancel-wish="exitConfirmCancelDialog(cancelWish)"
    @wish="exitConfirmCancelDialog(goWish, $event)"
  ></fate-purchase-dialog>
  <item-obtain-overlay
    description="Extra"
    :obtainedItems="pullExtraRewards"
    v-if="pullExtraRewards.length > 0 && screen === 'wish-banner'"
    @exit="pullExtraRewards = []"
  ></item-obtain-overlay>
  <quest-screen
    @exit="overlay = ''"
    v-if="overlay === 'quests'"
    :inventory="inv"
  ></quest-screen>

  <!-- main -->
  <wish-banners
    :inventory="inv"
    :banners="banners"
    :currentBannerIndex="currentBannerIndex"
    @wish="wish"
    @go-quests="overlay = 'quests'"
    @go-shop="screen = 'shop'"
    @change-banner="changeBannerIndex"
    v-if="screen === 'wish-banner'"
  ></wish-banners>
  <item-reveal-screen
    :lastRoll="lastRoll"
    :inventory="inv"
    v-if="screen === 'item-reveal'"
    @exit="screen = 'wish-banner'"
    @reveal-all="screen = 'item-all-reveal'"
  ></item-reveal-screen>
  <item-all-reveal-screen
    :lastRoll="lastRoll"
    :inventory="inv"
    @exit="screen = 'wish-banner'"
    v-if="screen === 'item-all-reveal'"
  ></item-all-reveal-screen>
  <video-player
    v-if="screen === 'video-player'"
    :pulls="pullNumber"
    :stars="pullRarity"
    v-on:video-ended="showResults"
    v-on:video-skipped="showResultsEnd"
  ></video-player>
  <shop-screen
    @exit="screen = 'wish-banner'"
    v-if="screen === 'shop'"
    :inventory="inv"
  ></shop-screen>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import WishBanners from "@/components/WishBanners.vue";
import FatePurchaseDialog from "@/components/FatePurchaseDialog.vue";
import ItemRevealScreen from "@/components/ItemRevealScreen.vue";
import ItemAllRevealScreen from "@/components/ItemAllRevealScreen.vue";
import ItemObtainOverlay from "@/components/ItemObtainOverlay.vue";
import QuestScreen from "@/components/QuestScreen.vue";
import ShopScreen from "@/components/ShopScreen.vue";
import Gacha from "@/state/Gacha";
import { Banner, Item, ItemStringQuantity } from "@/types";
import Inventory from "@/state/Inventory";

const BANNERS = [
  "gentry-of-hermitage-3",
  "adrift-in-the-harbor-2",
  "wanderlust-invocation",
];

export default defineComponent({
  components: {
    WishBanners,
    FatePurchaseDialog,
    VideoPlayer: defineAsyncComponent(
      () => import("@/components/VideoPlayer.vue")
    ),
    ItemRevealScreen,
    ItemAllRevealScreen,
    ItemObtainOverlay,
    QuestScreen,
    ShopScreen,
  },
  data() {
    return {
      // storage vars
      inv: new Inventory(),
      gachas: BANNERS.map(
        (id) => new Gacha(require(`@/custom/banners/${id}.json`)) // eslint-disable-line
      ),
      // state vars
      checkPullDialog: false,
      pullNumber: 1,
      pullRarity: 0,
      useStandardFates: false,
      screen: "wish-banner",
      lastRoll: [] as Item[],
      lastRollSorted: [] as Item[],
      banners: BANNERS.map((id) =>
        require(`@/custom/banners/${id}.json`)
      ) as Banner[],
      currentBannerIndex: 0,
      overlay: "",
      pullExtraRewards: [] as ItemStringQuantity[],
    };
  },
  methods: {
    changeBannerIndex(index: number): void {
      this.currentBannerIndex = index;
    },
    wish(pulls: number, useStandardFates: boolean): void {
      this.useStandardFates = useStandardFates;
      this.pullNumber = pulls;
      if (
        pulls <=
        (this.useStandardFates ? this.inv.standardFates : this.inv.fates)
      ) {
        this.goWish();
      } else {
        this.checkPullDialog = true;
      }
    },

    goWish(): void {
      // TODO: seriously consider moving wish and video logic
      // to WishBanners so that gachas are linked together
      if (this.useStandardFates) {
        this.inv.standardFates -= this.pullNumber;
      } else {
        this.inv.fates -= this.pullNumber;
      }
      this.checkPullDialog = false;
      this.screen = "video-player";

      this.lastRoll =
        this.pullNumber === 1
          ? [this.standardGacha.rollOne()]
          : this.standardGacha.rollTen();
      this.lastRollSorted = [...this.lastRoll];
      this.lastRollSorted.sort((a, b) => b.rarity - a.rarity); // highest rarity to lowest

      console.log(
        "Banner",
        this.currentBanner.id,
        "rolled:",
        [...this.lastRoll.map((i) => Object.assign({}, i))] // thank you vue love that
      );
      this.pullRarity = this.lastRollSorted[0].rarity;
      const extraRewards = this.inv.addItemsViaGacha(
        this.lastRoll,
        this.currentBanner.storage,
        this.currentBanner.description
      );
      this.pullExtraRewards = [
        {
          // TODO: these reduces are failing because arrays are empty, probably shortcircuit/return 0
          id: "stardust",
          quantity: extraRewards
            .filter((i) => i.id === "stardust")
            ?.reduce(
              (a, b) => {
                return { id: "", quantity: a.quantity + b.quantity };
              },
              { quantity: 0 }
            ).quantity,
        },
        {
          id: "starglitter",
          quantity: extraRewards
            .filter((i) => i.id === "starglitter")
            ?.reduce(
              (a, b) => {
                return { id: "", quantity: a.quantity + b.quantity };
              },
              { quantity: 0 }
            ).quantity,
        },
      ];
    },

    cancelWish(): void {
      this.checkPullDialog = false;
    },

    // hacky :/ but the audio element is unfortunately unmounted
    // before the audio fully plays
    exitConfirmCancelDialog(fn: () => void, fatesNeeded?: number): void {
      (this.$refs.audioExitDialog as HTMLAudioElement).play();
      if (fatesNeeded) {
        this.inv.primos -= fatesNeeded * 160;
        if (this.useStandardFates) {
          this.inv.standardFates += fatesNeeded;
        } else {
          this.inv.fates += fatesNeeded;
        }
      }
      fn();
    },

    showResults(): void {
      this.screen = "item-reveal";
    },

    showResultsEnd(): void {
      this.screen = "item-reveal";
      // TODO: yikes you have to check if it's 10 or not since i
      // think they have different uis
    },
  },
  computed: {
    standardGacha(): Gacha {
      return this.gachas[this.currentBannerIndex];
    },
    currentBanner(): Banner {
      return this.banners[this.currentBannerIndex];
    },
    fatesToPurchase(): number {
      return (
        this.pullNumber -
        (this.useStandardFates ? this.inv.standardFates : this.inv.fates)
      );
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
    #8ac2eb;
}

/* reset css */
* {
  margin: 0;
  padding: 0;
  font-family: Genshin, serif;
  cursor: url("./assets/images/cursor.png"), auto;
  user-select: none;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

img {
  /* to not have white flash on initial load */
  background-color: transparent;
}

@media screen and (orientation: portrait) {
  body {
    height: 100vw;
    width: 100vh;
    transform: rotate(90deg);
    transform-origin: bottom left;
    position: absolute;
    top: -100vw;
    left: 0;
  }
  #app {
    width: 100%;
  }

  html {
    font-size: 10px;
  }
}

@media screen and (max-height: 700px) and (orientation: landscape) {
  html {
    font-size: 10px;
  }
}
</style>
