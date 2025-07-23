import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeviceModel {
  icon: string;
  label: string;
  state: boolean;
}

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent {
  @Input() device!: DeviceModel;

  toggle(): void {
    this.device.state = !this.device.state;
  }
}
