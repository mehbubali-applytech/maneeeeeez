// HROnboardingProgressCard.tsx
"use client";

import React from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  CheckSquare, CheckCircle, Clock, AlertCircle, 
  FileCheck, UserCheck, Laptop, Shield,
  TrendingUp, Calendar, Users, Award,
  ListChecks // Alternative checklist icon
} from 'lucide-react';

interface HROnboardingProgressCardProps {
  employee: IHREmployee;
  onMarkComplete?: () => void;
  onViewChecklist?: () => void;
}

const HROnboardingProgressCard: React.FC<HROnboardingProgressCardProps> = ({ 
  employee, 
  onMarkComplete,
  onViewChecklist
}) => {
  // Onboarding checklist items
  const onboardingChecklist = [
    {
      id: 'documents',
      title: 'Document Collection',
      completed: employee.documents.length > 0,
      icon: FileCheck,
      color: 'blue'
    },
    {
      id: 'background',
      title: 'Background Check',
      completed: employee.backgroundCheckStatus === 'Completed',
      icon: Shield,
      color: 'green'
    },
    {
      id: 'orientation',
      title: 'Orientation',
      completed: employee.orientationCompleted,
      icon: Users,
      color: 'purple'
    },
    {
      id: 'equipment',
      title: 'Equipment Setup',
      completed: employee.equipmentIssued,
      icon: Laptop,
      color: 'orange'
    },
    {
      id: 'system',
      title: 'System Access',
      completed: employee.systemAccessCreated,
      icon: UserCheck,
      color: 'indigo'
    },
    {
      id: 'training',
      title: 'Initial Training',
      completed: employee.trainingCompleted?.length > 0,
      icon: Award,
      color: 'pink'
    }
  ];

  const completedItems = onboardingChecklist.filter(item => item.completed).length;
  const totalItems = onboardingChecklist.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const getOnboardingStatusText = () => {
    switch(employee.onboardingStatus) {
      case 'Completed':
        return 'Onboarding completed successfully';
      case 'In Progress':
        return `${completedItems}/${totalItems} tasks completed`;
      case 'Pending':
        return 'Onboarding not started';
      case 'On Hold':
        return 'Onboarding paused';
      default:
        return 'Status not defined';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              {/* Use CheckSquare or ListChecks instead of Checklist */}
              <CheckSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
              <p className="text-sm text-gray-500">{getOnboardingStatusText()}</p>
            </div>
          </div>
          
          {employee.onboardingStatus !== 'Completed' && onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                completionPercentage >= 90 ? 'bg-green-500' :
                completionPercentage >= 60 ? 'bg-yellow-500' :
                completionPercentage >= 30 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {onboardingChecklist.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3 border rounded-lg transition-colors ${
                  item.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      item.completed ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline/Next Steps */}
        {employee.onboardingStatus !== 'Completed' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Next Steps Required</h4>
            </div>
            <ul className="space-y-1 text-sm text-yellow-700">
              {!employee.orientationCompleted && (
                <li className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Schedule orientation session
                </li>
              )}
              {!employee.equipmentIssued && (
                <li className="flex items-center gap-2">
                  <Laptop className="w-3 h-3" />
                  Issue equipment (laptop, access card)
                </li>
              )}
              {!employee.systemAccessCreated && (
                <li className="flex items-center gap-2">
                  <UserCheck className="w-3 h-3" />
                  Create system user account
                </li>
              )}
              {employee.backgroundCheckStatus !== 'Completed' && (
                <li className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Complete background verification
                </li>
              )}
            </ul>
          </div>
        )}

        {/* HR Actions */}
        <div className="flex gap-2 mt-6">
          {onViewChecklist && (
            <button
              onClick={onViewChecklist}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 flex items-center gap-2"
            >
              {/* Use ListChecks or CheckSquare here */}
              <ListChecks className="w-4 h-4" />
              View Full Checklist
            </button>
          )}
          
          {employee.probationReviewDate && (
            <button
              onClick={() => console.log('Schedule probation review')}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HROnboardingProgressCard;