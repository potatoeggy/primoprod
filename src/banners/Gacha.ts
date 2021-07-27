// Some code taken from https://github.com/uzair-ashraf/genshin-impact-wish-simulator
import ItemDatabase from "./ItemDatabase.json";

export interface Item {
  name: string;
  id: string;
  rarity: number;
  type: string;
  element: string;
  featured?: boolean;
}

export interface Banner {
  name: string;
  storage: string;
  drops: string[];
  featuredDrops: string[];
}

export interface State {
  pullAttempts: number;
  pityCounter4: number;
  pityCounter5: number;
  guaranteedFeatured4Star: boolean;
  guaranteedFeatured5Star: boolean;
}

export default class Gacha {
  // TODO: since weapons are being added now their pity is actually slightly different I believe
  
  // loaded vars
  drops: Item[][];
  name: string;
  storage: string;

  // constant vars
  // pities are -1 because numbers are zero indexed :/
  readonly softPity5Start = 75 - 1;
  readonly hardPity5Limit = 90 - 1;
  readonly hardPity4Limit = 10 - 1;
  readonly standardRange = this.generateProbabilityRange(943, 51, 6); // % 94.3, 5.1, 0.6
  readonly softPityRange = this.generateProbabilityRange(629, 51, 320); // % 62.9, 5.1, 32

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
        .map((item) => (ItemDatabase as { [name: string]: Item })[item])
        .filter((item) => item.rarity === i)
    );
    for (const item of banner.featuredDrops.map(
      (item) => (ItemDatabase as { [name: string]: Item })[item]
    )) {
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

  generateProbabilityRange(
    threeOdds: number,
    fourOdds: number,
    fiveOdds: number
  ): Array<number> {
    console.assert(threeOdds + fourOdds + fiveOdds === 1000);
    const range: Array<number> = [];
    [threeOdds, fourOdds, fiveOdds].forEach((odds, i) =>
      range.push(...Array.from({ length: odds }, (_) => i + 3))
    );
    return range;
  }

  rng(max: number): number {
    return Math.floor(Math.random() * max);
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
      this.state.pityCounter5 >= this.softPity5Start
        ? this.softPityRange
        : this.standardRange;
    this.state.pullAttempts += 1;

    // guarantees and specials
    if (this.state.pityCounter5 >= this.hardPity5Limit) {
      return this.get5StarItem();
    }

    if (this.state.pityCounter4 >= this.hardPity4Limit) {
      if (probabilityRange[this.rng(probabilityRange.length)] === 5) {
        return this.get5StarItem();
      }
      return this.get4StarItem();
    }

    const rarity = probabilityRange[this.rng(probabilityRange.length)];
    console.assert(rarity >= 3 && rarity <= 5);

    if (rarity === 4) {
      return this.get4StarItem();
    } else if (rarity === 5) {
      return this.get5StarItem();
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

    let drop = this.drops[4][this.rng(this.drops[4].length)];
    if (this.state.guaranteedFeatured4Star || drop.featured) {
      this.state.guaranteedFeatured4Star = false;
      const filtered = this.drops[4].filter((drop) => drop.featured);
      // it's okay to recalculate here since it's featured and less copied code :P
      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    } else {
      this.state.guaranteedFeatured4Star = true;
    }
    this.saveState();
    return drop;
  }

  get5StarItem(): Item {
    this.state.pityCounter4 = 0;
    this.state.pityCounter5 = 0;

    let drop = this.drops[5][this.rng(this.drops[5].length)];
    if (this.state.guaranteedFeatured5Star || drop.featured) {
      this.state.guaranteedFeatured5Star = false;
      const filtered = this.drops[5].filter((drop) => drop.featured);
      if (filtered.length > 0) {
        drop = filtered[this.rng(filtered.length)];
      }
    } else {
      this.state.guaranteedFeatured5Star = true;
    }
    this.saveState();
    return drop;
  }
}
