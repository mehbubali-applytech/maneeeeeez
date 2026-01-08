// src/data/leave-data.ts

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface ILeave {
  id: number;
  [key: string]: any;
  leaveId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: string;
  reason?: string;
  appliedOn: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedDate?: string;
}

// Leave Requests Data for HR Dashboard
export const leaveRequestsData: ILeave[] = [
  {
    id: 1,
    leaveId: "LEAVE-2024-001",
    employeeName: "John Doe",
    employeeAvatar: "/assets/images/avatar/avatar1.png",
    department: "Engineering",
    leaveType: "Sick Leave",
    fromDate: "2024-01-15",
    toDate: "2024-01-17",
    duration: "3 days",
    reason: "High fever and doctor's advice",
    appliedOn: "2024-01-10",
    status: "Pending",
  },
  {
    id: 2,
    leaveId: "LEAVE-2024-002",
    employeeName: "Jane Smith",
    employeeAvatar: "/assets/images/avatar/avatar2.png",
    department: "Marketing",
    leaveType: "Annual Leave",
    fromDate: "2024-01-20",
    toDate: "2024-01-25",
    duration: "6 days",
    reason: "Family vacation",
    appliedOn: "2024-01-05",
    status: "Pending",
  },
  {
    id: 3,
    leaveId: "LEAVE-2024-003",
    employeeName: "Robert Johnson",
    employeeAvatar: "/assets/images/avatar/avatar3.png",
    department: "Sales",
    leaveType: "Emergency Leave",
    fromDate: "2024-01-18",
    toDate: "2024-01-18",
    duration: "1 day",
    reason: "Medical emergency",
    appliedOn: "2024-01-17",
    status: "Approved",
    approvedBy: "HR Manager",
    approvedDate: "2024-01-17",
  },
  {
    id: 4,
    leaveId: "LEAVE-2024-004",
    employeeName: "Sarah Williams",
    employeeAvatar: "/assets/images/avatar/avatar4.png",
    department: "HR",
    leaveType: "Maternity Leave",
    fromDate: "2024-02-01",
    toDate: "2024-04-30",
    duration: "90 days",
    reason: "Maternity",
    appliedOn: "2024-01-08",
    status: "Pending",
  },
  {
    id: 5,
    leaveId: "LEAVE-2024-005",
    employeeName: "Michael Brown",
    employeeAvatar: "/assets/images/avatar/avatar5.png",
    department: "Finance",
    leaveType: "Casual Leave",
    fromDate: "2024-01-22",
    toDate: "2024-01-23",
    duration: "2 days",
    reason: "Personal work",
    appliedOn: "2024-01-15",
    status: "Pending",
  },
  {
    id: 6,
    leaveId: "LEAVE-2024-006",
    employeeName: "Emily Davis",
    employeeAvatar: "/assets/images/avatar/avatar6.png",
    department: "Engineering",
    leaveType: "Sick Leave",
    fromDate: "2024-01-25",
    toDate: "2024-01-26",
    duration: "2 days",
    reason: "Migraine and rest needed",
    appliedOn: "2024-01-20",
    status: "Rejected",
    approvedBy: "HR Manager",
    approvedDate: "2024-01-21",
  },
  {
    id: 7,
    leaveId: "LEAVE-2024-007",
    employeeName: "David Wilson",
    employeeAvatar: "/assets/images/avatar/avatar7.png",
    department: "Operations",
    leaveType: "Annual Leave",
    fromDate: "2024-02-10",
    toDate: "2024-02-15",
    duration: "6 days",
    reason: "Holiday trip",
    appliedOn: "2024-01-12",
    status: "Pending",
  },
  {
    id: 8,
    leaveId: "LEAVE-2024-008",
    employeeName: "Lisa Anderson",
    employeeAvatar: "/assets/images/avatar/avatar8.png",
    department: "Marketing",
    leaveType: "Paternity Leave",
    fromDate: "2024-03-01",
    toDate: "2024-03-15",
    duration: "15 days",
    reason: "Newborn baby",
    appliedOn: "2024-01-10",
    status: "Approved",
    approvedBy: "HR Manager",
    approvedDate: "2024-01-11",
  },
  {
    id: 9,
    leaveId: "LEAVE-2024-009",
    employeeName: "Kevin Taylor",
    employeeAvatar: "/assets/images/avatar/avatar9.png",
    department: "Sales",
    leaveType: "Casual Leave",
    fromDate: "2024-01-30",
    toDate: "2024-01-30",
    duration: "1 day",
    reason: "Wedding anniversary",
    appliedOn: "2024-01-25",
    status: "Pending",
  },
  {
    id: 10,
    leaveId: "LEAVE-2024-010",
    employeeName: "Amanda Clark",
    employeeAvatar: "/assets/images/avatar/avatar10.png",
    department: "Finance",
    leaveType: "Sick Leave",
    fromDate: "2024-01-19",
    toDate: "2024-01-19",
    duration: "1 day",
    reason: "Dental appointment",
    appliedOn: "2024-01-18",
    status: "Pending",
  },
];

// Additional data for other HR components
export interface IAttendance {
  id: number;
  employeeId: string;
  employeeName: string;
  avatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent" | "Half Day";
  workingHours: string;
  overtime?: string;
}

