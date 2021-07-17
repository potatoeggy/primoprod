<template>
  <button class="gem-counter">
    <div class="flex">
      <div class="left">
        <img :src="require(`../assets/images/${icon}`)" width="25" />
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
  },
});
</script>

<style scoped>
.gem-counter {
  background-color: rgba(0, 0, 0, 0.5);
  height: 1.5rem;
  width: 6rem;
  margin: 0.5rem;
  border-radius: 1rem;
  border-width: 0px;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2),
    0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 11pt;
  color: white;
  padding-left: 5px;
  /* the text must be right aligned while the icon left-aligned */
  justify-content: space-between;
}

.flex {
  display: flex;
}

img {
  vertical-align: middle;
}

.text {
  text-align: right;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 1rem;
}
</style>
