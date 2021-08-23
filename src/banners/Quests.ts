import { ItemStringQuantity } from "./Gacha";

export interface Quest {
  name: string;
  description?: string;
  rewards?: ItemStringQuantity[];
}

export default class Quests {
  private commissionQuests: Quest[] = [];
  private eventQuests: Quest[] = [];

  constructor() {
    this.commissions = JSON.parse(localStorage.getItem("commissions") || "[]");
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
