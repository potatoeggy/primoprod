<template>
  <!-- overlay use json? -->
  <item-description-overlay
    v-if="activeItem"
    :item="activeItem"
    @exit="activeItemId = ''"
  ></item-description-overlay>
  <banner-details-screen
    v-if="showDetails"
    :banner="banner"
    @exit="exitDetailsScreen"
  ></banner-details-screen>
  <wish-history-screen
    v-if="showHistory"
    :inventory="inventory"
    :active-banner-storage="banner.storage"
    @exit="exitHistoryScreen"
  ></wish-history-screen>
  <settings-screen
    v-if="showSettings"
    @exit="exitSettingsScreen"
  ></settings-screen>

  <audio id="audio-banner-switch" preload="auto">
    <source src="@/assets/audio/banner-switch.ogg" type="audio/ogg" />
    <source src="@/assets/audio/banner-switch.mp3" type="audio/mp3" />
  </audio>
  <div class="banner-container">
    <div v-if="isMobile" class="mobile-header">
      <img src="@/assets/images/ui-wish.png" />
      <div class="mobile-header-holder">
        <template v-for="(ban, index) of banners" :key="ban.id">
          <banner-header
            :banner="ban"
            :is-selected="currentBannerIndex === index"
            @click="changeBanner(index)"
          />
        </template>
      </div>
    </div>
    <div
      :class="{
        banner: true,
        invisible: showDetails || showHistory,
      }"
    >
      <div
        id="header"
        :class="[
          'space-between',
          'center',
          stateExiting ? 'exit-animation' : 'start-animation',
        ]"
        @animationend="exitEmit"
      >
        <div id="wish-label" class="space-between center">
          <img v-if="!isMobile" src="@/assets/images/ui-wish.png" />
          <p id="wish-label">Wish</p>
        </div>
        <div v-if="!isMobile" class="banner-header">
          <template v-for="(ban, index) of banners" :key="index">
            <banner-header
              :banner="ban"
              :is-selected="currentBannerIndex === index"
              @click="changeBanner(index)"
            />
          </template>
        </div>
        <div id="gems">
          <gem-counter
            v-if="isMobile"
            icon="starglitter.webp"
            :text="inventory.starglitter"
            @image-clicked="activeItemId = 'starglitter'"
          ></gem-counter>
          <gem-counter
            v-if="isMobile"
            icon="stardust.webp"
            :text="inventory.stardust"
            @image-clicked="activeItemId = 'stardust'"
          ></gem-counter>
          <gem-counter
            icon="primogem.webp"
            :text="settings.infinitePrimos ? '∞' : inventory.primos"
            plus-sign
            @image-clicked="activeItemId = 'primogem'"
          ></gem-counter>
          <gem-counter
            v-if="banner.storage === 'standard'"
            icon="acquaint-fate.webp"
            :text="settings.infinitePrimos ? '∞' : inventory.standardFates"
            @image-clicked="activeItemId = 'acquaint-fate'"
          ></gem-counter>
          <gem-counter
            v-else
            icon="intertwined-fate.webp"
            :text="settings.infinitePrimos ? '∞' : inventory.fates"
            @image-clicked="activeItemId = 'intertwined-fate'"
          ></gem-counter>
          <div class="close-box">
            <close-button icon-src="ui-quest" @clicked="exit" />
            <close-button
              icon-src="ui-settings"
              @clicked="showSettings = true"
            />
          </div>
        </div>
      </div>
      <div
        id="div-banner"
        :key="currentBannerIndex"
        :class="stateExiting ? 'exit-animation' : 'start-animation'"
      >
        <p v-if="banner.id === 'everything'" class="everyone">
          Everyone is here!
        </p>
        <img
          v-for="(b, index) in banners"
          id="banner"
          :key="index"
          :src="require(`@/assets/images/banners/${b.id}.webp`)"
          :class="{ invisible: b.id !== banner.id }"
          rel="prefetch"
        />
      </div>
      <div
        id="footer"
        :class="[
          'space-between',
          stateExiting ? 'exit-animation' : 'start-animation',
        ]"
      >
        <div id="shop-button-holder-sometimes">
          <div
            v-if="!isMobile"
            id="masterless-home"
            class="footer-align-flex left-align-flex"
          >
            <gem-counter
              icon="starglitter.webp"
              :text="inventory.starglitter"
              nobackground
              @image-clicked="activeItemId = 'starglitter'"
            ></gem-counter>
            <gem-counter
              icon="stardust.webp"
              :text="inventory.stardust"
              nobackground
              @image-clicked="activeItemId = 'stardust'"
            ></gem-counter>
          </div>
          <div id="shop-buttons" class="footer-align-flex">
            <text-button
              text="Shop"
              @clicked="targetExitEmit = 'go-shop'"
            ></text-button>
            <text-button
              text="Details"
              @clicked="showDetails = true"
            ></text-button>
            <text-button
              text="History"
              @clicked="showHistory = true"
            ></text-button>
          </div>
        </div>
        <div id="wish-buttons" class="footer-align-flex">
          <wish-button
            :wishes="1"
            :fates="
              banner.storage === 'standard'
                ? inventory.standardFates
                : inventory.fates
            "
            :standard="banner.storage === 'standard'"
            @try-wish="wish(1)"
          ></wish-button>
          <wish-button
            :wishes="10"
            :fates="
              banner.storage === 'standard'
                ? inventory.standardFates
                : inventory.fates
            "
            :standard="banner.storage === 'standard'"
            @try-wish="wish(10)"
          ></wish-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WishButton from "./WishButton.vue";
