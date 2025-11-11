import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import * as DashboardSelectors from 'dashboard-data-access';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardApiService } from 'dashboard-data-access';
import * as DashboardActions from 'dashboard-data-access';
import { SmartCard, SmartItem } from '@core/models/models';
import { DragDropModule } from '@angular/cdk/drag-drop';

export interface EditCardDialogData {
  tabId: string;
  card: SmartCard;
}

@Component({
  selector: 'app-edit-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DragDropModule,
  ],
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: ['./edit-card-dialog.component.scss'],
})
export class EditCardDialogComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly apiService = inject(DashboardApiService);
  private readonly dialogData: EditCardDialogData = inject(MAT_DIALOG_DATA);

  isLoading = signal(true);
  availableEntities = signal<SmartItem[]>([]);
  private readonly destroy$ = new Subject<void>();

  readonly card$ = this.store.select(
    DashboardSelectors.selectCardById(
      this.dialogData.tabId,
      this.dialogData.card.id,
    ),
  );

  readonly card = toSignal(this.card$);

  cardTitleControl = new FormControl(this.dialogData.card.title, {
    nonNullable: true,
  });
  selectedEntityControl = new FormControl<SmartItem | null>(null);

  readonly filteredEntities = computed(() => {
    const all = this.availableEntities();
    const currentCard = this.card();
    if (!currentCard) return [];

    const existingIds = new Set(currentCard.items.map((item) => item.id));
    return all.filter((entity) => !existingIds.has(entity.id));
  });

  ngOnInit(): void {
    this.apiService.getAvailableEntities().subscribe((entities) => {
      this.availableEntities.set(entities);
      this.isLoading.set(false);
    });

    this.cardTitleControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((newTitle) => {
        this.store.dispatch(
          DashboardActions.updateCardTitle({
            tabId: this.dialogData.tabId,
            cardId: this.dialogData.card.id,
            newTitle: newTitle,
          }),
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem(): void {
    const selectedItem = this.selectedEntityControl.value;
    if (!selectedItem) return;

    this.store.dispatch(
      DashboardActions.addItemToCard({
        tabId: this.dialogData.tabId,
        cardId: this.dialogData.card.id,
        item: selectedItem,
      }),
    );
    this.selectedEntityControl.reset();
  }

  removeItem(itemId: string): void {
    this.store.dispatch(
      DashboardActions.removeItemFromCard({
        tabId: this.dialogData.tabId,
        cardId: this.dialogData.card.id,
        itemId: itemId,
      }),
    );
  }
}
