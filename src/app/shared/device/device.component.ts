import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import * as DashboardActions from 'app/store/dashboard/dashboard.actions';
import { Device } from 'app/core/models/models';

export interface DeviceModel {
  icon: string;
  label: string;
  state: boolean;
  id: string;
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
  @Input() device!: Device;

  private store = inject(Store);
  onToggle(): void {
    this.store.dispatch(
      DashboardActions.toggleDeviceState({
        deviceId: this.device.id,

        state: !this.device.state,
      }),
    );
  }
}