import TextButton from "@/components/shared/TextButton.vue";
import GemCounter from "@/components/shared/GemCounter.vue";
import BannerDetailsScreen from "@/components/ScreenBannerDetails/BannerDetailsScreen.vue";
import { ItemDatabase } from "@/state/Gacha";
import { Banner, Item, Settings } from "@/types";
import Inventory from "@/state/Inventory";
import WishHistoryScreen from "@/components/ScreenWishHistory/WishHistoryScreen.vue";
import ItemDescriptionOverlay from "@/components/overlays/ItemDescriptionOverlay.vue";
import CloseButton from "@/components/shared/CloseButton.vue";
import SettingsScreen from "../ScreenSettings/SettingsScreen.vue";
import BannerHeader from "./BannerHeader.vue";

export default defineComponent({
  components: {
    WishButton,
    TextButton,
    GemCounter,
    BannerDetailsScreen,
    WishHistoryScreen,
    ItemDescriptionOverlay,
    CloseButton,
    SettingsScreen,
    BannerHeader,
  },
  props: {
    banners: {
      type: Object as () => Banner[],
      required: true,
    },
    currentBannerIndex: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  emits: ["wish", "go-quests", "go-shop", "change-banner"],
  data() {
    return {
      showDetails: false,
      showHistory: false,
      showSettings: false,
      activeItemId: "",
      targetExitEmit: "" as "wish" | "go-quests" | "go-shop" | "",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    banner(): Banner {
      return this.banners[this.currentBannerIndex];
    },
    activeItem(): Item {
      return ItemDatabase[this.activeItemId];
    },
    stateExiting(): boolean {
      return this.targetExitEmit !== "";
    },
    isMobile(): boolean {
      return (
        (this.windowHeight > this.windowWidth && this.windowWidth < 850) ||
        this.windowHeight < 700
      );
    },
    settings(): Settings {
      return this.$store.state.settings;
    },
  },
  created() {
    this.$nextTick(() => window.addEventListener("resize", this.onResize));
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    wish(number: number): void {
      this.$emit("wish", number, this.banner.storage === "standard");
    },
    changeBanner(index: number): void {
      (
        document.getElementById("audio-banner-switch") as HTMLAudioElement
      ).play();
      this.$emit("change-banner", index);
    },
    exitDetailsScreen(): void {
      (
        document.getElementById("audioExitDialogDEPRECATED") as HTMLAudioElement
      ).play();
      this.showDetails = false;
    },
    exitHistoryScreen(): void {
      // so much legacy cruft from when I didn't know Vue :(
      (
        document.getElementById("audioExitDialogDEPRECATED") as HTMLAudioElement
      ).play();
      this.showHistory = false;
    },
    exitSettingsScreen(): void {
      // AAAAAAAAAAA
      // imagine adding new features instead of cleaning up legacy cruft
      (
        document.getElementById("audioExitDialogDEPRECATED") as HTMLAudioElement
      ).play();
      this.showSettings = false;
    },
    exitEmit(): void {
      if (!this.targetExitEmit) {
        // i would use this.stateExiting but typescript needs
        // to check that and isn't smart enough to do that :(
        return;
      }
      this.$emit(this.targetExitEmit);
    },
    exit(): void {
      this.$emit("go-quests");
    },
    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
  },
});
</script>

<style scoped>
.mobile-header-holder {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.everyone {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 85%;
  font-size: 3rem;
  color: white;
  text-shadow: black 0.2rem 0.2rem;
  z-index: 2;
}
.banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.banner-container {
  height: 100%;
  display: flex;
}

.mobile-header {
  width: 5%;
  height: 100%;
  background: linear-gradient(to bottom, #424b5c, #7a8d9c88);
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  box-sizing: border-box;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  align-items: center;
  transform: translateX(1rem);
  border-left: 0.1rem solid #978b72;
  border-right: 0.1rem solid #978b72;
  z-index: 1;
}

.mobile-header > .header-resizable {
  max-width: 8.5rem;
}

.mobile-header > img:not(.header-resizable) {
  width: 80%;
  padding-bottom: 1rem;
  padding-top: 0;
}

.banner-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  gap: 2rem;
}

.header-resizable {
  min-width: 2rem;
  max-width: calc(100% / 3);
}

.invisible {
  /* TODO: display: none also triggers the entry animation so:
   * use v-if for simplicity or make it an actual overlay using position: fixed
   */
  display: none;
}

.close-box {
  margin-left: 1rem;
  display: flex;
  gap: 0.25rem;
}

#wish-banners > div {
  display: flex;
  min-height: 0;
}

#header {
  animation: fadein 0.75s forwards, slide-from-top 0.75s forwards ease-out;
  margin-bottom: 0;
  max-height: min-content;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
}

#header.exit-animation {
  animation: fadein 0.25s forwards ease-out reverse,
    slide-from-top 0.25s forwards reverse;
}

