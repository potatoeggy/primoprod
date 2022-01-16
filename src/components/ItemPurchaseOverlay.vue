<template>
  <audio ref="audioDescriptionOverlayExit" preload="true">
    <source src="@/assets/audio/description-exit.mp3" />
  </audio>
  <audio preload="true" autoplay>
    <source src="@/assets/audio/description-enter.mp3" />
  </audio>
  <item-description-overlay
    v-if="activeItemId"
    :item="activeItem"
    @exit="activeItemId = ''"
  ></item-description-overlay>
  <item-obtain-overlay
    v-if="purchasedItemId"
    :obtained-items="purchasedItem"
    @exit="active = false"
  ></item-obtain-overlay>

  <div
    :class="{ bg: true, 'zoom-fade-in': active, 'zoom-fade-out': !active }"
    id="item-purchase-overlay-bg"
    @click="exitOutsideCheck"
    @animationend="exit"
  >
    <div :class="{ 'main-box': true, 'zoom-in': active, 'zoom-out': !active }">
      <p class="header-text flex">Item to Exchange</p>
      <div class="detailed-box flex-column">
        <div
          class="item-description-box flex"
          :style="cssBox"
          @click.self="activeItemId = item.id"
        >
          <img
            class="item-img"
            :src="require(`@/assets/images/${item.id}.png`)"
            @click.self="activeItemId = item.id"
          />
          <div
            class="item-description-text flex-column text"
            @click.self="activeItemId = item.id"
          >
            <div
              class="flex item-header-text text"
              @click.self="activeItemId = item.id"
            >
              <p @click="activeItemId = item.id">{{ item.name }}</p>
              <gem-counter
                :text="shopItem.cost[0].quantity"
                :icon="`${shopItem.cost[0].id}.png`"
                :small="true"
                :red="insufficientFunds"
                @image-clicked="activeItemId = shopItem.cost[0].id"
              ></gem-counter>
            </div>
            <div class="flex star-box" @click="activeItemId = item.id">
              <img
                class="star-img"
                src="@/assets/images/star.svg"
                v-for="i in item.rarity"
                :key="i"
              />
            </div>
            <p @click="activeItemId = item.id">{{ item.description }}</p>
          </div>
        </div>
        <div
          class="quantity-adjuster-box flex-column"
          v-if="!insufficientFunds"
        >
          <p>Qty.</p>
          <p style="font-size: 1.75rem">{{ quantityToPurchase }}</p>
          <div class="quantity-adjuster-interactive flex">
            <div
              :class="['plus-minus', { disabled: quantityToPurchase === 1 }]"
              @click="setQuantityToPurchase(quantityToPurchase - 1)"
            >
              -
            </div>
            <p>1</p>
            <input
              type="range"
              v-model.number="quantityToPurchase"
              min="1"
              :max="numPurchasable"
            />
            <p>{{ numPurchasable }}</p>
            <div
              :class="[
                'plus-minus',
                { disabled: quantityToPurchase === numPurchasable },
              ]"
              @click="setQuantityToPurchase(quantityToPurchase + 1)"
            >
              +
            </div>
          </div>
        </div>
        <p v-if="insufficientFunds" style="color: red">Insufficient Funds</p>
      </div>
      <div class="cancel-confirm-box flex">
        <cancel-confirm-button
          text="Cancel"
          @pressed="active = false"
        ></cancel-confirm-button>
        <cancel-confirm-button
          text="Exchange"
          @pressed="purchase"
          :disabled="insufficientFunds"
        ></cancel-confirm-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ItemDatabase } from "@/state/Gacha";
import { Item, ItemStringQuantity, ShopItem } from "@/types";
import { defineComponent } from "vue";
import CancelConfirmButton from "./CancelConfirmButton.vue";
import ItemDescriptionOverlay from "./ItemDescriptionOverlay.vue";
import ItemObtainOverlay from "./ItemObtainOverlay.vue";
import GemCounter from "./GemCounter.vue";
import Inventory from "@/state/Inventory";

