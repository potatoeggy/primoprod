<template>
  <div class="header" @keyup.esc="exit">
    <img
      src="@/assets/images/exit-browser.png"
      class="exit-button"
      @click="exit"
    />
  </div>
  <div class="details" @keyup.esc="exit">
    <div class="body">
      <h1>
        <span v-if="isFeaturedBanner">Event Wish</span
        ><span v-else>Standard Wish</span> "<banner-stylised-text
          :banner="banner"
        >
        </banner-stylised-text
        >"
      </h1>
      <br />
      <br />
      <br />
      <div class="featured-characters" v-if="isFeaturedBanner">
        <wish-details-h-2 text="Increased Drop Rates!"></wish-details-h-2>
        <p class="five-star star-text big-margin">
          <span class="star-holder"
            ><span class="star-img" v-for="index in 5" :key="index"></span
          ></span>
          Percentage of 5-Star Item Drops: 50.000%
        </p>
        <div class="grid">
          <banner-details-character-profile
            v-for="(char, index) in featured5Star"
            :character="char"
            :key="index"
          ></banner-details-character-profile>
        </div>
        <p class="four-star star-text big-margin">
          <span class="star-holder"
            ><span class="star-img" v-for="index in 4" :key="index"></span
          ></span>
          Percentage of 4-Star Item Drops: 50.000%
        </p>
        <div class="grid">
          <banner-details-character-profile
            v-for="(char, index) in featured4Stars"
            :character="char"
            :key="index"
          ></banner-details-character-profile>
        </div>
        <br />
      </div>
      <wish-details-h-2 text="Wish Details"></wish-details-h-2>
      <p v-if="!isFeaturedBanner" class="permanent big-margin">Permanent</p>
      <p v-else class="permanent big-margin">Limited-Time Event</p>
      <div v-if="!isFeaturedBanner">
        <p>
          Standard Wish "<banner-stylised-text :banner="banner">
          </banner-stylised-text
          >" is a standard wish with no time limit. Non-event-exclusive
          characters and weapons are available.
        </p>
        <p>
          In this wish, <span class="red">guaranteed</span> to win 4-star or
          above item at least once per 10 attempts.
        </p>
      </div>
      <div v-else>
        <p>
          Event Wish "<banner-stylised-text :banner="banner">
          </banner-stylised-text
          >" is now available. During this event wish, the
          <span class="red">event-exclusive</span> 5-star character
          <span :style="getCharacterElementStyle(featured5Star[0])">
            {{
              featured5Star[0].description
                ? `"${featured5Star[0].description}"`
                : null
            }}
            {{ featured5Star[0].name }} ({{ featured5Star[0].element }})
          </span>
          as well as 4-star characters
          <span
            v-for="(char, index) in featured4Stars"
            :key="index"
            :style="getCharacterElementStyle(char)"
            ><span
              style="color: black"
              v-if="index === featured4Stars.length - 1"
              >and </span
            >{{ char.description ? `"${char.description}"` : null }}
            {{ char.name }} ({{ char.element }})<span
              style="color: black"
              v-if="index !== featured4Stars.length - 1"
              >,
            </span></span
          >
          will receive a <span class="red">huge drop-rate boost</span>!
        </p>
        <p class="red">
          ※ Of the above characters, the event-exclusive character will not be
          available in the standard wish "Wanderlust Invocation."
        </p>
      </div>
      <br />
      <p>
        ※In most cases, the base probability of all characters and weapons is
        evenly distributed. If there is a boost or guarantee in effect, please
        refer to the corresponding rules.
      </p>
      <br />
      <p>〓Rules〓</p>
      <p v-if="!isFeaturedBanner">
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
      <div v-else>
        <p>5-Star Items</p>
        <p>
          For Event Wish "<banner-stylised-text :banner="banner">
          </banner-stylised-text
          >": Base probability of winning 5-star character =
          <span class="red">0.600%</span>; consolidated probability (incl.
          guarantee) = <span class="red">1.600%</span>; guaranteed to win 5-star
          character at least once per <span class="red">90</span> attempts.
        </p>
        <p>
          The first time you win a 5-star item in this event wish, there is a
          <span class="red">50.000%</span> chance it will be the promotional
          character
          <span :style="getCharacterElementStyle(featured5Star[0])">
            {{
              featured5Star[0].description
                ? `"${featured5Star[0].description}"`
                : null
            }}
            {{ featured5Star[0].name }} ({{ featured5Star[0].element }})</span
          >. If the first 5-star character you win in this event wish is not the
          promotional character, then the next 5-star character you win is
          <span class="red">guaranteed</span> to be the promotional character.
        </p>
        <p>4-Star Items</p>
        <p>
          For Event Wish "<banner-stylised-text :banner="banner">
          </banner-stylised-text
          >": Base probability of winning 4-star item =
          <span class="red">5.100%</span>; base probability of winning 4-star
          character = <span class="red">2.550%</span>, and base probability of
          winning 4-star weapon = <span class="red">2.500%</span>; consolidated
          probability (incl. guarantee) of winning 4-star item =
          <span class="red">13.000%</span>; guaranteed to win 4-star or above
          item at least once per <span class="red">10</span> attempts;
          probability of winning 4-star item through the guarantee =
          <span class="red">99.400%</span>, and probability of winning 5-star
          item through the guarantee = <span class="red">0.600%</span>.
        </p>
        <p>
          The first time you win a 4-star item in this event wish, there is a
          <span class="red">50.000%</span> chance it will be one of the featured
          characters
          <span
            v-for="(char, index) in featured4Stars"
            :key="index"
            :style="getCharacterElementStyle(char)"
            ><span
              style="color: black"
              v-if="index === featured4Stars.length - 1"
              >and </span
            >{{ char.description ? `"${char.description}"` : null }}
            {{ char.name }} ({{ char.element }})<span
              style="color: black"
              v-if="index !== featured4Stars.length - 1"
              >,
            </span></span
          >. If the first 4-star item you win in this event wish is not one of
          the featured characters, then the next 4-star item you win is
          <span class="red">guaranteed</span> to be a featured character.
        </p>
        <br />
      </div>
      <p>
        <span v-if="!isFeaturedBanner"
          >5-star weapons won in this wish come with
          <span class="gold">Masterless Starglitter</span> ×10; </span
        >4-star weapons
        <span v-if="isFeaturedBanner">won in this wish </span>come with
        <span class="gold">Masterless Starglitter</span> ×2; 3-star weapons
        <span v-if="isFeaturedBanner">won in this wish </span>come with
        <span class="purple">Masterless Stardust</span> ×15.
      </p>
      <br />
      <p>〓Duplicate Characters〓</p>
      <p>
        On obtaining a 5-star character that you already own (whether obtained
        in a wish, redeemed at the shop, or awarded by the game): The 2nd – 7th
        time you obtain the character, it will be converted into that
        character's <span class="purple">Stella Fortuna</span> ×1 and
        <span class="gold">Masterless Starglitter</span> ×10; from the 8th time
        onwards it will be converted into
        <span class="gold">Masterless Starglitter</span> ×25.
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
      <div v-if="isFeaturedBanner">
        <br />
        <p>
          ※ This is a character event wish. The wish guarantee count is
          accumulated within character event wishes only and is independent of
          the guarantee counts of other types of wishes.
        </p>
      </div>
      <br />
      <br />
      <p class="wish-header">Items to wish for:</p>
      <p class="five-star star-text big-margin">
        <span class="star-holder"
          ><span class="star-img" v-for="index in 5" :key="index"></span
        ></span>
        Base Probability for 5-Star Item Drops: 0.600% (Incl. guarantee: 1.600%)
      </p>
      <!-- too lazy to use flex -->
      <br />
      <banner-details-drop-table
        :banner="banner"
        :rarity="5"
      ></banner-details-drop-table>
      <br />
      <p class="four-star star-text big-margin">
        <span class="star-holder"
          ><span class="star-img" v-for="index in 4" :key="index"></span
        ></span>
        Base Probability for 4-Star Item Drops: 5.100% (Incl. guarantee:
        13.000%)
      </p>
      <br />
      <banner-details-drop-table
        :banner="banner"
        :rarity="4"
      ></banner-details-drop-table>
      <br />
      <p class="three-star star-text big-margin">
        <span class="star-holder"
          ><span class="star-img" v-for="index in 3" :key="index"></span
        ></span>
        Base Probability for 3-Star Item Drops: 94.300% (Incl. guarantee:
        85.400%)
      </p>
      <br />
      <banner-details-drop-table
        :banner="banner"
        :rarity="3"
      ></banner-details-drop-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WishDetailsH2 from "./WishDetailsH2.vue";
