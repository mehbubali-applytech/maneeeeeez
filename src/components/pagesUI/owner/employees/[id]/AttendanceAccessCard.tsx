// components/employee/AttendanceAccessCard.tsx
"use client";

import React from 'react';
import { IEmployee } from '../EmployeeTypes';
import { 
  Clock, MapPin, RadioTower, Smartphone, 
  Fingerprint, Shield, Wifi, Calendar,
  CheckCircle, XCircle, AlertCircle, Home,
  BarChart3, TrendingUp
} from 'lucide-react';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

interface AttendanceAccessCardProps {
  employee: IEmployee;
  onEditAccess?: () => void;
  onEditGeoFence?: () => void;
  onViewAttendance?: () => void;
}

const AttendanceAccessCard: React.FC<AttendanceAccessCardProps> = ({ 
  employee, 
  onEditAccess,
  onEditGeoFence,
  onViewAttendance
}) => {
  // Safe data extraction with nullish coalescing
  const presentDays = employee.presentDaysThisMonth ?? 1;
  const absentDays = employee.absenceDaysThisMonth ?? 0;
  const leaveDays = employee.leaveDaysThisMonth ?? 1;
  const holidayDays = employee.holidayDaysThisMonth ?? 1;
  
  // Calculate working days (Present + Absent, excluding leave & holidays)
  const workingDays = presentDays + absentDays;
  
  // Calculate attendance rate with fallback
  const attendanceRate = employee.attendancePercentage ?? 
    (workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0);

  const getAttendanceIcon = (type: string) => {
    switch(type) {
      case 'App': return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'Biometric': return <Fingerprint className="w-5 h-5 text-purple-500" />;
      case 'GPS': return <RadioTower className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAttendanceLabel = (type: string) => {
    switch(type) {
      case 'App': return 'Mobile App Check-in';
      case 'Biometric': return 'Biometric Device';
      case 'GPS': return 'GPS Tracking';
      default: return type;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch(status) {
      case 'Present': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Absent': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'On Leave': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'Work From Home': return <Home className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'On Leave': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Work From Home': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Prepare data for the pie chart (only include non-zero values)
  const pieChartData = [
    { 
      id: 0, 
      value: presentDays, 
      label: 'Present', 
      color: '#10B981' 
    },
    { 
      id: 1, 
      value: absentDays, 
      label: 'Absent', 
      color: '#EF4444' 
    },
    { 
      id: 2, 
      value: leaveDays, 
      label: 'Leave', 
      color: '#F59E0B' 
    },
    { 
      id: 3, 
      value: holidayDays, 
      label: 'Holiday', 
      color: '#8B5CF6' 
    },
  ].filter(item => item.value > 0);

  const totalDays = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const shouldShowChart = totalDays > 0;

  // Format date for temporary access
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to render attendance stats
  const renderStatCard = (title: string, value: number, color: string, icon: React.ReactNode) => (
    <div className={`p-4 ${color} border rounded-lg shadow-sm`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">days</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance & Access</h3>
              <p className="text-sm text-gray-500">Real-time attendance tracking and system access</p>
            </div>
          </div>
          <div className="flex gap-2">
            {onViewAttendance && (
              <button
                onClick={onViewAttendance}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </button>
            )}
            {onEditAccess && (
              <button
                onClick={onEditAccess}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Edit Settings
              </button>
            )}
          </div>
        </div>

        {/* Today's Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {`Today's Status`}
            </h4>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className={`p-4 rounded-lg border ${getStatusColor(employee.presentDayStatus)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(employee.presentDayStatus)}
                <div>
                  <p className="font-medium text-lg">
                    {employee.presentDayStatus || 'Not Marked'}
                  </p>
                  <p className="text-sm opacity-80">Current day status</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{attendanceRate}%</p>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm opacity-80">Monthly Attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Monthly Overview
            </h4>
            <span className="text-xs font-medium text-gray-700">
              {workingDays} working days
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {renderStatCard(
                  'Present',
                  presentDays,
                  'bg-green-50 border-green-100',
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                
                {renderStatCard(
                  'Absent',
                  absentDays,
                  'bg-red-50 border-red-100',
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                
                {renderStatCard(
                  'Leave',
                  leaveDays,
                  'bg-orange-50 border-orange-100',
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                )}
                
                {renderStatCard(
                  'Holiday',
                  holidayDays,
                  'bg-purple-50 border-purple-100',
                  <Calendar className="w-4 h-4 text-purple-600" />
                )}
              </div>
              
              {/* Attendance Progress */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      Based on {workingDays} working days
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {attendanceRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      attendanceRate >= 90 ? 'bg-green-500' :
                      attendanceRate >= 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Poor ({'<75%'})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Average (75-89%)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Good (90%+)</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Pie Chart */}
            {shouldShowChart && (
              <div className="lg:col-span-1">
                <div className="h-64 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Distribution</p>
                    <span className="text-xs font-semibold text-gray-900">
                      Total: {totalDays} days
                    </span>
                  </div>
                  <Box sx={{ height: '100%' }}>
                    <PieChart
                      series={[
                        {
                          data: pieChartData,
                          innerRadius: 30,
                          outerRadius: 70,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          cx: 100,
                          cy: 90,
                          faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
                        }
                      ]}
                      slotProps={{
                        legend: {
                          direction: "vertical",
                          position: { vertical: 'middle', horizontal: 'end' },
                        
                        },
                      }}
                      height={180}
                      margin={{ right: 120, left: 0, top: 10, bottom: 10 }}
                    />
                  </Box>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      {workingDays} working days • {leaveDays} leave days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Access Status */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            System Access
          </h4>
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {employee.systemUserEnabled ? (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {employee.systemUserEnabled ? 'Access Enabled' : 'Access Disabled'}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {employee.username && (
                      <span className="bg-gray-100 px-2 py-1 rounded">@{employee.username}</span>
                    )}
                    {employee.temporaryAccessUntil && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Until {formatDate(employee.temporaryAccessUntil)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {employee.systemUserEnabled && employee.roles && employee.roles.length > 0 && (
                <div className="flex flex-wrap gap-2 max-w-xs justify-end">
                  {employee.roles.slice(0, 2).map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                  {employee.roles.length > 2 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{employee.roles.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Settings */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Attendance Type */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getAttendanceIcon(employee.attendanceType)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Attendance Type</p>
                  <p className="text-sm text-gray-600">
                    {getAttendanceLabel(employee.attendanceType)}
                  </p>
                </div>
              </div>
            </div>

            {/* Shift */}
            {employee.shiftName && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shift Schedule</p>
                    <p className="text-sm text-gray-600">{employee.shiftName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Temporary Access */}
            {employee.temporaryAccessUntil && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Temporary Access</p>
                    <p className="text-sm text-gray-600">
                      Expires {formatDate(employee.temporaryAccessUntil)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Geo-fencing */}
        {employee.geoFence && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geo-fencing Area
              </h4>
              {onEditGeoFence && (
                <button
                  onClick={onEditGeoFence}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  Edit Area
                </button>
              )}
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">
                    {employee.geoFence.address || 'Designated Work Area'}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Latitude</p>
                      <p className="font-mono text-gray-900">{employee.geoFence.latitude.toFixed(6)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Longitude</p>
                      <p className="font-mono text-gray-900">{employee.geoFence.longitude.toFixed(6)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Radius</p>
                      <p className="font-medium text-gray-900">{employee.geoFence.radius}m</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    <span className="font-medium">Note:</span> Employee can only check-in within this designated area
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceAccessCard;