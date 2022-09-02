<script setup lang="ts">
const emit = defineEmits(["exit"]);
</script>

<template>
  <div class="bg">
    <div class="container">
      <div class="detail-box">
        <div class="text-box">
          <div class="close-web" @click="emit('exit')" />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  backdrop-filter: blur(0.5rem);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  height: 80%;
  width: 80%;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
}

.detail-box {
  aspect-ratio: 1.9/1; /* from measurements */
  background-image: url(../../assets/images/details-book.webp);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  flex-grow: 1;
  padding-top: 3%;
  padding-bottom: 6%;
  padding-left: 8%;
  padding-right: 2%;
  display: flex;
}

.text-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding-right: 7%;
}

.close-web {
  position: absolute;
  width: 4%;
  aspect-ratio: 1/1;
  right: 3%;
  cursor: pointer;
}

* {
  box-sizing: border-box;
}
</style>
