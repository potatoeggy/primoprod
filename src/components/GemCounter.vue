<template>
  <button
    v-bind:class="{
      'gem-counter': true,
      'gem-counter-background': !nobackground,
    }"
    tabindex="-1"
  >
    <div class="flex-gem">
      <div class="left">
        <img :src="require(`@/assets/images/${icon}`)" />
      </div>
      <div class="text">{{ text }}</div>
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
      type: Number,
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
    alignRight: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>

<style scoped>
.gem-counter {
  background-color: unset;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.5);
  height: 2.2rem;
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

.flex-gem > div {
  /* TODO: make all sizes relative to viewport? (set em initially with root and then use em for the rest)*/
}

.flex-gem {
  display: flex;
  text-align: center;
}

img {
  vertical-align: middle;
  height: 2.2rem;
  margin-left: 0.3rem;
  filter: drop-shadow(0px 1px 1px #222)
}

.text {
  text-align: right;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 0.5rem;
  margin-right: 1.3rem;
}

.plus-button {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0.25rem;
}
</style>
