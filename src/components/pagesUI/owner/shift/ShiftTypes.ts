// ShiftTypes.ts
export interface IShift {
  [key: string]: any;
  shiftId: number;
  shiftName: string;
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  isNightShift?: boolean;
  gracePeriod?: number; // in minutes
  breakTimeSlots: BreakTimeSlot[];
  applicableLocations?: string[];
  activeStatus: boolean;
  assignedEmployees?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BreakTimeSlot {
  breakId?: number;
  breakStart: string; // Format: "HH:MM"
  breakEnd: string;   // Format: "HH:MM"
}

export interface IShiftForm {
  shiftName: string;
  startTime: string;
  endTime: string;
  isNightShift: boolean;
  gracePeriod?: number;
  breakTimeSlots: BreakTimeSlot[];
  applicableLocations?: string[];
  activeStatus: boolean;
}

// Mock locations data
export const OFFICE_LOCATIONS = [
  "Mumbai HQ",
  "Delhi Corporate Office",
  "Bangalore Branch",
  "Hyderabad Operations",
  "Chennai Branch",
  "Pune Support Center",
  "Kolkata East Branch",
  "Ahmedabad Zone Office",
  "Jaipur Regional Branch",
  "Surat Office"
];

// Time options for dropdowns (15 minute intervals)
export const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  return {
    value: timeString,
    label: timeString
  };
});

// Helper functions
export const calculateDuration = (startTime: string, endTime: string, isNightShift: boolean = false): string => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  if (isNightShift) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const calculateTotalBreakTime = (breakSlots: BreakTimeSlot[]): number => {
  return breakSlots.reduce((total, breakSlot) => {
    const start = new Date(`2000-01-01T${breakSlot.breakStart}`);
    const end = new Date(`2000-01-01T${breakSlot.breakEnd}`);
    const diffMs = end.getTime() - start.getTime();
    return total + Math.floor(diffMs / (1000 * 60));
  }, 0);
};