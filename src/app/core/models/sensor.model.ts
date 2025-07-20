export interface SensorModel {
  icon: string;
  label: string;
  value: {
    amount: number;
    unit: string;
  };
}
