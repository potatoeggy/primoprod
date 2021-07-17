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
  },
});
</script>

<style scoped>
.gem-counter {
  background-color: rgba(0, 0, 0, 0.4);
  height: 1.5rem;
  width: 6rem;
  border-radius: 1rem;
  border-width: 0px;
  box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2),
    0 2px 2px 0 rgba(100, 100, 100, 0.19);
  font-size: 100%;
  color: white;
  padding-left: 5px;
  /* the text must be right aligned while the icon left-aligned */
  justify-content: space-between;
}

.flex-gem > div {
  /* TODO: make all sizes relative to viewport? (set em initially with root and then use em for the rest)*/
}

.flex-gem {
  display: flex;
}

img {
  vertical-align: middle;
  height: 1.75rem;
}

.text {
  text-align: right;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 0.75rem;
}
</style>
