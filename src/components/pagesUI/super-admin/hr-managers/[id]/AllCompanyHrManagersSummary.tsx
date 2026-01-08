"use client";
import React, { useMemo } from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AllCompanyHrManagersSummaryProps {
  companyId: string;
  companyName?: string;
}

const AllCompanyHrManagersSummary: React.FC<AllCompanyHrManagersSummaryProps> = ({ 
  companyId,
  companyName = "Company"
}) => {
  // Mock data for HR Managers
  const hrManagersData = useMemo(() => [
    { id: 1, companyId: "1", status: "Active", department: "Human Resources", rating: 4.8, managedEmployees: 150 },
    { id: 2, companyId: "1", status: "Active", department: "Recruitment", rating: 4.6, managedEmployees: 80 },
    { id: 3, companyId: "1", status: "On Leave", department: "Employee Relations", rating: 4.7, managedEmployees: 120 },
    { id: 4, companyId: "2", status: "Active", department: "Human Resources", rating: 4.9, managedEmployees: 200 },
    { id: 5, companyId: "2", status: "Inactive", department: "Training & Development", rating: 4.5, managedEmployees: 60 },
    { id: 6, companyId: "1", status: "Active", department: "Compensation & Benefits", rating: 4.8, managedEmployees: 90 },
  ], []);

  // Filter by company
  const companyHrManagers = useMemo(() => 
    hrManagersData.filter(hr => hr.companyId === companyId), 
    [companyId, hrManagersData]
  );

  // Calculate statistics
  const totalHrManagers = companyHrManagers.length;
  const activeHrManagers = companyHrManagers.filter(hr => hr.status === "Active").length;
  const avgRating = companyHrManagers.reduce((sum, hr) => sum + hr.rating, 0) / totalHrManagers || 0;
  const totalManagedEmployees = companyHrManagers.reduce((sum, hr) => sum + hr.managedEmployees, 0);

  // Status distribution for pie chart - FIXED: Ensure we always have numbers
  const statusDistribution = useMemo(() => {
    const statusCounts = companyHrManagers.reduce((acc, hr) => {
      acc[hr.status] = (acc[hr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      series: Object.values(statusCounts).map(v => Number(v))
    };
  }, [companyHrManagers]);

  // Department distribution - FIXED: Ensure we always have numbers
  const departmentDistribution = useMemo(() => {
    const deptCounts = companyHrManagers.reduce((acc, hr) => {
      acc[hr.department] = (acc[hr.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(deptCounts),
      series: Object.values(deptCounts).map(v => Number(v))
    };
  }, [companyHrManagers]);

  // Chart options - FIXED: Simplified options
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
              label: 'Total HR',
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
        formatter: function(value) {
          return value + ' HR Manager(s)';
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
        text: 'Number of HR Managers'
      }
    },
    yaxis: {
      title: {
        text: 'Departments'
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + ' HR Manager(s)';
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
            title="Total HR Managers"
            value={totalHrManagers.toString()}
            description={`Total HR managers in ${companyName}`}
            percentageChange="+2"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-user-check"
            title="Active HR"
            value={activeHrManagers.toString()}
            description={`${totalHrManagers > 0 ? Math.round((activeHrManagers / totalHrManagers) * 100) : 0}% of total`}
            percentageChange="+1"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-star"
            title="Average Rating"
            value={avgRating.toFixed(1)}
            description="Based on performance reviews"
            percentageChange="+0.2"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-user-tie"
            title="Employees Managed"
            value={totalManagedEmployees.toString()}
            description="Total employees under HR management"
            percentageChange="+15%"
            isIncrease={true}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">{companyName} HR Managers Overview</h5>
            <p className="text-gray-600 text-sm mt-1">Statistics for this company only</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h6 className="text-lg font-semibold text-gray-800 mb-4">HR Managers by Status</h6>
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
                <p>Active HR: {activeHrManagers} ({totalHrManagers > 0 ? Math.round((activeHrManagers / totalHrManagers) * 100) : 0}%)</p>
              </div>
            </div>

            {/* Department Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h6 className="text-lg font-semibold text-gray-800 mb-4">HR Managers by Department</h6>
              {departmentDistribution.series.length > 0 && departmentDistribution.series.some(v => v > 0) ? (
                <Chart
                  options={departmentChartOptions}
                  series={[{ name: 'HR Managers', data: departmentDistribution.series }]} // FIXED: Wrap in object
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
          </div>

          {/* Additional Stats */}
          {companyHrManagers.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Most Common Role</div>
                <div className="text-lg font-semibold">HR Generalist</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Avg Experience</div>
                <div className="text-lg font-semibold">8.5 years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">HR to Employee Ratio</div>
                <div className="text-lg font-semibold">1:45</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCompanyHrManagersSummary;