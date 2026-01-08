"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import DepartmentsTable from "./DepartmentsTable";
import GenerateDepartmentReportModal from "./GenerateDepartmentReportModal";
import DepartmentsSummary from "./DepartmentsSummary";
import DepartmentFilters from "./DepartmentFilters";
import { IDepartment } from "./departments.interface";
import { useRouter } from "next/navigation";

const DepartmentsMainArea: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const [selectedDepartmentType, setSelectedDepartmentType] =
        useState<string>("all");
    const [selectedStatus, setSelectedStatus] =
        useState<string>("all");

    const [dateRange, setDateRange] = useState<{
        start: string;
        end: string;
    }>({
        start: "2024-01-01",
        end: "2024-12-31",
    });

    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const handleOpenClick = () => {
        router.push("/owner/departments/add-dept");
    }

    // ✅ MOCK DATA MATCHING IDepartment
    useEffect(() => {
        setDepartments([
            {
                id: 1,
                departmentName: "Engineering",
                departmentCode: "DEP-001",
                departmentType: "Technical",
                managerName: "Rahul Sharma",
                managerEmail: "rahul@company.com",
                managerPhone: "+91 9876543210",
                location: "Bangalore",
                creationDate: "2024-01-15",
                status: "Active",
                employeeCount: 45,
                budget: 500000,
                actualSpending: 420000,
                currency: "INR",
                projectsCount: 6,
                description: "Handles product development",
            },
            {
                id: 2,
                departmentName: "Human Resources",
                departmentCode: "DEP-002",
                departmentType: "Administrative",
                managerName: "Priya Verma",
                managerEmail: "priya@company.com",
                managerPhone: "+91 9123456780",
                location: "Mumbai",
                creationDate: "2024-02-10",
                status: "Inactive",
                employeeCount: 12,
                budget: 200000,
                actualSpending: 180000,
                currency: "INR",
                projectsCount: 2,
                description: "Manages employees",
            },
        ]);
    }, []);

    // ✅ FILTER LOGIC (FIELD-CORRECT)
    const filteredDepartments = useMemo(() => {
        return departments.filter((dept) => {
            const matchType =
                selectedDepartmentType === "all" ||
                dept.departmentType === selectedDepartmentType;

            const matchStatus =
                selectedStatus === "all" ||
                dept.status === selectedStatus;

            const deptDate = new Date(dept.creationDate);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);

            const matchDate =
                deptDate >= startDate && deptDate <= endDate;

            return matchType && matchStatus && matchDate;
        });
    }, [departments, selectedDepartmentType, selectedStatus, dateRange]);

    return (
        <>
            <div className="app__slide-wrapper">
                {/* Breadcrumb */}
                <div className="breadcrumb__wrapper mb-[25px]">
                    <nav>
                        <ol className="breadcrumb flex items-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/owner">Owner</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                Departments
                            </li>
                        </ol>
                    </nav>

                    <div className="breadcrumb__btn">
                        <button
                            className="btn btn-primary"
                            onClick={handleOpenClick}
                        >
                            Create New Department
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-12 gap-x-6 mb-6">
                    <DepartmentsSummary />
                </div>

                {/* Filters */}
                <DepartmentFilters
                    selectedDepartmentType={selectedDepartmentType}
                    setSelectedDepartmentType={setSelectedDepartmentType}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />

                {/* ✅ TABLE RECEIVES DATA */}
                <DepartmentsTable data={filteredDepartments} />
            </div>

            {modalOpen && (
                <GenerateDepartmentReportModal
                    open={modalOpen}
                    setOpen={setModalOpen}
                />
            )}
        </>
    );
};

export default DepartmentsMainArea;
