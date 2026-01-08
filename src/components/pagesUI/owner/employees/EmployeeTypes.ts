// EmployeeTypes.ts
export interface IEmployee {
  [key: string]: any;
  employeeId: string;
  employeeCode?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  profilePhoto?: string;

  // Personal Address
  presentAddress: IAddress;
  permanentAddress?: IAddress;
  sameAsPresentAddress: boolean;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Job Details
  dateOfJoining: string;
  probationEndDate?: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  workLocationId: number;
  workLocationName: string;
  shiftId?: number;
  shiftName?: string;
  workType: "Full-time" | "Part-time" | "Contract" | "Intern";
  employmentStatus:
    | "Active"
    | "On Probation"
    | "Resigned"
    | "Terminated"
    | "Draft";
  contractStartDate?: string;
  contractEndDate?: string;

  // Salary & Compensation
  salaryGrade?: string;
  costToCompany?: number;
  salaryStructure?: ISalaryStructure;
  bankDetails?: IBankDetails;
  payFrequency: "Monthly" | "Weekly" | "Bi-weekly";

  // Documents
  documents: IDocument[];

  // Attendance & Access
  attendanceType: "App" | "Biometric" | "GPS";
  presentDayStatus?: "Present" | "Absent" | "On Leave" | "Work From Home";
  attendanceSummary?: IAttendanceSummary; // ✅ New: Backend-calculated summary
  absenceDaysThisMonth?: number; // ✅ Kept for backward compatibility
  presentDaysThisMonth?: number; // ✅ Kept for backward compatibility
  leaveDaysThisMonth?: number; // ✅ Kept for backward compatibility
  holidayDaysThisMonth?: number; // ✅ Kept for backward compatibility
  attendancePercentage?: number; // ✅ Kept for backward compatibility

  geoFence?: IGeoFence;
  systemUserEnabled: boolean;
  username?: string;
  roles?: string[];
  temporaryAccessUntil?: string;

  // System
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  status: "Active" | "Inactive" | "Draft";
}

export interface IAttendanceSummary {
  present: number;
  absent: number;
  leave: number;
  holiday: number;
  workingDays: number; // present + absent
  totalDays: number; // present + absent + leave + holiday
  percentage: number; // (present / workingDays) * 100
  lateArrivals: number;
  earlyDepartures: number;
  overtimeHours: number;
  regularHours: number;
  averageHoursPerDay: number;
}

export const getAttendanceData = (employee: IEmployee) => {
  // Prefer backend-calculated summary
  if (employee.attendanceSummary) {
    return {
      presentDays: employee.attendanceSummary.present,
      absentDays: employee.attendanceSummary.absent,
      leaveDays: employee.attendanceSummary.leave,
      holidayDays: employee.attendanceSummary.holiday,
      workingDays: employee.attendanceSummary.workingDays,
      totalDays: employee.attendanceSummary.totalDays,
      attendanceRate: employee.attendanceSummary.percentage,
    };
  }

  // Fallback to individual fields (with nullish coalescing)
  const presentDays = employee.presentDaysThisMonth ?? 0;
  const absentDays = employee.absenceDaysThisMonth ?? 0;
  const leaveDays = employee.leaveDaysThisMonth ?? 0;
  const holidayDays = employee.holidayDaysThisMonth ?? 0;
  const workingDays = presentDays + absentDays;
  const totalDays = presentDays + absentDays + leaveDays + holidayDays;

  // Calculate rate with safe fallback
  const attendanceRate =
    employee.attendancePercentage ??
    (workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0);

  return {
    presentDays,
    absentDays,
    leaveDays,
    holidayDays,
    workingDays,
    totalDays,
    attendanceRate,
  };
};

