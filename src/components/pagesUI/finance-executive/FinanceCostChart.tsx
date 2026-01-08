// components/finance/dashboard/FinanceCostChart.tsx
"use client";
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';
import { useTheme } from '@mui/material/styles';

interface FinanceCostChartProps {
    period: 'monthly' | 'quarterly' | 'yearly';
}

const FinanceCostChart: React.FC<FinanceCostChartProps> = ({ period }) => {
    const theme = useTheme();

    // Data based on period
    const getChartData = () => {
        switch (period) {
            case 'monthly':
                return {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    salaryCost: [45, 52, 48, 55],
                    benefitCost: [12, 15, 13, 14],
                    complianceCost: [8, 7, 9, 8],
                };
            case 'quarterly':
                return {
                    labels: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'],
                    salaryCost: [450, 520, 480, 550],
                    benefitCost: [120, 150, 130, 140],
                    complianceCost: [80, 70, 90, 80],
                };
            case 'yearly':
                return {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    salaryCost: [4200, 4800, 5200, 5800, 6200],
                    benefitCost: [1100, 1250, 1350, 1450, 1550],
                    complianceCost: [850, 900, 920, 950, 980],
                };
        }
    };

    const data = getChartData();

    // Format Y-axis label based on period
    const getYAxisLabel = () => {
        switch (period) {
            case 'monthly':
                return 'Amount (₹ in Thousands)';
            case 'quarterly':
                return 'Amount (₹ in Thousands)';
            case 'yearly':
                return 'Amount (₹ in Lakhs)';
        }
    };

    // Format tooltip value based on period
    const getValueFormatter = (value: number | null) => {
        if (value === null) return '';
        
        switch (period) {
            case 'monthly':
                return `₹${value}K`;
            case 'quarterly':
                return `₹${value}K`;
            case 'yearly':
                return `₹${value / 100}L`;
        }
    };

    const series = [
        {
            label: 'Salary Cost',
            data: data.salaryCost,
            showMark: true,
            color: theme.palette.primary.main,
            valueFormatter: getValueFormatter,
        },
        {
            label: 'Benefits Cost',
            data: data.benefitCost,
            showMark: true,
            color: theme.palette.success.main,
            valueFormatter: getValueFormatter,
        },
        {
            label: 'Compliance Cost',
            data: data.complianceCost,
            showMark: true,
            color: theme.palette.warning.main,
            valueFormatter: getValueFormatter,
        },
    ];

    return (
        <div className="finance-cost-chart">
            <LineChart
                xAxis={[
                    {
                        scaleType: 'point' as const,
                        data: data.labels,
                        label: period === 'monthly' ? 'Weeks' : period === 'quarterly' ? 'Quarters' : 'Years',
                    },
                ]}
                yAxis={[
                    {
                        label: getYAxisLabel(),
                    },
                ]}
                series={series}
                height={400}
                grid={{ horizontal: true }}
                margin={{ left: 80, right: 30, top: 30, bottom: 50 }}
                sx={{
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                        transform: 'translate(-20px, 0)',
                    },
                    [`.${axisClasses.bottom} .${axisClasses.label}`]: {
                        transform: 'translate(0, 10px)',
                    },
                }}
            />
        </div>
    );
};

export default FinanceCostChart;