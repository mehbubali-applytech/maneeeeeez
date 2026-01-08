"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StaffTable from "./StaffTable";
import { IStaff } from "./staff.interface";

interface Props {
  department: string;
}

const StaffByDepartmentMainArea: React.FC<Props> = ({ department }) => {
  const [staff, setStaff] = useState<IStaff[]>([]);

  useEffect(() => {
    // Dummy data for generic departments (like employees)
    const dummyData:  IStaff[] = [
  {
    id: 1,
    employeeId: "EMP-001",
    firstName: "John",
    lastName: "Smith",
    fullName: "John Smith",
    email: "john.smith@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    position: "Senior Software Engineer",
    department: "Engineering",
    company: "TechNova Solutions",
    companyId: 1,
    location: "San Francisco, CA",
    joinDate: "2020-03-15",
    status: "Active",
    employmentType: "Full-time",
    salary: 125000,
    currency: "USD",
    supervisor: "Sarah Johnson",
    gender: "Male",
    dateOfBirth: "1990-05-20",
    address: "123 Tech Street, San Francisco, CA 94105",
    city: "San Francisco",
    country: "USA",
    zipCode: "94105",
    emergencyContact: "+1 (555) 111-2222",
    skills: ["JavaScript", "React", "Node.js", "AWS", "TypeScript"],
    education: "MS Computer Science, Stanford University",
    experience: 8,
    performanceRating: 4.8,
    attendanceRate: 97.5,
    projectsCompleted: 42,
    lastLogin: "2024-03-28 09:15:23",
    notes: "Top performer, leads the React team"
  }
];
    setStaff(dummyData);
  }, []);

  const departmentTitle = department
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin">Admin</Link>
            </li>
            <li className="breadcrumb-item active">{departmentTitle}</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button
            type="button"
            className="btn btn-primary"
          >
            Add {departmentTitle}
          </button>
        </div>
      </div>

      <StaffTable  />
    </div>
  );
};

export default StaffByDepartmentMainArea;
