"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AllHrManagersSummary: React.FC = () => {
  const hrManagersData = [
    {
      iconClass: "fa-light fa-users",
      title: "Total HR Managers",
      value: "48",
      description: "",
      percentageChange: "+15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active HR Managers",
      value: "42",
      description: "87.5%",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-clock",
      title: "On Leave",
      value: "3",
      description: "6.3%",
      percentageChange: "-2%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-xmark",
      title: "Inactive",
      value: "2",
      description: "4.2%",
      percentageChange: "-1%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-plus",
      title: "Pending Approval",
      value: "1",
      description: "2.1%",
      percentageChange: "+50%",
      isIncrease: true,
    },
  ];

  const donutOptions: ApexOptions = {
    series: [42, 3, 2, 1],
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
              label: 'HR Managers',
              color: '#7A7A7A',
              formatter: function (w) {
                return '48'
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
      name: 'Number of HR Managers',
      data: [12, 8, 7, 6, 5, 4, 3, 2, 1]
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
        'Human Resources',
        'Talent Acquisition',
        'HR Operations',
        'Employee Relations',
        'Learning & Development',
        'Compensation & Benefits',
        'HR Compliance',
        'HR Information Systems',
        'International HR'
      ],
    },
    yaxis: {
      title: {
        text: 'Number of HR Managers'
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

  // Pie Chart Options for Experience Distribution
  const experienceOptions: ApexOptions = {
    series: [15, 12, 10, 8, 3],
    chart: {
      type: 'pie',
      foreColor: '#7A7A7A',
    },
    labels: ['0-3 years', '4-6 years', '7-10 years', '11-15 years', '15+ years'],
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
              label: 'Experience',
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
    colors: ['#ADD8C7', '#3B93A5', '#F7B844', '#EC3C65', '#D43F97'],
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
      {hrManagersData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">HR Managers Overview</h5>
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
                    <h5 className="card__heading-title">Experience Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={experienceOptions} 
                        series={experienceOptions.series} 
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

export default AllHrManagersSummary;