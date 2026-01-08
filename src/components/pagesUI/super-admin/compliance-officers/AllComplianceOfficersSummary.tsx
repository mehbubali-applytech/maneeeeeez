"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AllComplianceOfficersSummary: React.FC = () => {
  const complianceOfficersData = [
    {
      iconClass: "fa-light fa-user-shield",
      title: "Total Compliance Officers",
      value: "42",
      description: "",
      percentageChange: "+18%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Compliance Officers",
      value: "38",
      description: "90.5%",
      percentageChange: "+10%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-clock",
      title: "On Leave",
      value: "2",
      description: "4.8%",
      percentageChange: "-1%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-xmark",
      title: "Inactive",
      value: "1",
      description: "2.4%",
      percentageChange: "0%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-user-plus",
      title: "Pending Certification",
      value: "1",
      description: "2.4%",
      percentageChange: "+100%",
      isIncrease: true,
    },
  ];

  const donutOptions: ApexOptions = {
    series: [38, 2, 1, 1],
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
              label: 'Compliance Officers',
              color: '#7A7A7A',
              formatter: function (w) {
                return '42'
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
      name: 'Number of Officers',
      data: [12, 8, 6, 5, 4, 3, 2, 1, 1]
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
        'Legal & Compliance',
        'Risk & Compliance',
        'AML Compliance',
        'Data Privacy',
        'Regulatory Affairs',
        'Ethics & Compliance',
        'Corporate Governance',
        'Environmental Compliance',
        'Quality Assurance'
      ],
    },
    yaxis: {
      title: {
        text: 'Number of Officers'
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



  return (
    <>
      {/* Summary Cards */}
      {complianceOfficersData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Compliance Officers Overview</h5>
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
            
          </div>
        </div>
      </div>
    </>
  );
};

export default AllComplianceOfficersSummary;