<script setup lang="ts">
import { Banner } from "@/types";

const props = defineProps<{ banner: Banner; quotes?: boolean }>();
</script>

<template>
  <span v-if="banner?.styles">
    {{ quotes ? '"' : null
    }}<span
      v-for="(style, index) in banner?.styles"
      :key="index"
      :style="{ color: style.color || 'unset' }"
      >{{ style.text }} </span
    >{{ quotes ? '"' : null }}
  </span>
  <span v-else>
    {{ banner?.name }}
  </span>
</template>
