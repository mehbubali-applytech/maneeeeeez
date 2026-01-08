"use client";
import React from "react";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { dropdownItems } from "@/data/dropdown-data";
import {
  IAttendanceRecord,
  ATTENDANCE_STATUS,
} from "../../../pagesUI/owner/attendance/AttendanceTypes";
import { calculateLateMinutes } from "../../../pagesUI/owner/attendance/AttendanceTypes";

// Mock data based on IAttendanceRecord interface
const attendanceTodayData: IAttendanceRecord[] = [
  {
    id: "ATT-2024-001",
    employeeId: "EMP-001",
    employeeName: "John Doe",
    department: "Engineering",
    role: "Senior Developer",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    checkInTime: "09:00",
    checkOutTime: "18:00",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 9,
    attendanceStatus: "Present",
    lateMinutes: 0,
    isManualEntry: false,
    createdAt: "2024-01-15T09:05:00",
    updatedAt: "2024-01-15T18:05:00",
  },
  {
    id: "ATT-2024-002",
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    department: "Marketing",
    role: "Marketing Manager",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    checkInTime: "09:15",
    checkOutTime: "18:00",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 8.75,
    attendanceStatus: "Late",
    lateMinutes: 15,
    isManualEntry: false,
    createdAt: "2024-01-15T09:20:00",
    updatedAt: "2024-01-15T18:05:00",
  },
  {
    id: "ATT-2024-003",
    employeeId: "EMP-003",
    employeeName: "Robert Johnson",
    department: "Sales",
    role: "Sales Executive",
    shiftId: 2,
    shiftName: "Evening Shift",
    shiftStartTime: "14:00",
    shiftEndTime: "22:00",
    date: "2024-01-15",
    checkInTime: "14:00",
    checkOutTime: "22:00",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 8,
    attendanceStatus: "Present",
    lateMinutes: 0,
    isManualEntry: false,
    createdAt: "2024-01-15T14:05:00",
    updatedAt: "2024-01-15T22:05:00",
  },
  {
    id: "ATT-2024-004",
    employeeId: "EMP-004",
    employeeName: "Sarah Williams",
    department: "HR",
    role: "HR Manager",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    checkInTime: "08:45",
    checkOutTime: "17:30",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 8.75,
    attendanceStatus: "Present",
    lateMinutes: 0,
    correctionRequest: {
      status: "Approved",
      requestedBy: "EMP-004",
      requestedAt: "2024-01-15T17:45:00",
      reason: "Had to leave early for appointment",
      correctedCheckIn: "08:45",
      correctedCheckOut: "17:30",
      approvedBy: "HR-ADMIN",
      approvedAt: "2024-01-15T17:50:00",
      notes: "Approved with adjustment",
    },
    isManualEntry: false,
    createdAt: "2024-01-15T08:50:00",
    updatedAt: "2024-01-15T17:55:00",
  },
  {
    id: "ATT-2024-005",
    employeeId: "EMP-005",
    employeeName: "Michael Brown",
    department: "Finance",
    role: "Accountant",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    checkInTime: "10:00",
    checkOutTime: "19:00",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 9,
    attendanceStatus: "Late",
    lateMinutes: 45,
    isManualEntry: false,
    createdAt: "2024-01-15T10:05:00",
    updatedAt: "2024-01-15T19:05:00",
  },
  {
    id: "ATT-2024-006",
    employeeId: "EMP-006",
    employeeName: "Emily Davis",
    department: "Engineering",
    role: "Frontend Developer",
    shiftId: 4,
    shiftName: "Flexi Shift",
    shiftStartTime: "10:00",
    shiftEndTime: "19:00",
    date: "2024-01-15",
    checkInTime: "10:30",
    checkOutTime: "19:00",
    checkInLocation: "Remote",
    checkOutLocation: "Remote",
    totalHours: 8.5,
    attendanceStatus: "Late",
    lateMinutes: 30,
    isManualEntry: false,
    createdAt: "2024-01-15T10:35:00",
    updatedAt: "2024-01-15T19:05:00",
  },
  {
    id: "ATT-2024-007",
    employeeId: "EMP-007",
    employeeName: "David Wilson",
    department: "Operations",
    role: "Operations Manager",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    checkInTime: "09:00",
    checkOutTime: "13:00",
    checkInLocation: "Office Main Gate",
    checkOutLocation: "Office Main Gate",
    totalHours: 4,
    attendanceStatus: "Half-Day",
    lateMinutes: 0,
    correctionRequest: {
      status: "Pending",
      requestedBy: "EMP-007",
      requestedAt: "2024-01-15T13:15:00",
      reason: "Medical emergency, need to mark full day",
      correctedCheckIn: "09:00",
      correctedCheckOut: "18:00",
      notes: "Doctor's certificate attached",
    },
    isManualEntry: false,
    createdAt: "2024-01-15T09:05:00",
    updatedAt: "2024-01-15T13:20:00",
  },
  {
    id: "ATT-2024-008",
    employeeId: "EMP-008",
    employeeName: "Lisa Anderson",
    department: "Marketing",
    role: "Content Writer",
    shiftId: 1,
    shiftName: "Morning Shift",
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    date: "2024-01-15",
    attendanceStatus: "On Leave",
    isManualEntry: true,
    createdBy: "HR-SYSTEM",
    createdAt: "2024-01-10T10:00:00",
    updatedAt: "2024-01-10T10:00:00",
  },
];

