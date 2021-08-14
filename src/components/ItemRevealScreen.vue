<template>
  <template v-for="n in 6" :key="n">
    <!-- -1 to zero index -->
    <audio :ref="`audioStarPing${n - 1}`" preload>
      <source src="@/assets/audio/star-ping.mp3" type="audio/mpeg" />
    </audio>
  </template>
  <div class="item-picture" @click="nextItem">
    <img
      :src="currentItemImage"
      :class="{
        'animate-image': animationIndex === 1,
        'zoom-image': animationIndex === 0,
        'active-img': true,
        'active-img-weapon': currentItem.type === 'Weapon',
      }"
      @animationend="nextAnimation"
      :alt="currentItemImage"
    />
  </div>
  <div class="item" @click="nextItem">
    <div class="name-rarity flex-start">
      <p
        :class="{
          'name-text': true,
          transparent: animationIndex <= 0,
          'appear-slide-left': animationIndex === 1,
        }"
        @animationend="nextAnimation"
      >
        {{ currentItem.name }}
      </p>
      <div class="stars">
        <img
          src="@/assets/images/star.svg"
          v-for="n in currentItem.rarity"
          v-bind:key="n"
          :class="{
            transparent: animationIndex < n + 2,
            'star-pop-in': animationIndex === n + 2,
          }"
          @animationend="nextAnimation"
          alt="star"
        />
      </div>
    </div>
    <div class="image-padding"></div>
    <div
      :class="[
        'extra-dust-glitter',
        'flex-start',
        {
          'starglitter-slide-in': animationIndex >= 2,
          transparent: animationIndex < 2,
        },
      ]"
      v-if="currentItem.type === 'Weapon'"
    >
      <p>Extra</p>
      <div class="extra-text flex-start" v-if="currentItem.rarity === 3">
        <p>Masterless Stardust</p>
        <p>x15</p>
      </div>
      <div class="extra-text flex-start starglitter" v-else>
        <p>Masterless Starglitter</p>
        <p>x{{ currentItem.rarity === 4 ? 2 : 10 }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/banners/Inventory";
import { Item } from "@/banners/Gacha";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    lastRoll: {
      type: Object as () => Item[],
      required: true,
    },
    inventory: {
      type: Object as () => Inventory,
      required: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      animationIndex: 0,
    };
  },
  methods: {
    nextItem() {
      this.currentIndex += 1;
      if (this.currentIndex >= this.lastRoll.length) {
        this.exit();
      }
      this.animationIndex = 0;
      /*
       * Animation index documentation
       * -1: give time for images to reset
       * 0: item image zooms in
       * 1: item image and name text slides in
       * 2+: individual stars load in, extra text slides in
       */
    },
    nextAnimation() {
      this.animationIndex += 1;
      if (
        this.animationIndex >= 2 &&
        this.animationIndex <= this.currentItem.rarity + 2
      ) {
        // when a star is animated
        // it's weird but it has to be <= rarity + 2
        // because otherwise the last one won't play and
        // i don't know why
        // that's why there are six audios
        (
          this.$refs[
            `audioStarPing${this.animationIndex - 2}`
          ] as HTMLAudioElement
        ).play();
      }
    },
    exit() {
      this.$emit("exit");
    },
  },
  computed: {
    currentItem(): Item {
      return this.lastRoll[this.currentIndex];
    },
    currentItemImage(): string {
      const images = require.context(
        "../assets/images/drops/",
        false,
        /\.png$/
      );
      try {
        return images(`./${this.currentItem.id}.png`);
      } catch (error) {
        return `${this.currentItem.id}.png`;
      }
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.image-padding {
  width: 50%;
  height: 100%;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url("../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
  /* once a certain screen size is hit change to align-items center I guess */
}

.item > div {
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.stars > img {
  width: 1.25rem;
  padding-right: 0.3rem;
}

.item-picture {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 0;
}

.active-img {
  max-height: 100%;
  transform: translateX(1rem);
}

.active-img-weapon {
  max-height: 60%;
  max-width: 60%;
}

.starglitter-slide-in {
  animation-name: starglitterslidein;
  animation-duration: 0.05s;
  animation-iteration-count: initial;
}

@keyframes starglitterslidein {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.star-pop-in {
  animation-name: starpopin;
  animation-duration: 0.15s;
  animation-iteration-count: initial;
}

@keyframes starpopin {
  from {
    transform: scale(300%);
  }
  to {
    transform: scale(100%);
  }
}

.appear-slide-left {
  animation-name: fade-in-slide-left;
  /* equal to quickfadein */
  animation-duration: 0.75s;
  animation-iteration-count: initial;
  opacity: 0;
}

@keyframes fade-in-slide-left {
  from {
  }
  80% {
    transform: translateX(1rem);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.zoom-image {
  filter: brightness(0%);
  animation-name: zoominfastdark;
  animation-duration: 0.25s;
  /* The opacity change is to hide the image
   * while Vue switches the image to avoid a huge
   * flicker
   * nextTick doesn't work with a negative animationIndex
   * Quite frustrating
   */
  opacity: 0;
  animation-delay: 0.1s;
  animation-iteration-count: initial;
}

@keyframes zoominfastdark {
  from {
    transform: scale(200%);
    opacity: 1;
  }
  to {
    transform: scale(100%);
    opacity: 1;
  }
}

.animate-image {
  animation-name: quickfadein;
  animation-duration: 0.75s;
  animation-iteration-count: initial;
}

@keyframes quickfadein {
  from {
    filter: brightness(0%);
    transform: translateX(0%);
  }
  80% {
    filter: brightness(0%);
    transform: translateX(0%);
  }
  to {
    filter: brightness(100%);
    transform: translateX(1rem);
  }
}

.flex-start {
  align-items: flex-start;
}

.name-rarity {
  color: white;
  margin-top: 10%;
  margin-left: 5rem;
  font-size: 2.25rem;
  word-wrap: break-word;
  letter-spacing: -0.125rem;
}

.extra-dust-glitter {
  text-align: left;
  margin-top: 7.5%;
  color: #e3e3e9;
  min-width: 20%;
}

.extra-text {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0;
  padding-right: 1rem;
  padding-left: 1rem;
  font-size: 1.25rem;
  color: #f7b7ff;
  letter-spacing: -0.06rem;
  line-height: 2rem;
  background: linear-gradient(to right, #6f3aabdd, #6f3aab11);
}

.starglitter {
  color: #fff45e;
  background: linear-gradient(to right, #e0a933dd, #6f3aab11);
}

.name-text {
  margin-bottom: -0.5rem;
  text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
  text-align: left;
}

.transparent {
  opacity: 0;
}
</style>
