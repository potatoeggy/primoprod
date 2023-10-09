<template>
  <audio ref="audioDescriptionOverlayExit" preload="auto">
    <source src="@/assets/audio/description-exit.ogg" type="audio/ogg" />
    <source src="@/assets/audio/description-exit.mp3" type="audio/mp3" />
  </audio>
  <audio autoplay>
    <source src="@/assets/audio/description-enter.ogg" type="audio/ogg" />
    <source src="@/assets/audio/description-enter.mp3" type="audio/mp3" />
  </audio>
  <div
    id="item-description-overlay-bg"
    :class="{ bg: true, 'zoom-fade-in': active, 'zoom-fade-out': !active }"
    @click="exitOutsideCheck"
    @animationend="exit"
  >
    <div
      :class="{ 'main-box': true, 'zoom-in': active, 'zoom-out': !active }"
      :style="cssBox"
    >
      <div class="coloured-box">
        <p class="item-name">{{ item.name }}</p>
      </div>
      <div class="graphic-box">
        <p class="item-name item-type">{{ item.type }}</p>
        <div class="item-icon">
          <img
            class="item-icon-img"
            :src="require(`@/assets/images/${item.id}.webp`)"
          />
        </div>
        <div class="star-box margin-left">
          <img
            v-for="i in item.rarity"
            :key="i"
            class="star"
            src="@/assets/images/star.svg"
          />
        </div>
      </div>
      <p class="description margin-left">{{ item.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Item } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
  emits: ["exit"],
  data() {
    return {
      active: true,
      colouredBoxBgColours: [
        "",
        "#72778b",
        "#339c73",
        "#5181cd",
        "#a155df",
        "#be692e",
      ],
      bodyBoxBgColours: [
        [],
        ["#505865", "#545a66", "#828e99"],
        ["#46565c", "#485d60", "#659973"],
        ["#525376", "#4e5d7c", "#489fb3"],
        ["#595482", "#716196", "#b684c8"],
        ["#695352", "#99694e", "#e3ad52"],
      ],
    };
  },
  computed: {
    cssBox(): { [name: string]: string } {
      return {
        "--header-bg-color": this.colouredBoxBgColours[this.item.rarity],
        "--body-bg-gradient-start": this.bodyBoxBgColours[this.item.rarity][0],
        "--body-bg-gradient-middle": this.bodyBoxBgColours[this.item.rarity][1],
        "--body-bg-gradient-end": this.bodyBoxBgColours[this.item.rarity][2],
      };
    },
  },
  methods: {
    exitOutsideCheck(e: Event) {
      if (e.target === document.getElementById("item-description-overlay-bg")) {
        (this.$refs.audioDescriptionOverlayExit as HTMLAudioElement).play();
        this.active = false;
      }
    },
    exit() {
      if (!this.active) {
        this.$emit("exit");
      }
    },
  },
});
</script>

<style scoped>
.bg {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.main-box {
  --description-box-width: 26rem;
  --description-box-height: calc(1.1 * var(--description-box-width));
  color: #6b6c6e;
  background-color: #ebe5d9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: open-dialog 0.1s forwards;
  width: var(--description-box-width);
  height: var(--description-box-height);
}

.coloured-box {
  height: 15%;
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: var(--header-bg-color);
}

.item-name {
  color: white;
  font-size: 1.8rem;
  padding-top: 0.5rem;
  padding-bottom: 0.3rem;
  padding-left: 1.1rem; /* margin + padding should equal 1rem */
  padding-right: 1.1rem;
  margin-left: 0.12rem;
  margin-right: 0.12rem;
  text-align: left;
  width: 100%;
  border: 0.17rem solid #64646464;
  letter-spacing: -0.1rem;
}

.item-type {
  font-size: 1.1rem;
  margin-bottom: 0;
  border: none;
  letter-spacing: -0.02rem;
}

.graphic-box {
  height: 45%;
  width: 100%;
  background: linear-gradient(
    to bottom right,
    var(--body-bg-gradient-start) 0%,
    var(--body-bg-gradient-middle) 50%,
    var(--body-bg-gradient-end) 100%
  );
}

.item-icon {
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.item-icon-img {
  height: 150%;
}

.star-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 20%;
}

.star {
  width: 1.5rem;
  padding-right: 0.35rem;
}

.margin-left {
  margin-left: 1.2rem;
  margin-right: 1.2rem;
}

.description {
  height: 40%;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1.2rem;
  vertical-align: middle;
  letter-spacing: -0.03rem;
}

.zoom-fade-in {
  animation: desc-overlay-fadein 0.1s;
}

.zoom-fade-out {
  animation: desc-overlay-fadeout 0.1s;
}

@keyframes desc-overlay-fadein {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 1;
  }
}

/* i know i can use reverse but animationend
 * fires randomly like that so here we are
 */
@keyframes desc-overlay-fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.zoom-in {
  animation: desc-overlay-zoomin 0.1s;
}

.zoom-out {
  animation: desc-overlay-zoomout 0.1s;
}

@keyframes desc-overlay-zoomin {
  from {
    transform: scale(75%);
  }
  to {
    transform: scale(100%);
  }
}

@keyframes desc-overlay-zoomout {
  from {
    transform: scale(100%);
  }
  to {
    transform: scale(75%);
  }
}
</style>
