<script setup lang="ts">
import { Banner } from "@/types";
import BannerDetailsDropTable from "./BannerDetailsDropTable.vue";

defineProps<{ banner: Banner }>();
</script>

<template>
  <div>
    <p style="text-align: left; padding-top: 0.25em; font-size: 1.25em">
      Items to wish for:
    </p>
    <p class="five-star star-text">
      <span class="star-holder"
        ><span v-for="index in 5" :key="index" class="star-img"></span
      ></span>
      Base Probability for 5-Star Item Drops: 0.600% (Incl. guarantee: 1.600%)
    </p>
    <BannerDetailsDropTable :banner="banner" :rarity="5" />

    <p class="four-star star-text">
      <span class="star-holder"
        ><span v-for="index in 4" :key="index" class="star-img"></span
      ></span>
      Base Probability for 4-Star Item Drops: 5.100% (Incl. guarantee: 13.000%)
    </p>
    <BannerDetailsDropTable :banner="banner" :rarity="4" />

    <p class="three-star star-text">
      <span class="star-holder"
        ><span v-for="index in 3" :key="index" class="star-img"></span
      ></span>
      Base Probability for 3-Star Item Drops: 94.300% (Incl. guarantee: 85.400%)
    </p>
    <BannerDetailsDropTable :banner="banner" :rarity="3" />
  </div>
</template>

<style scoped>
.five-star {
  background-color: #cfb383;
}

.four-star {
  background-color: #b5a8c9;
}

.three-star {
  background-color: #a8bdc9;
}

.star-text {
  color: white;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  margin-top: 1.5em;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
}

.star-holder {
  width: 7.5em;
  margin-left: 1.75em;
  display: flex;
  align-items: center;
}

.star-img {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-left: 0.2em;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAA+VBMVEVHcEz/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDOsGzbcAAAAUnRSTlMA4fbZavh0E5eZzMYEDILplnyBSDNWN3p/x2UN1hLBiEr5Ft6oWm2RtEcoNtAG6PcU2PCqCq286gesUCslsM7dgL3CiXI5itJG9WTf1EzcPDGxMv0FbwAAAMRJREFUGBl1wYV2wlAURcGDJkFK3d3d3WhL3bv//2OavAXNpTxmZEWr6iKAdfktw4r8MlCQ1waxJfksEhuTx0SBxLw65XH61W5ranBgEqc2O7x7Kqd4dFza285i7Jzkrm+vbpSji6yCMl71S0lneNxVlYjocKCmUf7p1Z/xOaw+GXmMoqwRjB5Z0xgLMir7WIFSF7Q5V+oeJ5zBCZX6IZYZktY2iZWVegPCQyUawEtVLV/w+aGmhxK8quX7Paoo9fj0rNgvL0VdL6uVnlgAAAAASUVORK5CYII=);
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
