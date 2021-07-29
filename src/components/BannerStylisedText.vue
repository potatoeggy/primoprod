<template>
  <span v-if="banner.styles">
    <span
      v-for="(style, index) in banner.styles"
      :key="index"
      :style="{ color: style.color || 'unset' }"
      >{{ style.text }}
    </span>
  </span>
  <span v-else>
    {{ banner.name }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Banner } from "@/banners/Gacha";
export default defineComponent({
  props: {
    banner: Object as () => Banner,
  },
});
</script>

<style scoped>
span {
  font-family: Arial, sans-serif;
}
</style>
