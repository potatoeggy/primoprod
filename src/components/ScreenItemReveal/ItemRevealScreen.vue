<template>
  <template v-for="i in [3, 4, 5]" :key="i">
    <audio
      ref="audioItemReveal"
      preload="true"
      @canplaythrough="if (animationIndex < 0) nextAnimation();"
      v-if="currentIndex === 0 && currentItem.rarity === i"
    >
      <source
        :src="require(`@/assets/audio/${i}-star-wish-reveal-first.mp3`)"
        type="audio/mpeg"
      />
    </audio>
    <audio
      ref="audioItemReveal"
      preload="true"
      @canplaythrough="if (animationIndex < 0) nextAnimation();"
      v-else-if="currentItem.rarity === i"
    >
      <source
        :src="require(`@/assets/audio/${i}-star-wish-reveal.mp3`)"
        type="audio/mpeg"
      />
    </audio>
  </template>
  <div class="item-picture" @click="nextItem">
    <div
      :class="{
        'glow-box': true,
        blue: currentItem.rarity === 3,
        purple: currentItem.rarity === 4,
        gold: currentItem.rarity === 5,
      }"
    ></div>
    <img
      :src="currentItemImage"
      :class="{
        'animate-image': animationIndex === 1,
        'zoom-image': animationIndex === 0,
        'active-img': true,
        'active-img-weapon': currentItem.type === 'Weapon',
        transparent: animationIndex < 0,
      }"
      @animationstart="playSfx"
      @animationend="nextAnimation"
      @load="nextAnimation"
      :alt="currentItemImage"
    />
  </div>
  <div class="item" @click="nextItem">
    <div
      :class="{
        'name-rarity': true,
        'name-rarity-left-push': currentItem.type === 'Character',
      }"
      id="item-reveal-description-box"
    >
      <div class="element-img-box">
        <img
          :src="
            require(`@/assets/images/icons/icon-element-${currentItem.element}.png`)
          "
          :class="{
            'element-img': true,
            'element-img-weapon': currentItem.type === 'Weapon',
            transparent: animationIndex <= 0,
            'appear-slide-left-element': animationIndex >= 1,
          }"
        />
      </div>
      <div class="flex-start star-text-box">
        <p
          :class="{
            'name-text': true,
            'name-left-align': true,
            transparent: animationIndex <= 0,
            'appear-slide-left': animationIndex === 1,
          }"
        >
          {{ currentItem.name }}
        </p>
        <div class="stars name-left-align">
          <img
            src="@/assets/images/star.svg"
            v-for="n in currentItem.rarity"
            v-bind:key="n"
            :class="{
              transparent: animationIndex < n + 1,
              delayed: n === 1 && animationIndex === n + 1,
              'star-pop-in': animationIndex === n + 1,
            }"
            @animationend="nextAnimation"
            alt="star"
          />
        </div>
      </div>
    </div>
    <div class="image-padding"></div>
    <div
      :class="[
        'extra-dust-glitter',
        'flex-start',
        {
          'starglitter-slide-in': animationIndex >= 2,
          transparent: animationIndex < 2 || currentItem.type === 'Character',
        },
      ]"
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
import Inventory from "@/state/Inventory";
import { Item } from "@/types";
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
      animationIndex: -2,
    };
  },
  methods: {
    nextItem() {
      this.currentIndex += 1;
      if (this.currentIndex >= this.lastRoll.length) {
        if (this.lastRoll.length === 1) {
          this.exit();
        } else {
          this.$emit("reveal-all");
        }
        return;
      }

      this.animationIndex = -2;
      if (this.currentIndex >= 1) {
        if (
          this.currentItem.rarity ===
            this.lastRoll[this.currentIndex - 1].rarity &&
          this.currentIndex >= 1
        ) {
          // audio depends on rarity and the first two
          // audios are guaranteed to be different because of
          // "first"
          this.animationIndex += 1;
        }

        if (this.currentItem.id === this.lastRoll[this.currentIndex - 1].id) {
          // if the image has already loaded
          this.animationIndex += 1;
        }
      }

      /*
       * Animation index documentation
       * below 0: image and/or sfx have yet to finish loading
       * 0: item image zooms in
       * 1: item image and name text slides in
       * 2+: individual stars load in, extra text slides in
       */
    },
    nextAnimation() {
      this.animationIndex += 1;
    },
    exit() {
      this.$emit("exit");
    },
    playSfx() {
      if (this.animationIndex > 0) {
        // only play sound when assets have loaded
        return;
      }
      const audioRef = (
        this.$refs.audioItemReveal as Array<HTMLAudioElement>
      )[0];
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.play();
    },
  },
  computed: {
    currentItem(): Item {
      return this.lastRoll[this.currentIndex];
    },
    currentItemImage(): string {
      const images = require.context("@/assets/images/drops/", false, /\.png$/);
      try {
        return images(`./${this.currentItem.id}.png`);
      } catch (error) {
        return `${this.currentItem.id}.png`;
      }
    },
    currentItemAudio(): string {
      const name = `${this.currentItem.rarity}-star-wish-reveal${
        this.currentIndex === 0 ? "-first" : ""
      }`;
      try {
        return require.context(
          "@/assets/audio",
          false,
          /\.mp3$/
        )(`./${name}.mp3`);
      } catch (error) {
        console.error(`Could not find ${name}.mp3.`);
        return "";
      }
    },
  },
  emits: ["exit", "reveal-all"],
});
</script>

