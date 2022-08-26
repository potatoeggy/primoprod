<template>
  <div class="close-button-box">
    <img
      src="@/assets/images/close-button.webp"
      class="close-button"
      @click="clicked"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["clicked"],
  methods: {
    clicked() {
      // TODO: WARN: stupid and hacky temporary solution that will
      // break once an inventory is introduced
      (
        (this.$parent?.$refs.audioCancelConfirm ||
          document.getElementById(
            "audioExitDialogDEPRECATED"
          )) as HTMLAudioElement
      ).play();
      this.$emit("clicked");
    },
  },
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

.close-button:active {
  filter: brightness(80%);
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
