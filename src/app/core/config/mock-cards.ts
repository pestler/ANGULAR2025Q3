import { CardModel } from '../models/card.model';
import { DeviceType } from '../enums/device-type.enum';
import { CardLayoutType } from '../enums/card-layout.enum';

export const mockCards: CardModel[] = [
  {
    title: 'Living Room',
    layout: CardLayoutType.Single,
    devices: [
      {
        type: DeviceType.Light,
        icon: 'icon-lightbulb',
        label: 'Ceiling Light',
        state: true,
      },
    ],
    sensors: [],
  },
  {
    title: 'Bedroom',
    layout: CardLayoutType.Horizontal,
    devices: [
      {
        type: DeviceType.Socket,
        icon: 'icon-socket',
        label: 'Night Lamp',
        state: false,
      },
      {
        type: DeviceType.Switch,
        icon: 'icon-switch',
        label: 'Wall Switch',
        state: true,
      },
    ],
    sensors: [
      {
        icon: 'icon-temperature',
        label: 'Temperature',
        value: { amount: 22.5, unit: '°C' },
      },
    ],
  },
  {
    title: 'Kitchen',
    layout: CardLayoutType.Vertical,
    devices: [
      {
        type: DeviceType.Relay,
        icon: 'icon-relay',
        label: 'Oven Relay',
        state: false,
      },
    ],
    sensors: [
      {
        icon: 'icon-humidity',
        label: 'Humidity',
        value: { amount: 60, unit: '%' },
      },
      {
        icon: 'icon-power',
        label: 'Power Consumption',
        value: { amount: 220, unit: 'W' },
      },
    ],
  },
];
