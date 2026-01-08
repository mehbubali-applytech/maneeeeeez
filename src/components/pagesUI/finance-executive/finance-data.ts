// data/finance-data.ts
export const payrollApprovalData = [
  { id: "PR-2024-001", department: "Engineering", amount: 425000, status: "Pending" },
  { id: "PR-2024-002", department: "Sales", amount: 325000, status: "Approved" },
  { id: "PR-2024-003", department: "Marketing", amount: 287500, status: "Pending" },
  { id: "PR-2024-004", department: "HR", amount: 185000, status: "In Review" },
  { id: "PR-2024-005", department: "Operations", amount: 365000, status: "Pending" },
];

export const complianceStatusData = [
  { type: "PF Payment", dueDate: "15 Oct 2024", status: "Submitted", challanNo: "PF20241015" },
  { type: "ESIC Payment", dueDate: "21 Oct 2024", status: "Pending", challanNo: null },
  { type: "TDS Filing", dueDate: "31 Oct 2024", status: "Due Soon", challanNo: null },
  { type: "Professional Tax", dueDate: "10 Oct 2024", status: "Submitted", challanNo: "PT20241010" },
  { type: "LWF Payment", dueDate: "25 Oct 2024", status: "Pending", challanNo: null },
];

export const bankProcessingData = [
  { bankName: "HDFC Bank", mode: "NEFT", amount: 742500, status: "Processed" },
  { bankName: "ICICI Bank", mode: "RTGS", amount: 365000, status: "Processing" },
  { bankName: "Axis Bank", mode: "NEFT", amount: 287500, status: "Pending" },
  { bankName: "SBI", mode: "RTGS", amount: 185000, status: "Processed" },
];

export const upcomingDeadlinesData = [
  { 
    icon: "fa-file-contract", 
    title: "PF Payment Due", 
    description: "Monthly PF contribution for October", 
    dueDate: "15 Nov 2024", 
    daysLeft: 5, 
    priority: "high" 
  },
  { 
    icon: "fa-heartbeat", 
    title: "ESIC Filing", 
    description: "Employee state insurance contribution", 
    dueDate: "21 Nov 2024", 
    daysLeft: 11, 
    priority: "medium" 
  },
  { 
    icon: "fa-percentage", 
    title: "TDS Quarterly", 
    description: "Quarter 2 TDS filing", 
    dueDate: "31 Oct 2024", 
    daysLeft: 1, 
    priority: "high" 
  },
];

export const recentPayrollData = [
  { date: "01 Nov 2024", payrollId: "PR-2024-011", processedBy: "Rahul Sharma", amount: 1587500, status: "Completed" },
  { date: "31 Oct 2024", payrollId: "PR-2024-010", processedBy: "Priya Patel", amount: 1525000, status: "Completed" },
  { date: "30 Oct 2024", payrollId: "PR-2024-009", processedBy: "Amit Kumar", amount: 1492500, status: "Completed" },
  { date: "29 Oct 2024", payrollId: "PR-2024-008", processedBy: "Sneha Gupta", amount: 1550000, status: "Completed" },
  { date: "28 Oct 2024", payrollId: "PR-2024-007", processedBy: "Rajesh Singh", amount: 1487500, status: "Failed" },
  { date: "27 Oct 2024", payrollId: "PR-2024-006", processedBy: "Anjali Mehta", amount: 1575000, status: "Completed" },
  { date: "26 Oct 2024", payrollId: "PR-2024-005", processedBy: "Vikram Reddy", amount: 1532500, status: "Completed" },
  { date: "25 Oct 2024", payrollId: "PR-2024-004", processedBy: "Neha Kapoor", amount: 1498000, status: "Completed" },
  { date: "24 Oct 2024", payrollId: "PR-2024-003", processedBy: "Sanjay Verma", amount: 1512000, status: "Processing" },
  { date: "23 Oct 2024", payrollId: "PR-2024-002", processedBy: "Meera Nair", amount: 1505000, status: "Completed" },
];


export const financeDropdownItems = [
  { label: "This Week", link: "/finance/dashboard?period=week" },
  { label: "This Month", link: "/finance/dashboard?period=month" },
  { label: "Last Month", link: "/finance/dashboard?period=last_month" },
  { label: "This Quarter", link: "/finance/dashboard?period=quarter" },
  { label: "This Year", link: "/finance/dashboard?period=year" },
  { label: "Custom Range", link: "/finance/dashboard?period=custom" },
];