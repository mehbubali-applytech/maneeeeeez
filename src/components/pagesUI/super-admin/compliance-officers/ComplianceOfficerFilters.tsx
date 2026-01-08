"use client";
import React from "react";

interface ComplianceOfficerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const ComplianceOfficerFilters: React.FC<ComplianceOfficerFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedCompany,
  setSelectedCompany,
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
            <option value="Legal & Compliance">Legal & Compliance</option>
            <option value="Risk & Compliance">Risk & Compliance</option>
            <option value="AML Compliance">AML Compliance</option>
            <option value="Data Privacy">Data Privacy</option>
            <option value="Regulatory Affairs">Regulatory Affairs</option>
            <option value="Ethics & Compliance">Ethics & Compliance</option>
            <option value="Corporate Governance">Corporate Governance</option>
            <option value="Environmental Compliance">Environmental Compliance</option>
            <option value="Quality Assurance">Quality Assurance</option>
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

export default ComplianceOfficerFilters;