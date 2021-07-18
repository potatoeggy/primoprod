<template>
  <div class="wish-container">
    <img class="wish-button" src="../assets/images/wish-button.png" />
    <div class="wish-text">
      <p>Wish ×{{ wishes }}</p>
      <p class="red">
        <img
          class="fate-image"
          src="../assets/images/intertwined-fate.png"
          alt="intertwined_fate"
        />
        <span>x {{ wishes }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    wishes: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.wish-container {
  position: relative;
  display: inline-block;
  color: #b3a08c;
}

.wish-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

p {
  font-size: 1.3rem;
  user-select: none;
}

.fate-image {
  vertical-align: middle;
  display: inline;
  filter: drop-shadow(0px 1px 1px #222);
  width: 2.25rem;
}

.red {
  color: red;
}
</style>
