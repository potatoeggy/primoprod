<script setup lang="ts">
import { ElementDatabase, ItemDatabase } from "@/state/Gacha";
import { Banner, Item } from "@/types";
import CharacterProfile from "./CharacterProfile.vue";
import { computed } from "vue";

const props = defineProps<{ banner: Banner }>();

const featured5Stars = computed(() =>
  props.banner.featuredDrops
    .filter((c) => ItemDatabase[c].rarity === 5)
    .map((c) => ItemDatabase[c])
);

const featured4Stars = computed(() =>
  props.banner.featuredDrops
    .filter((c) => ItemDatabase[c].rarity === 4)
    .map((c) => ItemDatabase[c])
);

const getCharacterElementStyle = (character: Item) => {
  return {
    color: ElementDatabase[character.element]?.color,
  };
};
</script>

<template>
  <div class="container">
    <p>Increased Drop Rates!</p>
    <div class="flex">
      <div class="grow">
        <p class="five-star star-text">
          <span class="star-holder"
            ><span v-for="index in 5" :key="index" class="star-img"></span
          ></span>
          Percentage of 5-Star Item Drops: 50.000%
        </p>
        <div class="character-profile">
          <div>
            <p
              v-for="(c, i) in featured5Stars"
              :key="i"
              :style="getCharacterElementStyle(c)"
            >
              {{ c.name }}
            </p>
          </div>
          <div>
            <CharacterProfile
              v-for="(c, i) in featured5Stars"
              :key="i"
              :character="c"
            />
          </div>
        </div>
      </div>

      <div class="grow">
        <p class="four-star star-text">
          <span class="star-holder"
            ><span v-for="index in 4" :key="index" class="star-img"></span
          ></span>
          Percentage of 4-Star Item Drops: 50.000%
        </p>
        <div class="character-profile">
          <div>
            <p
              v-for="(c, i) in featured4Stars"
              :key="i"
              :style="getCharacterElementStyle(c)"
            >
              {{ c.name }}
            </p>
          </div>
          <div>
            <CharacterProfile
              v-for="(c, i) in featured4Stars"
              :key="i"
              :character="c"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
}

.grow {
  height: 50%;
}

.img-holder {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.item-pic-box > p {
  padding: 0.2em;
  letter-spacing: 0;
  font-size: 1.1em;
}

img.profile {
  border-radius: 0.2em 0.2em 1em 0;
  width: 100%;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 1.1em;
  padding-top: 0.5em;
  flex-grow: 1;
  min-height: 0;
}

.container > div {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-grow: 1;
}

.five-star {
  background-color: #cfb383;
}

.four-star {
  background-color: #b5a8c9;
}

.three-star {
  background-color: #a5bacc;
}

.star-text {
  color: white;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  margin-top: 0.25em;
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
.character-profile {
  display: flex;
  background: #fbf6ee;
  border: 1px solid rgba(128, 128, 128, 0.2);
  flex-grow: 1;
  max-height: 80%;
  padding: 1em;
  padding-left: 2em;
  gap: 1em;
  box-sizing: border-box;
}

.character-profile > div:nth-child(1) {
  /* the text names */
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  width: 28%;
  flex-grow: 1;
  gap: 0.3rem;
}

.character-profile > div:nth-child(2) {
  /* the avatars */
  flex-grow: 4;
  flex-wrap: wrap;
  display: flex;
  align-items: flex-start;
  gap: 2%;
  width: 72%;
}
</style>
