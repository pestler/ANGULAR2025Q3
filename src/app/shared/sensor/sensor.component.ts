import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
})
export class SensorComponent {
  @Input() sensor!: SensorModel;
}
