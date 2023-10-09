<template>
  <div
    :class="['close-button-box', { 'format-box': iconSrc !== 'close-button' }]"
  >
    <div class="button-box-box">
      <img :src="images(`${iconSrc}`)" class="close-button" @click="clicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    iconSrc: {
      type: String,
      required: false,
      default: "close-button",
    },
  },
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
    images(name: string) {
      try {
        return require.context(
          "@/assets/images",
          false,
          /\.webp$/
        )(`./${name}.webp`);
      } catch (error) {
        console.error(`Could not find ${name}.webp.`);
        return "";
      }
    },
  },
});
</script>

<style scoped>
.close-button {
  height: 2.5rem;
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

.button-box-box {
  display: flex;
  justify-content: center;
  background-color: #ebe2d5;
  border-radius: 100%;
}

.button-box-box:hover {
  border: 0rem solid white;
  border-width: 0.25rem;
  border-radius: 5rem;
  transition: border 0.1s ease-in-out 0s;
  outline: currentcolor none medium;
}

.format-box img {
  filter: brightness(0) saturate(100%) invert(23%) sepia(3%) saturate(4175%)
    hue-rotate(199deg) brightness(96%) contrast(87%);
}
</style>
