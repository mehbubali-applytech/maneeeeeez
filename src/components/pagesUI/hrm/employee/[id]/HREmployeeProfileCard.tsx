// HREmployeeProfileCard.tsx
"use client";

import React from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Building, Users, Target, Shield, FileText, CreditCard,
  Award, Clock, RadioTower, Award as Trophy, School, TrendingUp,
  CheckCircle, Clock as ClockIcon, AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, formatCurrency } from '../../../owner/employees/[id]/formatters';
import StatusBadge from './StatusBadge';



interface HREmployeeProfileCardProps {
  employee: IHREmployee;
  onEdit?: () => void;
  onStartOnboarding?: () => void;
  onViewDetails?: () => void;
}

const HREmployeeProfileCard: React.FC<HREmployeeProfileCardProps> = ({ 
  employee, 
  onEdit, 
  onStartOnboarding,
  onViewDetails 
}) => {
  const getWorkflowColor = (status: string) => {
    switch(status) {
      case 'Active': return 'success';
      case 'New Hire': return 'info';
      case 'On Leave': return 'warning';
      case 'Notice Period': return 'error';
      case 'Exit': return 'error';
      default: return 'default';
    }
  };

  const getOnboardingColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      case 'On Hold': return 'info';
      default: return 'default';
    }
  };

  const calculateTenure = () => {
    if (!employee.dateOfJoining) return 'N/A';
    const joiningDate = new Date(employee.dateOfJoining);
    const today = new Date();
    
    const years = today.getFullYear() - joiningDate.getFullYear();
    const months = today.getMonth() - joiningDate.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  const getProbationStatus = () => {
    if (employee.employmentStatus !== 'On Probation') return null;
    
    if (employee.probationReviewDate) {
      const reviewDate = new Date(employee.probationReviewDate);
      const today = new Date();
      const daysLeft = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        return `${daysLeft} days until review`;
      } else {
        return `Review overdue by ${Math.abs(daysLeft)} days`;
      }
    }
    return 'Probation active';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header Section with HR Badges */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
        <div className="absolute top-4 right-4 flex space-x-2">
          {/* HR Action Buttons */}
          {onStartOnboarding && employee.onboardingStatus !== 'Completed' && (
            <button
              onClick={onStartOnboarding}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Start Onboarding"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Edit HR Profile"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="View HR Details"
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
              )}
            </div>
            {/* HR Status Badges */}
            <div className="absolute -bottom-2 -right-2 flex flex-col gap-1">
              <StatusBadge
                status={employee.workflowStatus}
                className=""
              />
              <StatusBadge
                status={employee.onboardingStatus}
                className={`${
                  employee.onboardingStatus === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                  employee.onboardingStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }`}
              />
            </div>
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
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-white/80 flex items-center gap-1 text-sm">
                <Building className="w-3 h-3" />
                {employee.departmentName}
              </span>
              <span className="text-white/70">•</span>
              <span className="text-white/80 flex items-center gap-1 text-sm">
                <MapPin className="w-3 h-3" />
                {employee.workLocationName}
              </span>
              <span className="text-white/70">•</span>
              <span className="text-white/80 flex items-center gap-1 text-sm">
                <Calendar className="w-3 h-3" />
                Tenure: {calculateTenure()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HR Info Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* HR & Onboarding Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" />
              HR Information
            </h3>
            <div className="space-y-3">
              <InfoRow 
                icon={Users} 
                label="HR Manager" 
                value={employee.hrManagerName || 'Not assigned'}
              />
              <InfoRow 
                icon={CheckCircle} 
                label="Onboarding Status" 
                value={employee.onboardingStatus}
                badgeColor={getOnboardingColor(employee.onboardingStatus)}
              />
              <InfoRow 
                icon={ClockIcon} 
                label="Workflow Status" 
                value={employee.workflowStatus}
                badgeColor={getWorkflowColor(employee.workflowStatus)}
              />
              {employee.employmentStatus === 'On Probation' && (
                <InfoRow 
                  icon={AlertTriangle} 
                  label="Probation Status" 
                  value={getProbationStatus() || 'Active'}
                  badgeColor="warning"
                />
              )}
            </div>
          </div>

          {/* Performance & Attendance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </h3>
            <div className="space-y-3">
              {employee.performanceRating && (
                <InfoRow 
                  icon={Trophy} 
                  label="Performance Rating" 
                  value={`${employee.performanceRating}/5`}
                  badgeColor={
                    employee.performanceRating >= 4.5 ? 'success' :
                    employee.performanceRating >= 3.5 ? 'warning' : 'error'
                  }
                />
              )}
              
              <InfoRow 
                icon={Clock} 
                label="Attendance %" 
                value={`${employee.attendanceCompliance || 0}%`}
                badgeColor={
                  (employee.attendanceCompliance || 0) >= 95 ? 'success' :
                  (employee.attendanceCompliance || 0) >= 90 ? 'warning' : 'error'
                }
              />
              
              <InfoRow 
                icon={Calendar} 
                label="Leave Balance" 
                value={`${employee.leaveBalance || 0} days`}
              />
              
              {employee.lastAppraisalDate && (
                <InfoRow 
                  icon={Calendar} 
                  label="Last Appraisal" 
                  value={formatDate(employee.lastAppraisalDate)}
                />
              )}
            </div>
          </div>

          {/* Training & Compliance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4" />
              Training & Compliance
            </h3>
            <div className="space-y-3">
              <InfoRow 
                icon={CheckCircle} 
                label="Training Completed" 
                value={`${employee.trainingCompleted?.length || 0} programs`}
              />
              
              <InfoRow 
                icon={Shield} 
                label="Background Check" 
                value={employee.backgroundCheckStatus || 'Pending'}
                badgeColor={
                  employee.backgroundCheckStatus === 'Completed' ? 'success' :
                  employee.backgroundCheckStatus === 'In Progress' ? 'warning' : 'error'
                }
              />
              
              <InfoRow 
                icon={Briefcase} 
                label="Equipment Issued" 
                value={employee.equipmentIssued ? 'Yes' : 'No'}
                badgeColor={employee.equipmentIssued ? 'success' : 'error'}
              />
              
              <InfoRow 
                icon={RadioTower} 
                label="System Access" 
                value={employee.systemAccessCreated ? 'Created' : 'Pending'}
                badgeColor={employee.systemAccessCreated ? 'success' : 'warning'}
              />
            </div>
          </div>
        </div>

        {/* Contact & Personal Info Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <ContactRow 
                  icon={Mail}
                  value={employee.email}
                  href={`mailto:${employee.email}`}
                  label="Work Email"
                />
                {employee.phoneNumber && (
                  <ContactRow 
                    icon={Phone}
                    value={employee.phoneNumber}
                    href={`tel:${employee.phoneNumber}`}
                    label="Phone Number"
                  />
                )}
                {employee.username && (
                  <ContactRow 
                    icon={User}
                    value={`@${employee.username}`}
                    label="System Username"
                    copyable
                  />
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Details
              </h3>
              <div className="space-y-2">
                {employee.dateOfBirth && (
                  <ContactRow 
                    icon={Calendar}
                    value={formatDate(employee.dateOfBirth)}
                    label="Date of Birth"
                  />
                )}
                {employee.gender && (
                  <ContactRow 
                    icon={Users}
                    value={employee.gender}
                    label="Gender"
                  />
                )}
                {employee.dateOfJoining && (
                  <ContactRow 
                    icon={Calendar}
                    value={formatDate(employee.dateOfJoining)}
                    label="Date of Joining"
                  />
                )}
                <ContactRow 
                  icon={Target}
                  value={employee.employeeId}
                  label="Employee ID"
                  copyable
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  badgeColor?: string;
}> = ({ icon: Icon, label, value, badgeColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-600">{label}:</span>
    </div>
    <div className="flex items-center gap-2">
      {badgeColor ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badgeColor}-100 text-${badgeColor}-800`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  </div>
);

const ContactRow: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  href?: string;
  copyable?: boolean;
}> = ({ icon: Icon, value, label, href, copyable = false }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value.replace('@', ''));
  };

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {href ? (
          <Link 
            href={href}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {value}
          </Link>
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

export default HREmployeeProfileCard;