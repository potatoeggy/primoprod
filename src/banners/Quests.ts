import { ItemStringQuantity } from "./Gacha";

export interface Quest {
  name: string;
  description?: string;
  rewards?: ItemStringQuantity[];
  complete: boolean;
  claimed?: Date;
  expires?: Date;
}

export default class Quests {
  private commissionQuests: Quest[] = Array.from({ length: 4 }, (_, i) => {
    return {
      name: `Daily Commission #${i + 1}`,
      description: "Add an interesting description here!",
      rewards: [{ id: "primogem", quantity: 20 }],
      complete: false,
    };
  });
  private eventQuests: Quest[] = [];

  constructor() {
    this.commissions = JSON.parse(
      localStorage.getItem("commissions") ||
        JSON.stringify(this.commissionQuests)
    );

    this.commissions.forEach((item) => {
      if (
        // if items are unclaimed or their reset date
        // is yesterday or before
        (item.claimed || new Date().setHours(0, 0, 0, 0)) <
        new Date().setHours(4, 0, 0, 0)
      ) {
        delete item.claimed;
        item.complete = false;
      }
    });

    if (this.commissions.every((item) => item.complete)) {
      // give reward
      // insert event quest that expires?
    }
  }

  saveState(): void {
    localStorage.commissions = JSON.stringify(this.commissions);
    localStorage.events = JSON.stringify(this.events);
  }

  public get commissions(): Quest[] {
    return this.commissionQuests;
  }

  public set commissions(coms: Quest[]) {
    this.commissionQuests = coms;
    this.saveState();
  }

  public get events(): Quest[] {
    return this.eventQuests;
  }

  public set events(events: Quest[]) {
    this.eventQuests = events;
    this.saveState();
  }
}
