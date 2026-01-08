// components/common/StatusBadge.tsx
"use client";

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Active':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'On Probation':
        return {
          icon: <Clock className="w-3 h-3" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case 'Resigned':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'Terminated':
        return {
          icon: <XCircle className="w-3 h-3" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: null,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.icon}
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
};

export default StatusBadge;