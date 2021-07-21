<template>
  <div id="overlay-fate-purchase" @click="clickOutside">
    <div id="dialog-fate-purchase">
      <div id="dialog-paimon-bargain">
        <p>Paimon's Bargains</p>
      </div>
      <div id="dialog-text">
        <p v-if="primoBalance >= primogemsNeeded">
          An additional
          <span class="fate-coloured">{{ fatesToPurchase }}</span> Intertwined
          Fate are needed.
        </p>
        <p v-if="primoBalance >= primogemsNeeded">
          Purchase with
          <span class="fate-coloured">{{ primogemsNeeded }}</span> Primogem?
        </p>
        <p v-else>Not enough Primogems or Fates!</p>
      </div>
      <div id="dialog-cancel-confirm">
        <cancel-confirm-button
          text="Cancel"
          v-on:pressed="$emit('cancel-wish')"
        ></cancel-confirm-button>
        <cancel-confirm-button
          text="Confirm"
          v-on:pressed="$emit('wish', fatesToPurchase)"
          v-if="primoBalance >= primogemsNeeded"
        ></cancel-confirm-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CancelConfirmButton from "./CancelConfirmButton.vue";

export default defineComponent({
  components: {
    CancelConfirmButton,
  },
  props: {
    fatesToPurchase: {
      type: Number,
      required: true,
    },
    primoBalance: {
      type: Number,
      required: true,
    },
  },
  computed: {
    primogemsNeeded(): number {
      return this.fatesToPurchase * 160;
    },
  },
  methods: {
    clickOutside(e: Event): void {
      if (e.target === document.getElementById("overlay-fate-purchase")) {
        this.$emit("cancel-wish");
      }
    }
  },
  emits: ["cancel-wish", "wish"],
});
</script>

<style scoped>
#overlay-fate-purchase {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  animation: fadein 0.1s forwards;
}

#dialog-fate-purchase {
  position: absolute;
  min-height: 50%;
  min-width: 50%;
  top: 50%;
  left: 50%;
  font-size: 2rem;
  color: #4a5365;
  padding: 1.5rem 3rem;
  background-color: rgb(228, 226, 220);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: open-dialog 0.1s forwards;
}

@keyframes open-dialog {
  from {
    transform: scale(0.95) translate(-50%, -50%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}

#dialog-fate-purchase > div > * {
  letter-spacing: -0.1rem;
}

#dialog-paimon-bargain {
  padding-bottom: 0.3rem;
  border-bottom: 0.2rem solid rgb(219, 211, 197);
}

#dialog-cancel-confirm {
  padding-top: 0.3rem;
  border-top: 0.2rem solid rgb(219, 211, 197);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.fate-coloured {
  color: #f49c00;
}
</style>
