import { Banner, Item, State, StylisedElement } from "@/types";
import ItemDB from "@/data/ItemDatabase.json";

export const ItemDatabase: { [name: string]: Item } = ItemDB.items;
export const ElementDatabase: { [name: string]: StylisedElement } =
  ItemDB.elements;

export default class Gacha {
  // TODO: since weapons are being added now their pity is actually slightly different I believe
  // TODO: consider adding an inherit tag to banners
  // since all genshin banners actually inherit from wanderlust

  // loaded vars
  drops: Item[][];
  name: string;
  storage: string;

  // constant vars
  // pities are -1 because numbers are zero indexed :/
  readonly SOFT_PITY_5_START = 75 - 1;
  readonly HARD_PITY_5 = 90 - 1;
  readonly HARD_PITY_4 = 10 - 1;
  readonly STANDARD_ODDS = [94.3, 5.1, 0.6]; // rarity and their percentage odds
  readonly SOFT_PITY_ODDS = [
    (): number => 100 - (0.6 + 6 * (this.state.pityCounter5 - 73)),
    5.1,
    (): number => 0.6 + 6 * (this.state.pityCounter5 - 73),
  ];

  // state vars
  state: State = {
    guaranteedFeatured4Star: false,
    guaranteedFeatured5Star: false,
    pullAttempts: 0,
    pityCounter4: 0,
    pityCounter5: 0,
  };

  constructor(banner: Banner, state?: State) {
    this.name = banner.name;
    this.storage = "gacha-" + banner.storage;

    // combined featured and non-featured drops
    this.drops = Array.from([0, 1, 2, 3, 4, 5], (i) =>
      banner.drops
        .map((item) => ItemDatabase[item])
        .filter((item) => item.rarity === i)
    );
    for (const item of banner.featuredDrops.map((item) => ItemDatabase[item])) {
      console.assert(
        item,
        "A featured item ID did not appear in ItemDatabase. Check your banner JSON and ensure that each drop is present in ItemDatabase."
      );
      this.drops[item.rarity].push({ ...item, featured: true });
    }

    // create this older structure and reconstruct it from ItemDatabase
    this.state =
      state ||
      JSON.parse(
        localStorage.getItem(this.storage) || JSON.stringify(this.state)
      );
    console.log(this.state);
  }

  rng(max: number): number {
    return Math.floor(Math.random() * max);
  }

  rollRandomRarityWithPity(odds: (number | (() => number))[]): number {
    console.assert(odds.length == 3);
    const newOdds = odds.map(
      (
        (sum) => (value: number | (() => number)) =>
          (sum += typeof value == "number" ? value : value())
      )(0)
    ); // prefix sum array

    // hacky workaround bad planning that rng is only for ints
    const roll = this.rng(1000) / 10;
    for (const [index, value] of newOdds.entries()) {
      if (value >= roll) return index + 3; // god i hate this it limits things to 3-5 stars
    }
    console.error("You done goofed in your roll");
    return -1;
  }

  rollTen(): Item[] {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(this.rollOne());
    }
    return result;
  }

  rollOne(): Item {
    return this.roll();
  }

  roll(): Item {
    console.assert(this.state.pityCounter5 <= 90);
    const probabilityRange =
      this.state.pityCounter5 >= this.SOFT_PITY_5_START
        ? this.SOFT_PITY_ODDS
        : this.STANDARD_ODDS;
    this.state.pullAttempts += 1;

    const rolledRarity = this.rollRandomRarityWithPity(probabilityRange);
    console.assert(rolledRarity >= 3 && rolledRarity <= 5);

    if (rolledRarity === 5) {
      return this.get5StarItem();
    }

    // guarantees and specials
    if (this.state.pityCounter5 >= this.HARD_PITY_5) {
      return this.get5StarItem();
    }

    if (rolledRarity === 4) {
      return this.get4StarItem();
    }

    if (this.state.pityCounter4 >= this.HARD_PITY_4) {
      if (this.rollRandomRarityWithPity(probabilityRange) === 5) {
        return this.get5StarItem();
      }
      return this.get4StarItem();
    }

    return this.get3StarItem();
  }

  saveState(): void {
    localStorage.setItem(this.storage, JSON.stringify(this.state));
  }

  get3StarItem(): Item {
    this.state.pityCounter4 += 1;
    this.state.pityCounter5 += 1;
    this.saveState();
    return this.drops[3][this.rng(this.drops[3].length)];
  }

  get4StarItem(): Item {
    this.state.pityCounter5 += 1;
    this.state.pityCounter4 = 0;

    // initialise in case things bork
    let drop = this.drops[4][this.rng(this.drops[4].length)];
    if (this.rng(2) || this.state.guaranteedFeatured4Star) {
      // TODO: refactor to have less duplicated code
      this.state.guaranteedFeatured4Star = false;
      const filtered = this.drops[4].filter((drop) => drop.featured);

      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    } else {
      this.state.guaranteedFeatured4Star = true;
      const filtered = this.drops[4].filter((drop) => !drop.featured);
      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    }
    this.saveState();
    return drop;
  }

  get5StarItem(): Item {
    this.state.pityCounter4 += 1;
    this.state.pityCounter5 = 0;

    let drop = this.drops[5][this.rng(this.drops[5].length)];
    if (this.rng(2) || this.state.guaranteedFeatured5Star) {
      this.state.guaranteedFeatured5Star = false;
      const filtered = this.drops[5].filter((drop) => drop.featured);
      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    } else {
      this.state.guaranteedFeatured5Star = true;
      const filtered = this.drops[5].filter((drop) => !drop.featured);
      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    }
    this.saveState();
    return drop;
  }
}
