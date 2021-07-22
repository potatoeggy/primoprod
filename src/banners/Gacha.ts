// Some code taken from https://github.com/uzair-ashraf/genshin-impact-wish-simulator

interface Drop {
  name: string;
  rarity: number;
  element: string;
  featured?: boolean;
}

interface State {
  pullAttempts: number;
  pityCounter4: number;
  pityCounter5: number;
  guaranteedFeatured4Star: boolean;
  guaranteedFeatured5Star: boolean;
}

export default class Gacha {
  // loaded vars
  drops: Array<Array<Drop>>;

  // constant vars
  readonly softPity5Start = 75;
  readonly hardPity5Limit = 90;
  readonly hardPity4Limit = 10;
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

  constructor(drops: Array<Drop>, state?: State) {
    // consider accepting a string as parameter for json
    // so that the heavy lefting happens here instead
    // of in main
    this.drops = Array.from({ length: 3 }, (i) =>
      drops.filter((item) => item.rarity === i)
    );
    if (state) this.state = state;
    console.log(this.drops);
    this.state = localStorage.gacha || this.state;
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

  rollTen(): Drop[] {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(this.rollOne());
    }
    return result;
  }

  rollOne(): Drop {
    console.assert(this.state.pityCounter5 <= 90);
    const probabilityRange =
      this.state.pityCounter5 >= this.softPity5Start
        ? this.softPityRange
        : this.standardRange;

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
    localStorage.gacha = this.state;
  }

  get3StarItem(): Drop {
    this.state.pityCounter4 += 1;
    this.state.pityCounter5 += 1;
    this.saveState();
    return this.drops[3][this.rng(this.drops[3].length)];
  }

  get4StarItem(): Drop {
    this.state.pityCounter5 += 1;
    this.state.pityCounter4 = 0;

    if (this.state.guaranteedFeatured4Star) {
      this.state.guaranteedFeatured4Star = false;
      const filtered = this.drops[4].filter((drop) => drop.featured);
      return filtered[this.rng(filtered.length)];
    }
    this.state.guaranteedFeatured4Star = true;
    this.saveState();
    return this.drops[4][this.rng(this.drops[4].length)];
  }

  get5StarItem(): Drop {
    this.state.pityCounter4 = 0;
    this.state.pityCounter5 = 0;

    if (this.state.guaranteedFeatured5Star) {
      this.state.guaranteedFeatured5Star = false;
      const filtered = this.drops[4].filter((drop) => drop.featured);
      return filtered[this.rng(filtered.length)];
    }
    this.state.guaranteedFeatured5Star = true;
    this.saveState();
    return this.drops[5][this.rng(this.drops[5].length)];
  }
}
