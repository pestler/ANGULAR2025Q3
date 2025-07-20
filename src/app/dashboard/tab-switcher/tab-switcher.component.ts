import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface TabItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tab-switcher.component.html',
  styleUrls: ['./tab-switcher.component.scss'],
})
export class TabSwitcherComponent {
  tabs: TabItem[] = [
    { label: 'Overview', route: '/overview' },
    { label: 'Lights', route: '/lights' },
  ];
}
