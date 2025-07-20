import { DeviceType } from '../enums/device-type.enum';

export interface DeviceModel {
  type: DeviceType;
  icon: string;
  label: string;
  state: boolean;
}
