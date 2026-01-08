// components/employee/SalaryDetailsCard.tsx
"use client";

import React from 'react';
import { IEmployee } from '../EmployeeTypes';
import { 
  CreditCard, DollarSign, TrendingUp, TrendingDown, 
  PieChart, Calendar, Wallet, Shield
} from 'lucide-react';
import { formatCurrency, calculatePercentage } from './formatters';

interface SalaryDetailsCardProps {
  employee: IEmployee;
  onEdit?: () => void;
}

const SalaryDetailsCard: React.FC<SalaryDetailsCardProps> = ({ 
  employee, 
  onEdit 
}) => {
  const salary = employee.salaryStructure;
  const bank = employee.bankDetails;
  
  const totalAllowances = salary?.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0;
  const totalDeductions = salary?.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const grossSalary = (salary?.basicPay || 0) + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Salary & Compensation</h3>
              <p className="text-sm text-gray-500">Monthly salary structure</p>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Edit Salary
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            title="Gross Salary"
            amount={grossSalary}
            icon={<TrendingUp className="w-5 h-5" />}
            color="blue"
          />
          <SummaryCard
            title="Net Salary"
            amount={netSalary}
            icon={<Wallet className="w-5 h-5" />}
            color="green"
          />
          <SummaryCard
            title="Deductions"
            amount={totalDeductions}
            icon={<TrendingDown className="w-5 h-5" />}
            color="red"
          />
        </div>

        {/* Salary Breakdown */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Salary Breakdown
          </h4>
          <div className="space-y-4">
            <SalaryComponent
              label="Basic Pay"
              amount={salary?.basicPay || 0}
              percentage={calculatePercentage(salary?.basicPay || 0, grossSalary)}
              color="blue"
            />
            <SalaryComponent
              label="HRA"
              amount={salary?.hra || 0}
              percentage={calculatePercentage(salary?.hra || 0, grossSalary)}
              color="green"
            />
            
            {/* Allowances */}
            {salary?.allowances?.map((allowance, index) => (
              <SalaryComponent
                key={index}
                label={allowance.name}
                amount={allowance.amount}
                percentage={calculatePercentage(allowance.amount, grossSalary)}
                subLabel={allowance.taxable ? 'Taxable' : 'Non-taxable'}
                color="yellow"
              />
            ))}
            
            {/* Deductions */}
            {salary?.deductions?.map((deduction, index) => (
              <SalaryComponent
                key={index}
                label={deduction.name}
                amount={-deduction.amount}
                percentage={calculatePercentage(deduction.amount, grossSalary)}
                subLabel={deduction.type}
                color="red"
                isDeduction
              />
            ))}
          </div>
        </div>

        {/* Bank Details */}
        {bank && (
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bank Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Account Holder</p>
                  <p className="font-medium">{bank.accountName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium font-mono">{bank.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="font-medium">{bank.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IFSC Code</p>
                  <p className="font-medium font-mono">{bank.ifscCode}</p>
                </div>
                {bank.branchName && (
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium">{bank.branchName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pay Schedule */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pay Frequency</p>
                <p className="text-sm text-gray-500">
                  {employee.payFrequency} payments
                </p>
              </div>
            </div>
            {employee.costToCompany && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Annual CTC</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(employee.costToCompany)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, amount, icon, color }) => (
  <div className={`p-4 rounded-lg border border-${color}-100 bg-${color}-50`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-${color}-600`}>{icon}</span>
      <span className={`text-xs font-semibold text-${color}-600 uppercase`}>
        {title}
      </span>
    </div>
    <p className={`text-2xl font-bold text-${color}-900`}>
      {formatCurrency(amount)}
    </p>
  </div>
);

const SalaryComponent: React.FC<{
  label: string;
  amount: number;
  percentage: number;
  subLabel?: string;
  color: string;
  isDeduction?: boolean;
}> = ({ label, amount, percentage, subLabel, color, isDeduction = false }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {subLabel && (
          <p className="text-xs text-gray-500">{subLabel}</p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${isDeduction ? 'text-red-600' : 'text-gray-900'}`}>
          {isDeduction ? '-' : ''}{formatCurrency(Math.abs(amount))}
        </p>
        <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
      </div>
    </div>
  </div>
);

export default SalaryDetailsCard;