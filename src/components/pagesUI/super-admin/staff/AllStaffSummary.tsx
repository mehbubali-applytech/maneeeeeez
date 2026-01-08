"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AllStaffSummary: React.FC = () => {
  const staffData = [
    {
      iconClass: "fa-light fa-users",
      title: "Total Staff",
      value: "8,425",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Staff",
      value: "7,850",
      description: "93.2%",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-clock",
      title: "Avg. Experience",
      value: "4.2y",
      description: "Per employee",
      percentageChange: "+0.5%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-money-check-dollar-pen",
      title: "Avg. Salary",
      value: "$65,420",
      description: "Annual",
      percentageChange: "+6%",
      isIncrease: true,
    },
  ];

  const donutOptions: ApexOptions = {
    series: [52, 18, 15, 10, 5],
    chart: {
      type: 'donut',
      foreColor: '#7A7A7A',
    },
    labels: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Others'],
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
              label: 'Staff',
              color: '#7A7A7A',
              formatter: function (w) {
                return '8,425'
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
    colors: ['#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6'],
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

  // Bar Chart Options for Company Distribution
  const barOptions: ApexOptions = {
    series: [{
      name: 'Number of Staff',
      data: [1850, 1250, 980, 850, 720, 680, 420, 320, 195, 160]
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
      categories: ['TechNova', 'Global Finance', 'MediCare', 'EcoManufacture', 'RetailMax', 'EduTech', 'RealEstate', 'LogiTrans', 'EnergyPlus', 'TeleConnect'],
    },
    yaxis: {
      title: {
        text: 'Number of Staff'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B93A5'],
    title: {
      text: 'Staff Distribution by Company',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    }
  };

  // Stacked Bar Chart for Employment Type
  const stackedBarOptions: ApexOptions = {
    series: [
      {
        name: 'Full-time',
        data: [1520, 980, 720, 580, 420, 380, 280, 210, 150, 120]
      },
      {
        name: 'Part-time',
        data: [180, 140, 120, 160, 180, 160, 80, 70, 25, 20]
      },
      {
        name: 'Contract',
        data: [120, 100, 80, 70, 80, 100, 40, 30, 15, 15]
      },
      {
        name: 'Intern',
        data: [30, 30, 60, 40, 40, 40, 20, 10, 5, 5]
      }
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: ['TechNova', 'Global Finance', 'MediCare', 'EcoManufacture', 'RetailMax', 'EduTech', 'RealEstate', 'LogiTrans', 'EnergyPlus', 'TeleConnect'],
    },
    yaxis: {
      title: {
        text: 'Number of Staff'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65'],
    title: {
      text: 'Employment Type Distribution by Company',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    legend: {
      position: 'bottom',
    }
  };

  return (
    <>
      {/* Summary Cards */}
      {staffData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Staff Overview</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Donut Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Department Distribution</h5>
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
                    <h5 className="card__heading-title">Company-wise Staff Count</h5>
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
            
            {/* Stacked Bar Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Employment Type by Company</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={stackedBarOptions} 
                        series={stackedBarOptions.series} 
                        type="bar" 
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

export default AllStaffSummary;