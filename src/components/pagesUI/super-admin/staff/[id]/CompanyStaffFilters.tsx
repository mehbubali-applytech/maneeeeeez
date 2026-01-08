"use client";
import React from "react";

interface CompanyStaffFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
  selectedEmploymentType: string;
  setSelectedEmploymentType: (type: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const CompanyStaffFilters: React.FC<CompanyStaffFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedPosition,
  setSelectedPosition,
  selectedEmploymentType,
  setSelectedEmploymentType,
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
            <option value="Terminated">Terminated</option>
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
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
            <option value="Customer Support">Customer Support</option>
            <option value="IT">IT</option>
            <option value="Product">Product</option>
            <option value="Research & Development">Research & Development</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Position</label>
          <select
            className="form-control"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="all">All Positions</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Senior Software Engineer">Senior Software Engineer</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="Financial Analyst">Financial Analyst</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Customer Support Rep">Customer Support Rep</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Product Manager">Product Manager</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="UX Designer">UX Designer</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Employment Type</label>
          <select
            className="form-control"
            value={selectedEmploymentType}
            onChange={(e) => setSelectedEmploymentType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div>
          <label className="form-label">Join Date Range</label>
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

        <div>
          <label className="form-label">Salary Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min"
              onChange={(e) => {/* Handle min salary */}}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Max"
              onChange={(e) => {/* Handle max salary */}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStaffFilters;