<script setup lang="ts">
const props = defineProps<{
  uid: string;
}>();
</script>

<template>
  <div class="fake-uid">UID: {{ props.uid }}</div>
</template>

<style scoped>
.fake-uid {
  font-size: 1.1rem;
  color: #fff;
  position: absolute;
  right: 4rem;
  bottom: 0;
  text-shadow: 0 0 0.15rem #000;
  letter-spacing: -0.03rem;
}
</style>
