<template>
  <div class="profile">
    <img
      class="element-bg"
      :src="elementBgs(`./bg-${character.element}.png`)"
    />
    <div class="card-info">
      <img
        class="char-icon"
        :src="icons(`./icon-${character.id}.png`)"
        :alt="`icon-${character.id}`"
      />
      <p>{{ character.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Item } from "@/types";

export default defineComponent({
  props: {
    character: {
      type: Object as () => Item,
      required: true,
    },
  },
  methods: {
    icons(path: string) {
      const i = require.context("@/assets/images/icons/", false, /\.png$/);
      try {
        return i(path);
      } catch (err) {
        return path;
      }
    },
    elementBgs(path: string) {
      const i = require.context("@/assets/images/details-bg/", false, /\.png$/);
      try {
        return i(path);
      } catch (err) {
        return i("./bg-Anemo.png"); // fallback
      }
    },
  },
});
</script>

<style scoped>
.element-bg {
  height: 6.25rem;
  padding-right: 3%;
}

.card-info {
  display: flex;
  flex-direction: row;
  position: absolute;
  align-items: center;
  left: 0;
  top: 0;
}

.char-icon {
  flex: 0 0 1rem;
  margin: 0.5rem;
  height: 5.25rem;
}

.profile {
  display: inline-block;
  position: relative;
}

p {
  font-family: Arial, sans-serif;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