export const createRealisticMockEmployee = (
  overrides?: Partial<IEmployee>
): IEmployee => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Generate realistic attendance data
  const workingDays = 22; // Typical working days
  const presentDays = Math.floor(Math.random() * (workingDays - 14) + 14); // 14-21 days
  const leaveDays = Math.floor(Math.random() * 5); // 0-4 days
  const holidayDays = Math.floor(Math.random() * 3) + 1; // 1-3 days
  const absentDays = Math.max(0, workingDays - presentDays - leaveDays);
  const totalDays = presentDays + absentDays + leaveDays + holidayDays;
  const attendancePercentage = Math.round((presentDays / workingDays) * 100);

  const statuses: Array<"Present" | "Absent" | "On Leave" | "Work From Home"> =
    ["Present", "Absent", "On Leave", "Work From Home"];

  const baseEmployee: IEmployee = {
    employeeId: `EMP${Date.now().toString().slice(-6)}`,
    employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+91 9876543210",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    dateOfJoining: new Date(currentYear, currentMonth - 6, 1)
      .toISOString()
      .split("T")[0],
    roleId: 1,
    roleName: "Software Engineer",
    departmentId: 1,
    departmentName: "Engineering",
    workLocationId: 1,
    workLocationName: "Bangalore Office",
    workType: "Full-time",
    employmentStatus: "Active",
    attendanceType: "Biometric",
    status: "Active",
    presentAddress: {
      addressLine1: "123 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560001",
    },
    emergencyContactName: "Jane Doe",
    emergencyContactRelation: "Spouse",
    emergencyContactPhone: "+91 9876543211",
    documents: [],
    costToCompany: 1200000,
    payFrequency: "Monthly",
    systemUserEnabled: true,
    username: "john.doe",
    roles: ["Employee", "Developer"],
    sameAsPresentAddress: true,

    // ✅ New: Backend-calculated summary (preferred)
    attendanceSummary: {
      present: presentDays,
      absent: absentDays,
      leave: leaveDays,
      holiday: holidayDays,
      workingDays: workingDays,
      totalDays: totalDays,
      percentage: attendancePercentage,
      lateArrivals: Math.floor(Math.random() * 3),
      earlyDepartures: Math.floor(Math.random() * 2),
      overtimeHours: Math.floor(Math.random() * 10),
      regularHours: presentDays * 8,
      averageHoursPerDay: 8.2 + Math.random() * 0.8,
    },

    // ✅ Kept for backward compatibility
    presentDayStatus: statuses[Math.floor(Math.random() * statuses.length)],
    presentDaysThisMonth: presentDays,
    absenceDaysThisMonth: absentDays,
    leaveDaysThisMonth: leaveDays,
    holidayDaysThisMonth: holidayDays,
    attendancePercentage: attendancePercentage,

    // Geo-fencing
    geoFence: {
      latitude: 12.9716,
      longitude: 77.5946,
      radius: 500,
      address: "Tech Park, Bangalore",
    },

    // System
    createdAt: new Date(currentYear, currentMonth - 6, 1).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "Admin",
    updatedBy: "Admin",
  };

  return { ...baseEmployee, ...overrides };
};

// Usage example in components:
export const ExampleUsage = () => {
  // In your component, use the helper function:
  const employee = createRealisticMockEmployee();
  const attendance = getAttendanceData(employee);

  // Clean, safe access to data:
  console.log({
    presentDays: attendance.presentDays,
    attendanceRate: attendance.attendanceRate,
    workingDays: attendance.workingDays,
  });
};

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ISalaryStructure {
  basicPay: number;
  hra: number;
  allowances: IAllowance[];
  deductions: IDeduction[];
}

export interface IAllowance {
  name: string;
  amount: number;
  type: "Fixed" | "Variable";
  taxable: boolean;
}

export interface IDeduction {
  name: string;
  amount: number;
  type: "Fixed" | "Percentage";
}

export interface IBankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
}

export interface IDocument {
  id: string;
  type: "ID Proof" | "Offer Letter" | "Joining Form" | "Other";
  documentType?: "Aadhaar" | "PAN" | "Passport" | "Driving License";
  documentNumber?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedDate: string;
  verified: boolean;
}

export interface IGeoFence {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  address?: string;
}

export interface IEmployeeForm {
  // Personal Info
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  profilePhoto?: File | string;

  // Address
  presentAddress: IAddress;
  sameAsPresentAddress: boolean;
  permanentAddress?: IAddress;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Job Details
  dateOfJoining: string;
  probationEndDate?: string;
  roleId: number;
  departmentId: number;
  reportingManagerId?: string;
  workLocationId: number;
  shiftId?: number;
  workType: "Full-time" | "Part-time" | "Contract" | "Intern";
  employmentStatus:
    | "Active"
    | "On Probation"
    | "Resigned"
    | "Terminated"
    | "Draft";
  contractStartDate?: string;
  contractEndDate?: string;

