"use client";
import React from "react";

interface HrManagerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const HrManagerFilters: React.FC<HrManagerFiltersProps> = ({
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
            <option value="HR Operations">HR Operations</option>
            <option value="Talent Acquisition">Talent Acquisition</option>
            <option value="Employee Relations">Employee Relations</option>
            <option value="Compensation & Benefits">Compensation & Benefits</option>
            <option value="HR Compliance">HR Compliance</option>
            <option value="Learning & Development">Learning & Development</option>
            <option value="Wellness Programs">Wellness Programs</option>
            <option value="International HR">International HR</option>
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

export default HrManagerFilters;