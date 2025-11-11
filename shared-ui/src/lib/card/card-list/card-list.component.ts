import { Component, inject, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import type { SmartCard } from '@core/models/models';
import { EditCardDialogComponent } from '../../dialogs/edit-card-dialog/edit-card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  @Input() cards: SmartCard[] = [];
  @Input() isEditMode = false;
  @Input() tabId = '';
  private readonly dialog = inject(MatDialog);

  onEditCard(card: SmartCard, trigger: MatIconButton): void {
    const triggerRect = (
      trigger._elementRef.nativeElement as HTMLElement
    ).getBoundingClientRect();

    this.dialog.open(EditCardDialogComponent, {
      //width: '500px',
      data: {
        tabId: this.tabId,
        card: card,
      },
      autoFocus: false,
      position: {
        top: `${triggerRect.top}px`,
        right: `${window.innerWidth - triggerRect.left + 8}px`,
      },
    });
  }
}
