import { Dashboard } from './dashboard.model';
import { Tab } from './models';

export interface FullDashboard extends Omit<Dashboard, 'tabs'> {
  tabs: Tab[];
}

export interface NewDashboardPayload {
  id: string;
  title: string;
  icon: string;
}
