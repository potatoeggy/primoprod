<template>
  <button class="gem-counter">
    <span class="left">
      <img :src="require(`../assets/images/${icon}`)" width="25" />
    </span>
    <span class="center">{{ text }}</span>
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
  },
});
</script>

<style scoped>
.gem-counter {
  background-color: rgba(0, 0, 0, 0.5);
  height: 1.5rem;
  width: 5rem;
  margin: 0.5rem;
  border-radius: 1rem;
  border-width: 0px;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2), 0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 11pt;
  color: white;
  text-align: start;
  padding-left: 5px;
  /* the text must be right aligned while the icon left-aligned */
}

.gem-counter img {
  display: inline;
  vertical-align: middle;
}

.left {
  text-align: left;
}

.center {
  text-align: right;
}
</style>