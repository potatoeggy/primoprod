<template>
  <!-- overlay use json? -->
  <item-description-overlay
    :item="activeItem"
    v-if="activeItem"
    @exit="activeItemId = ''"
  ></item-description-overlay>
  <banner-details-screen
    :banner="banner"
    v-if="showDetails"
    @exit="exitDetailsScreen"
  ></banner-details-screen>
  <wish-history-screen
    v-if="showHistory"
    :inventory="inventory"
    @exit="exitHistoryScreen"
  ></wish-history-screen>

  <audio id="audio-banner-switch" preload="true">
    <source src="@/assets/audio/banner-switch.mp3" />
  </audio>

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
        <img src="../assets/images/ui-wish-edited.png" />
        <p id="wish-label">Wish</p>
      </div>
      <div class="banner-header">
        <template v-for="(ban, index) of banners" :key="index">
          <img
            :src="getBannerHeaderImage(ban, true)"
            v-if="currentBannerIndex === index"
          />
          <img
            :src="getBannerHeaderImage(ban)"
            v-else
            @click="changeBanner(index)"
          />
        </template>
      </div>
      <div id="gems">
        <gem-counter
          icon="primogem.png"
          :text="inventory.primos"
          @image-clicked="activeItemId = 'primogem'"
          plusSign
        ></gem-counter>
        <gem-counter
          icon="acquaint-fate.png"
          :text="inventory.standardFates"
          @image-clicked="activeItemId = 'acquaint-fate'"
          v-if="banner.storage === 'standard'"
        ></gem-counter>
        <gem-counter
          icon="intertwined-fate.png"
          :text="inventory.fates"
          @image-clicked="activeItemId = 'intertwined-fate'"
          v-else
        ></gem-counter>
        <div class="close-box">
          <close-button @clicked="exit"></close-button>
        </div>
      </div>
    </div>
    <div
      id="div-banner"
      :class="stateExiting ? 'exit-animation' : 'start-animation'"
      :key="currentBannerIndex"
    >
      <img id="banner" :src="getBannerImage" />
    </div>
    <div
      id="footer"
      :class="[
        'space-between',
        stateExiting ? 'exit-animation' : 'start-animation',
      ]"
    >
      <div>
        <div id="masterless-home" class="footer-align-flex left-align-flex">
          <gem-counter
            icon="starglitter.png"
            :text="inventory.starglitter"
            @image-clicked="activeItemId = 'starglitter'"
            nobackground
          ></gem-counter>
          <gem-counter
            icon="stardust.png"
            :text="inventory.stardust"
            @image-clicked="activeItemId = 'stardust'"
            nobackground
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
          :fates="inventory.fates"
          :standard="banner.storage === 'standard'"
          @try-wish="wish(1)"
        ></wish-button>
        <wish-button
          :wishes="10"
          :fates="inventory.fates"
          :standard="banner.storage === 'standard'"
          @try-wish="wish(10)"
        ></wish-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WishButton from "./WishButton.vue";
import TextButton from "./TextButton.vue";
import GemCounter from "./GemCounter.vue";
import BannerDetailsScreen from "./BannerDetailsScreen.vue";
import { Banner, Item, ItemDatabase } from "@/banners/Gacha";
import Inventory from "@/banners/Inventory";
import WishHistoryScreen from "./WishHistoryScreen.vue";
import ItemDescriptionOverlay from "./ItemDescriptionOverlay.vue";
import CloseButton from "./CloseButton.vue";

export default defineComponent({
  components: {
    WishButton,
    TextButton,
    GemCounter,
    BannerDetailsScreen,
    WishHistoryScreen,
    ItemDescriptionOverlay,
    CloseButton,
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
  data() {
    return {
      showDetails: false,
      showHistory: false,
      activeItemId: "",
      targetExitEmit: "" as "wish" | "go-quests" | "go-shop" | "",
    };
  },
  computed: {
    banner(): Banner {
      return this.banners[this.currentBannerIndex];
    },

    getBannerImage(): string {
      const images = require.context(
        "../assets/images/banners/",
        false,
        /\.png$/
      );
      try {
        return images(`./${this.banner.id}.png`);
      } catch (error) {
        return `./${this.banner.id}.png`;
      }
    },
    activeItem(): Item {
      return ItemDatabase[this.activeItemId];
    },
    stateExiting(): boolean {
      return this.targetExitEmit !== "";
    },
  },
  methods: {
    getBannerHeaderImage(banner: Banner, selected = false): string {
      const images = require.context(
        "../assets/images/banner-headers/",
        false,
        /\.png$/
      );
      try {
        return images(`./${selected ? "selected-" : ""}${banner.id}.png`);
      } catch (error) {
        return `./${selected ? "selected-" : ""}${banner.id}.png`;
      }
    },
    wish(number: number): void {
      this.$emit("wish", number);
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
  },
  emits: ["wish", "go-quests", "go-shop", "change-banner"],
});
</script>

<style scoped>
.banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.banner-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2vw;
}

.invisible {
  /* TODO: display: none also triggers the entry animation so:
   * use v-if for simplicity or make it an actual overlay using position: fixed
   */
  display: none;
}

.close-box {
  margin-left: 1rem;
}

#wish-banners > div {
  display: flex;
  min-height: 0;
}

#header {
  animation: fadein 0.75s forwards, slide-from-top 0.75s forwards ease-out;
  margin-bottom: 0;
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
  max-height: 70%;
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
}

#footer {
  min-height: 4rem;
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
  margin: 1rem;
  margin-right: 2rem;
  margin-left: 2rem;
  justify-content: space-between;
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
</style>
