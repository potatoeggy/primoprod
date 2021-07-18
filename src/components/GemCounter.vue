<template>
  <button class="gem-counter">
    <div class="flex-gem">
      <div class="left">
        <img :src="require(`../assets/images/${icon}`)" />
      </div>
      <div class="text">{{ text }}</div>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: false,
      default: "0",
    },
    icon: {
      type: String,
      required: true,
    },
    background: {
      type: Boolean,
      required: false,
      default: true,
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
  background-color: rgba(0, 0, 0, 0.35);
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

.flex-gem > div {
  /* TODO: make all sizes relative to viewport? (set em initially with root and then use em for the rest)*/
}

.flex-gem {
  display: flex;
}

img {
  vertical-align: middle;
  height: 2.2rem;
  margin-left: 0.3rem;
}

.text {
  text-align: right;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 0.5rem;
  margin-right: 1.3rem;
}
</style>
