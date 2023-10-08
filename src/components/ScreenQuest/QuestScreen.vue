<script setup lang="ts">
import CloseButton from "../shared/CloseButton.vue";
import Quests from "@/state/Quests";
import { ItemDatabase } from "@/state/Gacha";
import { Item, ItemStringQuantity, Quest } from "@/types";
import ItemDescriptionOverlay from "../overlays/ItemDescriptionOverlay.vue";
import ItemObtainOverlay from "../overlays/ItemObtainOverlay.vue";
import CancelConfirmButton from "../shared/CancelConfirmButton.vue";
import Inventory from "@/state/Inventory";
import { computed, onMounted, Ref, ref } from "vue";

const props = defineProps<{ inventory: Inventory }>();
const emit = defineEmits(["exit"]);
const active = ref(true);
const currentTab = ref("All Quests");
const quests = ref(new Quests());
const currentQuest = ref({} as Quest);
const itemDescriptionId = ref("");
const editMode = ref(false);
const obtainScreenRewards = ref([] as ItemStringQuantity[]);
const audioCancelConfirm: Ref<HTMLAudioElement | null> = ref(null);
const audioQuestClick: Ref<HTMLAudioElement | null> = ref(null);

const itemDescription = computed(() => ItemDatabase[itemDescriptionId.value]);
const formattedQuests = computed(() => [
  {
    name: "Daily Commissions",
    quests: quests.value.commissions.filter((i) => !i.complete),
  },
  {
    name: "Event Quests",
    quests: quests.value.events.filter((i) => !i.complete),
  },
  {
    name: "Completed Quests",
    quests: [
      ...quests.value.commissions.filter((i) => i.complete),
      ...quests.value.events.filter((i) => i.complete),
    ],
  },
]);

function idToItem(id: string): Item {
  return ItemDatabase[id];
}

function exitAnimation() {
  active.value = false;
}
function exit() {
  if (!active.value) {
    emit("exit");
  }
}
function processClaim() {
  audioCancelConfirm.value?.play();
  if (editMode.value) {
    editMode.value = false;
    quests.value.saveState();
  } else {
    if (!currentQuest.value.complete) {
      if (currentQuest.value.rewards) {
        props.inventory.addItems(currentQuest.value.rewards);
      }
      // mark the current quest as done and save it
      obtainScreenRewards.value = currentQuest.value.rewards || [];
      currentQuest.value.complete = true;
      currentQuest.value.claimed = new Date();
      quests.value.refresh();

      // TODO: fix all of the divs bouncing around everywhere
      // by adding padding?
      // TODO: shrink the description buttons on click instead
      // of filtering brightness to emulate original behaviour
    }
  }
}
function deleteCurrentQuest() {
  audioCancelConfirm.value?.play();

  // commissions can't be deleted and ids should be unique
  quests.value.events.splice(
    quests.value.events.findIndex((i) => i.id === currentQuest.value.id),
    1
  );
  resetCurrentQuest();
  quests.value.saveState();
}
function setCurrentQuest(quest: Quest) {
  const audio = audioQuestClick;
  if (audio.value && !audio.value.paused) {
    audio.value.currentTime = 0;
  }
  audio.value?.play();
  currentQuest.value = quest;
  editMode.value = false;
}
function resetCurrentQuest() {
  editMode.value = false;
  currentQuest.value =
    formattedQuests.value.find((i) => i.quests.length > 0)?.quests[0] ||
    quests.value.commissions[0];
}
function newQuest() {
  const audio = audioQuestClick;
  if (audio.value && !audio.value.paused) {
    audio.value.currentTime = 0;
  }
  audio.value?.play();
  quests.value.events.push({
    name: "New Quest",
    id: `custom-event-${+new Date()}`,
    description: "Add an interesting description here!",
    rewards: [{ id: "primogem", quantity: 900 }],
  });
  currentQuest.value = quests.value.events[quests.value.events.length - 1];
}

onMounted(() => {
  resetCurrentQuest();
});
</script>

