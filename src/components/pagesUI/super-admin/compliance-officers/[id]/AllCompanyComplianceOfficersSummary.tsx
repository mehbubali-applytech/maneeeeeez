"use client";
import React, { useMemo } from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AllCompanyComplianceOfficersSummaryProps {
  companyId: string;
  companyName?: string;
}

const AllCompanyComplianceOfficersSummary: React.FC<AllCompanyComplianceOfficersSummaryProps> = ({ 
  companyId,
  companyName = "Company"
}) => {
  // Mock data for Compliance Officers
  const complianceOfficersData = useMemo(() => [
    { id: 1, companyId: "1", status: "Active", department: "Compliance & Risk", complianceScore: 98, managedAudits: 45 },
    { id: 2, companyId: "1", status: "Active", department: "Legal & Regulatory", complianceScore: 95, managedAudits: 32 },
    { id: 3, companyId: "1", status: "On Leave", department: "Internal Audit", complianceScore: 92, managedAudits: 28 },
    { id: 4, companyId: "2", status: "Active", department: "Compliance & Risk", complianceScore: 99, managedAudits: 56 },
    { id: 5, companyId: "2", status: "Inactive", department: "Quality Assurance", complianceScore: 90, managedAudits: 24 },
    { id: 6, companyId: "1", status: "Active", department: "Financial Compliance", complianceScore: 97, managedAudits: 38 },
  ], []);

  // Filter by company
  const companyComplianceOfficers = useMemo(() => 
    complianceOfficersData.filter(officer => officer.companyId === companyId), 
    [companyId, complianceOfficersData]
  );

  // Calculate statistics
  const totalComplianceOfficers = companyComplianceOfficers.length;
  const activeComplianceOfficers = companyComplianceOfficers.filter(officer => officer.status === "Active").length;
  const avgComplianceScore = companyComplianceOfficers.reduce((sum, officer) => sum + officer.complianceScore, 0) / totalComplianceOfficers || 0;
  const totalManagedAudits = companyComplianceOfficers.reduce((sum, officer) => sum + officer.managedAudits, 0);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statusCounts = companyComplianceOfficers.reduce((acc, officer) => {
      acc[officer.status] = (acc[officer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      series: Object.values(statusCounts).map(v => Number(v))
    };
  }, [companyComplianceOfficers]);

  // Department distribution
  const departmentDistribution = useMemo(() => {
    const deptCounts = companyComplianceOfficers.reduce((acc, officer) => {
      acc[officer.department] = (acc[officer.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(deptCounts),
      series: Object.values(deptCounts).map(v => Number(v))
    };
  }, [companyComplianceOfficers]);

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
              label: 'Total Officers',
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
          return value + ' Officer(s)';
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
    colors: ['#8B5CF6'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: departmentDistribution.labels,
      title: {
        text: 'Number of Officers'
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
          return value + ' Officer(s)';
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
            iconClass="fa-regular fa-user-shield"
            title="Total Compliance Officers"
            value={totalComplianceOfficers.toString()}
            description={`Total compliance officers in ${companyName}`}
            percentageChange="+2"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-user-check"
            title="Active Officers"
            value={activeComplianceOfficers.toString()}
            description={`${totalComplianceOfficers > 0 ? Math.round((activeComplianceOfficers / totalComplianceOfficers) * 100) : 0}% of total`}
            percentageChange="+1"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-chart-line"
            title="Avg Compliance Score"
            value={avgComplianceScore.toFixed(0) + "%"}
            description="Based on audit performance"
            percentageChange="+2.5%"
            isIncrease={true}
          />
          
          <SummarySingleCard
            iconClass="fa-regular fa-clipboard-check"
            title="Audits Managed"
            value={totalManagedAudits.toString()}
            description="Total audits under management"
            percentageChange="+12%"
            isIncrease={true}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">{companyName} Compliance Officers Overview</h5>
            <p className="text-gray-600 text-sm mt-1">Statistics for this company only</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h6 className="text-lg font-semibold text-gray-800 mb-4">Compliance Officers by Status</h6>
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
                <p>Active Officers: {activeComplianceOfficers} ({totalComplianceOfficers > 0 ? Math.round((activeComplianceOfficers / totalComplianceOfficers) * 100) : 0}%)</p>
              </div>
            </div>

            {/* Department Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h6 className="text-lg font-semibold text-gray-800 mb-4">Compliance Officers by Department</h6>
              {departmentDistribution.series.length > 0 && departmentDistribution.series.some(v => v > 0) ? (
                <Chart
                  options={departmentChartOptions}
                  series={[{ name: 'Compliance Officers', data: departmentDistribution.series }]}
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
          {companyComplianceOfficers.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Most Common Role</div>
                <div className="text-lg font-semibold">Compliance Analyst</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Avg Experience</div>
                <div className="text-lg font-semibold">7.2 years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Compliance Risk Level</div>
                <div className="text-lg font-semibold text-green-600">Low</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCompanyComplianceOfficersSummary;