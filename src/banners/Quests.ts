import { ItemStringQuantity } from "./Gacha";

export interface Quest {
  name: string;
  id: string;
  description?: string;
  rewards: ItemStringQuantity[];
  complete?: boolean;
  uneditable?: boolean;
  claimed?: Date;
  expires?: Date;
}

export default class Quests {
  commissions: Quest[] = Array.from({ length: 4 }, (_, i) => {
    return {
      name: `Daily Commission #${i + 1}`,
      id: `root-daily-commission-${i + 1}`,
      description: "Add an interesting description here!",
      rewards: [{ id: "primogem", quantity: 30 }],
    };
  });
  events: Quest[] = [
    {
      name: "Welcome!",
      id: "welcome-quest",
      description:
        "Thank you for using primoprod! To get you started, have some gems and fates on us!",
      rewards: [
        { id: "primogem", quantity: 3200 },
        { id: "intertwined-fate", quantity: 5 },
      ],
      uneditable: true,
    },
  ];

  constructor() {
    this.commissions = JSON.parse(
      localStorage.commissions || JSON.stringify(this.commissions)
    );
    this.events = JSON.parse(
      localStorage.events || JSON.stringify(this.events)
    ).map((e: Quest) => {
      return e.expires ? { ...e, expires: new Date(e.expires) } : e;
    });
    this.refresh();
  }

  refresh(): void {
    /* Look at commissions and refresn them if necessary,
     * also add extra free quest for completing all four
     * also check if event quests have expired
     */
    for (const item of this.commissions) {
      if (item.claimed) {
        item.claimed = new Date(item.claimed);
      }
      if (item.expires) {
        item.expires = new Date(item.expires);
      }
      if (
        // if items are unclaimed or their reset date
        // is yesterday or before
        (item.claimed || new Date(new Date().setHours(0, 0, 0, 0))) <
        new Date(new Date().setHours(4, 0, 0, 0))
      ) {
        delete item.claimed;
        item.complete = false;
      }
    }

    // remove expired quests
    this.events = this.events.filter(
      (q) => !q.expires || q.expires > new Date()
    );

    // this must be after refreshing commissions so we
    // don't spawn a new quest based on old data
    if (
      this.commissions.every((item) => item.complete) &&
      !this.events.find((i) => i.id === "root-ad-astra-abyssosque")
    ) {
      console.log("Daily commissions completed!");
      this.events.unshift({
        name: "Ad Astra Abyssosque!",
        id: "root-ad-astra-abyssosque",
        description:
          "Congratulations for completing all your daily commissions! Here is your reward, please claim it before it expires tomorrow.",
        rewards: [
          { id: "primogem", quantity: 60 },
          { id: "acquaint-fate", quantity: 1 },
        ],
        expires: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          d.setHours(4, 0, 0, 0);
          return d;
          // somehow this way is actually nicer than the new Date() way
        })(),
        uneditable: true,
      });
    }
    this.saveState();
  }

  saveState(): void {
    localStorage.commissions = JSON.stringify(this.commissions);
    localStorage.events = JSON.stringify(this.events);
  }
}
