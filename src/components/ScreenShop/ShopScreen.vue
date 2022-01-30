<template>
  <item-purchase-overlay
    :shopItem="activePurchase"
    :inventory="inventory"
    v-if="activePurchase"
    @exit="activePurchase = null"
  ></item-purchase-overlay>
  <item-description-overlay
    :item="descriptionItem"
    v-if="descriptionItem"
    @exit="descriptionItemId = ''"
  ></item-description-overlay>

  <div class="main">
    <div class="header">
      <close-button @clicked="exit"></close-button>
      <div style="margin-right: 3rem">
        <gem-counter
          icon="primogem.webp"
          :text="inventory.primos"
          plusSign
          outline
          nobackground
          @click="descriptionItemId = 'primogem'"
        >
        </gem-counter>
      </div>
      <gem-counter
        icon="starglitter.webp"
        :text="inventory.starglitter"
        outline
        nobackground
        @click="descriptionItemId = 'starglitter'"
      >
      </gem-counter>
      <gem-counter
        icon="stardust.webp"
        :text="inventory.stardust"
        outline
        nobackground
        @click="descriptionItemId = 'stardust'"
      ></gem-counter>
    </div>
    <div class="shop-body">
      <div v-for="(item, index) of shopList" :key="index">
        <div
          :style="cssColours(ItemDatabase[item.id])"
          class="shop-item-holder"
          @click="activePurchase = item"
        >
          <img
            :src="require(`@/assets/images/${item.id}.webp`)"
            class="item-img"
          />
          <p class="item-label">{{ ItemDatabase[item.id].name }}</p>
          <div class="item-price-holder">
            <img
              class="cost-item-img"
              :src="require(`@/assets/images/${item.cost[0].id}.webp`)"
            />
            <p class="item-price-text">{{ item.cost[0].quantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Inventory from "@/state/Inventory";
import { defineComponent } from "vue";
import GemCounter from "../shared/GemCounter.vue";
import CloseButton from "../shared/CloseButton.vue";
import ItemPurchaseOverlay from "@/components/overlays/ItemPurchaseOverlay.vue";
import ItemDescriptionOverlay from "@/components/overlays/ItemDescriptionOverlay.vue";
import { ItemDatabase } from "@/state/Gacha";
import { Item, ShopItem } from "@/types";
import RootShopItemList from "@/data/shop.json";

export default defineComponent({
  components: {
    GemCounter,
    CloseButton,
    ItemPurchaseOverlay,
    ItemDescriptionOverlay,
  },
  props: {
    inventory: {
      type: Inventory,
      required: true,
    },
  },
  data() {
    return {
      activePurchase: null as ShopItem | null,
      descriptionItemId: "",
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
    descriptionItem(): Item {
      return ItemDatabase[this.descriptionItemId];
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
  padding-right: 5rem;
  box-sizing: border-box;
}

.shop-body {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
  overflow: auto;
  padding: 3rem;
}

.shop-item-holder {
  --shop-item-width: 17.5rem;
  width: var(--shop-item-width);
  height: calc(var(--shop-item-width) * 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    to bottom,
    var(--body-bg-gradient-start) 0%,
    var(--body-bg-gradient-middle) 0%,
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
  background-color: #616c87;
  width: 100%;
  padding: 0.1rem;
  gap: 0.25rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.item-price-text {
  color: white;
  font-size: 1.25rem;
  padding-left: 0.1rem;
}

.item-img {
  --image-size: 80%;
  height: var(--image-size);
  width: var(--image-size);
}

.cost-item-img {
  --image-size: 2rem;
  height: var(--image-size);
  width: var(--image-size);
}

.item-label {
  color: white;
  font-size: 1.5rem;
  transform: translateY(-1rem);
}

/* TODO: re-use css via components this is super inefficient
 * right now since it's copied from QuestScreen
 */
.main {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
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
