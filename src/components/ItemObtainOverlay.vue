<template>
  <div id="item-obtain-overlay-bg" class="main" @click="exitOutsideCheck">
    <p class="obtained">Obtained</p>
    <div class="center-box">
      <p class="description">{{ description }}</p>
      <div id="item-obtain-overlay-items-box" class="items-box" v-dragscroll.x>
        <div class="box-for-one-item" v-for="(i, index) in items" :key="index">
          <div class="item-box-graphics">
            <div
              :class="[
                [0, 'gray', 'green', 'blue', 'purple', 'orange'][i.item.rarity],
                'item-pic-box',
              ]"
            >
              <img
                :src="require(`@/assets/images/${i.item.id}.png`)"
                class="icon-img"
              />
            </div>
            <div class="star-box">
              <template v-for="i in i.item.rarity" :key="i">
                <img class="star-img" src="@/assets/images/star.svg" />
              </template>
            </div>
            <p class="quantity-text">{{ i.quantity }}</p>
          </div>
          <p class="item-name">{{ i.item.name }}</p>
        </div>
      </div>
    </div>
    <p class="dim">Press anywhere in the blank area to continue</p>
  </div>
</template>

<script lang="ts">
import { Item, ItemDatabase } from "@/banners/Gacha";
import { defineComponent } from "vue";

export interface ItemStringQuantity {
  id: string;
  quantity: number;
}

export interface ItemQuantity {
  item: Item;
  quantity: number;
}

export default defineComponent({
  props: {
    obtainedItems: {
      type: Object as () => Array<ItemStringQuantity>,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  computed: {
    items(): Array<ItemQuantity> {
      return this.obtainedItems.map((i) => {
        return { item: ItemDatabase[i.id], quantity: i.quantity };
      });
    },
  },
  methods: {
    exitOutsideCheck(e: Event) {
      if (
        e.target !== document.getElementById("item-obtain-overlay-items-box")
      ) {
        this.$emit("exit");
      }
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.item-name {
  color: white;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.icon-img {
  width: 5rem;
  filter: drop-shadow(0px 1px 1px #666);
  transform: translateY(-0.25rem);
}

.box-for-one-item {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 5rem;
  height: 6rem; /* count on the browser to not shift the whole thing up or down based on text length */
}

.item-box-graphics {
  /* observations indicate height is 1.2x width */
  height: 6rem;
  width: 100%;
  background-color: #e6e1da;
  border-radius: 0.2rem;
  box-shadow: 0 0 0.125rem 0.125rem #555;
  font-size: 0.8rem;
  position: relative;
}

.star-box {
  position: absolute;
  top: 70%;
  width: 100%;
}

.star-img {
  width: 0.75rem;
  filter: drop-shadow(0px 1px 1px #666);
}

.quantity-text {
  margin-top: 0.1rem;
}

.item-pic-box {
  height: 80%;
  border-radius: inherit;
  border-bottom-right-radius: 1.25rem;
}

.items-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  max-width: 80%;
  height: calc(6rem + 3rem);
  padding-top: 1rem;
  overflow: hidden;
}

.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  border-top: 0.25rem solid #d4c38f44;
  border-bottom: 0.25rem solid #d4c38f44;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.main {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 99;
  /* once a certain screen size is hit change to align-items center I guess */
}

.main::before {
  content: "";
  background: url("../assets/images/wish-reveal-background.jpg") center/cover
      no-repeat fixed,
    white;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  opacity: 0.98;
  position: absolute;
}

.dim {
  color: #9a9994;
}

.obtained {
  color: #d4c38f;
  font-size: 1.5rem;
}

.description {
  color: white;
  font-size: 1.1rem;
}

.orange {
  background-color: #b27730;
}

.purple {
  background-color: #b6abbf;
}

.blue {
  background-color: #a5bacc;
}

.green {
  background-color: #53756a;
}

.gray {
  background-color: #505863;
}
</style>
