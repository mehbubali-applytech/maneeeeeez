"use client";
import React from "react";

interface FinanceExecutiveFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const FinanceExecutiveFilters: React.FC<FinanceExecutiveFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedCompany,
  setSelectedCompany,
  selectedRole,
  setSelectedRole,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <option value="On Leave">On Leave</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Department</label>
          <select
            className="form-control"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
            <option value="Financial Planning & Analysis">Financial Planning & Analysis</option>
            <option value="Accounts Payable">Accounts Payable</option>
            <option value="Accounts Receivable">Accounts Receivable</option>
            <option value="Taxation">Taxation</option>
            <option value="Internal Audit">Internal Audit</option>
            <option value="Treasury">Treasury</option>
            <option value="Financial Reporting">Financial Reporting</option>
            <option value="Cost Accounting">Cost Accounting</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Company</label>
          <select
            className="form-control"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">All Companies</option>
            <option value="TechNova Solutions">TechNova Solutions</option>
            <option value="Global Finance Group">Global Finance Group</option>
            <option value="MediCare Innovations">MediCare Innovations</option>
            <option value="RetailMax Corporation">RetailMax Corporation</option>
            <option value="Alpha Industries">Alpha Industries</option>
            <option value="Beta Technologies">Beta Technologies</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Role</label>
          <select
            className="form-control"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="CFO">CFO</option>
            <option value="Director">Director</option>
            <option value="Manager">Manager</option>
            <option value="Specialist">Specialist</option>
            <option value="Analyst">Analyst</option>
            <option value="Auditor">Auditor</option>
            <option value="Controller">Controller</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Hire Date Range</label>
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
  );
};

export default FinanceExecutiveFilters;