<template>
  <!-- overlay -->
  <item-description-overlay
    v-if="itemDescriptionId"
    :item="itemDescription"
    @exit="itemDescriptionId = ''"
  ></item-description-overlay>
  <item-obtain-overlay
    v-if="obtainScreenRewards.length > 0"
    :obtained-items="obtainScreenRewards"
    @exit="obtainScreenRewards = []"
  ></item-obtain-overlay>

  <audio ref="audioCancelConfirm" preload="auto">
    <source src="@/assets/audio/text-click.ogg" type="audio/ogg" />
    <source src="@/assets/audio/text-click.mp3" type="audio/mp3" />
  </audio>
  <audio ref="audioQuestClick" preload="auto">
    <source src="@/assets/audio/quest-click.ogg" type="audio/ogg" />
    <source src="@/assets/audio/quest-click.mp3" type="audio/mp3" />
  </audio>

  <div :class="{ main: true, 'exit-main': !active }" @animationend="exit">
    <div class="header">
      <p>
        {{ currentTab }}
      </p>
      <close-button @clicked="exitAnimation"></close-button>
    </div>
    <div class="body">
      <div class="quest-selector">
        <div class="quest-selector-list">
          <template v-for="(category, _) of formattedQuests" :key="_">
            <p
              v-if="currentTab === 'All Quests' && category.quests.length > 0"
              class="quest-header"
            >
              {{ category.name }}
            </p>
            <template v-for="quest of category.quests" :key="quest.id">
              <div
                v-if="
                  currentTab === 'All Quests' || currentTab === category.name
                "
                :class="{
                  'quest-box': true,
                  'quest-box-active': currentQuest.id === quest.id,
                  'quest-box-faded': quest.complete,
                }"
                @click="setCurrentQuest(quest)"
              >
                <div>{{ quest.name }}</div>
              </div>
            </template>
          </template>
        </div>
        <div>
          <cancel-confirm-button
            v-if="!editMode"
            text="New"
            invert
            @pressed="newQuest"
          ></cancel-confirm-button>
        </div>
      </div>
      <div class="quest-details">
        <div class="flex-row">
          <p v-if="!editMode" class="quest-desc-name">
            {{ currentQuest.name }}
          </p>
          <input
            v-else
            v-model="currentQuest.name"
            type="text"
            class="quest-desc-name"
          />
          <img
            v-if="!currentQuest.uneditable"
            class="ui-icon"
            src="@/assets/images/edit.svg"
            @click="editMode = !editMode"
          />
        </div>
        <div class="quest-description">
          <p v-if="!editMode">{{ currentQuest.description }}</p>
          <textarea
            v-else
            v-model="currentQuest.description"
            class="quest-description"
          ></textarea>
        </div>
        <div class="quest-rewards">
          <p :class="{ 'quest-header': true, 'quest-header-white': editMode }">
            Quest Chain Rewards:
          </p>
          <div class="quest-reward-icons">
            <div
              v-for="(i, index) in currentQuest.rewards"
              :key="index"
              :class="[
                'reward-icon-graphics',
                [0, 'gray', 'green', 'blue', 'purple', 'orange'][
                  idToItem(i.id).rarity
                ],
              ]"
              @click="itemDescriptionId = i.id"
            >
              <img
                :src="require(`@/assets/images/${i.id}.webp`)"
                class="icon-img"
              />
              <div class="quantity-text">{{ i.quantity }}</div>
            </div>
          </div>
        </div>
        <div class="flex-end save-buttons">
          <cancel-confirm-button
            v-if="editMode || !currentQuest.complete"
            :text="editMode ? 'Save' : 'Claim'"
            invert
            @pressed="processClaim"
          ></cancel-confirm-button>
          <cancel-confirm-button
            v-if="currentQuest.id && !currentQuest.id.startsWith('root-')"
            text="Delete"
            invert
            @pressed="deleteCurrentQuest"
          ></cancel-confirm-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}

.exit-main {
  animation: main-exit 0.1s ease-in 0s reverse forwards;
}

.flex-end {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  height: 4rem;
  margin-top: auto;
  margin-bottom: 1rem;
}

