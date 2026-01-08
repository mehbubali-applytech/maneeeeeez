// components/employee/EmployeeProfileCard.tsx
"use client";

import React from 'react';
import { IEmployee, GENDER_OPTIONS, WORK_TYPE_OPTIONS, EMPLOYMENT_STATUS_OPTIONS } from '../EmployeeTypes';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Building, Users, Target, Shield, FileText, CreditCard,
  Award, Clock, RadioTower
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { formatDate, formatCurrency } from './formatters';

interface EmployeeProfileCardProps {
  employee: IEmployee;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ 
  employee, 
  onEdit, 
  onViewDetails 
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Probation': return 'warning';
      case 'Resigned': return 'info';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch(workType) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'secondary';
      case 'Contract': return 'warning';
      case 'Intern': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div className="absolute top-4 right-4 flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Edit Profile"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="View Details"
            >
              <FileText className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white">
              {employee.profilePhoto ? (
                <Image
                  src={employee.profilePhoto}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
              )}
            </div>
            <StatusBadge
              status={employee.employmentStatus}
              className="absolute -bottom-2 -right-2"
            />
          </div>
          
          <div className="text-white">
            <h2 className="text-2xl font-bold">
              {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
              {employee.preferredName && (
                <span className="text-sm font-normal ml-2 opacity-90">
                  ({employee.preferredName})
                </span>
              )}
            </h2>
            <p className="text-white/90 text-lg">{employee.roleName}</p>
            <p className="text-white/80 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {employee.departmentName} • {employee.workLocationName}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Info
            </h3>
            <div className="space-y-3">
              <InfoRow 
                icon={Mail} 
                label="Email" 
                value={employee.email}
                href={`mailto:${employee.email}`}
              />
              <InfoRow 
                icon={Phone} 
                label="Phone" 
                value={employee.phoneNumber || 'Not provided'}
                href={employee.phoneNumber ? `tel:${employee.phoneNumber}` : undefined}
              />
              <InfoRow 
                icon={Calendar} 
                label="Date of Birth" 
                value={employee.dateOfBirth ? formatDate(employee.dateOfBirth) : 'Not provided'}
              />
              <InfoRow 
                icon={Users} 
                label="Gender" 
                value={employee.gender || 'Not specified'}
              />
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Details
            </h3>
            <div className="space-y-3">
              <InfoRow 
                icon={Calendar} 
                label="Joined On" 
                value={formatDate(employee.dateOfJoining)}
              />
              <InfoRow 
                icon={Clock} 
                label="Work Type" 
                value={employee.workType}
                badgeColor={getWorkTypeColor(employee.workType)}
              />
              <InfoRow 
                icon={Target} 
                label="Employee ID" 
                value={employee.employeeId}
                copyable
              />
              {employee.reportingManagerName && (
                <InfoRow 
                  icon={Users} 
                  label="Reports To" 
                  value={employee.reportingManagerName}
                />
              )}
            </div>
          </div>

          {/* Salary & Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Compensation & Access
            </h3>
            <div className="space-y-3">
              {employee.costToCompany && (
                <InfoRow 
                  icon={Award} 
                  label="CTC" 
                  value={formatCurrency(employee.costToCompany)}
                />
              )}
              <InfoRow 
                icon={Shield} 
                label="System Access" 
                value={employee.systemUserEnabled ? 'Enabled' : 'Disabled'}
                badgeColor={employee.systemUserEnabled ? 'success' : 'error'}
              />
              <InfoRow 
                icon={RadioTower} 
                label="Attendance Type" 
                value={employee.attendanceType}
              />
              <InfoRow 
                icon={Clock} 
                label="Pay Frequency" 
                value={employee.payFrequency}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        {employee.presentAddress && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" />
              Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{employee.presentAddress.addressLine1}</p>
              {employee.presentAddress.addressLine2 && (
                <p className="text-gray-600">{employee.presentAddress.addressLine2}</p>
              )}
              <p className="text-gray-600">
                {employee.presentAddress.city}, {employee.presentAddress.state} - {employee.presentAddress.zipCode}
              </p>
              <p className="text-gray-600">{employee.presentAddress.country}</p>
              {employee.sameAsPresentAddress && employee.permanentAddress && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Permanent address same as present</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  badgeColor?: string;
  copyable?: boolean;
}> = ({ icon: Icon, label, value, href, badgeColor, copyable = false }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    // You can add a toast notification here
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{label}:</span>
      </div>
      <div className="flex items-center gap-2">
        {href ? (
          <Link 
            href={href}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {value}
          </Link>
        ) : badgeColor ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badgeColor}-100 text-${badgeColor}-800`}>
            {value}
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-900">{value}</span>
        )}
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            <FileText className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileCard;