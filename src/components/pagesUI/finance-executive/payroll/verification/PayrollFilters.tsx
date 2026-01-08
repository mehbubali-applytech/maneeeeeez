"use client";
import React from "react";

interface PayrollFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedMonth,
  setSelectedMonth,
  selectedDepartment,
  setSelectedDepartment,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
}) => {
  const months = [
    "January 2025", "February 2025", "March 2025", "April 2025",
    "May 2025", "June 2025", "July 2025", "August 2025",
    "September 2025", "October 2025", "November 2025", "December 2025"
  ];

  const departments = [
    "All Departments",
    "Engineering",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "HR",
    "Customer Support"
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="form-label">Search Employee</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label className="form-label">Payroll Month</label>
          <select
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
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
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Verified">Verified</option>
            <option value="Needs Review">Needs Review</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Department</label>
          <select
            className="form-control"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept === "All Departments" ? "all" : dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Payment Date Range</label>
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
      
      {/* Quick Action Buttons */}
      <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          onClick={() => {
            // Handle bulk approval
            console.log('Bulk approve payroll');
          }}
        >
          <i className="fa-solid fa-check-circle"></i>
          Approve Selected
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          onClick={() => {
            // Handle export
            console.log('Export payroll data');
          }}
        >
          <i className="fa-solid fa-download"></i>
          Export Report
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          onClick={() => {
            // Reset filters
            setSelectedStatus("all");
            setSelectedMonth("all");
            setSelectedDepartment("all");
            setSearchQuery("");
            setDateRange({ start: "", end: "" });
          }}
        >
          <i className="fa-solid fa-filter-circle-xmark"></i>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default PayrollFilters;