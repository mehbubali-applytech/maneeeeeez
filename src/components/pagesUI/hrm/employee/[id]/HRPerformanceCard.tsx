// HRPerformanceCard.tsx
"use client";

import React from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  TrendingUp, TrendingDown, Target, Award, Star,
  Calendar, BarChart3, Users, MessageSquare,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { formatDate } from '../../../owner/employees/[id]/formatters';


interface HRPerformanceCardProps {
  employee: IHREmployee;
  onScheduleAppraisal?: () => void;
  onViewDetails?: () => void;
}

const HRPerformanceCard: React.FC<HRPerformanceCardProps> = ({ 
  employee, 
  onScheduleAppraisal,
  onViewDetails
}) => {
  const performanceRating = employee.performanceRating || 0;
  
  // Mock performance data
  const performanceMetrics = [
    { label: 'Quality of Work', score: 4.5, trend: 'up' },
    { label: 'Team Collaboration', score: 4.2, trend: 'up' },
    { label: 'Meeting Deadlines', score: 3.8, trend: 'down' },
    { label: 'Initiative', score: 4.0, trend: 'stable' },
    { label: 'Communication', score: 4.3, trend: 'up' },
    { label: 'Problem Solving', score: 4.1, trend: 'stable' },
  ];

  const recentFeedback = [
    {
      id: 1,
      type: 'Manager',
      comment: 'Excellent teamwork and dedication',
      rating: 4.5,
      date: '2024-01-15',
    },
    {
      id: 2,
      type: 'Peer',
      comment: 'Good communication skills',
      rating: 4.0,
      date: '2024-01-10',
    },
    {
      id: 3,
      type: 'Self',
      comment: 'Need to improve documentation',
      rating: 3.5,
      date: '2024-01-05',
    },
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Outstanding';
    if (rating >= 4.0) return 'Exceeds Expectations';
    if (rating >= 3.5) return 'Meets Expectations';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <p className="text-sm text-gray-500">Last updated: {employee.lastAppraisalDate ? formatDate(employee.lastAppraisalDate) : 'No appraisal yet'}</p>
            </div>
          </div>
          
          {onScheduleAppraisal && (
            <button
              onClick={onScheduleAppraisal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Appraisal
            </button>
          )}
        </div>

        {/* Overall Rating */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Overall Performance Rating
            </h4>
            <span className={`text-lg font-bold ${getRatingColor(performanceRating)}`}>
              {getRatingLabel(performanceRating)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {performanceRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(performanceRating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : i < performanceRating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">out of 5.0</p>
            </div>
            
            <div className="w-48 h-48">
              {/* Circular progress chart */}
              <div className="relative w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(performanceRating / 5) * 283} 283`}
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#374151"
                  >
                    {performanceRating.toFixed(1)}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Detailed Metrics
          </h4>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded ${
                    metric.trend === 'up' ? 'bg-green-100' :
                    metric.trend === 'down' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                    {metric.trend === 'stable' && <BarChart3 className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        metric.score >= 4.5 ? 'bg-green-500' :
                        metric.score >= 4.0 ? 'bg-blue-500' :
                        metric.score >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(metric.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {metric.score.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Recent Feedback
          </h4>
          <div className="space-y-3">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                      {feedback.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(feedback.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < feedback.rating 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Appraisal & Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {employee.nextAppraisalDate && (
            <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Next Appraisal Due</span>
              </div>
              <p className="text-lg font-semibold text-blue-900">
                {formatDate(employee.nextAppraisalDate)}
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Details
              </button>
            )}
            
            <button
              onClick={() => console.log('Add feedback')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Add Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRPerformanceCard;