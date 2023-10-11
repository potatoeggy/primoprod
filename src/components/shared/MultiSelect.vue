<script setup lang="ts">
import { reactive, ref, watch } from "vue";

interface SelectElement {
  id: string;
  label: string;
}
const props = defineProps<{
  options: SelectElement[];
  selected: string[];
}>();
const emit = defineEmits(["updateSelected"]);

const isOpen = ref(false);

const selectedMap = reactive({
  ...Object.fromEntries(props.options.map(({ id }) => [id, false])),
  ...Object.fromEntries(props.selected.map((id) => [id, true])),
});

watch(selectedMap, (newVal) => {
  console.log("CHANGE DETECTED");
  const selected = Object.entries(newVal)
    .filter(([, val]) => val)
    .map(([key]) => key);
  selected.sort((a, b) => {
    const aIndex = props.selected.indexOf(a);
    const bIndex = props.selected.indexOf(b);

    const aRealIndex = aIndex === -1 ? Infinity : aIndex;
    const bRealIndex = bIndex === -1 ? Infinity : bIndex;
    return aRealIndex - bRealIndex;
  });
  emit("updateSelected", selected);
});
</script>

<template>
  <div class="dropdown-menu">
    <section v-for="el in selected" :key="el">
      <p>{{ options.find(({ id }) => id === el)?.label ?? "MissingNo" }}</p>
      <input v-model="selectedMap[el]" type="checkbox" />
    </section>
    <template v-for="el in options" :key="el.id">
      <section v-if="!selected.includes(el.id)">
        <p>{{ el.label }}</p>
        <input v-model="selectedMap[el.id]" type="checkbox" />
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dropdown-menu {
  background: white;
  width: 100%;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  border: 0.2rem solid darkgray;
  max-height: 23rem;
  overflow: scroll;
}

.dropdown-menu * {
  box-sizing: border-box;
}

.dropdown-menu section:nth-child(even) {
  background: #ebebeb;
}

.dropdown-menu section {
  width: 100%;
  padding: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  color: #666;
}

input {
  width: 1.5rem;
  height: 2.5rem;
}
</style>
