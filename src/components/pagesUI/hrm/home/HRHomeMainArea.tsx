"use client";

import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import DashboardDetailsCards from "@/components/pagesUI/apps/home/DashboardDetailsCards";
import AttendanceOverview from "./AttendanceOverview";
import LeaveRequestsPanel from "./LeaveRequestsPanel";
import PendingTasks from "./PendingTasks";
import TeamAttendanceSummary from "./TeamAttendanceSummary";
import UpcomingBirthdays from "./UpcomingBirthdays";
import { useState, useEffect } from "react";
import {
  IAttendanceRecord,
  ATTENDANCE_STATUS,
} from "../../../pagesUI/owner/attendance/AttendanceTypes";
import { ILeave } from "./leave-data";

const cardsData = [
  {
    iconClass: "fa-sharp fa-regular fa-user",
    title: "Total Employee",
    value: 313,
    description: "Than Last Year",
    percentageChange: "+10%",
    isIncrease: true,
  },
  {
    iconClass: "fa-sharp fa-regular fa-house-person-leave",
    title: "On Leave Employee",
    value: 55,
    description: "Than Last Month",
    percentageChange: "+2.15%",
    isIncrease: true,
  },
  {
    iconClass: "fa-sharp fa-regular fa-gear",
    title: "Attendance Percentage",
    value: 98.5,
    description: "Than Last Month",
    percentageChange: "+5.15%",
    isIncrease: true,
  },
  {
    iconClass: "fa-light fa-badge-check",
    title: "Payroll Status",
    value: "Completed",
    isIncrease: true,
  },
  {
    iconClass: "fa-sharp fa-regular fa-users",
    title: "Pending Leaves",
    value: 11,
    description: "Than Last Month",
    percentageChange: "+2.15%",
    isIncrease: true,
  },
  {
    iconClass: "fa-regular fa-arrow-up-right-dots",
    title: "Total Revenue",
    value: "$55",
    description: "Than Last Month",
    percentageChange: "+2.15%",
    isIncrease: true,
  },
  {
    iconClass: "fa-sharp fa-light fa-suitcase",
    title: "Total Jobs",
    value: 55,
    description: "Than Last Month",
    percentageChange: "+2.15%",
    isIncrease: true,
  },
  {
    iconClass: "icon-tickets1",
    title: "Total Ticket",
    value: 55,
    description: "Than Last Month",
    percentageChange: "+2.15%",
    isIncrease: true,
  },
];