.save-buttons {
  margin-top: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.ui-icon {
  width: 2rem;
  margin-top: 0.5rem;
}

.ui-icon:hover {
  filter: brightness(80%);
}

.ui-icon:active {
  filter: brightness(60%);
}

.quest-box {
  width: 90%;
  background-color: #2c3848cc;
  color: #e4ddd4;
  height: 4rem;
  font-size: 1.25rem;
  text-align: left;
  letter-spacing: -0.05rem;
  display: flex;
  align-items: center;
  transition: transform 0.1s, background-color 0.1s, color 0.1s;
  margin-bottom: 0.75rem;
}

.quest-box-faded {
  opacity: 0.6;
}

.quest-box:hover:not(.quest-box-active) {
  transform: scale(102%);
  border: 0.15rem solid #c7b696;
}

.quest-box-active,
.quest-box:active {
  color: #2c3848;
  background-color: #ede6da;
  transform: scale(102%);
}

.quest-box > div {
  margin: 0.25rem;
  width: 100%;
  height: 2.4rem;
  padding-left: 2rem;
  padding: 0.5rem;
  overflow: hidden;
}

.quest-box-active > div,
.quest-box:active > div {
  border: 0.2rem solid #00000033;
}

.quest-header,
.quest-desc-name {
  color: #e4ddd4;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 2px rgba(2, 2, 2, 0.2);
  letter-spacing: -0.05rem;
}

.quest-header-white {
  color: white;
}

input.quest-desc-name {
  background-color: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  color: white;
}

textarea.quest-description {
  background: transparent;
  outline: none;
  border: none;
  color: white;
  margin: 0;
  padding: 0;
  width: 99%;
  height: 100%;
  resize: none;
}

.quest-desc-name {
  font-size: 2rem;
}

.quest-description {
  text-align: left;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 60%;
  border-top: 0.25rem solid #e4ddd455;
  border-bottom: 0.25rem solid #e4ddd455;
  color: #e4ddd4;
  white-space: pre-wrap;
  overflow-x: hidden;
  overflow-y: auto;
}

.quest-reward-icons {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 6rem;
}

.reward-icon-graphics {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  transition: border 0.1s;
}

.reward-icon-graphics:hover {
  border: 0.2rem solid white;
}

.reward-icon-graphics:active {
  filter: brightness(90%);
}

.quantity-text {
  position: absolute;
  color: white;
  width: 4rem;
  height: 1rem;
  background-color: #00000055;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  transform: translateY(1.5rem);
  font-size: 0.8rem;
}

.icon-img {
  height: 3.75rem;
  margin: auto;
}

.body {
  margin-bottom: 2rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: 85%;
  width: 85%;
}

.quest-selector {
  height: 100%;
  width: 40%;
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
}

.quest-selector-list {
  overflow-x: visible;
  overflow-y: auto;
  max-height: 80%;
  margin-bottom: 0;
}

.quest-details {
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #d2bd8d;
  font-size: 1.25rem;
  width: 100%;
  margin-left: 4rem;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #00000055;
  height: 5rem;
}

.header > div {
  margin-left: auto;
  margin-right: 4rem; /* ??? header padding no work why */
}

@keyframes main-entry {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #383d53, transparent);
    backdrop-filter: blur(1.5rem);
  }
}

@keyframes main-exit {
  from {
    background: none;
    backdrop-filter: none;
  }
  to {
    background: linear-gradient(to bottom, #383d53, transparent);
    backdrop-filter: blur(1rem);
  }
}

.orange {
  background: linear-gradient(#936031, #b27730);
}

.purple {
  background: linear-gradient(#565282, #9f6eb9);
}

.blue {
  background: linear-gradient(#577291, #5495b2);
}

.green {
  background-color: #53756a;
}

.gray {
  background-color: #505863;
}

@media screen and (max-width: 850px) and (orientation: portrait) {
  .header {
    padding-right: 3rem;
    margin-left: 0;
    box-sizing: border-box;
    padding-bottom: 0.5rem;
  }
}
</style>
