import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DeviceComponent } from 'app/shared/device/device.component';
import { SensorComponent } from 'app/shared/sensor/sensor.component';
import type { SmartCard, Device, Sensor } from 'app/core/models/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    DeviceComponent,
    SensorComponent,
    MatIconModule,
    MatButtonModule,
  ],
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

  getSensorLayout(): 'horizontal' | 'vertical' {
    return this.card.layout === 'horizontalLayout' ? 'horizontal' : 'vertical';
  }

  toggleGroup(): void {
    const newState = !this.groupState;
    this.devices.forEach((d) => (d.state = newState));
  }

  get groupState(): boolean {
    return this.devices.some((d) => d.state);
  }

  getStatusLabel(): string {
    return this.groupState ? 'On' : 'Off';
  }

  getCardStyleClass(): string {
    const i = this.card.items[0];
    if (i?.type === 'device') return i.state ? 'card--on' : 'card--off';
    if (i?.type === 'sensor') {
      const label = i.label?.toLowerCase();
      if (label?.includes('temp')) return 'card--temp';
      if (label?.includes('humidity')) return 'card--humidity';
      return i.value?.amount ? 'card--occupied' : 'card--clear';
    }
    return 'card--clear';
  }
}
