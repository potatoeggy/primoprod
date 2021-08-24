import { ItemStringQuantity } from "./Gacha";

export interface Quest {
  name: string;
  description?: string;
  rewards?: ItemStringQuantity[];
  complete: boolean;
}

export default class Quests {
  private commissionQuests: Quest[] = Array.from({ length: 4 }, (_, i) => {
    return {
      name: `Daily Commission #${i+1}`,
      description: "Add an interesting description here!",
      rewards: [{id: "primogem", quantity: 20}],
      complete: false
    };
  });
  private eventQuests: Quest[] = [];

  constructor() {
    this.commissions = JSON.parse(
      localStorage.getItem("commissions") ||
        JSON.stringify(this.commissionQuests)
    );
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
