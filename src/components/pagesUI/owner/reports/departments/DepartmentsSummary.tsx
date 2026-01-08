"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DepartmentsSummary: React.FC = () => {
  const departmentData = [
    {
      iconClass: "fa-light fa-building",
      title: "Total Departments",
      value: "24",
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: "1,245",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-money-check-dollar-pen",
      title: "Total Budget",
      value: "$45.8M",
      description: "",
      percentageChange: "+15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-chart-mixed-up-circle-dollar",
      title: "Avg. Cost per Employee",
      value: "$36,785",
      description: "",
      percentageChange: "-3%",
      isIncrease: false,
    },
  ];

  const pieOptions: ApexOptions = {
    series: [28, 19, 15, 12, 10, 8, 8],
    chart: {
      type: 'donut',
      foreColor: '#7A7A7A',
    },
    labels: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'IT'],
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
              label: 'Employees',
              color: '#7A7A7A',
              formatter: function (w) {
                return '1,245'
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
    colors: ['#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6', '#C1F666', '#D43F97'],
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

  // Bar Chart Options for Budget Distribution
  const barOptions: ApexOptions = {
    series: [{
      name: 'Budget Allocation',
      data: [12.5, 8.2, 6.8, 5.5, 4.2, 3.8, 3.5, 2.5]
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
        horizontal: true,
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return "$" + val + "M";
      }
    },
    xaxis: {
      categories: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'IT', 'HR', 'Customer Support'],
      labels: {
        formatter: function(val) {
          return "$" + val + "M"
        }
      }
    },
    colors: [
      '#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', 
      '#CDD7B6', '#C1F666', '#D43F97', '#1E5D8C'
    ],
    title: {
      text: 'Budget Distribution by Department',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "$" + val + "M"
        }
      }
    }
  };

  return (
    <>
      {/* Summary Cards */}
      {departmentData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Department Overview</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Donut Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Employee Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={pieOptions} 
                        series={pieOptions.series} 
                        type="donut" 
                        height={320} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-8">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Budget Allocation</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={barOptions} 
                        series={barOptions.series} 
                        type="bar" 
                        height={350} 
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

export default DepartmentsSummary;