// Mock attendance data
const mockAttendanceData: IAttendanceRecord[] = [
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

// Mock leave requests data
const mockLeaveRequests: ILeave[] = [
  {
    id: 1,
    leaveId: "LEAVE-2024-001",
    employeeName: "John Doe",
    employeeAvatar: "/assets/images/avatar/avatar1.png",
    department: "Engineering",
    leaveType: "Sick Leave",
    fromDate: "2024-01-15",
    toDate: "2024-01-17",
    duration: "3 days",
    reason: "High fever and doctor's advice",
    appliedOn: "2024-01-10",
    status: "Pending",
  },
  {
    id: 2,
    leaveId: "LEAVE-2024-002",
    employeeName: "Jane Smith",
    employeeAvatar: "/assets/images/avatar/avatar2.png",
    department: "Marketing",
    leaveType: "Annual Leave",
    fromDate: "2024-01-20",
    toDate: "2024-01-25",
    duration: "6 days",
    reason: "Family vacation",
    appliedOn: "2024-01-05",
    status: "Pending",
  },
  {
    id: 3,
    leaveId: "LEAVE-2024-003",
    employeeName: "Robert Johnson",
    employeeAvatar: "/assets/images/avatar/avatar3.png",
    department: "Sales",
    leaveType: "Emergency Leave",
    fromDate: "2024-01-18",
    toDate: "2024-01-18",
    duration: "1 day",
    reason: "Medical emergency",
    appliedOn: "2024-01-17",
    status: "Approved",
    approvedBy: "HR Manager",
    approvedDate: "2024-01-17",
  },
  {
    id: 4,
    leaveId: "LEAVE-2024-004",
    employeeName: "Sarah Williams",
    employeeAvatar: "/assets/images/avatar/avatar4.png",
    department: "HR",
    leaveType: "Maternity Leave",
    fromDate: "2024-02-01",
    toDate: "2024-04-30",
    duration: "90 days",
    reason: "Maternity",
    appliedOn: "2024-01-08",
    status: "Pending",
  },
  {
    id: 5,
    leaveId: "LEAVE-2024-005",
    employeeName: "Michael Brown",
    employeeAvatar: "/assets/images/avatar/avatar5.png",
    department: "Finance",
    leaveType: "Casual Leave",
    fromDate: "2024-01-22",
    toDate: "2024-01-23",
    duration: "2 days",
    reason: "Personal work",
    appliedOn: "2024-01-15",
    status: "Pending",
  },
  {
    id: 6,
    leaveId: "LEAVE-2024-006",
    employeeName: "Emily Davis",
    employeeAvatar: "/assets/images/avatar/avatar6.png",
    department: "Engineering",
    leaveType: "Sick Leave",
    fromDate: "2024-01-25",
    toDate: "2024-01-26",
    duration: "2 days",
    reason: "Migraine and rest needed",
    appliedOn: "2024-01-20",
    status: "Rejected",
    approvedBy: "HR Manager",
    approvedDate: "2024-01-21",
  },
];

const HRHomeMainArea = () => {
  // Dashboard cards data

  // State for attendance data
  const [attendanceTodayData, setAttendanceTodayData] = useState<
    IAttendanceRecord[]
  >([]);
  const [lateArrivalsData, setLateArrivalsData] = useState<any[]>([]);

  // State for leave requests
  const [leaveRequests, setLeaveRequests] = useState<ILeave[]>([]);

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    onLeaveCount: 0,
    todayAttendanceRate: 0,
  });

  // Initialize data on component mount
  useEffect(() => {
    setAttendanceTodayData(mockAttendanceData);
    setLeaveRequests(mockLeaveRequests);

    // Calculate late arrivals
    const lateArrivals = mockAttendanceData
      .filter((att) => att.attendanceStatus === "Late" && att.checkInTime)
      .map((att) => ({
        id: att.id,
        employeeName: att.employeeName,
        employeeId: att.employeeId,
        department: att.department,
        lateBy: `${att.lateMinutes} mins`,
        checkInTime: att.checkInTime!,
        scheduledTime: att.shiftStartTime,
        shiftName: att.shiftName,
      }));

    setLateArrivalsData(lateArrivals);

    // Calculate dashboard stats
    const presentCount = mockAttendanceData.filter(
      (a) => a.attendanceStatus === "Present"
    ).length;
    const lateCount = mockAttendanceData.filter(
      (a) => a.attendanceStatus === "Late"
    ).length;
    const onLeaveCount = mockAttendanceData.filter(
      (a) => a.attendanceStatus === "On Leave"
    ).length;

    const totalEmployees = mockAttendanceData.length;
    const attendanceRate =
      totalEmployees > 0
        ? ((presentCount + lateCount * 0.5) / totalEmployees) * 100
        : 0;

    setDashboardStats({
      presentCount,
      lateCount,
      absentCount: mockAttendanceData.filter(
        (a) => a.attendanceStatus === "Absent"
      ).length,
      onLeaveCount,
      todayAttendanceRate: parseFloat(attendanceRate.toFixed(1)),
    });

    // Update cards data with real stats
    const updatedCardsData = [...cardsData];
    updatedCardsData[0].value = 313; // Total employees
    updatedCardsData[1].value = onLeaveCount; // On leave
    updatedCardsData[2].value = attendanceRate; // Attendance percentage

    // Update cards state if you have state for cards
  }, []);

  // Handle leave approval
  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.leaveId === leaveId
          ? {
              ...leave,
              status: "Approved",
              approvedBy: "HR Manager",
              approvedDate: new Date().toISOString(),
            }
          : leave
      )
    );
  };

  // Handle leave rejection
  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.leaveId === leaveId
          ? {
              ...leave,
              status: "Rejected",
              approvedBy: "HR Manager",
              approvedDate: new Date().toISOString(),
            }
          : leave
      )
    );
  };

  // Handle approve all leaves
  const handleApproveAllLeaves = () => {
    setLeaveRequests((prev) =>
      prev.map((leave) => ({
        ...leave,
        status: leave.status === "Pending" ? "Approved" : leave.status,
        approvedBy:
          leave.status === "Pending" ? "HR Manager" : leave.approvedBy,
        approvedDate:
          leave.status === "Pending"
            ? new Date().toISOString()
            : leave.approvedDate,
      }))
    );
  };

  return (
    <>
      <MetaData pageTitle="HR Dashboard">
        <Wrapper role={"hr"}>
          <div className="app__slide-wrapper">
            <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
              {/* Dashboard Stats Cards */}
              <DashboardDetailsCards cardsData={cardsData} />

              {/* Attendance Overview Section */}
              <div className="col-span-12 xxl:col-span-6 xl:col-span-12 lg:col-span-12">
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
                        {dashboardStats.presentCount} Present
                      </span>
                      <span className="bd-badge bg-warning">
                        {dashboardStats.lateCount} Late
                      </span>
                      <span className="bd-badge bg-danger">
                        {dashboardStats.onLeaveCount} On Leave
                      </span>
                    </div>
                  </div>

                  {/* You can use the AttendanceOverview component here */}
                  <AttendanceOverview />
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="col-span-12 lg:col-span-6 xxl:col-span-6">
                <PendingTasks />
              </div>

              {/* Leave Requests Panel */}
              <div className="col-span-12 xxl:col-span-12">
                <div className="card__wrapper">
                  <div className="card__title-wrap flex items-center justify-between mb-5">
                    <h5 className="card__heading-title">
                      Pending Leave Requests
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="bd-badge bg-warning">
                        {
                          leaveRequests.filter((l) => l.status === "Pending")
                            .length
                        }{" "}
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* You can use the LeaveRequestsPanel component here */}
                  <LeaveRequestsPanel />
                </div>
              </div>

              {/* Team Attendance Summary */}
              <div className="col-span-12 xl:col-span-6 xxl:col-span-6">
                <TeamAttendanceSummary />
              </div>

              {/* Upcoming Birthdays */}
              <div className="col-span-12 lg:col-span-6 xl:col-span-12 xxl:col-span-6">
                <UpcomingBirthdays />
              </div>
            </div>
          </div>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default HRHomeMainArea;