import BannerDetailsDropTable from "./BannerDetailsDropTable.vue";
import { Banner, Item, ItemDatabase, ElementDatabase } from "@/banners/Gacha";
import BannerDetailsCharacterProfile from "./BannerDetailsCharacterProfile.vue";
import BannerStylisedText from "./BannerStylisedText.vue";

export default defineComponent({
  components: {
    WishDetailsH2,
    BannerDetailsDropTable,
    BannerDetailsCharacterProfile,
    BannerStylisedText,
  },
  props: {
    banner: {
      type: Object as () => Banner,
      required: true,
    },
  },
  data() {
    return {
      isFeaturedBanner: this.banner.featuredDrops.length > 0,
      featured5Star: this.banner.featuredDrops
        .filter((item) => ItemDatabase[item].rarity === 5)
        .map((item) => ItemDatabase[item]),
      featured4Stars: this.banner.featuredDrops
        .filter((item) => ItemDatabase[item].rarity === 4)
        .map((item) => ItemDatabase[item]),
    };
  },
  methods: {
    exit() {
      this.$emit("exit");
    },
    getCharacterElementStyle(character: Item) {
      return {
        color: ElementDatabase[character.element].color,
      };
    },
  },
  emits: ["exit"],
});
</script>

<style scoped>
.grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.exit-button {
  width: 1.5rem;
  height: 1.5rem;
  margin: auto;
  margin-left: 1rem;
  filter: brightness(30%);
}

.exit-button:hover,
.exit-button:active {
  filter: brightness(100%);
}

.details {
  background-color: #ebebeb;
  padding: 2rem;
  padding-left: 10%;
  padding-right: 10%;
  /* viewport - header + padding*2 so that the page doesn't
     extend to the bottom cutting off content */
  height: calc(100% - 7rem);
  overflow: auto;
}

.header {
  background-color: #111315;
  height: 3rem;
  display: flex;
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
  content: "|||||";
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

.three-star {
  background-color: #a5bacc;
}

.star-text {
  color: #545758;
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
