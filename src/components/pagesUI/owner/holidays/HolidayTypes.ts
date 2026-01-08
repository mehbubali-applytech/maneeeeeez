export interface IHoliday {
  id: number;
  [key: string]: any;
  holidayId: string;
  name: string;
  date: string;
  description?: string;
  created_at: string;
  status: "Active" | "Inactive";
}
