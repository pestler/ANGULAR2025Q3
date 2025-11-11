import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import type { SmartCard } from 'app/core/models/models';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  @Input() cards: SmartCard[] = [];
}
