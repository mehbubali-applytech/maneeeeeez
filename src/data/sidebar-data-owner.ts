import { SidebarCategory } from "@/interface";


const subItems = [
          { label: "Employees", link: "/owner/employees" },
          { label: "Designations", link: "/owner/designations" },
          { label: "Attendance", link: "/owner/attendance" },
          { label: "Leaves", link: "/owner/leaves" },
          { label: "Holidays", link: "/owner/holidays" },
        ]
const businessOwnerSidebarData: SidebarCategory[] = [
  {
    id: 1,
    category: "Business Owner",
    items: [
      // Dashboard
      {
        id: 2,
        label: "Dashboard",
        icon: "icon-house",
        link: "/owner",
      }
    ],
  },
  {
    id: 2,
    category:"Company Management",
    items:[
      {
        id: 21,
        label: "Overview",
        icon: "fa-regular fa-building",
        link: "/owner/overview"
      },
      {
        id: 22,
        label: "Branches",
        icon: "fa-regular icon-house",
        link: "/owner/branches"
      },
      {
        id: 23,
        label: "Departments",
        icon: "fa-regular fa-sitemap",
        link: "/owner/departments",
      },
      {
        id: 24,
        label: "Shifts",
        icon: "fa-regular fa-clock",
        link: "/owner/shift",
      },
    ]
  }
  ,
  {
    id: 3,
    category: "HR Management",
    items: [
      {
        id: 31,
        label: "Employees",
        icon: "fa-light fa-users",
        link: "/owner/employees"
      },
      {
        id: 32,
        label: "Designations",
        icon: "fa-light fa-user-tag",
        link: "/owner/designations"
      },
      {
        id: 33,
        label: "Attendance",
        icon: "fa-light fa-calendar-check",
        link: "/owner/attendance"
      },
      {
        id: 34,
        label: "Leaves",
        icon: "fa-light fa-calendar-minus",
        link: "/owner/leaves"
      },
      {
        id: 35,
        label: "Holidays",
        icon: "fa-light fa-calendar-alt",
        link: "/owner/holidays"
      }
    ]
  },
  {
    id: 4,
    category: "Payroll Management",
    items: [
            {
        id: 41,
        label: "Grades",
        icon: "fa-light icon-lobster",
        link: "/owner/grade"
      },
      {
        id: 42,
        label: "Monthly Payroll",
        icon: "fa-light fa-money-bill-wave",
        link: "/owner/payroll/monthly"
      },
      {
        id: 43,
        label: "Payroll Reports",
        icon: "fa-light fa-chart-line",
        link: "/owner/payroll/reports"
      }

    ]
  },
  {
    id: 5,
    category: "Finance Management",
    items: [
      {
        id: 51,
        label: "Invoices",
        icon: "fa-light fa-file-invoice",
        link: "/owner/finance/invoices"
      },
      {
        id: 52,
        label: "Expenses",
        icon: "fa-light fa-file-invoice-dollar",
        link: "/owner/finance/expenses"
      },
      {
        id: 53,
        label: "Vendor Payments",
        icon: "fa-light fa-money-check",
        link: "/owner/finance/vendors"
      }
    ]
  },
  {
    id: 6,
    category: "Mislellaneous",
    items: [
      // Subscriptions
      {
        id: 7,
        label: "Subscriptions",
        icon: "fa-light fa-badge-check",
        link: "/owner/subscription",
      },

      // Reports
      {
        id: 8,
        label: "Reports",
        icon: "fa-light fa-chart-simple",
        subItems: [
          { label: "HR Reports", link: "/owner/reports/hr" },
          { label: "Departments", link: "/owner/reports/departments" },
          { label: "Attendance", link: "/owner/reports/attendance" },
          { label: "Finance Reports", link: "/owner/reports/finance" },
          { label: "Performance", link: "/owner/reports/performance" },
        ],
      },

      // Support
      {
        id: 9,
        label: "Support",
        icon: "fa-light fa-life-ring",
        subItems: [
          { label: "Tickets", link: "/owner/support/tickets" },
          { label: "Knowledge Base", link: "/owner/support/knowledge-base" },
        ],
      },

      // Settings
      {
        id: 10,
        label: "Settings",
        icon: "icon-settings",
        subItems: [
          { label: "General", link: "/owner/settings/general" },
          { label: "Notifications", link: "/owner/settings/notifications" },
          { label: "Security", link: "/owner/settings/security" },
        ],
      },
    ],
  },
];

export default businessOwnerSidebarData;
