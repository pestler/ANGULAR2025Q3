export interface DashboardTab {
  id: string;
  title: string;
}

export interface Dashboard {
  id: string;
  title: string;
  icon: string;
  tabs?: DashboardTab[];
}