  // Salary
  salaryGrade?: string;
  costToCompany?: number;
  basicPay?: number;
  hra?: number;
  allowances: IAllowance[];
  deductions: IDeduction[];

  // Bank Details
  bankAccountName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  payFrequency: "Monthly" | "Weekly" | "Bi-weekly";

  // Documents
  documents: IDocument[];
  newDocuments: File[];

  // Attendance & Access
  attendanceType: "App" | "Biometric" | "GPS";
  geoFence?: IGeoFence;
  systemUserEnabled: boolean;
  username?: string;
  roleIds?: number[];
  temporaryAccessUntil?: string;
}

// Mock Data
export const GENDER_OPTIONS = [
  { value: "Male", label: "Male", icon: "♂" },
  { value: "Female", label: "Female", icon: "♀" },
  { value: "Other", label: "Other", icon: "⚧" },
];

export const WORK_TYPE_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Intern", label: "Intern" },
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "Active", label: "Active", color: "success" },
  { value: "On Probation", label: "On Probation", color: "warning" },
  { value: "Resigned", label: "Resigned", color: "info" },
  { value: "Terminated", label: "Terminated", color: "error" },
  { value: "Draft", label: "Draft", color: "default" },
];

export const ATTENDANCE_TYPE_OPTIONS = [
  { value: "App", label: "Mobile App" },
  { value: "Biometric", label: "Biometric" },
  { value: "GPS", label: "GPS Tracking" },
];

export const ID_PROOF_TYPES = [
  { value: "Aadhaar", label: "Aadhaar Card" },
  { value: "PAN", label: "PAN Card" },
  { value: "Passport", label: "Passport" },
  { value: "Driving License", label: "Driving License" },
];

export const PAY_FREQUENCY_OPTIONS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
  { value: "Bi-weekly", label: "Bi-weekly" },
];

// Helper function to create a mock employee
export const createMockEmployee = (
  overrides?: Partial<IEmployee>
): IEmployee => {
  const baseEmployee: IEmployee = {
    employeeId: `EMP${Date.now().toString().slice(-6)}`,
    employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+91 9876543210",
    dateOfJoining: new Date().toISOString().split("T")[0],
    roleId: 1,
    roleName: "Software Engineer",
    departmentId: 1,
    departmentName: "Engineering",
    workLocationId: 1,
    workLocationName: "Bangalore Branch",
    workType: "Full-time",
    employmentStatus: "Active",
    attendanceType: "Biometric",
    status: "Active",
    presentAddress: {
      addressLine1: "123 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560001",
    },
    emergencyContactName: "Suresh Kumar",
    emergencyContactRelation: "Father",
    emergencyContactPhone: "+91 9876543211",
    documents: [],
    costToCompany: 1200000,
    payFrequency: "Monthly",
    systemUserEnabled: true,
    username: "john.doe",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "Admin",
    updatedBy: "Admin",
    sameAsPresentAddress: true,
  };

  return { ...baseEmployee, ...overrides };
};

