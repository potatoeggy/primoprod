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

  <div :class="{ banner: true, invisible: showDetails || showHistory }">
    <div id="header" class="space-between center">
      <div id="wish-label" class="space-between center">
        <img src="../assets/images/ui-wish-edited.png" />
        <p id="wish-label">Wish</p>
      </div>
      <div id="gems">
        <gem-counter
          icon="primogem.png"
          :text="primos"
          @image-clicked="activeItemId = 'primogem'"
          plusSign
        ></gem-counter>
        <gem-counter
          icon="intertwined-fate.png"
          :text="fates"
          @image-clicked="activeItemId = 'intertwined-fate'"
        ></gem-counter>
        <div class="close-box"><close-button></close-button></div>
      </div>
    </div>
    <div id="div-banner">
      <img id="banner" :src="getBannerImage" />
    </div>
    <div id="footer" class="space-between">
      <div>
        <div id="masterless-home" class="footer-align-flex left-align-flex">
          <gem-counter
            icon="starglitter.png"
            :text="starglitter"
            @image-clicked="activeItemId = 'starglitter'"
            nobackground
          ></gem-counter>
          <gem-counter
            icon="stardust.png"
            :text="stardust"
            @image-clicked="activeItemId = 'stardust'"
            nobackground
          ></gem-counter>
        </div>
        <div id="shop-buttons" class="footer-align-flex">
          <text-button text="Shop"></text-button>
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
        <wish-button :wishes="1" :fates="fates" @try-wish="wish"></wish-button>
        <wish-button :wishes="10" :fates="fates" @try-wish="wish"></wish-button>
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
    banner: {
      type: Object as () => Banner,
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
      fates: this.inventory.fates,
      primos: this.inventory.primos,
      starglitter: this.inventory.starglitter,
      stardust: this.inventory.stardust,
      activeItemId: "",
    };
  },
  computed: {
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
  },
  methods: {
    wish(number: number): void {
      this.$emit("wish", number);
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
  },
  emits: ["wish"],
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

#gems {
  display: flex;
  align-items: center;
}

#div-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadein 0.75s forwards, slide-from-left 0.75s forwards ease-out;
  max-height: 70%;
}

#banner {
  max-width: 90%;
  max-height: 100%;
}

#footer {
  min-height: 4rem;
  animation: fadein 0.75s forwards, slide-from-bottom 0.75s forwards ease-out;
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
