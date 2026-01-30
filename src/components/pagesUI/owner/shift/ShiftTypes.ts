// ShiftTypes.ts
export interface IShift {
  shift_id: number;
  client_id: number;
  shift_name: string;
  start_time: string; // Format: "HH:MM:SS"
  end_time: string;   // Format: "HH:MM:SS"
  is_night_shift: boolean;
  grace_period: number;
  break_time_slots: BreakTimeSlot[];
  active_status: boolean;
  assigned_employees?: number;
  created_at: string;
  updated_at: string;
  Branches?: IBranch[];
}

export interface IBranch {
  branch_id: number;
  branch_name: string;
  [key: string]: any;
}

export interface BreakTimeSlot {
  breakStart: string; // Format: "HH:MM"
  breakEnd: string;   // Format: "HH:MM"
}

export interface IShiftForm {
  shift_name: string;
  start_time: string;
  end_time: string;
  is_night_shift: boolean;
  grace_period: number;
  break_time_slots: BreakTimeSlot[];
  branch_ids: number[];
  active_status: boolean;
}