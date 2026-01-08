// Example usage in EmployeeProfileMainArea
"use client";

import React, { useState } from 'react';
import { IEmployee } from '../EmployeeTypes';
import EmployeeProfileCard from './EmployeeProfileCard';
import EmergencyContactCard from './EmergencyContactCard';
import DocumentsCard from './DocumentsCard';
import SalaryDetailsCard from './SalaryDetailsCard';
import AttendanceAccessCard from './AttendanceAccessCard';
import { createMockEmployee } from '../EmployeeTypes';
import Link from "next/link";


interface EmployeeProfileMainAreaProps {
  employeeId: string;
}

const EmployeeProfileMainArea: React.FC<EmployeeProfileMainAreaProps> = ({ employeeId }) => {
  const [employee] = useState<IEmployee>(createMockEmployee({
    employeeId,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@company.com',
    roleName: 'Senior Software Engineer',
    departmentName: 'Engineering',
    workLocationName: 'Bangalore Office',
    employmentStatus: 'Active',
    workType: 'Full-time',
    systemUserEnabled: true,
    username: 'rajesh.kumar',
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
  }));

  const handleEditProfile = () => {
    // Open edit modal
    console.log('Edit profile clicked');
  };

  const handleUploadDocuments = (files: File[]) => {
    console.log('Uploading documents:', files);
    // Handle file upload logic
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
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">Employee Profile</li>
          </ol>
        </nav>

      
        </div>
        

        {/* Main Profile Card */}
        <EmployeeProfileCard
          employee={employee}
          onEdit={handleEditProfile}
        />

        {/* Two Column Layout for Other Cards */}
        <div className="grid grid-cols-1 mt-8 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <EmergencyContactCard
              employee={employee}
              onEdit={handleEditProfile}
            />
            

                 <AttendanceAccessCard
              employee={employee}
              onEditAccess={handleEditProfile}
              onEditGeoFence={handleEditProfile}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <SalaryDetailsCard
              employee={employee}
              onEdit={handleEditProfile}
            />
            
            <DocumentsCard
              employee={employee}
              onUpload={handleUploadDocuments}
              onView={(doc) => console.log('View document:', doc)}
              onVerify={(docId) => console.log('Verify document:', docId)}
            />
          </div>
        </div>
      </div>

  );
};

export default EmployeeProfileMainArea;