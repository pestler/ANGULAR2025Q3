export interface RawTab {
  id: string;
  title: string;
  cards: RawCard[];
}

export interface RawCard {
  id: string;
  title: string;
  layout: 'horizontalLayout' | 'verticalLayout' | 'singleDevice';
  items: RawItem[];
}

export type RawItem = RawDevice | RawSensor;

export interface RawDevice {
  type: 'device';
  icon: string;
  label: string;
  state: boolean;
}

export interface RawSensor {
  type: 'sensor';
  icon: string;
  label: string;
  value: {
    amount: number;
    unit: string;
  };
}
