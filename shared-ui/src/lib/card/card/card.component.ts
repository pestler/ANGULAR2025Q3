import {
  Component,
  Input,
  computed,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DeviceComponent } from '../../device/device.component';
import { SensorComponent } from '../../sensor/sensor.component';
import type { SmartCard, Device, Sensor } from '@core/models/models';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import * as DashboardActions from 'dashboard-data-access';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatMenuModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() isEditMode = false;
  @Input() tabId = '';
  @Input() index = 0;
  @Input() totalCards = 0;
  @Output() edit = new EventEmitter<MatIconButton>();
  private store = inject(Store);
  private dialog = inject(MatDialog);

  public readonly cardSignal = signal<SmartCard>({
    id: '',
    title: '',
    layout: 'verticalLayout',
    items: [],
  });
  @Input({ required: true }) set card(value: SmartCard) {
    this.cardSignal.set(value);
  }

  readonly devices = computed(() =>
    this.cardSignal().items.filter((i): i is Device => i.type === 'device'),
  );
  readonly sensors = computed(() =>
    this.cardSignal().items.filter((i): i is Sensor => i.type === 'sensor'),
  );
  readonly showGroupToggle = computed(() => this.devices().length >= 2);
  readonly groupState = computed(() => this.devices().some((d) => d.state));
  readonly groupStatusLabel = computed(() =>
    this.groupState() ? 'On' : 'Off',
  );

  readonly cardStyleClass = computed(() => {
    const firstItem = this.cardSignal().items[0];
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

  get layoutVariant(): 'horizontal' | 'vertical' | 'single' {
    switch (this.cardSignal().layout) {
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

  toggleGroup(): void {
    const newState = !this.groupState();
    const deviceIds = this.devices().map((d) => d.id);
    this.store.dispatch(
      DashboardActions.toggleDeviceGroupState({ deviceIds, newState }),
    );
  }

  removeCard(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Card',
        message: 'Are you sure you want to delete this card?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(
          DashboardActions.removeCard({
            tabId: this.tabId,

            cardId: this.cardSignal().id,
          }),
        );
      }
    });
  }

  reorderCard(direction: 'up' | 'down'): void {
    this.store.dispatch(
      DashboardActions.reorderCard({
        tabId: this.tabId,

        cardId: this.cardSignal().id,
        direction,
      }),
    );
  }
}
