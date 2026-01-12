// HRAttendanceAccessCard.tsx
"use client";

import React from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  Clock, MapPin, RadioTower, Smartphone, 
  Fingerprint, Shield, Wifi, Calendar,
  CheckCircle, XCircle, AlertCircle, Home,
  BarChart3, TrendingUp, TrendingDown, Users,
  Lock, Unlock, Bell, Settings
} from 'lucide-react';
import { formatDate } from '../../../owner/employees/[id]/formatters';

interface HRAttendanceAccessCardProps {
  employee: IHREmployee;
  onEditAccess?: () => void;
  onEditGeoFence?: () => void;
  onViewAttendance?: () => void;
  onToggleAccess?: () => void;
}

const HRAttendanceAccessCard: React.FC<HRAttendanceAccessCardProps> = ({ 
  employee, 
  onEditAccess,
  onEditGeoFence,
  onViewAttendance,
  onToggleAccess
}) => {
  const attendance = employee.attendanceSummary || {
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
  };

  const attendanceRate = attendance.percentage;

  const getAttendanceIcon = (type: string) => {
    switch(type) {
      case 'App': return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'Biometric': return <Fingerprint className="w-5 h-5 text-purple-500" />;
      case 'GPS': return <RadioTower className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAttendanceTrend = () => {
    const lastMonthRate = 88; // Mock previous month
    const difference = attendanceRate - lastMonthRate;
    
    return {
      value: Math.abs(difference),
      direction: difference >= 0 ? 'up' : 'down',
      color: difference >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  const trend = getAttendanceTrend();

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
              <h3 className="text-lg font-semibold text-gray-900">HR Attendance & Access</h3>
              <p className="text-sm text-gray-500">Attendance analytics and access control</p>
            </div>
          </div>
          <div className="flex gap-2">
            {onToggleAccess && (
              <button
                onClick={onToggleAccess}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  employee.systemUserEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {employee.systemUserEnabled ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Disable Access
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Enable Access
                  </>
                )}
              </button>
            )}
            
            {onEditAccess && (
              <button
                onClick={onEditAccess}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                HR Settings
              </button>
            )}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Attendance Analytics
            </h4>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm ${trend.color}`}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trend.value}% from last month
              </span>
            </div>
          </div>
          
          {/* Attendance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Present" 
              value={attendance.present} 
              color="green"
              icon={<CheckCircle className="w-5 h-5" />}
              subtitle="days"
            />
            <StatCard 
              title="Absent" 
              value={attendance.absent} 
              color="red"
              icon={<XCircle className="w-5 h-5" />}
              subtitle="days"
            />
            <StatCard 
              title="Late Arrivals" 
              value={attendance.lateArrivals} 
              color="orange"
              icon={<Clock className="w-5 h-5" />}
              subtitle="times"
            />
            <StatCard 
              title="Overtime" 
              value={attendance.overtimeHours} 
              color="blue"
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle="hours"
            />
          </div>

          {/* Attendance Progress */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">Monthly Attendance Rate</p>
                <p className="text-sm text-gray-500">
                  Based on {attendance.workingDays} working days
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
                <p className="text-sm text-gray-500">Compliance Rate</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  attendanceRate >= 95 ? 'bg-green-500' :
                  attendanceRate >= 90 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Poor ({'<90%'})</span>
              <span>Average (90-94%)</span>
              <span>Good (95%+)</span>
            </div>
          </div>
        </div>

        {/* System Access Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" />
              System Access Control
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              employee.systemUserEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.systemUserEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Access Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Username:</span>
                    <span className="text-sm font-medium text-gray-900">{employee.username || 'Not set'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getAttendanceIcon(employee.attendanceType)}
                    <span className="text-sm text-gray-600">Attendance Type:</span>
                    <span className="text-sm font-medium text-gray-900">{employee.attendanceType}</span>
                  </div>
                  
                  {employee.temporaryAccessUntil && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Temporary Access Until:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(employee.temporaryAccessUntil)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Roles & Permissions</p>
                {employee.roles && employee.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {employee.roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No roles assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Geo-fencing (HR View) */}
        {employee.geoFence && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geo-fencing Area
              </h4>
              <div className="flex gap-2">
                {onEditGeoFence && (
                  <button
                    onClick={onEditGeoFence}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Area
                  </button>
                )}
                
                <button
                  onClick={() => console.log('View location history')}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
                >
                  <Clock className="w-4 h-4" />
                  View History
                </button>
              </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Latitude</p>
                      <p className="font-mono text-gray-900 text-sm">{employee.geoFence.latitude.toFixed(6)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Longitude</p>
                      <p className="font-mono text-gray-900 text-sm">{employee.geoFence.longitude.toFixed(6)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <p className="text-xs text-gray-500 mb-1">Allowed Radius</p>
                      <p className="font-medium text-gray-900">{employee.geoFence.radius}m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Bell className="w-4 h-4" />
                    <span>Alerts triggered when outside this area</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR Compliance Notes */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            HR Compliance Notes
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
              <p className="text-sm text-gray-700">
                <span className="font-medium">Attendance Compliance:</span> {attendanceRate}% this month. 
                {attendanceRate < 90 && ' Below target. Requires HR follow-up.'}
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5" />
              <p className="text-sm text-gray-700">
                <span className="font-medium">System Access:</span> {employee.systemUserEnabled ? 'Active' : 'Inactive'}
                {!employee.systemUserEnabled && '. Consider enabling for new hires.'}
              </p>
            </div>
            
      {attendance.lateArrivals > 3 && (
  <div className="flex items-start gap-2">
    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
    <p className="text-sm text-red-700">
      <span className="font-medium">Warning:</span> {attendance.lateArrivals} late arrivals this month.
      Consider discussing with employee.
    </p>
  </div>
)}


          </div>
        </div>

        {/* HR Action Buttons */}
        <div className="flex gap-2 mt-6">
          {onViewAttendance && (
            <button
              onClick={onViewAttendance}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              View Detailed Analytics
            </button>
          )}
          
          <button
            onClick={() => console.log('Generate attendance report')}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 flex items-center gap-2"
          >
            <i className="fa-regular fa-file-pdf text-lg"></i>
            Generate Report
          </button>
          
          <button
            onClick={() => console.log('Send attendance alert')}
            className="px-4 py-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200 flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Send Alert
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  subtitle: string;
}> = ({ title, value, color, icon, subtitle }) => (
  <div className={`p-3 bg-${color}-50 border border-${color}-100 rounded-lg`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-1 bg-${color}-100 rounded`}>
        <div className={`text-${color}-600`}>{icon}</div>
      </div>
      <p className="text-xs font-medium text-gray-600">{title}</p>
    </div>
    <div className="flex items-baseline gap-1">
      <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default HRAttendanceAccessCard;