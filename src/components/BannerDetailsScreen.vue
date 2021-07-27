<template>
  <div class="details">
    <div class="header">
      <!-- back button on left that's it -->
    </div>
    <div class="body">
      <h1>
        <span v-if="isFeaturedBanner">Event Wish</span
        ><span v-else>Standard Wish</span> "{{ bannerName }}"
      </h1>
      <br />
      <br />
      <br />
      <div class="featured-characters" v-if="isFeaturedBanner">
        <div class="h2">Increased Drop Rates!</div>
      </div>
      <wish-details-h-2 text="Wish Details"></wish-details-h-2>
      <p v-if="!isFeaturedBanner" class="permanent big-margin">Permanent</p>
      <p v-if="!isFeaturedBanner">
        Standard Wish "{{ bannerName }}" is a standard wish with no time limit.
        Non-event-exclusive characters and weapons are available.
      </p>
      <p>
        In this wish, <span class="red">guaranteed</span> to win 4-star or above
        item at least once per 10 attempts.
      </p>
      <br />
      <p>
        In most cases, the base probability of all characters and weapons is
        evenly distributed. If there is a boost or guarantee in effect, please
        refer to the corresponding rules.
      </p>
      <br />
      <p>〓Rules〓</p>
      <p>
        Base probability of winning 5-star item =
        <span class="red">0.600%</span>; base probability of winning 5-star
        character = <span class="red">0.300%</span>, and base probability of
        winning winning 5-star weapon = <span class="red">0.300%</span>;
        consolidated probability (incl. guarantee) of winning 5-star item =
        <span class="red">1.600%</span>; guaranteed to win 5-star item at least
        once per <span class="red">90</span> attempts. Base probability of
        winning 4-star item = <span class="red">5.100%</span>; base probability
        of winning 4-star character = <span class="red">2.550%</span>, and base
        probability of winning 4-star weapon = <span class="red">2.550%</span>;
        consolidated probability (incl. guarantee) of winning 4-star item =
        <span class="red">13.000%</span>; guaranteed to win 4-star or above item
        at least once per <span class="red">10</span> attempts; probability of
        winning 4-star item through the guarantee =
        <span class="red">99.400%</span>, and probability of winning 5-star item
        through the guarantee = <span class="red">0.600%</span>.
      </p>
      <p>
        5-star weapons won in this wish come with
        <span class="gold">Masterless Starglitter</span> ×10; 4-star weapons
        come with <span class="gold">Masterless Starglitter</span> ×2; 3-star
        weapons come with <span class="purple">Masterless Stardust ×15</span>.
      </p>
      <br />
      <p>〓Duplicate Characters〓</p>
      <p>
        On obtaining a 5-star character that you already own (whether obtained
        in a wish, redeemed at the shop, or awarded by the game): The 2nd – 7th
        time you obtain the character, it will be converted into that
        character's Stella Fortuna ×1 and Masterless Starglitter ×10; from the
        8th time onwards it will be converted into Masterless Starglitter ×25.
      </p>
      <p>
        On obtaining a 4-star character that you already own (whether obtained
        in a wish, redeemed at the shop, or awarded by the game): The 2nd – 7th
        time you obtain the character, it will be converted into that
        character's <span class="purple">Stella Fortuna</span> ×1 and
        <span class="gold">Masterless Starglitter</span> ×2; from the 8th time
        onwards it will be converted into
        <span class="gold">Masterless Starglitter</span> ×5.
      </p>
      <br />
      <br />
      <p class="wish-header">Items to wish for:</p>
      <p class="five-star star-text big-margin">
        <span class="star-holder"
          ><span class="star-img" v-for="index in 5" :key="index"></span
        ></span>
        Base Probability for 5-Star Item Drops: 0.600% (Incl. guarantee: 1.600%)
      </p>
      <p class="four-star star-text big-margin">
        <span class="star-holder"
          ><span class="star-img" v-for="index in 4" :key="index"></span
        ></span>Base Probability for 4-Star Item Drops: 5.100% (Incl. guarantee:
        13.000%)
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WishDetailsH2 from "./WishDetailsH2.vue";
// TODO: pass json instead of text and then grab drops from there

export default defineComponent({
  components: { WishDetailsH2 },
  props: {
    bannerName: {
      type: String,
      required: true,
    },
    isFeaturedBanner: {
      type: Boolean,
      default: true,
    },
    featured5Star: {
      default: "",
    },
    featured4Stars: {
      default: () => [],
    },
  },
});
</script>

<style scoped>
.details {
  background-color: #ebebeb;
  padding: 2rem;
  padding-left: 6rem;
  padding-right: 6rem;
  overflow: auto;
}

.header {
  background-color: #111315;
}

* {
  font-family: Arial, sans-serif;
  text-align: left;
}

p {
  line-height: 2.25rem;
  font-size: 1.25rem;
}

.red {
  color: #c93c22;
}

.gold {
  color: #bd6029;
}

.purple {
  color: #a153e1;
}

h1 {
  background-color: #dbdbdb;
  font-weight: 600;
  padding: 0.25rem;
  padding-left: 0;
  color: #4d4d4d;
}

h1::before {
  content: "|||";
  font-size: 2.5rem;
  letter-spacing: -0.6rem;
  padding-right: 3rem;
}

.permanent {
  color: #ebebeb;
  background-color: #a38052;
  font-weight: bold;
}

.big-margin {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
}

.five-star {
  background-color: #dcbba5;
}

.four-star {
  background-color: #b6abbf;
}

.star-text {
  color: black;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
}

.wish-header {
  color: #a38052;
  font-size: 1.5rem;
}

.star-img {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.2rem;
  margin-bottom: -0.35rem;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAA+VBMVEVHcEz/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDP/zDOsGzbcAAAAUnRSTlMA4fbZavh0E5eZzMYEDILplnyBSDNWN3p/x2UN1hLBiEr5Ft6oWm2RtEcoNtAG6PcU2PCqCq286gesUCslsM7dgL3CiXI5itJG9WTf1EzcPDGxMv0FbwAAAMRJREFUGBl1wYV2wlAURcGDJkFK3d3d3WhL3bv//2OavAXNpTxmZEWr6iKAdfktw4r8MlCQ1waxJfksEhuTx0SBxLw65XH61W5ranBgEqc2O7x7Kqd4dFza285i7Jzkrm+vbpSji6yCMl71S0lneNxVlYjocKCmUf7p1Z/xOaw+GXmMoqwRjB5Z0xgLMir7WIFSF7Q5V+oeJ5zBCZX6IZYZktY2iZWVegPCQyUawEtVLV/w+aGmhxK8quX7Paoo9fj0rNgvL0VdL6uVnlgAAAAASUVORK5CYII=);
  background-size: 100%;
  background-repeat: no-repeat;
}

.star-holder {
  width: 10rem;
}

.wish-header::before {
  content: "";
  display: inline-block;
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.5rem;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAP1BMVEVHcEyjgFKkgFKjgFKjgFKiflGjf1KAgAChe0yjgFKigFCkgVGjgFGhf1KigFKigVKif1KigVGbgEmiflGjgFLp5kSyAAAAFHRSTlMA0RzQ/WV6AhtkZnvSetF50Xsce8af3VIAAABJSURBVAgdRcEJEoAgEASxFpBdvI/5/1stodCEyi9+48jHhsHobmmmsTNJaTYgTIuqZQp4iaqO4oCtSUrZaHYp01ncjE8p/Nx5PeguAvmODht+AAAAAElFTkSuQmCC);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style>
body {
  overflow: auto;
}
</style>
