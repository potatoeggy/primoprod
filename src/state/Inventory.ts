import { Item, ItemStringQuantity, Pull } from "@/types";

export default class Inventory {
  inventory: Record<string, number> = {};
  pullHistory: Pull[] = [];

  constructor() {
    this.inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    this.pullHistory = JSON.parse(
      localStorage.getItem("pullHistory") || JSON.stringify(this.pullHistory)
    );
  }

  saveState(): void {
    localStorage.inventory = JSON.stringify(Object.assign({}, this.inventory)); // typescript why
    localStorage.pullHistory = JSON.stringify(this.pullHistory);
  }

  addItems(items: ItemStringQuantity[]): void {
    // default to auto-save
    for (const item of items) {
      if (this.inventory[item.id]) {
        this.inventory[item.id] += item.quantity;
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
      this.stardust += quantity;
    };

    const pushStarglitter = (quantity: number) => {
      extraRewards.push({ id: "starglitter", quantity: quantity });
      this.starglitter += quantity;
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
      if (this.inventory[item.id]) {
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

  public get primos(): number {
    return this.inventory.primogem ?? 0;
  }

  public set primos(num: number) {
    this.inventory.primogem = num;
    this.saveState();
  }

  public get fates(): number {
    return this.inventory["intertwined-fate"] ?? 0;
  }

  public set fates(num: number) {
    this.inventory["intertwined-fate"] = num;
    this.saveState();
  }

  public get standardFates(): number {
    return this.inventory["acquaint-fate"] ?? 0;
  }

  public set standardFates(num: number) {
    this.inventory["acquaint-fate"] = num;
    this.saveState();
  }

  public get starglitter(): number {
    return this.inventory.starglitter ?? 0;
  }

  public set starglitter(num: number) {
    this.inventory.starglitter = num;
    this.saveState();
  }

  public get stardust(): number {
    return this.inventory.stardust ?? 0;
  }

  public set stardust(num: number) {
    this.inventory.stardust = num;
    this.saveState();
  }
}
