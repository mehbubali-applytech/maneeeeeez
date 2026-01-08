import { SidebarCategory } from "@/interface";

const financeExecutiveSidebarData: SidebarCategory[] = [
  {
    id: 1,
    category: "Finance Executive",
    items: [
      // Dashboard
      {
        id: 2,
        label: "Dashboard",
        icon: "icon-house",
        link: "/finance-executive",
      }
    ],
  },
  {
    id: 2,
    category: "Payroll Management",
    items: [
      {
        id: 21,
        label: "Payroll Verification",
        icon: "fa-light fa-clipboard-check",
        link: "/finance-executive/payroll/verification"
      },
      {
        id: 22,
        label: "Salary Structure",
        icon: "fa-light fa-layer-group",
        link: "/finance-executive/payroll/salary-structure"
      },
      {
        id: 23,
        label: "Monthly Payroll",
        icon: "fa-light fa-calendar-alt",
        subItems: [
          { label: "Current Month", link: "/finance-executive/payroll/current" },
          { label: "Run Payroll", link: "/finance-executive/payroll/run" },
          { label: "Approval Queue", link: "/finance-executive/payroll/approval" }
        ]
      },
      {
        id: 24,
        label: "Payslip Management",
        icon: "fa-light fa-file-invoice",
        link: "/finance-executive/payslips"
      }
    ]
  },
  {
    id: 3,
    category: "Payroll History",
    items: [
      {
        id: 31,
        label: "Payroll History",
        icon: "fa-light fa-history",
        link: "/finance-executive/payroll/history"
      },
      {
        id: 32,
        label: "Processed Payslips",
        icon: "fa-light fa-file-download",
        link: "/finance-executive/payslips/archive"
      },
      {
        id: 33,
        label: "Employee Salary Records",
        icon: "fa-light fa-user-tie",
        link: "/finance-executive/salary/records"
      }
    ]
  },
  {
    id: 4,
    category: "Compliance & Reporting",
    items: [
      {
        id: 41,
        label: "Compliance Center",
        icon: "fa-light fa-file-contract",
        subItems: [
          { label: "PF Reports & Challans", link: "/finance-executive/compliance/pf" },
          { label: "ESIC Reports & Challans", link: "/finance-executive/compliance/esic" },
          { label: "ECR Generation", link: "/finance-executive/compliance/ecr" },
          { label: "TDS Reports", link: "/finance-executive/compliance/tds" },
          { label: "PT Reports", link: "/finance-executive/compliance/pt" }
        ]
      },
      {
        id: 42,
        label: "Bank Processing",
        icon: "fa-light fa-university",
        subItems: [
          { label: "Bank File Generator", link: "/finance-executive/bank/generator" },
          { label: "NEFT Templates", link: "/finance-executive/bank/neft" },
          { label: "RTGS Templates", link: "/finance-executive/bank/rtgs" },
          { label: "Payment Status", link: "/finance-executive/bank/status" }
        ]
      },
      {
        id: 43,
        label: "Statutory Reports",
        icon: "fa-light fa-chart-pie",
        link: "/finance-executive/reports/statutory"
      }
    ]
  },
  {
    id: 5,
    category: "Financial Reports",
    items: [
      {
        id: 51,
        label: "Payroll Reports",
        icon: "fa-light fa-chart-line",
        subItems: [
          { label: "Monthly Payroll Summary", link: "/finance-executive/reports/payroll-monthly" },
          { label: "Department-wise Cost", link: "/finance-executive/reports/department-cost" },
          { label: "Employee Cost Analysis", link: "/finance-executive/reports/employee-cost" },
          { label: "Year-to-Date Summary", link: "/finance-executive/reports/ytd-summary" }
        ]
      },
      {
        id: 52,
        label: "Cost & Budget Reports",
        icon: "fa-light fa-calculator",
        subItems: [
          { label: "Labor Cost Analysis", link: "/finance-executive/reports/labor-cost" },
          { label: "Budget vs Actual", link: "/finance-executive/reports/budget-vs-actual" },
          { label: "Overtime Analysis", link: "/finance-executive/reports/overtime" },
          { label: "Allowance & Deduction Summary", link: "/finance-executive/reports/allowances-deductions" }
        ]
      },
      {
        id: 53,
        label: "Export Data",
        icon: "fa-light fa-download",
        link: "/finance-executive/export"
      }
    ]
  },
  {
    id: 6,
    category: "Tools & Settings",
    items: [
      {
        id: 61,
        label: "Payroll Settings",
        icon: "fa-light fa-sliders-h",
        subItems: [
          { label: "Allowance Templates", link: "/finance-executive/settings/allowances" },
          { label: "Deduction Templates", link: "/finance-executive/settings/deductions" },
          { label: "Salary Components", link: "/finance-executive/settings/components" },
          { label: "Payroll Calendar", link: "/finance-executive/settings/calendar" }
        ]
      },
      {
        id: 62,
        label: "Bank & Payment Setup",
        icon: "fa-light fa-credit-card",
        link: "/finance-executive/settings/bank-setup"
      },
      {
        id: 63,
        label: "Audit Log",
        icon: "fa-light fa-clipboard-list",
        link: "/finance-executive/audit-log"
      }
    ]
  },
  {
    id: 7,
    category: "Support & Help",
    items: [
      {
        id: 71,
        label: "Support Tickets",
        icon: "fa-light fa-life-ring",
        link: "/finance-executive/support/tickets"
      },
      {
        id: 72,
        label: "Compliance Guide",
        icon: "fa-light fa-book",
        link: "/finance-executive/help/compliance"
      },
      {
        id: 73,
        label: "FAQ & Documentation",
        icon: "fa-light fa-question-circle",
        link: "/finance-executive/help/faq"
      }
    ]
  }
];

export default financeExecutiveSidebarData;