// TODO: move all exported types here
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

export interface State {
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
