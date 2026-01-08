"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import EmployeesTable from "./EmployeesTable";
import AddNewEmployeeModal from "./AddNewEmployee";
import { IEmployee, createMockEmployees } from "../../owner/employees/EmployeeTypes";

// Create dummy data using the helper function
const dummyEmployeeData: IEmployee[] = createMockEmployees(10);

const EmployeesMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>(dummyEmployeeData);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered employees
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const searchLower = searchTerm.toLowerCase();
    return employees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.employeeCode?.toLowerCase().includes(searchLower) ||
      emp.departmentName.toLowerCase().includes(searchLower) ||
      emp.roleName.toLowerCase().includes(searchLower)
    );
  }, [employees, searchTerm]);

  const handleAddEmployee = (newEmployee: IEmployee) => {
    setEmployees(prev => [newEmployee, ...prev]);
  };

  const handleUpdateEmployee = (updatedEmployee: IEmployee) => {
    setEmployees(prev => prev.map(emp => 
      emp.employeeId === updatedEmployee.employeeId ? updatedEmployee : emp
    ));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
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
              <Link href="/super-admin">Admin</Link>
            </li>
            <li className="breadcrumb-item active">Employees</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name, email, department..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa-solid fa-search absolute left-3 top-3.5 text-gray-400"></i>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active</h3>
          <p className="text-3xl font-bold text-green-600">
            {employees.filter(e => e.employmentStatus === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">On Probation</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {employees.filter(e => e.employmentStatus === 'On Probation').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Departments</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(employees.map(e => e.departmentName)).size}
          </p>
        </div>
      </div>

      <EmployeesTable 
        data={filteredEmployees}
        onUpdateEmployee={handleUpdateEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {modalOpen && (
        <AddNewEmployeeModal 
          open={modalOpen} 
          setOpen={setModalOpen}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesMainArea;