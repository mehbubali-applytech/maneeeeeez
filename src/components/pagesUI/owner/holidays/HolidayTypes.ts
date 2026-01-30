// HolidayTypes.ts
export interface IHoliday {
  // Backend fields
  id: number;
  holiday_id: string;
  name: string;
  holiday_date: string;
  description?: string;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
  
  // Frontend display fields (compatibility)
  date: string; // Alias for holiday_date
  holidayId?: string; // Alias for holiday_id
  
  // Index signature for RowObject compatibility
  [key: string]: any;
}

export interface HolidayFormData {
  holiday_id?: string;
  name: string;
  holiday_date: string;
  description?: string;
  status?: "Active" | "Inactive";
}