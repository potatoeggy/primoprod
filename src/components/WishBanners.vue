<template>
  <!-- overlay use json? -->
  <banner-details-screen
    bannerName="Wanderlust Invocation"
    :isFeaturedBanner="false"
    v-if="showDetails"
    @exit="exitDetailsScreen"
  ></banner-details-screen>

  <div :class="{ banner: true, invisible: showDetails }">
    <div id="header" class="space-between center">
      <div id="wish-label" class="space-between center">
        <img src="../assets/images/ui-wish-edited.png" />
        <p id="wish-label">Wish</p>
      </div>
      <div id="gems">
        <gem-counter icon="primogem.png" :text="primos" plusSign></gem-counter>
        <gem-counter icon="intertwined-fate.png" :text="fates"></gem-counter>
      </div>
    </div>
    <div id="div-banner">
      <img id="banner" src="../assets/images/wanderlust-banner.png" />
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
          <text-button
            text="Details"
            @clicked="showDetails = true"
          ></text-button>
          <text-button text="History"></text-button>
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
import BannerDetailsScreen from "@/components/BannerDetailsScreen.vue";

export default defineComponent({
  components: { WishButton, TextButton, GemCounter, BannerDetailsScreen },
  props: {
    fates: {
      type: Number,
      required: true,
    },
    primos: {
      type: Number,
      required: true,
    },
    starglitter: {
      type: Number,
      required: true,
    },
    stardust: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showDetails: false,
    };
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
  display: none;
}

#wish-banners > div {
  display: flex;
  min-height: 0;
}

#header {
  animation: fadein 0.75s forwards, slide-from-top 0.75s forwards ease-out;
  margin-bottom: 0;
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
