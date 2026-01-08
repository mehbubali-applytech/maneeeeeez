"use client";
import React from "react";

interface CompanyHrManagerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const CompanyHrManagerFilters: React.FC<CompanyHrManagerFiltersProps> = ({
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
            <option value="Human Resources">Human Resources</option>
            <option value="Recruitment">Recruitment</option>
            <option value="Employee Relations">Employee Relations</option>
            <option value="Training & Development">Training & Development</option>
            <option value="Compensation & Benefits">Compensation & Benefits</option>
            <option value="HR Operations">HR Operations</option>
            <option value="Talent Management">Talent Management</option>
            <option value="HR Analytics">HR Analytics</option>
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
            <option value="HR Director">HR Director</option>
            <option value="HR Manager">HR Manager</option>
            <option value="HR Generalist">HR Generalist</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Training Specialist">Training Specialist</option>
            <option value="Compensation Analyst">Compensation Analyst</option>
            <option value="Employee Relations Specialist">Employee Relations Specialist</option>
            <option value="HR Coordinator">HR Coordinator</option>
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

export default CompanyHrManagerFilters;