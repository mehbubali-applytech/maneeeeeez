"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AllFinanceExecutivesSummary: React.FC = () => {
  const financeExecutivesData = [
    {
      iconClass: "fa-light fa-user-tie",
      title: "Total Finance Executives",
      value: "36",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Finance Executives",
      value: "32",
      description: "88.9%",
      percentageChange: "+6%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-clock",
      title: "On Leave",
      value: "2",
      description: "5.6%",
      percentageChange: "-1%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-xmark",
      title: "Inactive",
      value: "1",
      description: "2.8%",
      percentageChange: "0%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-plus",
      title: "Pending Approval",
      value: "1",
      description: "2.8%",
      percentageChange: "+100%",
      isIncrease: true,
    },
  ];

  const donutOptions: ApexOptions = {
    series: [32, 2, 1, 1],
    chart: {
      type: 'donut',
      foreColor: '#7A7A7A',
    },
    labels: ['Active', 'On Leave', 'Inactive', 'Pending'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Finance Executives',
              color: '#7A7A7A',
              formatter: function (w) {
                return '36'
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#7A7A7A',
      },
    },
    colors: ['#3B93A5', '#F7B844', '#EC3C65', '#ADD8C7'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
  };

  // Bar Chart Options for Department Distribution
  const barOptions: ApexOptions = {
    series: [{
      name: 'Number of Executives',
      data: [8, 6, 5, 4, 4, 3, 2, 2, 2]
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: [
        'Finance & Accounting',
        'Financial Planning & Analysis',
        'Accounts Payable',
        'Accounts Receivable',
        'Taxation',
        'Internal Audit',
        'Treasury',
        'Financial Reporting',
        'Cost Accounting'
      ],
    },
    yaxis: {
      title: {
        text: 'Number of Executives'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B93A5'],
    title: {
      text: 'Department Distribution',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    }
  };

  // Pie Chart Options for Role Distribution
  const roleOptions: ApexOptions = {
    series: [6, 8, 10, 6, 4, 2],
    chart: {
      type: 'pie',
      foreColor: '#7A7A7A',
    },
    labels: ['CFO', 'Director', 'Manager', 'Specialist', 'Analyst', 'Auditor'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Roles',
              color: '#7A7A7A',
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      position: 'right',
      labels: {
        colors: '#7A7A7A',
      },
    },
    colors: ['#3B93A5', '#F7B844', '#EC3C65', '#ADD8C7', '#D43F97', '#8E44AD'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
  };

  return (
    <>
      {/* Summary Cards */}
      {financeExecutivesData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Finance Executives Overview</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Donut Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Status Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={donutOptions} 
                        series={donutOptions.series} 
                        type="donut" 
                        height={320} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Department Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={barOptions} 
                        series={barOptions.series} 
                        type="bar" 
                        height={320} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pie Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Role Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={roleOptions} 
                        series={roleOptions.series} 
                        type="pie" 
                        height={320} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllFinanceExecutivesSummary;