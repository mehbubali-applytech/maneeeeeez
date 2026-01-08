import { SidebarCategory } from "@/interface";

const superAdminSidebarData: SidebarCategory[] = [
  {
    id: 1,
    category: "Super Admin",
    items: [
      {
        id: 2,
        label: "Dashboard",
        icon: "icon-house",
        link: "/super-admin",
      }
    ],
  },
  {
    id: 2,
    category: "Company Management",
    items: [
      {
        id: 21,
        label: "All Companies",
        icon: "fa-regular fa-building",
        link: "/super-admin/companies"
      },
      {
        id: 22,
        label: "Company Subscriptions",
        icon: "fa-regular fa-wallet",
        link: "/super-admin/subscriptions/companies"
      }
    ]
  },
  {
    id: 3,
    category: "Staff Management",
    items: [
      {
        id: 31,
        label: "All Staff",
        icon: "fa-light fa-users",
        link: "/super-admin/staff"
      },
      {
        id: 32,
        label: "HR Managers",
        icon: "fa-light fa-user-tie",
        link: "/super-admin/hr-manager"
      },
      {
        id: 33,
        label: "Finance Executives",
        icon: "fa-light fa-chart-line",
        link: "/super-admin/finance-executives"
      },
      {
        id: 34,
        label: "Compliance Officers",
        icon: "fa-light fa-user-shield",
        link: "/super-admin/compliance-officers"
      },
      {
        id: 35,
        label: "Employees",
        icon: "fa-light fa-user",
        link: "/super-admin/employees"
      },
      {
        id: 36,
        label: "Roles & Permissions",
        icon: "fa-light fa-key",
        link: "/super-admin/role"
      }
    ]
  },
  {
    id: 4,
    category: "Module Management",
    items: [
      {
        id: 41,
        label: "Enabled Modules",
        icon: "fa-light fa-puzzle-piece",
        link: "/super-admin/modules"
      },
      {
        id: 42,
        label: "Module Tiers",
        icon: "fa-light fa-layer-group",
        link: "/super-admin/modules/tiers"
      }
    ]
  },
  {
    id: 5,
    category: "Subscriptions",
    items: [
      {
        id: 51,
        label: "Subscription Plans",
        icon: "fa-light fa-badge-check",
        link: "/super-admin/subscriptions"
      }
    ]
  },
  {
    id: 6,
    category: "Reports & Analytics",
    items: [
      {
        id: 61,
        label: "Platform Usage",
        icon: "fa-light fa-chart-simple",
        link: "/super-admin/reports/platform"
      },
      {
        id: 62,
        label: "Attendance Summary",
        icon: "fa-light fa-calendar-check",
        link: "/super-admin/reports/attendance"
      },
      {
        id: 63,
        label: "Payroll Summary",
        icon: "fa-light fa-money-bill-wave",
        link: "/super-admin/reports/payroll"
      },
      {
        id: 64,
        label: "Compliance Overview",
        icon: "fa-light fa-file-contract",
        link: "/super-admin/reports/compliance"
      }
    ]
  },
  {
    id: 7,
    category: "Miscellaneous",
    items: [
      {
        id: 71,
        label: "Activity Logs",
        icon: "fa-light fa-history",
        link: "/super-admin/logs"
      },
      {
        id: 72,
        label: "Audit Trail",
        icon: "fa-light fa-clipboard-check",
        link: "/super-admin/audit"
      },
      {
        id: 73,
        label: "Support Tickets",
        icon: "fa-light fa-ticket",
        link: "/super-admin/support/tickets"
      }
    ]
  },
  {
    id: 8,
    category: "Settings",
    items: [
      {
        id: 81,
        label: "General Settings",
        icon: "fa-light fa-cog",
        link: "/super-admin/settings/general"
      },
      {
        id: 82,
        label: "Notification Templates",
        icon: "fa-light fa-bell",
        link: "/super-admin/settings/templates"
      },
      {
        id: 83,
        label: "Security & Retention",
        icon: "fa-light fa-shield",
        link: "/super-admin/settings/security"
      }
    ]
  }
];

export default superAdminSidebarData;