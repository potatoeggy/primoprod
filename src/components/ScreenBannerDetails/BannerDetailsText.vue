<script setup lang="ts">
import { ElementDatabase, ItemDatabase } from "@/state/Gacha";
import BannerStylisedText from "./BannerStylisedText.vue";
import { Banner, Item } from "@/types";

const props = defineProps<{ banner: Banner }>();
const isFeaturedBanner = props.banner.featuredDrops.length > 0;
const featured5Star = props.banner.featuredDrops
  .filter((item) => ItemDatabase[item].rarity === 5)
  .map((item) => ItemDatabase[item]);
const featured4Stars = props.banner.featuredDrops
  .filter((item) => ItemDatabase[item].rarity === 4)
  .map((item) => ItemDatabase[item]);

const getCharacterElementStyle = (character: Item) => {
  return {
    color: ElementDatabase[character.element]?.color,
  };
};
</script>

<template>
  <div class="container">
    <header>Wish Details</header>
    <p v-if="!isFeaturedBanner" class="permanent big-margin">Permanent</p>
    <p v-else class="permanent big-margin">Limited-Time Event</p>
    <div v-if="!isFeaturedBanner" class="text-reg">
      <p>
        Standard Wish "<banner-stylised-text :banner="banner">
        </banner-stylised-text
        >" is a standard wish with no time limit. Non-event-exclusive characters
        and weapons are available.
      </p>
      <p>
        In this wish, <span class="red">guaranteed</span> to win 4-star or above
        item at least once per 10 attempts.
      </p>
    </div>
    <div v-else class="text-reg">
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
          ><span v-if="index === featured4Stars.length - 1" style="color: black"
            >and </span
          >{{ char.description ? `"${char.description}"` : null }}
          {{ char.name }} ({{ char.element }})<span
            v-if="index !== featured4Stars.length - 1"
            style="color: black"
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
    <p class="text-reg">
      ※In most cases, the base probability of all characters and weapons is
      evenly distributed. If there is a boost or guarantee in effect, please
      refer to the corresponding rules.
    </p>
    <br />
    <p class="text-reg">〓Rules〓</p>
    <p v-if="!isFeaturedBanner" class="text-reg">
      Base probability of winning 5-star item =
      <span class="red">0.600%</span>; base probability of winning 5-star
      character = <span class="red">0.300%</span>, and base probability of
      winning winning 5-star weapon = <span class="red">0.300%</span>;
      consolidated probability (incl. guarantee) of winning 5-star item =
      <span class="red">1.600%</span>; guaranteed to win 5-star item at least
      once per <span class="red">90</span> attempts. Base probability of winning
      4-star item = <span class="red">5.100%</span>; base probability of winning
      4-star character = <span class="red">2.550%</span>, and base probability
      of winning 4-star weapon = <span class="red">2.550%</span>; consolidated
      probability (incl. guarantee) of winning 4-star item =
      <span class="red">13.000%</span>; guaranteed to win 4-star or above item
      at least once per <span class="red">10</span> attempts; probability of
      winning 4-star item through the guarantee =
      <span class="red">99.400%</span>, and probability of winning 5-star item
      through the guarantee = <span class="red">0.600%</span>.
    </p>
    <div v-else class="text-reg">
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
        <span class="red">13.000%</span>; guaranteed to win 4-star or above item
        at least once per <span class="red">10</span> attempts; probability of
        winning 4-star item through the guarantee =
        <span class="red">99.400%</span>, and probability of winning 5-star item
        through the guarantee = <span class="red">0.600%</span>.
      </p>
      <p>
        The first time you win a 4-star item in this event wish, there is a
        <span class="red">50.000%</span> chance it will be one of the featured
        characters
        <span
          v-for="(char, index) in featured4Stars"
          :key="index"
          :style="getCharacterElementStyle(char)"
          ><span v-if="index === featured4Stars.length - 1" style="color: black"
            >and </span
          >{{ char.description ? `"${char.description}"` : null }}
          {{ char.name }} ({{ char.element }})<span
            v-if="index !== featured4Stars.length - 1"
            style="color: black"
            >,
          </span></span
        >. If the first 4-star item you win in this event wish is not one of the
        featured characters, then the next 4-star item you win is
        <span class="red">guaranteed</span> to be a featured character.
      </p>
      <br />
    </div>
    <p class="text-reg">
      <span v-if="!isFeaturedBanner"
        >5-star weapons won in this wish come with
        <span class="gold">Masterless Starglitter</span> ×10; </span
      >4-star weapons <span v-if="isFeaturedBanner">won in this wish </span>come
      with <span class="gold">Masterless Starglitter</span> ×2; 3-star weapons
      <span v-if="isFeaturedBanner">won in this wish </span>come with
      <span class="purple">Masterless Stardust</span> ×15.
    </p>
    <br />
    <div class="text-reg">
      <p>〓Duplicate Characters〓</p>
      <p>
        On obtaining a 5-star character that you already own (whether obtained
        in a wish, redeemed at the shop, or awarded by the game): The 2nd – 7th
        time you obtain the character, it will be converted into
        <span class="purple"> that character's Stella Fortuna</span> ×1 and
        <span class="gold">Masterless Starglitter</span> ×10; from the 8th time
        onwards it will be converted into
        <span class="gold">Masterless Starglitter</span> ×25.
      </p>
      <p>
        On obtaining a 4-star character that you already own (whether obtained
        in a wish, redeemed at the shop, or awarded by the game): The 2nd – 7th
        time you obtain the character, it will be converted into
        <span class="purple"> that character's Stella Fortuna</span> ×1 and
        <span class="gold">Masterless Starglitter</span> ×2; from the 8th time
        onwards it will be converted into
        <span class="gold">Masterless Starglitter</span> ×5.
      </p>
      <div v-if="isFeaturedBanner">
        <br />
        <p>
          ※ This is a character event wish. The wish guarantee count for
          "Character Event Wish" and "Character Event Wish-2" is shared, and is
          accumulated between both "Character Event Wish" and "Character Event
          Wish-2". The wish guarantee count is independent of the guarantee
          counts of other types of wishes.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-reg {
  font-size: 1.2em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  line-height: 1.5em;
}
header {
  font-size: 1.5em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  text-align: left;
  overflow-x: hidden;
  overflow-y: scroll;
}

.permanent {
  color: #ebebeb;
  background-color: #6f778a;
  font-size: 1.25em;
  padding: 0.25em;
  padding-left: 1em;
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

.big-margin {
}
</style>
