<template>
  <button type="button" class="plus-button"><p>+</p></button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>

<style scoped>
.plus-button {
  display: relative;
  font-family: Genshin, Arial, Helvetica, sans-serif;
  border: none;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background-color: #ece5d8;
  font-size: 22pt;
  text-align: center;
  transition: 0.1s;
  outline: none;
}

.plus-button:active {
  opacity: 0.3;
}

.plus-button > p {
  margin-top: -2px;
}
</style>
