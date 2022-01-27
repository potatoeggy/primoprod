/* For use with Genshin Impact data ONLY.
 * Therefore, there can be hacks in here to work around
 * primoprod design decisions for custom banners as it
 * is assumed only validated Genshin data will be fed here.
 */

import { Pull, GachaState } from "@/types";
import dayjs from "dayjs";
import { ItemDatabase } from "./Gacha";

const STANDARD_BANNER_STORAGE = "gacha-wanderlust-invocation";
const CHARACTER_BANNER_STORAGE = "gacha-event";
const PULL_HISTORY = "pullHistory";
const EMPTY_GACHA: GachaState = {
  pullAttempts: 0,
  pityCounter4: 0,
  pityCounter5: 0,
  guaranteedFeatured4Star: false,
  guaranteedFeatured5Star: false,
};
const REPLACE_EXCEPTIONS: { [key: string]: string } = {
  "primordial-jade-winged-spear": "primordial_jade_winged-spear",
};

export default class Paimon {
  static export(): string {
    const gacha_standard: GachaState =
      JSON.parse(localStorage.getItem(STANDARD_BANNER_STORAGE) ?? "0") ||
      EMPTY_GACHA;
    const gacha_character: GachaState =
      JSON.parse(localStorage.getItem(CHARACTER_BANNER_STORAGE) ?? "0") ||
      EMPTY_GACHA;

    const pullHistory: Pull[] =
      JSON.parse(localStorage.getItem(PULL_HISTORY) ?? "0") || [];

    // eslint-disable-next-line
    const pulls: { [key: string]: Array<{ [key: string]: any }> } = {
      standard: [],
      event: [],
    };
    for (const type of ["standard", "event"]) {
      const pity: { [key: number]: number } = { 5: 0, 4: 0, 3: 1 };
      for (const pull of pullHistory) {
        if (pull.bannerStorage != type) continue;
        pity[5]++;
        pity[4]++;
        pity[3]++;

        const item = ItemDatabase[pull.item];

        pulls[type].push({
          type: item.type.toLowerCase(),
          id: Object.prototype.hasOwnProperty.call(REPLACE_EXCEPTIONS, item.id)
            ? REPLACE_EXCEPTIONS[item.id]
            : item.id.replaceAll("-", "_"),
          time: dayjs(pull.date).format("YYYY-MM-DD HH:mm:ss"),
          pity: pity[item.rarity],
          // super fragile
          code: pull.description === "Character Event Wish" ? "301" : "400",
        });

        pity[item.rarity] = 0;
      }
    }

    return JSON.stringify({
      locale: "en",
      server: "America",
      "wish-uid": 1234567,
      wl: 8,
      "wish-counter-setting": {
        firstTime: false,
        manualInput: false,
      },
      "wish-counter-beginners": {
        total: 0,
        legendary: 0,
        rare: 0,
        pulls: [],
      },
      "wish-counter-weapon": {
        total: 0,
        legendary: 0,
        rare: 0,
        pulls: [],
      },
      "wish-counter-character-event": {
        total: gacha_character.pullAttempts,
        legendary: gacha_character.pityCounter5,
        rare: gacha_character.pityCounter4,
        pulls: pulls["event"],
      },
      "wish-counter-standard": {
        total: gacha_standard.pullAttempts,
        legendary: gacha_standard.pityCounter5,
        rare: gacha_standard.pityCounter4,
        pulls: pulls["standard"],
      },
    });
  }
}
