"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AllCompaniesSummary: React.FC = () => {
  const companiesData = [
    {
      iconClass: "fa-light fa-building",
      title: "Total Companies",
      value: "156",
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-building-circle-check",
      title: "Active Companies",
      value: "142",
      description: "91%",
      percentageChange: "+5%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-building-circle-exclamation",
      title: "Pending Approval",
      value: "8",
      description: "5.1%",
      percentageChange: "-12%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-building-circle-xmark",
      title: "Inactive",
      value: "6",
      description: "3.8%",
      percentageChange: "-3%",
      isIncrease: false,
    },
  ];

  const donutOptions: ApexOptions = {
    series: [142, 8, 6],
    chart: {
      type: 'donut',
      foreColor: '#7A7A7A',
    },
    labels: ['Active', 'Pending', 'Inactive'],
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
              label: 'Companies',
              color: '#7A7A7A',
              formatter: function (w) {
                return '156'
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
    colors: ['#3B93A5', '#F7B844', '#EC3C65'],
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

  // Bar Chart Options for Industry Distribution
  const barOptions: ApexOptions = {
    series: [{
      name: 'Number of Companies',
      data: [45, 28, 22, 18, 15, 12, 8, 6, 3]
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
      categories: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Transportation', 'Energy'],
    },
    yaxis: {
      title: {
        text: 'Number of Companies'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B93A5'],
    title: {
      text: 'Industry Distribution',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    }
  };

  // Pie Chart Options for Geographic Distribution
  const pieOptions: ApexOptions = {
    series: [42, 28, 18, 15, 12, 10, 8, 7, 6, 4],
    chart: {
      type: 'pie',
      foreColor: '#7A7A7A',
    },
    labels: ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'France', 'Japan', 'India', 'China', 'Others'],
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
              label: 'Countries',
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
    colors: ['#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6', '#C1F666', '#D43F97', '#1E5D8C', '#421243', '#7F94B0'],
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
      {companiesData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Companies Overview</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Donut Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Company Status Distribution</h5>
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
                    <h5 className="card__heading-title">Industry Distribution</h5>
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
                    <h5 className="card__heading-title">Geographic Distribution</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={pieOptions} 
                        series={pieOptions.series} 
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

export default AllCompaniesSummary;