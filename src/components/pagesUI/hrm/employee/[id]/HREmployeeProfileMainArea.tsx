// HREmployeeProfileMainArea.tsx
"use client";

import React, { useState } from 'react';
import { IHREmployee, createHRMockEmployee } from '../HREmployeeTypes';
import HREmployeeProfileCard from './HREmployeeProfileCard';
import HREmergencyContactCard from './HREmergencyContactCard';
import HRAttendanceAccessCard from './HRAttendanceAccessCard';
import HROnboardingProgressCard from './HROnboardingProgressCard';
import HRPerformanceCard from './HRPerformanceCard';
import Link from "next/link";
import HRDocumentsCard from './HRDocumentsCard';
import HRSalaryDetailsCard from './HRSalaryDetailsCard';

interface HREmployeeProfileMainAreaProps {
  employeeId: string;
}

const HREmployeeProfileMainArea: React.FC<HREmployeeProfileMainAreaProps> = ({ employeeId }) => {
  const [employee] = useState<IHREmployee>(createHRMockEmployee({
    employeeId,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@company.com',
    roleName: 'Senior Software Engineer',
    departmentName: 'Engineering',
    workLocationName: 'Bangalore Office',
    employmentStatus: 'Active',
    workflowStatus: 'Active',
    onboardingStatus: 'In Progress',
    workType: 'Full-time',
    systemUserEnabled: true,
    username: 'rajesh.kumar',
    hrManagerName: 'Priya Sharma',
    performanceRating: 4.2,
    attendanceCompliance: 94,
    leaveBalance: 12,
    trainingCompleted: ['Orientation', 'Code of Conduct', 'Safety Training'],
    
    salaryStructure: {
      basicPay: 60000,
      hra: 24000,
      allowances: [
        { name: 'Special Allowance', amount: 12000, type: 'Fixed', taxable: true },
        { name: 'Travel Allowance', amount: 8000, type: 'Fixed', taxable: false },
      ],
      deductions: [
        { name: 'PF', amount: 7200, type: 'Fixed' },
        { name: 'Professional Tax', amount: 200, type: 'Fixed' },
      ],
    },
    
    bankDetails: {
      accountName: 'Rajesh Kumar',
      accountNumber: '123456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branchName: 'Koramangala Branch',
    },
    
    documents: [
      {
        id: '1',
        type: 'ID Proof',
        documentType: 'PAN',
        documentNumber: 'ABCDE1234F',
        fileName: 'PAN_Card.pdf',
        fileUrl: '/documents/pan.pdf',
        fileSize: 1024 * 256,
        uploadedDate: new Date().toISOString(),
        verified: true,
      },
    ],
    
    geoFence: {
      latitude: 12.9716,
      longitude: 77.5946,
      radius: 500,
      address: 'Company HQ, Bangalore',
    },
    
    attendanceSummary: {
      present: 22,
      absent: 1,
      leave: 2,
      holiday: 4,
      workingDays: 23,
      totalDays: 29,
      percentage: 94,
      lateArrivals: 1,
      earlyDepartures: 0,
      overtimeHours: 8,
      regularHours: 176,
      averageHoursPerDay: 8.2
    }
  }));

  const handleEditProfile = () => {
    console.log('Edit HR profile clicked');
  };

  const handleUploadDocuments = (files: File[]) => {
    console.log('HR Uploading documents:', files);
  };

  const handleStartOnboarding = () => {
    console.log('Start onboarding process');
  };

  const handleScheduleAppraisal = () => {
    console.log('Schedule performance appraisal');
  };

  const handleMarkOnboardingComplete = () => {
    console.log('Mark onboarding as complete');
  };

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/hr">HR Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Employee Profile (HR View)</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <i className="fa-regular fa-pen-to-square"></i>
            Edit HR Profile
          </button>
          
          {employee.onboardingStatus !== 'Completed' && (
            <button
              onClick={handleMarkOnboardingComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <i className="fa-regular fa-check-circle"></i>
              Complete Onboarding
            </button>
          )}
          
          <button
            onClick={handleScheduleAppraisal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <i className="fa-regular fa-calendar-check"></i>
            Schedule Appraisal
          </button>
        </div>
      </div>

      {/* Main Profile Card with HR Data */}
      <HREmployeeProfileCard
        employee={employee}
        onEdit={handleEditProfile}
        onStartOnboarding={handleStartOnboarding}
      />

      {/* Three Column Layout for HR Cards */}
      <div className="grid grid-cols-1 mt-8 lg:grid-cols-3 gap-8">
        {/* Left Column - HR & Performance */}
        <div className="space-y-8">
          <HROnboardingProgressCard
            employee={employee}
            onMarkComplete={handleMarkOnboardingComplete}
          />
          
          <HRPerformanceCard
            employee={employee}
            onScheduleAppraisal={handleScheduleAppraisal}
          />
        </div>

        {/* Middle Column - Personal & Contact */}
        <div className="space-y-8">
          <HREmergencyContactCard
            employee={employee}
            onEdit={handleEditProfile}
          />
          
          <HRAttendanceAccessCard
            employee={employee}
            onEditAccess={handleEditProfile}
            onEditGeoFence={handleEditProfile}
            onViewAttendance={() => console.log('View HR attendance analytics')}
          />
        </div>

        {/* Right Column - Documents & Salary */}
        <div className="space-y-8">
          <HRSalaryDetailsCard
            employee={employee}
            onEdit={handleEditProfile}
          />
          
          <HRDocumentsCard
            employee={employee}
            onUpload={handleUploadDocuments}
            onView={(doc) => console.log('View HR document:', doc)}
            onVerify={(docId) => console.log('Verify HR document:', docId)}
          />
        </div>
      </div>
    </div>
  );
};

export default HREmployeeProfileMainArea;