import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SensorValuePipe } from '../pipes/sensor-value.pipe';

export interface SensorModel {
  icon: string;
  label: string;
  value: {
    amount: number;
    unit: string;
  };
}

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [CommonModule, MatIconModule, SensorValuePipe],
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
})
export class SensorComponent {
  @Input() sensor!: SensorModel;
  @Input() layout: 'horizontal' | 'vertical' | 'single' = 'horizontal';
}
