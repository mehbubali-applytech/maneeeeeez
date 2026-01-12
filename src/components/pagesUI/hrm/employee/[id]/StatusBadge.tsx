// StatusBadge.tsx
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  HelpCircle,
  UserPlus,
  UserCheck,
  UserMinus,
  UserX
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '', 
  showIcon = true,
  size = 'md'
}) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    // Workflow Status Configurations
    if (statusLower.includes('active')) {
      return {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Active',
        iconColor: 'text-green-600'
      };
    }
    
    if (statusLower.includes('new hire') || statusLower.includes('new')) {
      return {
        icon: UserPlus,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'New Hire',
        iconColor: 'text-blue-600'
      };
    }
    
    if (statusLower.includes('on leave') || statusLower.includes('leave')) {
      return {
        icon: UserMinus,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'On Leave',
        iconColor: 'text-yellow-600'
      };
    }
    
    if (statusLower.includes('notice period') || statusLower.includes('notice')) {
      return {
        icon: Clock,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        text: 'Notice Period',
        iconColor: 'text-orange-600'
      };
    }
    
    if (statusLower.includes('exit') || statusLower.includes('terminated')) {
      return {
        icon: UserX,
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Exit',
        iconColor: 'text-red-600'
      };
    }
    
    // Onboarding Status Configurations
    if (statusLower.includes('completed')) {
      return {
        icon: UserCheck,
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Completed',
        iconColor: 'text-green-600'
      };
    }
    
    if (statusLower.includes('in progress') || statusLower.includes('progress')) {
      return {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'In Progress',
        iconColor: 'text-yellow-600'
      };
    }
    
    if (statusLower.includes('pending')) {
      return {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Pending',
        iconColor: 'text-red-600'
      };
    }
    
    if (statusLower.includes('on hold') || statusLower.includes('hold')) {
      return {
        icon: HelpCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'On Hold',
        iconColor: 'text-gray-600'
      };
    }
    
    // Default
    return {
      icon: HelpCircle,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      text: status,
      iconColor: 'text-gray-600'
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full border
      ${config.color}
      ${sizeClasses[size]}
      ${className}
    `}>
      {showIcon && <Icon className={`${iconSize[size]} ${config.iconColor}`} />}
      <span className="font-medium whitespace-nowrap">{config.text}</span>
    </div>
  );
};

export default StatusBadge;