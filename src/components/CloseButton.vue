<template>
  <div class="close-button-box">
    <img
      src="@/assets/images/close-button.png"
      class="close-button"
      @click="clicked"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  methods: {
    clicked() {
      this.$emit("clicked");
    },
  },
  emits: ["clicked"],
});
</script>

<style scoped>
.close-button {
  height: 2.5rem;
  border: 0rem solid white;
  border-radius: 5rem;
  transition: border 0.1s ease-in-out 0s;
  outline: currentcolor none medium;
}

.close-button:hover {
  border-width: 0.25rem;
}

.close-button-box {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  background-color: rgb(174, 187, 191);
  border-radius: 5rem;
}

.close-button-box:hover {
  border-color: white;
  box-shadow: rgba(160, 175, 190, 0.8) 0px 0px 7px 5px;
}
</style>
