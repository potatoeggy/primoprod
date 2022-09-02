<script setup lang="ts">
import { computed } from "vue";
import { ItemDatabase } from "@/state/Gacha";

const props = defineProps<{
  centerItemId: string;
  sideItemIds: string[];
  accentColor: string;
}>();

const centerItem = computed(() => ItemDatabase[props.centerItemId]);
const centerImageStyle = computed(
  () => `url(../../assets/images/drops/${centerItem.value.id}.webp)`
);
const sideItems = computed(() => props.sideItemIds.map((i) => ItemDatabase[i]));
</script>

<template>
  <div class="box" :style="centerImageStyle">
    <div class="detail-box">
      <div class="banner-text">Character Event Wish</div>
      <h1 class="title-text">Everbloom Violet</h1>
      <div class="description-box">
        <h3>Probability increased!</h3>
        <div class="wish-guarantee-box">
          <p>
            Every 10 wishes is guaranteed to include at least one 4-star or
            higher item.
          </p>
        </div>
        <p class="fluff-box">
          5-star event-exclusive characters can only be obtained in the
          specified wish during the specified time period(s). View Details for
          more.
        </p>
      </div>
      <div class="time-box">
        <p>
          Time Remaining <br />
          20 day(s) 18 hour(s) 49 minute(s)
        </p>
      </div>
    </div>
    <div class="image-holder">
      <img src="@/assets/images/drops/diona.webp" />
      <img src="@/assets/images/drops/fischl.webp" />
      <img src="@/assets/images/drops/thoma.webp" />
    </div>
  </div>
</template>

<style scoped>
.image-holder img {
  width: 40rem;
}
* {
  --accent-color: #7f64d1;
  --accent-color-trans: #7f64d1bb;
  --bg-color: #f3f1ef;
  --bg-color-bottom: #e8e0da;
}

.wish-guarantee-box {
  background-color: var(--accent-color-trans);
  padding: 0.25em;
  padding-left: 1.5em;
  color: white;
  font-size: 1.4em;
  line-height: 1.2em;
  letter-spacing: -0.02em;
}

.description-box {
  border: 1px dashed lightgray;
  border-left: none;
  border-right: none;
  margin-top: 1em;
  line-height: 1.1em;
}

.detail-box p,
.detail-box h3 {
  text-shadow: -0.05em -0.05em 0 var(--bg-color),
    0.05em -0.05em 0 var(--bg-color), -0.05em 0.05em 0 var(--bg-color),
    0.05em 0.05em 0 var(--bg-color);
}

.detail-box h3 {
  color: #4a4846;
  font-size: 1.8em;
  letter-spacing: -0.045em;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.wish-guarantee-box p {
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  text-shadow: none;
}

.fluff-box {
  margin-top: 1em;
  font-size: 1.45em;
  line-height: 1.3em;
  letter-spacing: -0.03em;
  padding-bottom: 0.25em;
}

.time-box {
  font-size: 1.45em;
  line-height: 1.7em;
  padding-top: 0.5em;
}

.banner-text {
  position: relative;
  left: -2.5em;
  top: -0.3em;
  width: 70%;
  height: 1.7em;
  background-color: var(--accent-color);
  border-radius: 1em;
  border-top-right-radius: 0;
  border-bottom-right-radius: 1.75em;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 500;
  font-size: 1.4em;
}

.detail-box {
  height: 100%;
  width: 33%;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: left;
  background: linear-gradient(to right, var(--bg-color), transparent);
}

.title-text {
  font-size: 3.5em;
  line-height: 1.3em;
  letter-spacing: -0.03em;
  color: #4a4846;
  text-shadow: -0.03em -0.03em 0 var(--bg-color),
    0.03em -0.03em 0 var(--bg-color), -0.03em 0.03em 0 var(--bg-color),
    0.03em 0.03em 0 var(--bg-color);
  margin: 0;
  margin-top: -0.5rem;
}

.detail-box {
  padding-left: 3em;
}

.box {
  margin: 1rem;
  height: 42rem;
  aspect-ratio: 680 / 350;
  border-radius: 0.5em;
  display: flex;
  background: v-bind(centerImageStyle) no-repeat,
    linear-gradient(to bottom, var(--bg-color), var(--bg-color-bottom));
  background-size: 175%;
  background-position: left calc(50% + 10%) top calc(50% + -17%);
}
</style>
