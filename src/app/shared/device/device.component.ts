import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface DeviceModel {
  icon: string;
  label: string;
  state: boolean;
}

@Component({
  selector: 'app-device',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent {
  @Input() device!: DeviceModel;
  @Input() index!: number;
  @Input() state!: boolean;
  @Output() stateChange = new EventEmitter<boolean>();

  onToggle(): void {
    this.stateChange.emit(!this.state);
  }

  get statusColor(): 'primary' | 'warn' {
    return this.device.state ? 'primary' : 'warn';
  }
}