export default defineComponent({
  components: {
    CancelConfirmButton,
    ItemDescriptionOverlay,
    GemCounter,
    ItemObtainOverlay,
  },
  props: {
    shopItem: {
      type: Object as () => ShopItem,
      required: true,
    },
    inventory: {
      type: Object as () => Inventory,
      required: true,
    },
  },
  data() {
    return {
      active: true,
      activeItemId: "",
      quantityToPurchase: 1,
      purchasedItemId: "",
      bodyBoxBgColours: [
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
    cssBox(): { [name: string]: string } {
      return {
        "--body-bg-gradient-start": this.bodyBoxBgColours[this.item.rarity][0],
        "--body-bg-gradient-middle": this.bodyBoxBgColours[this.item.rarity][1],
        "--body-bg-gradient-end": this.bodyBoxBgColours[this.item.rarity][2],
      };
    },
    activeItem(): Item {
      return ItemDatabase[this.activeItemId];
    },
    purchasedItem(): ItemStringQuantity[] {
      return [{ id: this.purchasedItemId, quantity: this.quantityToPurchase }];
    },
    item(): Item {
      return ItemDatabase[this.shopItem.id];
    },
    numPurchasable(): number {
      let bank = -1;
      switch (this.shopItem.cost[0].id) {
        case "primogem":
          bank = this.inventory.primos;
          break;
        case "intertwined-fate":
          bank = this.inventory.fates;
          break;
        case "stardust":
          bank = this.inventory.stardust;
          break;
        case "starglitter":
          bank = this.inventory.starglitter;
          break;
      }
      return Math.floor(bank / this.shopItem.cost[0].quantity);
    },
    insufficientFunds(): boolean {
      return this.numPurchasable > 0 ? false : true;
    },
  },
  methods: {
    purchase() {
      this.inventory.addItems([
        { id: this.item.id, quantity: this.quantityToPurchase },
      ]);
      this.inventory.removeItems([
        {
          id: this.shopItem.cost[0].id,
          quantity: this.shopItem.cost[0].quantity * this.quantityToPurchase,
        },
      ]);
      this.purchasedItemId = this.item.id;
    },
    setQuantityToPurchase(quantity: number) {
      this.quantityToPurchase = Math.min(
        this.numPurchasable,
        Math.max(quantity, 1)
      );
    },
    exitOutsideCheck(e: Event) {
      if (e.target === document.getElementById("item-purchase-overlay-bg")) {
        (this.$refs.audioDescriptionOverlayExit as HTMLAudioElement).play();
        this.active = false;
      }
    },
    exit() {
      if (!this.active) {
        this.$emit("exit");
      }
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.item-description-text {
  gap: 0.25rem;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.item-header-text {
  font-size: 1.5rem;
  justify-content: space-between;
  align-items: center;
}
.star-box {
  gap: 0.2rem;
}
.star-img {
  width: 1rem;
}
.text {
  color: #ece5d8;
}

.header-text {
  color: #495366;
  font-size: 1.5rem;
}

.flex {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.detailed-box {
  width: 100%;
  gap: 1rem;
}

.item-description-box {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background: linear-gradient(
    to bottom right,
    var(--body-bg-gradient-start) 0%,
    var(--body-bg-gradient-middle) 50%,
    var(--body-bg-gradient-end) 100%
  );
  padding-left: 1rem;
  padding-right: 1rem;
  transition: filter 0.2s;
}

.item-description-box:active {
  /* TODO: do not illuminate gemcounter or trigger
   * when gemcounter is clicked
   */
  filter: brightness(80%);
}

.item-img {
  max-width: 10rem;
}

.quantity-adjuster-interactive {
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

input[type="range"] {
  width: 50%;
}

.plus-minus {
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  color: white;
  background-color: #4a5365;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
}

.disabled {
  opacity: 0.3;
}

.bg {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.main-box {
  --description-box-width: 40rem;
  --description-box-height: calc(0.6 * var(--description-box-width));
  color: #6b6c6e;
  background-color: #ebe5d9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: open-dialog 0.1s forwards;
  width: var(--description-box-width);
  height: var(--description-box-height);
  box-sizing: content-box;
  padding: 1rem;
  align-items: center;
  gap: 0.5rem;
}

/* ahahaha copy :( */
.zoom-fade-in {
  animation: desc-overlay-fadein 0.1s;
}

.zoom-fade-out {
  animation: desc-overlay-fadeout 0.1s;
}

@keyframes desc-overlay-fadein {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 1;
  }
}

@keyframes desc-overlay-fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.zoom-in {
  animation: desc-overlay-zoomin 0.1s;
}

.zoom-out {
  animation: desc-overlay-zoomout 0.1s;
}

@keyframes desc-overlay-zoomin {
  from {
    transform: scale(75%);
  }
  to {
    transform: scale(100%);
  }
}

@keyframes desc-overlay-zoomout {
  from {
    transform: scale(100%);
  }
  to {
    transform: scale(75%);
  }
}
</style>
