<template>
  <!-- audio -->
  <audio v-if="screen !== 'game'" ref="audioBgm" preload="true" autoplay loop>
    <source src="./assets/audio/bgm-wish.mp3" />
  </audio>
  <audio id="audioExitDialogDEPRECATED" ref="audioExitDialog" preload="true">
    <source src="./assets/audio/exit-dialog.mp3" />
  </audio>

  <!-- overlay -->
  <fate-purchase-dialog
    v-if="
      pullNumber > (useStandardFates ? inv.standardFates : inv.fates) &&
      checkPullDialog
    "
    :fates-to-purchase="fatesToPurchase"
    :use-standard-fates="useStandardFates"
    :primo-balance="inv.primos"
    @cancel-wish="exitConfirmCancelDialog(cancelWish)"
    @wish="exitConfirmCancelDialog(goWish, $event)"
  ></fate-purchase-dialog>
  <item-obtain-overlay
    v-if="pullExtraRewards.length > 0 && screen === 'wish-banner'"
    description="Extra"
    :obtained-items="pullExtraRewards"
    @exit="pullExtraRewards = []"
  ></item-obtain-overlay>
  <quest-screen
    v-if="overlay === 'quests'"
    :inventory="inv"
    @exit="overlay = ''"
  ></quest-screen>

  <!-- main -->
  <wish-banners
    v-if="screen === 'wish-banner'"
    :inventory="inv"
    :banners="banners"
    :current-banner-index="currentBannerIndex"
    @wish="wish"
    @go-quests="overlay = 'quests'"
    @go-shop="screen = 'shop'"
    @change-banner="changeBannerIndex"
  ></wish-banners>
  <item-reveal-screen
    v-if="screen === 'item-reveal'"
    :last-roll="lastRoll"
    :inventory="inv"
    @exit="screen = 'wish-banner'"
    @reveal-all="screen = 'item-all-reveal'"
  ></item-reveal-screen>
  <item-all-reveal-screen
    v-if="screen === 'item-all-reveal'"
    :last-roll="lastRoll"
    :inventory="inv"
    :extra-rewards="detailedPullExtraRewards"
    @exit="screen = 'wish-banner'"
  ></item-all-reveal-screen>
  <video-player
    v-if="screen === 'video-player'"
    :pulls="pullNumber"
    :stars="pullRarity"
    :preload-drops="lastRoll"
    @video-ended="showResults"
    @video-skipped="showResultsEnd"
  ></video-player>
  <video-player :pulls="1" :stars="1" :preloader="true" />
  <shop-screen
    v-if="screen === 'shop'"
    :inventory="inv"
    @exit="screen = 'wish-banner'"
  ></shop-screen>
  <game-menu v-if="screen === 'game'"></game-menu>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import WishBanners from "@/components/WishBanners/WishBanners.vue";
import FatePurchaseDialog from "@/components/overlays/FatePurchaseDialog.vue";
import ItemRevealScreen from "@/components/ScreenItemReveal/ItemRevealScreen.vue";
import ItemAllRevealScreen from "@/components/ScreenItemReveal/ItemAllRevealScreen.vue";
import ItemObtainOverlay from "@/components/overlays/ItemObtainOverlay.vue";
import QuestScreen from "@/components/ScreenQuest/QuestScreen.vue";
import ShopScreen from "@/components/ScreenShop/ShopScreen.vue";
import Gacha from "@/state/Gacha";
import { Banner, Item, ItemStringQuantity } from "@/types";
import Inventory from "@/state/Inventory";
import GameMenu from "@/components/game/GameMenu.vue";

// empty comment below is to maintain multi-line array
// to keep prettier happy (do not remove)
const BANNERS = [
  "moment-of-bloom-2", //
  "drifting-luminescence-2",
  "the-transcendent-one-returns",
  "wanderlust-invocation",
  "everything",
];

export default defineComponent({
  components: {
    WishBanners,
    FatePurchaseDialog,
    VideoPlayer: defineAsyncComponent(
      () => import("@/components/ScreenVideo/VideoPlayer.vue")
    ),
    ItemRevealScreen,
    ItemAllRevealScreen,
    ItemObtainOverlay,
    QuestScreen,
    ShopScreen,
    GameMenu,
  },
  data() {
    return {
      // storage vars
      gachas: BANNERS.map(
        (id) =>
          new Gacha(
            require(`@/custom/banners/${id}.json`), // eslint-disable-line
            undefined,
            this.$store.state.settings
          )
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
      detailedPullExtraRewards: [] as ItemStringQuantity[],
    };
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
    inv(): Inventory {
      return this.$store.state.inventory;
    },
  },
  mounted() {
    const bgm: HTMLAudioElement = this.$refs.audioBgm as HTMLAudioElement;
    bgm.volume = 0.1;
  },
  methods: {
    changeBannerIndex(index: number): void {
      this.currentBannerIndex = index;
    },
    wish(pulls: number, useStandardFates: boolean): void {
      this.useStandardFates = useStandardFates;
      this.pullNumber = pulls;
      if (
        this.$store.state.settings.infinitePrimos ||
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
      if (!this.$store.state.settings.infinitePrimos) {
        if (this.useStandardFates) {
          this.inv.standardFates -= this.pullNumber;
        } else {
          this.inv.fates -= this.pullNumber;
        }
      }
      this.checkPullDialog = false;
      this.screen = "video-player";

      this.lastRoll =
        this.pullNumber === 1
          ? [this.standardGacha.rollOne(this.$store.state.settings.rollOnly)]
          : this.standardGacha.rollTen(this.$store.state.settings.rollOnly);
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
      this.detailedPullExtraRewards = extraRewards;
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
      if (this.pullNumber === 1) {
        this.screen = "item-reveal";
      } else {
        this.screen = "item-all-reveal";
      }
    },
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
  background: url("./assets/images/wish-background.webp") center/cover no-repeat,
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
