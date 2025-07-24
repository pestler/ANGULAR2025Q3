import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from 'app/shared/device/device.component';
import { SensorComponent } from 'app/shared/sensor/sensor.component';

import type { SmartCard, Device, Sensor } from 'app/core/models/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DeviceComponent, SensorComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true }) card!: SmartCard;

  get layoutVariant(): 'horizontal' | 'vertical' | 'single' {
    switch (this.card.layout) {
      case 'horizontalLayout':
        return 'horizontal';
      case 'verticalLayout':
        return 'vertical';
      case 'singleDevice':
        return 'single';
      default:
        return 'vertical';
    }
  }

  get devices(): Device[] {
    return this.card.items.filter((i): i is Device => i.type === 'device');
  }

  get sensors(): Sensor[] {
    return this.card.items.filter((i): i is Sensor => i.type === 'sensor');
  }
}
