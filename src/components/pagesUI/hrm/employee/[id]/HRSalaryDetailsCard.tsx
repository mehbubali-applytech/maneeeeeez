// HRSalaryDetailsCard.tsx
"use client";

import React, { useState } from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  CreditCard, Eye, EyeOff, Download, 
  TrendingUp, FileText, DollarSign, Calendar,
  Building, Shield, CheckCircle, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../../../owner/employees/[id]/formatters';

interface HRSalaryDetailsCardProps {
  employee: IHREmployee;
  onEdit?: () => void;
  onDownloadPayslip?: (month: string) => void;
}

const HRSalaryDetailsCard: React.FC<HRSalaryDetailsCardProps> = ({ 
  employee, 
  onEdit,
  onDownloadPayslip 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedBreakdown, setExpandedBreakdown] = useState(false);

  if (!employee.salaryStructure) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Salary Details
          </h3>
          <button
            onClick={onEdit}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Add Salary
          </button>
        </div>
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No salary information available</p>
          <p className="text-sm text-gray-400 mt-2">Add salary details to enable payroll processing</p>
        </div>
      </div>
    );
  }

  const salary = employee.salaryStructure;
  const totalAllowances = salary.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  const totalDeductions = salary.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  const grossSalary = salary.basicPay + salary.hra + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  // Generate mock payslip history
  const payslipHistory = [
    { month: 'March 2024', status: 'Paid', netAmount: netSalary, paidDate: '2024-03-01' },
    { month: 'February 2024', status: 'Paid', netAmount: netSalary, paidDate: '2024-02-01' },
    { month: 'January 2024', status: 'Paid', netAmount: netSalary, paidDate: '2024-01-01' },
    { month: 'December 2023', status: 'Paid', netAmount: netSalary, paidDate: '2023-12-01' },
  ];

  const taxComponents = [
    { name: 'Basic Pay', amount: salary.basicPay, percentage: ((salary.basicPay / grossSalary) * 100).toFixed(1) + '%' },
    { name: 'HRA', amount: salary.hra, percentage: ((salary.hra / grossSalary) * 100).toFixed(1) + '%' },
  ];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Salary Details
          </h3>
          <p className="text-sm text-gray-500">
            {employee.payFrequency} • {employee.salaryGrade || 'Grade A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={showDetails ? 'Hide Details' : 'Show Details'}
          >
            {showDetails ? (
              <EyeOff className="w-4 h-4 text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Net Salary Display */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Monthly Net Salary</p>
            {showDetails ? (
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(netSalary)}
              </p>
            ) : (
              <p className="text-3xl font-bold text-gray-900">••••••</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Gross: {showDetails ? formatCurrency(grossSalary) : '••••••'}
              </span>
              {employee.costToCompany && (
                <span className="text-sm text-gray-500">
                  CTC: {showDetails ? formatCurrency(employee.costToCompany) : '••••••'}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              employee.employmentStatus === 'Active' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {employee.employmentStatus}
            </span>
            {employee.nextAppraisalDate && (
              <p className="text-xs text-gray-500 mt-2">
                Next Review: {new Date(employee.nextAppraisalDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700">Salary Breakdown</h4>
          <button
            onClick={() => setExpandedBreakdown(!expandedBreakdown)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {expandedBreakdown ? 'Show Less' : 'Show All'}
          </button>
        </div>
        
        <div className="space-y-3">
          {/* Earnings */}
          <div className="border border-green-100 bg-green-50 rounded-lg p-3">
            <p className="text-sm font-medium text-green-800 mb-2">Earnings</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Basic Pay</span>
                <span className="text-sm font-medium">{formatCurrency(salary.basicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">House Rent Allowance</span>
                <span className="text-sm font-medium">{formatCurrency(salary.hra)}</span>
              </div>
              
              {salary.allowances.length > 0 && (
                <>
                  {(expandedBreakdown ? salary.allowances : salary.allowances.slice(0, 2)).map((allowance, index) => (
                    <div key={index} className="flex justify-between pl-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{allowance.name}</span>
                        {!allowance.taxable && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Non-Tax</span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(allowance.amount)}</span>
                    </div>
                  ))}
                  
                  {salary.allowances.length > 2 && !expandedBreakdown && (
                    <div className="text-center">
                      <button
                        onClick={() => setExpandedBreakdown(true)}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        +{salary.allowances.length - 2} more allowances
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <div className="pt-2 border-t border-green-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Earnings</span>
                <span className="text-sm font-bold">{formatCurrency(grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-red-100 bg-red-50 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 mb-2">Deductions</p>
            <div className="space-y-2">
              {salary.deductions.map((deduction, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600">{deduction.name}</span>
                  <span className="text-sm font-medium text-red-700">-{formatCurrency(deduction.amount)}</span>
                </div>
              ))}
              
              <div className="pt-2 border-t border-red-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Deductions</span>
                <span className="text-sm font-bold text-red-700">-{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      {employee.bankDetails && showDetails && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Bank Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Bank Name</p>
              <p className="text-sm font-medium">{employee.bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="text-sm font-medium font-mono">
                {employee.bankDetails.accountNumber.slice(-4).padStart(employee.bankDetails.accountNumber.length, '•')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">IFSC Code</p>
              <p className="text-sm font-medium">{employee.bankDetails.ifscCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <p className="text-sm font-medium">{employee.bankDetails.branchName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Payslips */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          Recent Payslips
        </h4>
        <div className="space-y-2">
          {payslipHistory.map((payslip, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{payslip.month}</p>
                <p className="text-xs text-gray-500">Paid on {new Date(payslip.paidDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{formatCurrency(payslip.netAmount)}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  payslip.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payslip.status}
                </span>
                {onDownloadPayslip && (
                  <button
                    onClick={() => onDownloadPayslip(payslip.month)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Download Payslip"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRSalaryDetailsCard;