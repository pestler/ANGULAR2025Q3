import { CardLayoutType } from '../enums/card-layout.enum';
import { DeviceModel } from './device.model';
import { SensorModel } from './sensor.model';

export interface CardModel {
  title: string;
  layout: CardLayoutType;
  devices: DeviceModel[];
  sensors: SensorModel[];
}