<style scoped>
.glow-box {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  width: 0px;
  height: 0px;
  border-radius: 50%;
}

.glow-box.blue {
  box-shadow: 0 0 15rem 15rem rgba(4, 89, 248, 0.5);
}

.glow-box.purple {
  box-shadow: 0 0 15rem 15rem rgba(118, 4, 248, 0.5);
}

.glow-box.gold {
  box-shadow: 0 0 15rem 15rem rgba(248, 142, 4, 0.5);
}
.element-img-box {
  width: 4.5rem;
  z-index: -1;
  transform: translateY(-2.5rem);
  margin-right: -1rem;
  margin-bottom: -2rem;
}

.element-img {
  width: 8rem;
}

.element-img-weapon {
  /* recolouring an image :/ */
  filter: invert(35%) sepia(26%) saturate(203%) hue-rotate(188deg)
    brightness(93%) contrast(92%);
}

.image-padding {
  width: 50%;
  height: 100%;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url("../../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  height: 100%;
  width: 100%;
  /* once a certain screen size is hit change to align-items center I guess */
  padding-left: 1rem;
}

.item > div {
  display: flex;
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
  filter: drop-shadow(0.75rem 0.5rem 0 black);
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
  animation-duration: 0.165s;
  animation-iteration-count: initial;
}

.delayed {
  animation-delay: 0.3s;
  opacity: 0;
}

@keyframes starpopin {
  from {
    transform: scale(300%);
    opacity: 1;
  }
  to {
    transform: scale(100%);
    opacity: 1;
  }
}

.appear-slide-left {
  animation-name: fade-in-slide-left;
  animation-duration: 1s;
  animation-iteration-count: initial;
  opacity: 0;
}

.appear-slide-left-element {
  animation-name: fade-in-slide-left;
  animation-duration: 1s;
  animation-delay: 0.25s;
  animation-fill-mode: forwards;
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
  animation-iteration-count: initial;
}

@keyframes zoominfastdark {
  from {
    transform: scale(400%);
    opacity: 1;
  }
  to {
    transform: scale(100%);
    opacity: 1;
  }
}

.animate-image {
  animation-name: fade-in-slide-right;
  animation-duration: 1s;
  animation-iteration-count: initial;
  filter: brightness(0%);
  transform: translateX(0%);
}

.animate-image.active-img-weapon {
  animation-name: fade-in-slide-right, dropshadowslidein;
}

@keyframes fade-in-slide-right {
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

@keyframes dropshadowslidein {
  from {
    filter: brightness(0%);
  }
  80% {
    filter: brightness(0%);
  }
  to {
    filter: brightness(100%) drop-shadow(0.75rem 0.5rem 0 black);
  }
}

.flex-start {
  align-items: flex-start;
}

.star-text-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name-rarity {
  color: white;
  margin-top: 10%;
  margin-left: auto;
  font-size: 2.25rem;
  word-wrap: break-word;
  letter-spacing: -0.125rem;
  flex-direction: row;
  align-items: flex-end;
  margin-right: 0;
  /* css too hard screw it */
  transform: translateY(30%);
}

/* help me */
.name-rarity-left-push {
  align-items: flex-start;
  position: absolute;
  left: 5rem;
}

.extra-dust-glitter {
  text-align: left;
  margin-top: 7.5%;
  color: #e3e3e9;
  min-width: 20%;
  flex-direction: column;
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

.name-left-align {
  margin-left: 2rem;
}

.transparent {
  opacity: 0;
}
</style>
