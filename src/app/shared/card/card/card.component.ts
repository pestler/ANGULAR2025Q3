import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModel } from 'app/core/models/card.model';
import { DeviceComponent } from 'app/shared/device/device.component';
import { HighlightDirective } from 'app/shared/directives/highlight.directive';
import { SensorComponent } from 'app/shared/sensor/sensor.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DeviceComponent, SensorComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  hostDirectives: [HighlightDirective],
})
export class CardComponent {
  @Input() card!: CardModel;
}
