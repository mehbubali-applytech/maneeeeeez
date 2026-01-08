"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import DepartmentTable from "./DepartmentTable";
import { IDepartment } from "./DepartmentTypes";
import UpdateDepartmentModal from "./UpdateDepartmentModal";
import { useRouter } from "next/navigation";
import DepartmentSummary from "./DepartmentSummary";

const DepartmentMainArea: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null);
  const router = useRouter();

  const [selectedDepartmentType, setSelectedDepartmentType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "2024-01-01",
    end: "2024-12-31",
  });

  const [departments, setDepartments] = useState<IDepartment[]>([]);

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
      {
        id: 3,
        departmentName: "Finance",
        departmentCode: "DEP-003",
        departmentType: "Administrative",
        managerName: "Amit Patel",
        managerEmail: "amit@company.com",
        managerPhone: "+91 9988776655",
        location: "Delhi",
        creationDate: "2024-03-01",
        status: "Active",
        employeeCount: 25,
        budget: 300000,
        actualSpending: 250000,
        currency: "INR",
        projectsCount: 4,
        description: "Financial management and accounting",
      },
    ]);
  }, []);

  const handleAddClick = () => {
    router.push("/owner/departments/add-dept");
  };

  // ✅ FILTER LOGIC
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchType = selectedDepartmentType === "all" || dept.departmentType === selectedDepartmentType;
      const matchStatus = selectedStatus === "all" || dept.status === selectedStatus;
      
      const deptDate = new Date(dept.creationDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const matchDate = deptDate >= startDate && deptDate <= endDate;

      return matchType && matchStatus && matchDate;
    });
  }, [departments, selectedDepartmentType, selectedStatus, dateRange]);

  const handleEditDepartment = (dept: IDepartment) => {
    setEditingDepartment(dept);
    setModalOpen(true);
  };

  const handleSaveDepartment = (payload: Partial<IDepartment>) => {
    if (payload.id) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === payload.id ? { ...d, ...(payload as IDepartment) } : d
        )
      );
    }
    setModalOpen(false);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">All Departments</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Department
          </button>
        </div>
      </div>
      


      {/* Summary Section */}
      <div className="grid grid-cols-12 gap-x-6 mb-6">
        <DepartmentSummary />
      </div>

            {/* Filters Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Department Type</label>
            <select
              className="form-control"
              value={selectedDepartmentType}
              onChange={(e) => setSelectedDepartmentType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Technical">Technical</option>
              <option value="Administrative">Administrative</option>
              <option value="Support">Support</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="form-control"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
              <input
                type="date"
                className="form-control"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        <DepartmentTable
          data={filteredDepartments}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          key={1}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <UpdateDepartmentModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editingDepartment}
          onSave={handleSaveDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentMainArea;