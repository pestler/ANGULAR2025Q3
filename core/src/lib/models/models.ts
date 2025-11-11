export type LayoutType = 'horizontalLayout' | 'verticalLayout' | 'singleDevice';

export interface Tab {
  id: string;
  title: string;
  cards: SmartCard[];
}

export interface SmartCard {
  id: string;
  title: string;
  layout: LayoutType;
  items: SmartItem[];
  state?: boolean;
}

export type SmartItem = Sensor | Device;

export interface Sensor {
  type: 'sensor';
  icon: string;
  label: string;
  value: {
    amount: number;
    unit: string;
  };
  id: string;
}

export interface Device {
  type: 'device';
  icon: string;
  label: string;
  state: boolean;
  id: string;
}
