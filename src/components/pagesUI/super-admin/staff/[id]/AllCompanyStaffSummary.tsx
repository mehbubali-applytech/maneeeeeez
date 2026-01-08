"use client";
import React, { useMemo } from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AllCompanyStaffSummaryProps {
    companyId: string;
    companyName?: string;
}

const AllCompanyStaffSummary: React.FC<AllCompanyStaffSummaryProps> = ({
    companyId,
    companyName = "Company"
}) => {
    // Mock data for Staff
    const staffData = useMemo(() => [
        { id: 1, companyId: "1", status: "Active", department: "Engineering", employmentType: "Full-time", salary: 85000 },
        { id: 2, companyId: "1", status: "Active", department: "Sales", employmentType: "Full-time", salary: 65000 },
        { id: 3, companyId: "1", status: "On Leave", department: "Marketing", employmentType: "Full-time", salary: 72000 },
        { id: 4, companyId: "2", status: "Active", department: "Engineering", employmentType: "Contract", salary: 95000 },
        { id: 5, companyId: "2", status: "Inactive", department: "HR", employmentType: "Part-time", salary: 45000 },
        { id: 6, companyId: "1", status: "Active", department: "Finance", employmentType: "Full-time", salary: 88000 },
        { id: 7, companyId: "1", status: "Active", department: "Engineering", employmentType: "Intern", salary: 35000 },
        { id: 8, companyId: "1", status: "Terminated", department: "Operations", employmentType: "Full-time", salary: 68000 },
    ], []);

    // Filter by company
    const companyStaff = useMemo(() =>
        staffData.filter(staff => staff.companyId === companyId),
        [companyId, staffData]
    );

    // Calculate statistics
    const totalStaff = companyStaff.length;
    const activeStaff = companyStaff.filter(staff => staff.status === "Active").length;
    const avgSalary = companyStaff.reduce((sum, staff) => sum + staff.salary, 0) / totalStaff || 0;
    const fullTimeStaff = companyStaff.filter(staff => staff.employmentType === "Full-time").length;

    // Status distribution for pie chart
    const statusDistribution = useMemo(() => {
        const statusCounts = companyStaff.reduce((acc, staff) => {
            acc[staff.status] = (acc[staff.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            labels: Object.keys(statusCounts),
            series: Object.values(statusCounts).map(v => Number(v))
        };
    }, [companyStaff]);

    // Department distribution
    const departmentDistribution = useMemo(() => {
        const deptCounts = companyStaff.reduce((acc, staff) => {
            acc[staff.department] = (acc[staff.department] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            labels: Object.keys(deptCounts),
            series: Object.values(deptCounts).map(v => Number(v))
        };
    }, [companyStaff]);

    // Employment type distribution
    const employmentTypeDistribution = useMemo(() => {
        const typeCounts = companyStaff.reduce((acc, staff) => {
            acc[staff.employmentType] = (acc[staff.employmentType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            labels: Object.keys(typeCounts),
            series: Object.values(typeCounts).map(v => Number(v))
        };
    }, [companyStaff]);

    // Chart options
    const statusChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 300,
        },
        labels: statusDistribution.labels,
        colors: ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'],
        legend: {
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Staff',
                            color: '#6B7280',
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value + ' employee(s)';
                }
            }
        }
    };

    const departmentChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                distributed: false,
            }
        },
        colors: ['#3B82F6'],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: departmentDistribution.labels,
            title: {
                text: 'Number of Employees'
            }
        },
        yaxis: {
            title: {
                text: 'Departments'
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value + ' employee(s)';
                }
            }
        }
    };

    const employmentTypeChartOptions: ApexOptions = {
        chart: {
            type: 'pie',
            height: 300,
        },
        labels: employmentTypeDistribution.labels,
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        legend: {
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '60%',
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number, opts: any) {
                return `${opts.w.config.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`;
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value + ' employee(s)';
                }
            }
        }
    };

    return (
        <>
            {/* Summary Cards */}
            <div className="col-span-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummarySingleCard
                        iconClass="fa-regular fa-users"
                        title="Total Staff"
                        value={totalStaff.toString()}
                        description={`Total employees in ${companyName}`}
                        percentageChange="+5"
                        isIncrease={true}
                    />

                    <SummarySingleCard
                        iconClass="fa-regular fa-user-check"
                        title="Active Staff"
                        value={activeStaff.toString()}
                        description={`${totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0}% of total`}
                        percentageChange="+3"
                        isIncrease={true}
                    />

                    <SummarySingleCard
                        iconClass="fa-regular fa-money-bill"
                        title="Avg. Salary"
                        value={`$${avgSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                        description="Average annual salary"
                        percentageChange="+4.2%"
                        isIncrease={true}
                    />

                    <SummarySingleCard
                        iconClass="fa-regular fa-briefcase"
                        title="Full-time"
                        value={fullTimeStaff.toString()}
                        description={`${totalStaff > 0 ? Math.round((fullTimeStaff / totalStaff) * 100) : 0}% of total`}
                        percentageChange="+2"
                        isIncrease={true}
                    />
                </div>
            </div>

            {/* Charts Section */}
            <div className="col-span-12 mt-6">
                <div className="card__wrapper style_two">
                    <div className="card__title-wrap mb-[25px]">
                        <h5 className="card__heading-title">{companyName} Staff Overview</h5>
                        <p className="text-gray-600 text-sm mt-1">Statistics for this company only</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Status Distribution Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h6 className="text-lg font-semibold text-gray-800 mb-4">Staff by Status</h6>
                            {statusDistribution.series.length > 0 && statusDistribution.series.some(v => v > 0) ? (
                                <Chart
                                    options={statusChartOptions}
                                    series={statusDistribution.series}
                                    type="donut"
                                    height={300}
                                />
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <p className="text-gray-500">No data available</p>
                                </div>
                            )}
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Active Staff: {activeStaff} ({totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0}%)</p>
                            </div>
                        </div>

                        {/* Department Distribution Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h6 className="text-lg font-semibold text-gray-800 mb-4">Staff by Department</h6>
                            {departmentDistribution.series.length > 0 && departmentDistribution.series.some(v => v > 0) ? (
                                <Chart
                                    options={departmentChartOptions}
                                    series={[{ name: 'Employees', data: departmentDistribution.series }]}
                                    type="bar"
                                    height={300}
                                />
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <p className="text-gray-500">No data available</p>
                                </div>
                            )}
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Total departments: {departmentDistribution.labels.length}</p>
                            </div>
                        </div>

                        {/* Employment Type Distribution Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h6 className="text-lg font-semibold text-gray-800 mb-4">Employment Type</h6>
                            {employmentTypeDistribution.series.length > 0 && employmentTypeDistribution.series.some(v => v > 0) ? (
                                <Chart
                                    options={employmentTypeChartOptions}
                                    series={employmentTypeDistribution.series}
                                    type="pie"
                                    height={300}
                                />
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <p className="text-gray-500">No data available</p>
                                </div>
                            )}
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Full-time: {fullTimeStaff} ({totalStaff > 0 ? Math.round((fullTimeStaff / totalStaff) * 100) : 0}%)</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    {companyStaff.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Highest Paid Dept</div>
                                <div className="text-lg font-semibold">Engineering</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Avg. Experience</div>
                                <div className="text-lg font-semibold">3.8 years</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Attrition Rate</div>
                                <div className="text-lg font-semibold">8.5%</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Avg. Age</div>
                                <div className="text-lg font-semibold">34 years</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllCompanyStaffSummary;