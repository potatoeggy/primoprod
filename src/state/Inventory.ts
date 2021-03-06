import { Item, ItemStringQuantity, Pull } from "@/types";

export default class Inventory {
  currency = {
    primos: 0,
    fates: 0,
    standardFates: 0,
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
    this.pullHistory = JSON.parse(
      localStorage.getItem("pullHistory") || JSON.stringify(this.pullHistory)
    );
    this.migrationCheck();
  }

  migrationCheck(): void {
    // any inventory incompatibilities will be resolved here if due to major updates
    // 1.0-beta7: Acquaint Fates were moved from the inventory to be a currency
    if (this.inventory["acquaint-fate"]) {
      this.standardFates =
        (this.standardFates || 0) + this.inventory["acquaint-fate"];
      delete this.inventory["acquaint-fate"];
    }
    this.saveState();
  }

  saveState(): void {
    localStorage.currency = JSON.stringify(this.currency);
    localStorage.inventory = JSON.stringify(Object.assign({}, this.inventory)); // typescript why
    localStorage.pullHistory = JSON.stringify(this.pullHistory);
  }

  addItems(items: ItemStringQuantity[]): void {
    // default to auto-save
    for (const item of items) {
      if (this.inventory[item.id]) {
        this.inventory[item.id] += item.quantity;
      } else if (item.id === "primogem") {
        this.currency.primos += item.quantity;
      } else if (item.id === "starglitter") {
        this.currency.starglitter += item.quantity;
      } else if (item.id === "stardust") {
        this.currency.stardust += item.quantity;
      } else if (item.id === "intertwined-fate") {
        this.currency.fates += item.quantity;
      } else if (item.id === "acquaint-fate") {
        this.currency.standardFates += item.quantity;
      } else {
        this.inventory[item.id] = item.quantity;
      }
    }
    this.saveState();
  }

  addPulls(items: string[], bannerStorage: string, description: string): void {
    for (const item of items) {
      this.pullHistory.push({
        item: item,
        date: new Date(),
        bannerStorage: bannerStorage,
        description: description,
      });
    }
    this.saveState();
  }

  addItemsViaGacha(
    items: Item[],
    bannerStorage: string,
    description: string
  ): ItemStringQuantity[] {
    // wrapper function calling addItems and addPulls for convenience
    const extraRewards: ItemStringQuantity[] = [];
    const pushStardust = (quantity: number) => {
      extraRewards.push({ id: "stardust", quantity: quantity });
      this.currency.stardust += quantity;
    };

    const pushStarglitter = (quantity: number) => {
      extraRewards.push({ id: "starglitter", quantity: quantity });
      this.currency.starglitter += quantity;
    };

    for (const item of items) {
      if (item.type === "Weapon") {
        switch (item.rarity) {
          case 3:
            pushStardust(15);
            break;
          case 4:
            pushStarglitter(2);
            break;
          case 5:
            pushStarglitter(10);
        }
      } else if (item.type === "Character") {
        if (this.inventory[item.id]) {
          // at least one
          if (this.inventory[item.id] <= 7) {
            // six constellations
            switch (item.rarity) {
              case 4:
                pushStarglitter(2);
                break;
              case 5:
                pushStarglitter(10);
            }
          } else {
            // more than six cons
            switch (item.rarity) {
              case 4:
                pushStarglitter(10);
                break;
              case 5:
                pushStarglitter(25);
            }
          }
        }
      } else {
        console.error(`Invalid item type for ${item}!`);
      }
    }
    // this saves state at the end so we don't go back
    // and forth with localStorage (buffer!)
    this.addItems(
      items.map((e) => {
        return { id: e.id, quantity: 1 };
      })
    );
    this.addPulls(
      items.map((e) => e.id),
      bannerStorage,
      description
    );
    return extraRewards;
  }

  removeItems(items: ItemStringQuantity[]): void {
    // use a dict/object instead with a json db
    for (const item of items) {
      if (item.id === "primogem") {
        this.currency.primos -= item.quantity;
      } else if (item.id === "starglitter") {
        this.currency.starglitter -= item.quantity;
      } else if (item.id === "stardust") {
        this.currency.stardust -= item.quantity;
      } else if (item.id === "intertwined-fate") {
        this.currency.fates -= item.quantity;
      } else if (item.id === "acquaint-fate") {
        this.currency.standardFates -= item.quantity;
      } else if (this.inventory[item.id]) {
        this.inventory[item.id] -= 1;
        if (this.inventory[item.id] <= 0) {
          delete this.inventory[item.id];
        } else {
          console.log(`Removing ${item} failed: item not found!`);
        }
      }
    }
    this.saveState();
  }

  resetItems(): void {
    this.inventory = {};
    this.saveState();
  }

  resetCurrency(): void {
    this.currency = {
      primos: 0,
      fates: 0,
      standardFates: 0,
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

  public get standardFates(): number {
    return this.currency.standardFates;
  }

  public set standardFates(num: number) {
    this.currency.standardFates = num;
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
