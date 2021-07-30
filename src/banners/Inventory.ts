import { Item } from "./Gacha";

interface Pull {
  item: string;
  date: Date;
}

export default class Inventory {
  private currency = {
    primos: 5200,
    fates: 60,
    starglitter: 0,
    stardust: 0,
  };

  inventory: { [name: string]: number } = {};
  pullHistory: Pull[] = [];

  constructor() {
    this.inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    this.currency = JSON.parse(
      localStorage.getItem("currency") || JSON.stringify(this.currency)
    );
  }

  saveState(): void {
    localStorage.currency = JSON.stringify(this.currency);
    localStorage.inventory = JSON.stringify(Object.assign({}, this.inventory)); // typescript why
  }

  addItems(items: string[]): void {
    // default to auto-save
    for (const item of items) {
      if (this.inventory[item]) {
        this.inventory[item] += 1;
      } else {
        this.inventory[item] = 1;
      }
    }
    this.saveState();
  }

  addPulls(items: string[]): void {
    for (const item of items) {
      this.pullHistory.push({ item: item, date: new Date() });
    }
    this.saveState();
  }

  addItemsViaGacha(items: Item[]): void {
    // wrapper function calling addItems and addPulls for convenience
    // WARN: this does not give any visual output aside from
    // updating this.currency
    for (const item of items) {
      if (item.type === "Weapon") {
        switch (item.rarity) {
          case 3:
            this.currency.stardust += 15;
            break;
          case 4:
            this.currency.starglitter += 2;
            break;
          case 5:
            this.currency.starglitter += 10;
        }
      } else if (item.type === "Character") {
        if (this.inventory[item.id]) {
          // at least one
          if (this.inventory[item.id] <= 7) {
            // six constellations
            switch (item.rarity) {
              case 4:
                this.currency.starglitter += 2;
                break;
              case 5:
                this.currency.starglitter += 10;
            }
          } else {
            // more than six cons
            switch (item.rarity) {
              case 4:
                this.currency.starglitter += 10;
                break;
              case 5:
                this.currency.starglitter += 25;
            }
          }
        }
      } else {
        console.error(`Invalid item type for ${item}!`);
      }
    }
    // this saves state at the end so we don't go back
    // and forth with localStorage (buffer!)
    this.addItems(items.map((e) => e.id));
    this.addPulls(items.map((e) => e.id));
  }

  removeItems(items: string[]): void {
    // use a dict/object instead with a json db
    for (const item of items) {
      if (this.inventory[item]) {
        this.inventory[item] -= 1;
        if (this.inventory[item] <= 0) {
          delete this.inventory[item];
        }
      } else {
        console.log(`Removing ${item} failed: item not found!`);
      }
    }
  }

  resetItems(): void {
    this.inventory = {};
    this.saveState();
  }

  resetCurrency(): void {
    this.currency = {
      primos: 0,
      fates: 0,
      starglitter: 0,
      stardust: 0,
    };
    this.saveState();
  }

  public get primos(): number {
    return this.currency.primos;
  }

  public set primos(num: number) {
    this.currency.primos = num;
    this.saveState();
  }

  public get fates(): number {
    return this.currency.fates;
  }

  public set fates(num: number) {
    this.currency.fates = num;
    this.saveState();
  }

  public get starglitter(): number {
    return this.currency.starglitter;
  }

  public set starglitter(num: number) {
    this.currency.starglitter = num;
    this.saveState();
  }

  public get stardust(): number {
    return this.currency.stardust;
  }

  public set stardust(num: number) {
    this.currency.stardust = num;
    this.saveState();
  }
}