// Helper function to create mock employees
export const createMockEmployees = (count: number): IEmployee[] => {
  const names = [
    { first: "Rajesh", last: "Kumar" },
    { first: "Priya", last: "Sharma" },
    { first: "Amit", last: "Patel" },
    { first: "Sneha", last: "Reddy" },
    { first: "Vikram", last: "Singh" },
    { first: "Anjali", last: "Gupta" },
    { first: "Rahul", last: "Verma" },
    { first: "Meera", last: "Joshi" },
  ];

  const departments = [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Sales" },
    { id: 4, name: "HR" },
  ];

  const roles = [
    { id: 1, name: "Software Engineer" },
    { id: 2, name: "Senior Software Engineer" },
    { id: 3, name: "Team Lead" },
    { id: 4, name: "Project Manager" },
  ];

  return Array.from({ length: count }, (_, index) => {
    const name = names[index % names.length];
    const department = departments[index % departments.length];
    const role = roles[index % roles.length];

    return createMockEmployee({
      employeeId: `EMP${String(index + 1).padStart(3, "0")}`,
      employeeCode: `EMP${index + 1000}`,
      firstName: name.first,
      lastName: name.last,
      email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@company.com`,
      roleId: role.id,
      roleName: role.name,
      departmentId: department.id,
      departmentName: department.name,
      workLocationId: (index % 3) + 1,
      workLocationName: ["Mumbai HQ", "Delhi Office", "Bangalore Branch"][
        index % 3
      ],
      employmentStatus: index % 4 === 0 ? "On Probation" : "Active",
      workType: index % 5 === 0 ? "Contract" : "Full-time",
      costToCompany: 800000 + index * 50000,
      systemUserEnabled: index % 3 !== 0,
    });
  });
};

// ================= Birthday Types & Functions =================

export interface INextBirthday {
  date: Date;
  daysUntil: number;
}

export interface IEmployeeBirthday extends IEmployee {
  fullName: string; // Derived
  age: number; // Calculated from DOB
  nextBirthday: INextBirthday;
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Validate date
  if (isNaN(birthDate.getTime())) {
    console.error("Invalid date of birth:", dateOfBirth);
    return 0;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year yet
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Get next birthday date and days until
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns Object with next birthday date and days until
 */
export const getNextBirthday = (dateOfBirth: string): INextBirthday => {
  if (!dateOfBirth) {
    return {
      date: new Date(),
      daysUntil: 0,
    };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Validate date
  if (isNaN(birthDate.getTime())) {
    console.error("Invalid date of birth:", dateOfBirth);
    return {
      date: new Date(),
      daysUntil: 0,
    };
  }

  // Set birth date for current year
  const currentYear = today.getFullYear();
  let nextBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // If birthday has already passed this year, set for next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  // Calculate days until next birthday
  const diffTime = nextBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    date: nextBirthday,
    daysUntil,
  };
};

/**
 * Check if birthday is in a specific period
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param period - Period to check ('week', 'month', 'nextMonth')
 * @returns Boolean indicating if birthday is in the period
 */
export const isBirthdayInPeriod = (
  dateOfBirth: string,
  period: "week" | "month" | "nextMonth"
): boolean => {
  if (!dateOfBirth) return false;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const nextBirthday = getNextBirthday(dateOfBirth);

  // Validate date
  if (isNaN(birthDate.getTime())) return false;

  switch (period) {
    case "week":
      // Check if next birthday is within next 7 days
      return nextBirthday.daysUntil <= 7;

    case "month":
      // Check if birthday is in current month
      return birthDate.getMonth() === today.getMonth();

    case "nextMonth":
      // Check if birthday is in next month
      const nextMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
      return birthDate.getMonth() === nextMonth;

    default:
      return false;
  }
};

/**
 * Check if birthday is today
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns Boolean indicating if birthday is today
 */
export const isBirthdayToday = (dateOfBirth: string): boolean => {
  if (!dateOfBirth) return false;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Validate date
  if (isNaN(birthDate.getTime())) return false;

  return (
    today.getMonth() === birthDate.getMonth() &&
    today.getDate() === birthDate.getDate()
  );
};

/**
 * Format birthday date for display
 * @param dateString - Date in string format
 * @returns Formatted date string (e.g., "Jan 15")
 */
export const formatBirthdayDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Get weekday for a date
 * @param dateString - Date in string format
 * @returns Weekday abbreviation (e.g., "Mon")
 */
export const getWeekday = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Filter employees by birthday period
 * @param employees - Array of IEmployee objects
 * @param period - Period to filter by ('week', 'month', 'nextMonth')
 * @returns Filtered array of employees with birthday in the period
 */
export const filterEmployeesByBirthday = (
  employees: IEmployee[],
  period: "week" | "month" | "nextMonth"
): IEmployee[] => {
  return employees
    .filter(
      (emp) =>
        emp.dateOfBirth &&
        emp.employmentStatus === "Active" &&
        isBirthdayInPeriod(emp.dateOfBirth, period)
    )
    .map((emp) => ({
      ...emp,
      fullName: `${emp.firstName} ${emp.lastName}`,
      age: calculateAge(emp.dateOfBirth!),
      nextBirthday: getNextBirthday(emp.dateOfBirth!),
    }))
    .sort((a, b) => a.nextBirthday.daysUntil - b.nextBirthday.daysUntil);
};

/**
 * Create mock employees with birthdays for testing
 * @param count - Number of mock employees to create
 * @param period - Period to generate birthdays for
 * @returns Array of IEmployee objects with birthdays in the specified period
 */
export const createMockBirthdayEmployees = (
  count: number,
  period: "week" | "month" | "nextMonth" = "month"
): IEmployee[] => {
  const baseEmployees = createMockEmployees(count);

  // Add realistic birthdays based on the period
  const employeesWithBirthdays = baseEmployees.map((emp, index) => {
    let birthDate: string;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    switch (period) {
      case "week":
        // Generate birthdays in the next 7 days
        const daysFromNow = (index % 7) + 1; // 1-7 days from now
        const birthday = new Date();
        birthday.setDate(today.getDate() + daysFromNow);
        birthDate = birthday.toISOString().split("T")[0];
        break;

      case "month":
        // Generate birthdays in current month
        const dayInMonth = (index % 28) + 1; // 1-28 days
        birthDate = new Date(currentYear, currentMonth, dayInMonth)
          .toISOString()
          .split("T")[0];
        break;

      case "nextMonth":
        // Generate birthdays in next month
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear =
          currentMonth === 11 ? currentYear + 1 : currentYear;
        const dayInNextMonth = (index % 28) + 1; // 1-28 days
        birthDate = new Date(nextMonthYear, nextMonth, dayInNextMonth)
          .toISOString()
          .split("T")[0];
        break;

      default:
        // Random birthdays
        const randomMonth = Math.floor(Math.random() * 12);
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const randomYear = 1990 + Math.floor(Math.random() * 15);
        birthDate = new Date(randomYear, randomMonth, randomDay)
          .toISOString()
          .split("T")[0];
    }

    return {
      ...emp,
      dateOfBirth: birthDate,
      age: calculateAge(birthDate),
      nextBirthday: getNextBirthday(birthDate),
    };
  });

  return employeesWithBirthdays;
};

/**
 * Get gender icon
 * @param gender - Gender value
 * @returns Gender icon string
 */
export const getGenderIcon = (gender?: string): string => {
  switch (gender) {
    case "Male":
      return "♂";
    case "Female":
      return "♀";
    case "Other":
      return "⚧";
    default:
      return "👤";
  }
};

/**
 * Get full name from employee
 * @param employee - Employee object
 * @returns Full name string
 */
export const getFullName = (employee: IEmployee): string => {
  return `${employee.firstName} ${employee.lastName}`;
};

/**
 * Get formatted date string
 * @param dateString - Date in string format
 * @param format - Format type ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  format: "short" | "medium" | "long" = "medium"
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: format === "short" ? "short" : "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

/**
 * Get employee avatar or initials
 * @param employee - Employee object
 * @returns Object with avatar src and fallback initials
 */
export const getEmployeeAvatar = (employee: IEmployee) => {
  if (employee.profilePhoto) {
    return {
      src: employee.profilePhoto,
      initials: `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`,
      useImage: true,
    };
  }

  return {
    src: "",
    initials: `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`,
    useImage: false,
  };
};

// HR-specific employee statuses
export const HR_EMPLOYMENT_STATUSES = [
  { value: "Active", label: "Active", color: "success", icon: "✓" },
  {
    value: "On Probation",
    label: "On Probation",
    color: "warning",
    icon: "⏱️",
  },
  { value: "On Leave", label: "On Leave", color: "info", icon: "🏖️" },
  {
    value: "Notice Period",
    label: "Notice Period",
    color: "warning",
    icon: "📝",
  },
  { value: "Resigned", label: "Resigned", color: "info", icon: "👋" },
  { value: "Terminated", label: "Terminated", color: "error", icon: "❌" },
  { value: "Inactive", label: "Inactive", color: "default", icon: "⏸️" },
];

// HR quick actions
export const HR_QUICK_ACTIONS = [
  {
    id: "addEmployee",
    title: "Add Employee",
    description: "Create new employee profile",
    icon: "fa-user-plus",
    color: "primary",
    permission: "employee:create",
  },
  {
    id: "bulkImport",
    title: "Bulk Import",
    description: "Import multiple employees",
    icon: "fa-file-import",
    color: "success",
    permission: "employee:import",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Manage new hires",
    icon: "fa-user-graduate",
    color: "info",
    permission: "onboarding:manage",
  },
  {
    id: "documentCheck",
    title: "Document Check",
    description: "Review pending documents",
    icon: "fa-file-check",
    color: "warning",
    permission: "documents:review",
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "View attendance reports",
    icon: "fa-calendar-check",
    color: "secondary",
    permission: "attendance:view",
  },
  {
    id: "reports",
    title: "Reports",
    description: "Generate HR reports",
    icon: "fa-chart-bar",
    color: "error",
    permission: "reports:generate",
  },
];

// HR employee filters
export const HR_EMPLOYEE_FILTERS = {
  status: [
    "All",
    "Active",
    "On Probation",
    "On Leave",
    "Inactive",
    "Terminated",
  ],
  department: [
    "All",
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
  ],
  workType: ["All", "Full-time", "Part-time", "Contract", "Intern"],
  onboardingStatus: ["All", "Pending", "Completed", "In Progress"],
};

// HR-specific employee metrics
export interface IHREmployeeMetrics {
  totalEmployees: number;
  activeEmployees: number;
  onProbation: number;
  newThisMonth: number;
  turnoverRate: number;
  avgTenure: number;
  departmentDistribution: Record<string, number>;
  genderDistribution: Record<string, number>;
  documentCompletionRate: number;
  onboardingCompletionRate: number;
}

// HR bulk actions
export const HR_BULK_ACTIONS = [
  { id: "sendOnboarding", label: "Send Onboarding Email", icon: "fa-envelope" },
  { id: "exportSelected", label: "Export Selected", icon: "fa-download" },
  { id: "updateStatus", label: "Update Status", icon: "fa-sync" },
  { id: "assignDepartment", label: "Assign Department", icon: "fa-building" },
  { id: "sendReminder", label: "Send Document Reminder", icon: "fa-bell" },
  { id: "deleteSelected", label: "Delete Selected", icon: "fa-trash" },
];

// Add these to your EmployeeTypes.ts file or create a new HRTypes.ts

// HR-specific form fields
export interface IHREmployeeForm extends IEmployeeForm {
  // Onboarding fields
  onboardingTemplate:
    | "Standard"
    | "Executive"
    | "Contractor"
    | "Intern"
    | "Remote"
    | "Custom";
  welcomeEmailTemplate: string;
  orientationSchedule: string;
  buddyAssigned: string;
  probationDuration: number;
  hrContactPerson: string;

  // Equipment & Access
  equipmentRequested: boolean;
  accessCardRequired: boolean;
  securityClearanceLevel: "Basic" | "Confidential" | "Secret" | "Top Secret";

  // HR workflow
  onboardingStatus: "Not Started" | "In Progress" | "Completed" | "On Hold";
  hrNotes: string;
  orientationCompleted: boolean;
  documentsSubmitted: boolean;
  systemAccessCreated: boolean;
  equipmentIssued: boolean;

  // Compliance
  backgroundCheckStatus: "Pending" | "In Progress" | "Completed" | "Failed";
  referenceCheckStatus: "Pending" | "Completed";
  medicalCheckStatus: "Pending" | "Completed";

  // Training
  mandatoryTrainingCompleted: boolean;
  safetyTrainingCompleted: boolean;
  complianceTrainingCompleted: boolean;
}

// HR onboarding template
export interface IOnboardingTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  steps: IOnboardingStep[];
  checklistItems: string[];
  emailTemplates: string[];
  requiredDocuments: string[];
}

// Onboarding step
export interface IOnboardingStep {
  id: string;
  title: string;
  description: string;
  day: number;
  assignedTo: "HR" | "IT" | "Manager" | "Buddy" | "Employee";
  duration: string; // e.g., "2 hours"
  status: "Pending" | "In Progress" | "Completed";
}

// HR checklist item
export interface IHRChecklistItem {
  id: string;
  category:
    | "Documentation"
    | "System Access"
    | "Equipment"
    | "Orientation"
    | "Training"
    | "Compliance";
  title: string;
  description: string;
  required: boolean;
  assignedTo: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Verified";
  verifiedBy?: string;
  verifiedDate?: string;
}
