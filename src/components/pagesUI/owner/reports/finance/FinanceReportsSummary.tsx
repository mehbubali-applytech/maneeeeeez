"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const FinanceReportsSummary: React.FC = () => {
  const reportData = [
    {
      iconClass: "fa-light fa-file-invoice-dollar",
      title: "Total Reports",
      value: "156",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-chart-line",
      title: "Revenue Reports",
      value: "$2.5M",
      description: "",
      percentageChange: "+18%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-money-check-dollar-pen",
      title: "Expense Reports",
      value: "$1.8M",
      description: "",
      percentageChange: "-5%",
      isIncrease: false,
    },
    {
      iconClass: "fa-sharp fa-light fa-file-export",
      title: "Exported This Month",
      value: "42",
      description: "",
      percentageChange: "+25%",
      isIncrease: true,
    },
  ];

  const pieOptions: ApexOptions = {
    series: [44, 55, 41, 17, 15],
    chart: {
      type: 'donut',
      foreColor: '#7A7A7A',
    },
    labels: ['Revenue', 'Expenses', 'Tax', 'Investments', 'Misc'],
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
              label: 'Total',
              color: '#7A7A7A',
              formatter: function (w) {
                return '$2.5M'
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

  // Treemap Chart Options
  const treemapOptions: ApexOptions = {
    series: [
      {
        data: [
          { x: 'Marketing', y: 218 },
          { x: 'Operations', y: 149 },
          { x: 'Sales', y: 184 },
          { x: 'R&D', y: 55 },
          { x: 'IT', y: 84 },
          { x: 'HR', y: 31 },
          { x: 'Legal', y: 70 },
          { x: 'Facilities', y: 30 },
          { x: 'Customer Support', y: 44 },
          { x: 'Finance', y: 68 },
        ]
      }
    ],
    legend: {
      show: false,
    },
    chart: {
      type: 'treemap',
      toolbar: {
        show: true
      }
    },
    colors: [
      '#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6',
      '#C1F666', '#D43F97', '#1E5D8C', '#421243', '#7F94B0'
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
    },
    title: {
      text: 'Expense Distribution by Department',
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
      {reportData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Financial Overview</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Pie/Donut Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Revenue Distribution</h5>
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
            
            {/* Treemap Chart */}
            <div className="col-span-12 lg:col-span-6 xxxl:col-span-8">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Departmental Expense Breakdown</h5>
                  </div>
                  <div className="card__content">
                    <div className="card__line-chart">
                      <Chart 
                        options={treemapOptions} 
                        series={treemapOptions.series} 
                        type="treemap" 
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

export default FinanceReportsSummary;