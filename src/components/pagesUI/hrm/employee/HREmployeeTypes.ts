// HREmployeeTypes.ts
import { IEmployee, IEmployeeForm, IAttendanceSummary, createMockEmployee } from "../../owner/employees/EmployeeTypes";

// HR-specific employee interface extension
export interface IHREmployee extends IEmployee {
  // HR-specific fields
  hrManagerId?: string;
  hrManagerName?: string;
  onboardingStatus: "Pending" | "In Progress" | "Completed" | "On Hold";
  backgroundCheckStatus: "Pending" | "In Progress" | "Completed" | "Failed";
  equipmentIssued: boolean;
  systemAccessCreated: boolean;
  orientationCompleted: boolean;
  probationReviewDate?: string;
  performanceRating?: number; // 1-5 scale
  lastAppraisalDate?: string;
  nextAppraisalDate?: string;
  
  // Compliance
  attendanceCompliance: number; // percentage
  leaveBalance: number;
  trainingCompleted: string[];
  certificationExpiry?: { [key: string]: string };
  
  // Workflow
  workflowStatus: "New Hire" | "Active" | "On Leave" | "Notice Period" | "Exit";
  exitChecklist?: IExitChecklist;
}

// HR-specific form
export interface IHREmployeeForm extends IEmployeeForm {
  // HR-specific fields
  hrManagerId?: string;
  onboardingStatus: "Pending" | "In Progress" | "Completed" | "On Hold";
  backgroundCheckStatus: "Pending" | "In Progress" | "Completed" | "Failed";
  orientationSchedule: string;
  equipmentRequired: boolean;
  probationDuration: number; // in months
  orientationCompleted: boolean;
  equipmentIssued: boolean;
  systemAccessCreated: boolean;
  hrNotes: string;
  
  // Compliance
  mandatoryTraining: string[];
  referenceCheckStatus: "Pending" | "Completed";
  medicalCheckStatus: "Pending" | "Completed";
}

// HR Onboarding Checklist
export interface IOnboardingChecklist {
  id: string;
  task: string;
  category: "Documentation" | "System Access" | "Equipment" | "Orientation" | "Training";
  assignedTo: "HR" | "IT" | "Manager" | "Employee";
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Verified";
  verifiedBy?: string;
  verifiedDate?: string;
  priority: "High" | "Medium" | "Low";
}

// Exit Checklist
export interface IExitChecklist {
  id: string;
  tasks: IExitTask[];
  exitDate: string;
  lastWorkingDay: string;
  exitInterviewCompleted: boolean;
  clearanceStatus: "Pending" | "Partial" | "Completed";
}

export interface IExitTask {
  id: string;
  description: string;
  department: string;
  status: "Pending" | "Completed";
  dueDate: string;
  completedDate?: string;
}

// HR Performance Metrics
export interface IHRPerformanceMetrics {
  employeeId: string;
  rating: number;
  goals: IGoal[];
  feedback: IFeedback[];
  skills: ISkill[];
  careerPath: ICareerPath[];
}

export interface IGoal {
  id: string;
  description: string;
  targetDate: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  progress: number; // 0-100
}

export interface IFeedback {
  id: string;
  from: string;
  type: "Manager" | "Peer" | "Self" | "HR";
  date: string;
  comments: string;
  rating: number;
}

export interface ISkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  lastAssessed: string;
}

export interface ICareerPath {
  position: string;
  timeline: string;
  requirements: string[];
}

// HR Filters
export const HR_FILTERS = {
  department: [
    "All",
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Customer Support"
  ],
  location: [
    "All",
    "Mumbai HQ",
    "Delhi Office",
    "Bangalore Branch",
    "Hyderabad Office",
    "Chennai Office"
  ],
  workType: ["All", "Full-time", "Part-time", "Contract", "Intern"],
  employmentStatus: [
    "All",
    "Active",
    "On Probation",
    "On Leave",
    "Notice Period",
    "Resigned",
    "Terminated"
  ],
  onboardingStatus: ["All", "Pending", "In Progress", "Completed", "On Hold"],
  probationStatus: ["All", "Active", "Completed", "Extended", "Terminated"]
};

// HR Roles & Permissions
export const HR_ROLES = [
  { id: "hr_admin", name: "HR Admin", permissions: ["all"] },
  { id: "hr_manager", name: "HR Manager", permissions: ["read", "write", "approve"] },
  { id: "hr_executive", name: "HR Executive", permissions: ["read", "write"] },
  { id: "hr_recruiter", name: "Recruiter", permissions: ["read", "write", "onboard"] }
];

// Mock data generators for HR
export const createHRMockEmployee = (overrides?: Partial<IHREmployee>): IHREmployee => {
  const baseEmployee = createMockEmployee(overrides) as IHREmployee;
  
  return {
    ...baseEmployee,
    hrManagerId: "HR001",
    hrManagerName: "Priya Sharma",
    onboardingStatus: Math.random() > 0.3 ? "Completed" : "In Progress",
    backgroundCheckStatus: "Completed",
    equipmentIssued: Math.random() > 0.5,
    systemAccessCreated: true,
    orientationCompleted: Math.random() > 0.4,
    probationReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    performanceRating: Math.floor(Math.random() * 3) + 3, // 3-5
    lastAppraisalDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextAppraisalDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    attendanceCompliance: Math.floor(Math.random() * 20) + 80, // 80-100%
    leaveBalance: Math.floor(Math.random() * 15),
    trainingCompleted: ["Orientation", "Code of Conduct", "Safety Training"],
    workflowStatus: "Active",
    attendanceSummary: {
      present: 22,
      absent: 0,
      leave: 2,
      holiday: 4,
      workingDays: 22,
      totalDays: 28,
      percentage: 100,
      lateArrivals: 1,
      earlyDepartures: 0,
      overtimeHours: 8,
      regularHours: 176,
      averageHoursPerDay: 8.2
    }
  };
};

export const createHRMockEmployees = (count: number): IHREmployee[] => {
  return Array.from({ length: count }, (_, index) => 
    createHRMockEmployee({
      employeeId: `EMP${String(index + 1).padStart(3, "0")}`,
      onboardingStatus: index % 4 === 0 ? "Pending" : 
                       index % 4 === 1 ? "In Progress" : 
                       index % 4 === 2 ? "Completed" : "On Hold",
      performanceRating: index % 5 === 0 ? 5 : 
                         index % 5 === 1 ? 4 : 
                         index % 5 === 2 ? 3 : 
                         index % 5 === 3 ? 2 : 1,
      workflowStatus: index % 6 === 0 ? "New Hire" : 
                     index % 6 === 1 ? "Active" : 
                     index % 6 === 2 ? "On Leave" : 
                     index % 6 === 3 ? "Notice Period" : "Exit"
    })
  );
};