// Late arrivals calculated from attendance data
const lateArrivalsData = attendanceTodayData
  .filter((att) => att.attendanceStatus === "Late" && att.checkInTime)
  .map((att) => ({
    id: att.id,
    employeeName: att.employeeName,
    employeeId: att.employeeId,
    department: att.department,
    lateBy: `${
      att.lateMinutes ||
      calculateLateMinutes(att.checkInTime!, att.shiftStartTime)
    } mins`,
    checkInTime: att.checkInTime!,
    scheduledTime: att.shiftStartTime,
    shiftName: att.shiftName,
  }));

const AttendanceOverview = () => {
  // Get status badge styling
  const getStatusBadge = (status: IAttendanceRecord["attendanceStatus"]) => {
    const statusConfig =
      ATTENDANCE_STATUS[
        status.toUpperCase().replace("-", "_") as keyof typeof ATTENDANCE_STATUS
      ];

    const colors: Record<string, string> = {
      Present: "bd-badge bg-success",
      Late: "bd-badge bg-warning",
      Absent: "bd-badge bg-danger",
      "Half-Day": "bd-badge bg-info",
      "On Leave": "bd-badge bg-secondary",
    };

    return {
      className: colors[status] || "bd-badge bg-secondary",
      label: statusConfig?.label || status,
      icon: statusConfig?.icon || "",
    };
  };

  // Format time for display
  const formatTime = (time?: string) => {
    if (!time) return "-";

    // Convert 24h to 12h format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  };

  return (
    <>
      <div className="col-span-12 xxl:col-span-5 xl:col-span-12 lg:col-span-12">
        {/* Attendance Today Section */}
        <div className="card__wrapper no-height">
          <div className="card__title-wrap flex items-center justify-between mb-[20px]">
            <div>
              <h5 className="card__heading-title">Attendance Today</h5>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bd-badge bg-success">
                {
                  attendanceTodayData.filter(
                    (a) => a.attendanceStatus === "Present"
                  ).length
                }{" "}
                Present
              </span>
              <CustomDropdown items={dropdownItems} />
            </div>
          </div>

          <div className="table__wrapper meeting-table table-responsive">
            <table className="table mb-[20px] w-full">
              <thead>
                <tr className="table__title">
                  <th>Employee</th>
                  <th>Shift</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {attendanceTodayData.map((attendance) => {
                  const statusBadge = getStatusBadge(
                    attendance.attendanceStatus
                  );

                  return (
                    <tr key={attendance.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="font-medium text-gray-700">
                              {attendance.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {attendance.employeeName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {attendance.department}
                            </div>
                            <div className="text-xs text-gray-400">
                              {attendance.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{attendance.shiftName}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(attendance.shiftStartTime)} -{" "}
                            {formatTime(attendance.shiftEndTime)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatTime(attendance.checkInTime)}
                          </span>
                          {attendance.checkInLocation && (
                            <span className="text-xs text-gray-500">
                              {attendance.checkInLocation}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatTime(attendance.checkOutTime)}
                          </span>
                          {attendance.checkOutLocation && (
                            <span className="text-xs text-gray-500">
                              {attendance.checkOutLocation}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {attendance.totalHours ? (
                          <span
                            className={`font-medium ${
                              attendance.totalHours >= 8
                                ? "text-success"
                                : attendance.totalHours >= 4
                                ? "text-warning"
                                : "text-danger"
                            }`}
                          >
                            {attendance.totalHours.toFixed(1)}h
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`bd-badge ${statusBadge.className}`}>
                            {statusBadge.icon && (
                              <span className="mr-1">{statusBadge.icon}</span>
                            )}
                            {statusBadge.label}
                          </span>
                          {attendance.correctionRequest && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                attendance.correctionRequest.status ===
                                "Pending"
                                  ? "bg-warning text-white"
                                  : attendance.correctionRequest.status ===
                                    "Approved"
                                  ? "bg-success text-white"
                                  : "bg-danger text-white"
                              }`}
                            >
                              {attendance.correctionRequest.status.charAt(0)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {attendanceTodayData.length} employees
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <i className="fa-regular fa-download mr-2"></i>
                Export
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="fa-regular fa-eye mr-2"></i>
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Late Arrivals Section */}
        <div className="card__wrapper no-height">
          <div className="card__title-wrap flex items-center justify-between mb-[20px]">
            <div>
              <h5 className="card__heading-title">Late Arrivals</h5>
              <p className="text-sm text-gray-500 mt-1">
                {lateArrivalsData.length} employees arrived late today
              </p>
            </div>
            <CustomDropdown items={dropdownItems} />
          </div>

          <div className="common-scrollbar h-[148px] overflow-y-auto">
            <div className="table-height">
              <div className="table__wrapper meeting-table table-responsive">
                <table className="table mb-[20px] w-full">
                  <thead>
                    <tr className="table__title">
                      <th>Employee</th>
                      <th>Late By</th>
                      <th>Department</th>
                      <th>Shift</th>
                    </tr>
                  </thead>
                  <tbody className="table__body">
                    {lateArrivalsData.map((employee, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {employee.employeeName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">
                              {employee.employeeName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-warning font-medium">
                            {employee.lateBy}
                          </span>
                          <div className="text-xs text-gray-500">
                            Check-in: {formatTime(employee.checkInTime)}
                          </div>
                        </td>
                        <td>{employee.department}</td>
                        <td>
                          <span className="text-sm">{employee.shiftName}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {lateArrivalsData.length === 0 ? (
            <div className="text-center py-4">
              <i className="fa-regular fa-clock text-2xl text-gray-300 mb-2"></i>
              <p className="text-gray-500">No late arrivals today</p>
            </div>
          ) : (
            <div className="pt-3 border-t">
              <button className="btn btn-outline-warning btn-sm w-full">
                <i className="fa-regular fa-bell mr-2"></i>
                Send Reminder to Late Employees
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceOverview;
