export interface DashboardCardData {
  iconClass: string;
  title: string;
  value: number | string;
  description?: string;
  percentageChange?: string;
  isIncrease: boolean;
}
