"use client";
import React from "react";

interface CompanyComplianceOfficerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const CompanyComplianceOfficerFilters: React.FC<CompanyComplianceOfficerFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedRole,
  setSelectedRole,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="Compliance & Risk">Compliance & Risk</option>
            <option value="Legal & Regulatory">Legal & Regulatory</option>
            <option value="Internal Audit">Internal Audit</option>
            <option value="Quality Assurance">Quality Assurance</option>
            <option value="Corporate Governance">Corporate Governance</option>
            <option value="Ethics & Conduct">Ethics & Conduct</option>
            <option value="Financial Compliance">Financial Compliance</option>
            <option value="Data Protection">Data Protection</option>
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
            <option value="Chief Compliance Officer">Chief Compliance Officer</option>
            <option value="Compliance Manager">Compliance Manager</option>
            <option value="Compliance Analyst">Compliance Analyst</option>
            <option value="Risk Officer">Risk Officer</option>
            <option value="Internal Auditor">Internal Auditor</option>
            <option value="Regulatory Specialist">Regulatory Specialist</option>
            <option value="Compliance Coordinator">Compliance Coordinator</option>
            <option value="Ethics Officer">Ethics Officer</option>
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

export default CompanyComplianceOfficerFilters;