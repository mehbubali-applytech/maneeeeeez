"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AddNewEmployeeModal from "../AddNewEmployee";
import EmployeesTable from "../EmployeesTable";
import { IEmployee, createMockEmployees } from "../../../owner/employees/EmployeeTypes";

const COMPANIES = [
  { id: "COMP001", name: "TechCorp Solutions", code: "TECHSOL" },
  { id: "COMP002", name: "Global Innovations", code: "GLOBINN" },
  { id: "COMP003", name: "Digital Dynamics", code: "DIGIDYN" },
  { id: "COMP004", name: "Future Systems", code: "FUTSYS" },
  { id: "COMP005", name: "Quantum Ventures", code: "QUANVEN" },
];


const CompanyEmployeesMainArea: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Simulate API call to fetch company data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Find company details
        const company = COMPANIES.find(comp => comp.id === employeeId);

        setCompanyName(company?.name || `Company ${employeeId}`);
        
        // Create mock employees for this company
        const allEmployees = createMockEmployees(15);
        
        // Add company-specific data to employees
        const companyEmployees = allEmployees
          .slice(0, 5) // Show 5 employees per company
          .map(emp => ({
            ...emp,
            // Override with company-specific data
            workLocationName: company?.name || emp.workLocationName,
            employeeCode: `${company?.code || "COMP"}-${emp.employeeCode}`,
            // Add company fields to the employee object (extending the interface)
            companyName: company?.name || "Unknown Company",
            companyId: employeeId,
            companyCode: company?.code || "UNK",
          })) as Array<IEmployee & { companyName: string; companyId: string; companyCode: string }>;
        
        setEmployees(companyEmployees);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleAddEmployee = (newEmployee: IEmployee) => {
    // Add company-specific data to the new employee
    const company = COMPANIES.find(comp => comp.id === employeeId);
    const companyEmployee = {
      ...newEmployee,
      workLocationName: company?.name || "Company Office",
      employeeCode: `${company?.code || "COMP"}-${newEmployee.employeeCode}`,
      // Add company fields
      companyName: company?.name || "Unknown Company",
      companyId: employeeId,
      companyCode: company?.code || "UNK",
    } as IEmployee & { companyName: string; companyId: string; companyCode: string };
    
    setEmployees(prev => [companyEmployee, ...prev]);
  };

  const handleUpdateEmployee = (updatedEmployee: IEmployee) => {
    setEmployees(prev => prev.map(emp => 
      emp.employeeId === updatedEmployee.employeeId ? {
        ...updatedEmployee,
        // Preserve company data
        companyName: (emp as any).companyName || companyName,
        companyId: employeeId,
        companyCode: (emp as any).companyCode || COMPANIES.find(comp => comp.id === employeeId)?.code || "UNK"
      } as IEmployee & { companyName: string; companyId: string; companyCode: string } : emp
    ));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
  };

  if (loading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading company employees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin" className="text-blue-600 hover:text-blue-800">
                Super Admin
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin/employees" className="text-blue-600 hover:text-blue-800">
                All Employees
              </Link>
            </li>
            <li className="breadcrumb-item active font-semibold">
              {companyName}
            </li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <i className="fa-solid fa-user-plus"></i>
            Add Employee to {companyName}
          </button>
        </div>
      </div>

      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {companyName}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-users text-blue-500"></i>
                <span>{employees.length} Employees</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-building text-green-500"></i>
                <span>Company ID: {employeeId}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-purple-500"></i>
                <span>Primary Location: {employees[0]?.workLocationName || "Not specified"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {employees.filter(e => e.employmentStatus === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {new Set(employees.map(e => e.departmentName)).size}
                  </div>
                  <div className="text-sm text-gray-500">Departments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees in this company..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fa-solid fa-search absolute left-3 top-3.5 text-gray-400"></i>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              {Array.from(new Set(employees.map(e => e.departmentName))).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Probation">On Probation</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      {employees.length > 0 ? (
        <EmployeesTable 
          data={employees}
          onUpdateEmployee={handleUpdateEmployee}
          onDeleteEmployee={handleDeleteEmployee}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <i className="fa-solid fa-users text-gray-300 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Employees Found
          </h3>
          <p className="text-gray-500 mb-6">
            This company does not have any employees yet. Add the first employee to get started.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <i className="fa-solid fa-user-plus mr-2"></i>
            Add First Employee
          </button>
        </div>
      )}

      {/* Add Employee Modal */}
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

export default CompanyEmployeesMainArea;