/* because legacy code doesn't use transition and so
 * here we are because animations don't trigger if you
 * only reverse it without a keyframe change
 */
#header.start-animation {
  animation: fadein-2 0.75s forwards, slide-from-top-2 0.75s forwards ease-out;
}

#gems {
  display: flex;
  align-items: center;
}

#div-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 60%;
}

#div-banner.start-animation {
  animation: fadein 0.75s forwards, slide-from-left 0.75s forwards ease-out;
}

#div-banner.exit-animation {
  animation: fadein-2 0.25s forwards ease-out reverse,
    slide-from-left-2 0.5s forwards reverse;
}

#banner {
  max-width: 90%;
  max-height: 100%;
  height: 100%;
}

#footer {
  display: flex;
  align-items: flex-end;
  padding-bottom: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

#footer.start-animation {
  animation: fadein 0.75s forwards, slide-from-bottom 0.75s forwards ease-out;
}

#footer.exit-animation {
  animation: fadein-2 0.25s forwards ease-out reverse,
    slide-from-bottom-2 0.25s forwards ease-in reverse;
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

@keyframes slide-from-top-2 {
  from {
    transform: translateY(-2rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-from-left-2 {
  from {
    transform: translateX(2rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-from-bottom-2 {
  from {
    transform: translateY(2rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadein-2 {
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
  align-items: center;
  flex-wrap: wrap;
}

.left-align-flex {
  justify-content: left;
}

#wish-label > img {
  width: 3rem;
  margin-right: 20%;
}

.space-between {
  display: flex;
  justify-content: space-between;
  /* the below aligns the text buttons above the wish buttons */
  /* flex-wrap: wrap; */
}

.center > * {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

#wish-label {
  color: #f6f2ee;
  text-shadow: 1px 1px rgba(2, 2, 2, 0.3);
  user-select: none;
  font-size: 1.25rem;
  margin-left: 0;
  padding-right: 0.5rem;
}

@media screen and (max-width: 850px) and (orientation: portrait),
  screen and (max-height: 700px) and (orientation: landscape) {
  .menu-button {
    transform: scale(75%);
    margin: 0;
  }

  .footer-align-flex {
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  #wish-buttons {
    /* transform: translateY(-1.75rem); */
    width: 55%;
  }

  #shop-buttons {
    width: 100%;
  }

  #shop-button-holder-sometimes {
    width: 45%;
  }

  p#wish-label {
    margin-right: 10rem;
  }

  .banner {
    width: 90%;
  }

  #div-banner {
    max-height: 80%;
  }

  #header {
    width: 100%;
    margin: 0;
    padding-right: 5rem;
    padding-top: 1rem;
    box-sizing: border-box;
  }
}

@media screen and (max-width: 600px) and (orientation: portrait),
  screen and (max-height: 500px) and (orientation: landscape) {
  .menu-button {
    transform: scale(60%);
    margin: 0;
  }

  .footer-align-flex {
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  #wish-buttons {
    transform: translateY(-1.75rem);
  }

  #footer {
    padding-top: 0.25rem;
    align-items: flex-start;
  }

  #header {
    padding-top: 0.5rem;
  }
}
</style>
