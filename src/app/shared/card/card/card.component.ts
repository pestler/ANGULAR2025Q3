import {
  Component,
  Input,
  computed,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DeviceComponent } from 'app/shared/device/device.component';
import { SensorComponent } from 'app/shared/sensor/sensor.component';
import type { SmartCard, Device, Sensor } from 'app/core/models/models';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import * as DashboardActions from 'app/store/dashboard/dashboard.actions';
import { ConfirmationDialogComponent } from 'app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
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
  @Input({ required: true }) card!: SmartCard;
  @Input() isEditMode = false;
  @Input() tabId = '';
  @Input() index = 0;
  @Input() totalCards = 0;
  @Output() edit = new EventEmitter<MatIconButton>();
  private store = inject(Store);
  private dialog = inject(MatDialog);

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

  editCard(): void {}

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
            cardId: this.card.id,
          }),
        );
      }
    });
  }
  reorderCard(direction: 'up' | 'down'): void {
    this.store.dispatch(
      DashboardActions.reorderCard({
        tabId: this.tabId,
        cardId: this.card.id,
        direction,
      }),
    );
  }
}
