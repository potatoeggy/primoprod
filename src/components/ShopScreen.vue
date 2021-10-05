<template>
  <item-purchase-overlay
    :item="activeItem"
    v-if="activeItem"
    @exit="activeItemId = ''"
  ></item-purchase-overlay>
  <!-- should not be itemdescription should be a new one
       that lets you buy things -->
  <div class="main">
    <div class="header">
      <close-button @clicked="exit"></close-button>
      <div style="margin-right: 3rem">
        <gem-counter
          icon="primogem.png"
          :text="inventory.primos"
          plusSign
          outline
          nobackground
        >
        </gem-counter>
      </div>
      <gem-counter
        icon="starglitter.png"
        :text="inventory.starglitter"
        outline
        nobackground
      >
      </gem-counter>
      <gem-counter
        icon="stardust.png"
        :text="inventory.stardust"
        outline
        nobackground
      ></gem-counter>
    </div>
    <div class="shop-body">
      <div v-for="(item, index) of shopList" :key="index">
        <div
          :style="cssColours(ItemDatabase[item.id])"
          class="shop-item-holder"
          @click="activeItemId = item.id"
        >
          <img
            :src="require(`@/assets/images/${item.id}.png`)"
            class="item-img"
          />
          <p class="item-label">{{ ItemDatabase[item.id].name }}</p>
          <div class="item-price-holder">
            <img
              class="cost-item-img"
              :src="require(`@/assets/images/${item.cost[0].id}.png`)"
            />
            <p class="item-price-text">{{ item.cost[0].quantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/banners/Inventory";
import { defineComponent } from "vue";
import GemCounter from "./GemCounter.vue";
import CloseButton from "./CloseButton.vue";
import ItemPurchaseOverlay from "./ItemPurchaseOverlay.vue";
import { Item, ItemDatabase, ItemStringQuantity } from "@/banners/Gacha";
import RootShopItemList from "@/banners/shop.json";

// import a shop json that shows shop quantities

export interface ShopItem {
  id: string;
  quantity: number;
  cost: ItemStringQuantity[];
}

export default defineComponent({
  components: { GemCounter, CloseButton, ItemPurchaseOverlay },
  props: {
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  data() {
    return {
      activeItemId: "",
      shopList: RootShopItemList as ShopItem[],
      ItemDatabase: ItemDatabase,
      bodyBoxBgColours: [
        // copied from ItemDescriptionOverlay
        [],
        ["#505865", "#545a66", "#828e99"],
        ["#46565c", "#485d60", "#659973"],
        ["#525376", "#4e5d7c", "#489fb3"],
        ["#595482", "#716196", "#b684c8"],
        ["#695352", "#99694e", "#e3ad52"],
      ],
    };
  },
  computed: {
    activeItem(): Item {
      return ItemDatabase[this.activeItemId];
    },
  },
  methods: {
    exit() {
      // TODO: exit animation
      this.$emit("exit");
    },
    cssColours(item: Item): { [name: string]: string } {
      return {
        "--body-bg-gradient-start": this.bodyBoxBgColours[item.rarity][0],
        "--body-bg-gradient-middle": this.bodyBoxBgColours[item.rarity][1],
        "--body-bg-gradient-end": this.bodyBoxBgColours[item.rarity][2],
      };
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  margin-right: 3rem;
}

.shop-body {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
  overflow: auto;
  padding: 3rem;
}

.shop-item-holder {
  --shop-item-width: 15rem;
  width: var(--shop-item-width);
  height: var(--shop-item-width);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    to bottom right,
    var(--body-bg-gradient-start) 0%,
    var(--body-bg-gradient-middle) 15%,
    var(--body-bg-gradient-end) 100%
  );
  transition: border 0.1s;
}

.shop-item-holder:hover {
  border: 0.3rem yellow solid;
}

.shop-item-holder:active {
  filter: brightness(90%);
}

.item-price-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: darkcyan;
  width: 100%;
  padding: 0.1rem;
  gap: 0.25rem;
}

.item-price-text {
  color: white;
  font-size: 1rem;
}

.item-img {
  --image-size: 80%;
  height: var(--image-size);
  width: var(--image-size);
}

.cost-item-img {
  --image-size: 1.75rem;
  height: var(--image-size);
  width: var(--image-size);
}

.item-label {
  color: white;
  font-size: 1.25rem;
  transform: translateY(-1rem);
}

/* TODO: re-use css via components this is super inefficient
 * right now since it's copied from QuestScreen
 */
.main {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  animation: main-entry 0.1s ease-in 0s forwards;
  padding: 1rem;
  animation: main-entry 0.5s forwards;
}

* {
  box-sizing: border-box;
}

.exit-main {
  animation: main-exit 0.1s ease-in 0s reverse forwards;
}

.header {
  animation: header-entry 0.2s forwards;
}

@keyframes header-entry {
  from {
    transform: translateY(-1rem);
  }
  to {
    transform: none;
  }
}

@keyframes main-entry {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #2c3047, transparent);
    backdrop-filter: blur(1.5rem);
  }
}

@keyframes main-exit {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #2c3047, transparent);
    backdrop-filter: blur(1rem);
  }
}
</style>
