<template>
  <button
    :class="{
      'gem-counter': true,
      'gem-counter-background': !nobackground,
      'gem-counter-outline': outline,
      'gem-counter-small': small,
    }"
    tabindex="-1"
  >
    <div class="flex-gem">
      <div class="left">
        <img
          :src="require(`@/assets/images/${icon}`)"
          :alt="icon"
          @click="imageClicked"
        />
      </div>
      <div :class="['text', { red: red }]" @click="imageClicked">
        {{ text }}
      </div>
      <plus-button v-if="plusSign"></plus-button>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlusButton from "./PlusButton.vue";

export default defineComponent({
  components: { PlusButton },
  props: {
    text: {
      type: [Number, String],
      required: false,
      default: 0,
    },
    icon: {
      type: String,
      required: true,
    },
    nobackground: {
      type: Boolean,
      required: false,
      default: false,
    },
    plusSign: {
      type: Boolean,
      required: false,
      default: false,
    },
    outline: {
      type: Boolean,
      required: false,
      default: false,
    },
    alignRight: {
      type: Boolean,
      required: false,
      default: true,
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
    red: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["image-clicked"],
  methods: {
    imageClicked(): void {
      this.$emit("image-clicked");
    },
  },
});
</script>

<style scoped>
.gem-counter {
  background-color: unset;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.5);
  height: 2.3rem;
  width: auto;
  border-radius: 2rem;
  border-width: 0px;
  font-size: 140%;
  color: white;
  padding-left: 0.25rem;
  /* the text must be right aligned while the icon left-aligned */
  justify-content: space-between;
  margin: 0.5rem;
}

.gem-counter-background {
  background-color: rgba(0, 0, 0, 0.35);
}

.gem-counter-outline {
  border-style: solid;
  border-width: 0.2rem;
  outline: none;
  border-color: #424558;
  box-shadow: none;
}

.flex-gem {
  display: flex;
  text-align: center;
}

.gem-counter-small {
  scale: 0.8;
  margin: 0;
  height: 2rem;
}

img {
  vertical-align: middle;
  height: 2rem;
  margin-left: 0.3rem;
  filter: drop-shadow(0px 1px 1px #222);
}

img:active {
  opacity: 0.2;
  transition: opacity 0.15s;
}

.text {
  text-align: right;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 0.5rem;
  margin-right: 1.3rem;
  font-size: 1.3rem;
}

.red {
  color: red;
}

.gem-counter-small .text {
  /* hacks dirty hacks */
  margin-right: 1rem;
  transform: translateY(-0.25rem);
}

.gem-counter-small img {
  margin-left: 0;
  transform: translateY(-0.4rem);
}

.plus-button {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0.25rem;
}
</style>
