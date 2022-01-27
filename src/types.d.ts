export interface Settings {
  infinitePrimos: boolean;
  rollOnly: null | 3 | 4 | 5;
  winGuarantee: null | boolean;
  unlimitedHistoryScroll: boolean;
  showBannerPity: boolean;
  everythingBanner: boolean;
}

export interface ShopItem {
  id: string;
  quantity: number;
  cost: ItemStringQuantity[];
}
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

export interface Pull {
  item: string;
  date: Date;
  bannerStorage: string;
  description: string;
}

export interface Item {
  name: string;
  id: string;
  rarity: number;
  type: string;
  element: string;
  featured?: boolean;
  description?: string;
}

export interface Banner {
  name: string;
  id: string;
  storage: string;
  drops: string[];
  featuredDrops: string[];
  styles: StylisedText[];
  description: string;
}

export interface GachaState {
  pullAttempts: number;
  pityCounter4: number;
  pityCounter5: number;
  guaranteedFeatured4Star: boolean;
  guaranteedFeatured5Star: boolean;
}

export interface StylisedText {
  color: string;
  text: string;
}

export interface StylisedElement {
  color: string;
}

export interface ItemStringQuantity {
  id: string;
  quantity: number;
}

export interface ItemQuantity {
  item: Item;
  quantity: number;
}
