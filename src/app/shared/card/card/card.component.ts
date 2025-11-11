import { Component, Input, computed } from '@angular/core';
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

  get groupState(): boolean {
    return this.devices.some((d) => d.state);
  }

  readonly cardStyleClass = computed(() => {
    const firstItem = this.card.items[0];
    if (firstItem?.type === 'device') {
      return firstItem.state ? 'card--on' : 'card--off';
    }
    if (firstItem?.type === 'sensor') {
      const label = firstItem.label?.toLowerCase();
      if (label?.includes('temp')) return 'card--temp';
      if (label?.includes('humidity')) return 'card--humidity';
      return firstItem.value?.amount ? 'card--occupied' : 'card--clear';
    }
    return 'card--clear';
  });

  getStatusLabel(): string {
    return this.groupState ? 'On' : 'Off';
  }

  toggleGroup(): void {
    const newState = !this.groupState;

    this.card.items = this.card.items.map((item) => {
      if (item.type === 'device') {
        return { ...item, state: newState };
      }
      return item;
    });
  }

  onDeviceToggled(device: Device, newState: boolean): void {
    this.card.items = this.card.items.map((item) =>
      item === device ? { ...item, state: newState } : item,
    );
  }
}