export const attendanceTodayData: IAttendance[] = [
  {
    id: 1,
    employeeId: "EMP-001",
    employeeName: "John Doe",
    avatar: "/assets/images/avatar/avatar1.png",
    department: "Engineering",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workingHours: "9h",
    overtime: "1h",
  },
  {
    id: 2,
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    avatar: "/assets/images/avatar/avatar2.png",
    department: "Marketing",
    date: "2024-01-15",
    checkIn: "09:15 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workingHours: "8h 45m",
    overtime: "0h",
  },
  {
    id: 3,
    employeeId: "EMP-003",
    employeeName: "Robert Johnson",
    avatar: "/assets/images/avatar/avatar3.png",
    department: "Sales",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workingHours: "9h",
    overtime: "0h",
  },
  {
    id: 4,
    employeeId: "EMP-004",
    employeeName: "Sarah Williams",
    avatar: "/assets/images/avatar/avatar4.png",
    department: "HR",
    date: "2024-01-15",
    checkIn: "08:45 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workingHours: "9h 15m",
    overtime: "1h 15m",
  },
  {
    id: 5,
    employeeId: "EMP-005",
    employeeName: "Michael Brown",
    avatar: "/assets/images/avatar/avatar5.png",
    department: "Finance",
    date: "2024-01-15",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    status: "Late",
    workingHours: "9h",
    overtime: "0h",
  },
  {
    id: 6,
    employeeId: "EMP-006",
    employeeName: "Emily Davis",
    avatar: "/assets/images/avatar/avatar6.png",
    department: "Engineering",
    date: "2024-01-15",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workingHours: "8h 30m",
    overtime: "0h",
  },
  {
    id: 7,
    employeeId: "EMP-007",
    employeeName: "David Wilson",
    avatar: "/assets/images/avatar/avatar7.png",
    department: "Operations",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    status: "Half Day",
    workingHours: "8h",
    overtime: "0h",
  },
  {
    id: 8,
    employeeId: "EMP-008",
    employeeName: "Lisa Anderson",
    avatar: "/assets/images/avatar/avatar8.png",
    department: "Marketing",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workingHours: "9h",
    overtime: "0h",
  },
];

export interface ILateArrival {
  id: number;
  employeeName: string;
  avatar: string;
  lateBy: string;
  department: string;
  checkInTime: string;
  scheduledTime: string;
  occurrences: number;
}

export const lateArrivalsData: ILateArrival[] = [
  {
    id: 1,
    employeeName: "Jane Smith",
    avatar: "/assets/images/avatar/avatar2.png",
    lateBy: "15 mins",
    department: "Marketing",
    checkInTime: "09:15 AM",
    scheduledTime: "09:00 AM",
    occurrences: 3,
  },
  {
    id: 2,
    employeeName: "Michael Brown",
    avatar: "/assets/images/avatar/avatar5.png",
    lateBy: "60 mins",
    department: "Finance",
    checkInTime: "10:00 AM",
    scheduledTime: "09:00 AM",
    occurrences: 5,
  },
  {
    id: 3,
    employeeName: "Emily Davis",
    avatar: "/assets/images/avatar/avatar6.png",
    lateBy: "30 mins",
    department: "Engineering",
    checkInTime: "09:30 AM",
    scheduledTime: "09:00 AM",
    occurrences: 2,
  },
  {
    id: 4,
    employeeName: "David Wilson",
    avatar: "/assets/images/avatar/avatar7.png",
    lateBy: "20 mins",
    department: "Operations",
    checkInTime: "09:20 AM",
    scheduledTime: "09:00 AM",
    occurrences: 1,
  },
  {
    id: 5,
    employeeName: "Kevin Taylor",
    avatar: "/assets/images/avatar/avatar9.png",
    lateBy: "45 mins",
    department: "Sales",
    checkInTime: "09:45 AM",
    scheduledTime: "09:00 AM",
    occurrences: 4,
  },
];

export interface IDepartmentAttendance {
  department: string;
  presentCount: number;
  totalCount: number;
  attendanceRate: number;
  change: number;
  lateCount: number;
  absentCount: number;
}

export const departmentAttendanceData: IDepartmentAttendance[] = [
  {
    department: "Engineering",
    presentCount: 45,
    totalCount: 50,
    attendanceRate: 90,
    change: 2,
    lateCount: 3,
    absentCount: 2,
  },
  {
    department: "Marketing",
    presentCount: 30,
    totalCount: 35,
    attendanceRate: 85.7,
    change: -1,
    lateCount: 4,
    absentCount: 1,
  },
  {
    department: "Sales",
    presentCount: 55,
    totalCount: 60,
    attendanceRate: 91.7,
    change: 3,
    lateCount: 2,
    absentCount: 3,
  },
  {
    department: "HR",
    presentCount: 15,
    totalCount: 15,
    attendanceRate: 100,
    change: 0,
    lateCount: 0,
    absentCount: 0,
  },
  {
    department: "Finance",
    presentCount: 25,
    totalCount: 30,
    attendanceRate: 83.3,
    change: 5,
    lateCount: 3,
    absentCount: 2,
  },
  {
    department: "Operations",
    presentCount: 40,
    totalCount: 45,
    attendanceRate: 88.9,
    change: 2,
    lateCount: 1,
    absentCount: 4,
  },
];

// Today's summary data
export interface ITodaySummary {
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  remote: number;
  halfDay: number;
}

// Fixed: Removed the duplicate export
const todaySummaryData: ITodaySummary = {
  present: 240,
  late: 18,
  absent: 55,
  onLeave: 32,
  remote: 12,
  halfDay: 8,
};
