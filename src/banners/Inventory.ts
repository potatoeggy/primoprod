export default class Inventory {
  private currency = {
    primos: 1600,
    fates: 10,
    starglitter: 0,
    stardust: 0,
  };

  inventory: { [name: string]: number } = {};

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
