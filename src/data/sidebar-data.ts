import { SidebarCategory } from "@/interface";

const sidebarData: SidebarCategory[] = [
  {
    id: 1,
    category: "HRM Dashboard",
    items: [
      {
        id: 2,
        label: "Employee",
        icon: "icon-hrm",
        subItems: [
          { label: "Employee", link: "/hrm/employee" },
          { label: "Employee Profile", link: "/hrm/employee-profile" },
          { label: "Designations", link: "/hrm/designations" },
        ],
      },
      {
        id: 3,
        label: "Attendance",
        icon: "icon-hrm",
        subItems: [
          { label: "Admin Attendance", link: "/hrm/attendance" },
          { label: "Employee Attendance", link: "/hrm/employee-attendance" },
          { label: "Biometric Attendance", link: "/hrm/biometric-attendance" },
        ],
      },
         {
        id: 4,
        label: "Salary Structure",
        icon: "icon-hrm",
        subItems: [
          { label: "Grades", link: "/hrm/salary" },
          { label: "Salary Components", link: "/hrm/salary-components" },
        ],
      },
      {
        id: 5,
        label: "Loan",
        icon: "icon-hrm",
        subItems: [
          { label: "Office Loan", link: "/hrm/office-loan" },
          { label: "Personal Loan", link: "/hrm/personal-loan" },
        ],
      },
      {
        id: 6,
        label: "Leaves",
        icon: "icon-hrm",
        subItems: [
          { label: "Employee leaves", link: "/hrm/leaves-employee" },
          { label: "Admin leaves", link: "/hrm/leaves" },

        ],
      },
          {
        id: 7,
        label: "Misl",
        icon: "icon-hrm",
        subItems: [
          { label: "Holidays", link: "/hrm/holidays" },
          { label: "Time Sheet", link: "/hrm/timesheet" },
          { label: "Schedule", link: "/hrm/schedule" },
          { label: "Overtime", link: "/hrm/overtime" },
          { label: "Warning", link: "/hrm/warning" },
        ],
      },
    ],
  },
];

export default sidebarData;
