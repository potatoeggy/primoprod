<script setup lang="ts">
import { Banner } from "@/types";
import { Ref, ref } from "vue";
import BookOverlay from "../overlays/BookOverlay.vue";
import BannerStylisedText from "./BannerStylisedText.vue";
import BannerDetailsDropRates from "./BannerDetailsDropRates.vue";
import BannerDetailsText from "./BannerDetailsText.vue";
import BannerDetailsItemList from "./BannerDetailsItemList.vue";

const props = defineProps<{ banner: Banner }>();
const emit = defineEmits<{ (e: "exit"): void }>();

const isStandardBanner = props.banner.featuredDrops.length === 0;
const navSelected: Ref<"items" | "details" | "drops"> = ref(
  isStandardBanner ? "details" : "items"
);
</script>

<template>
  <BookOverlay @exit="emit('exit')">
    <div class="content">
      <header class="header">
        <img class="logo" src="@/assets/images/ui-wish.png" />{{
          isStandardBanner ? "Standard" : "Event"
        }}
        Wish
        <BannerStylisedText :banner="banner" :quotes="true" />
      </header>
      <div class="navbar">
        <div
          v-if="!isStandardBanner"
          :class="[{ selected: navSelected === 'items' }]"
          @click="navSelected = 'items'"
        >
          Promotional Items
        </div>
        <div
          :class="[{ selected: navSelected === 'details' }]"
          @click="navSelected = 'details'"
        >
          Details
        </div>
        <div
          :class="[{ selected: navSelected === 'drops' }]"
          @click="navSelected = 'drops'"
        >
          List of Items
        </div>
      </div>
      <div class="loaded-content">
        <BannerDetailsDropRates
          v-show="navSelected === 'items'"
          :banner="banner"
        />
        <BannerDetailsText
          v-show="navSelected === 'details'"
          :banner="banner"
        />
        <BannerDetailsItemList
          v-show="navSelected === 'drops'"
          :banner="banner"
        />
      </div>
    </div>
  </BookOverlay>
</template>

<style scoped>
div.loaded-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* needed to prevent overflow for some inane reason */
  overflow-y: scroll;
  overflow-x: hidden;
}
div.content {
  color: #595252;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  text-align: left;
  font-size: 1.4em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.25em;
}

.header img.logo {
  display: inline;
  height: 1.25em;
}

.navbar {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;

  background: linear-gradient(
    to right,
    transparent,
    #e9dfd0 5%,
    #e9dfd0 95%,
    transparent
  );
}

.navbar > div {
  padding: 0.5em;
  flex-grow: 1;
  font-size: 1.1em;
}

.navbar > div:hover,
.navbar > div:active {
  color: white;
}

.navbar > div.selected {
  background: url("../../assets/images/ui-book-selector.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: white;
}
</style>
