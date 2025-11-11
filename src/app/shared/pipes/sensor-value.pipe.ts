import { Pipe, PipeTransform } from '@angular/core';
import { SensorModel } from '../sensor/sensor.component';

@Pipe({
  name: 'sensorValue',
  standalone: true,
})
export class SensorValuePipe implements PipeTransform {
  transform(value: SensorModel['value']): string {
    const amount = value?.amount ?? 0;
    const unit = value?.unit ?? '';
    return `${amount} ${unit}`.trim();
  }
}
