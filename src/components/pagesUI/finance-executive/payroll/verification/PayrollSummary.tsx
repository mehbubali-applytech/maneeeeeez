"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PayrollSummary: React.FC = () => {
  const payrollData = [
    {
      iconClass: "fa-light fa-money-check-dollar",
      title: "Total Payroll Amount",
      value: "₹1,245,800",
      description: "This Month",
      percentageChange: "+12.5%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Employees Paid",
      value: "142",
      description: "95.3% of total",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-clock",
      title: "Pending Verification",
      value: "7",
      description: "4.7% pending",
      percentageChange: "-2%",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-exclamation-triangle",
      title: "Payroll Issues",
      value: "3",
      description: "Require attention",
      percentageChange: "+1",
      isIncrease: false,
    },
  ];

  // Bar Chart for Monthly Payroll Trend
  const barOptions: ApexOptions = {
    series: [{
      name: 'Payroll Amount',
      data: [1125000, 1180000, 1245800, 1150000, 1100000, 1300000]
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
        columnWidth: '60%',
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'],
    },
    yaxis: {
      title: {
        text: 'Amount (₹)'
      },
      labels: {
        formatter: function (value) {
          return '₹' + (value / 1000000).toFixed(1) + 'M';
        }
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B93A5'],
    title: {
      text: 'Monthly Payroll Trend',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return '₹' + value.toLocaleString('en-IN');
        }
      }
    }
  };

  // Pie Chart for Department-wise Distribution
  const pieOptions: ApexOptions = {
    series: [35, 28, 22, 15],
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: ['Engineering', 'Sales', 'Marketing', 'Operations'],
    colors: ['#3B93A5', '#F7B844', '#EC3C65', '#ADD8C7'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Department-wise Payroll',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
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
    }]
  };

  return (
    <>
      {/* Summary Cards */}
      {payrollData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
          <SummarySingleCard {...item} />
        </div>
      ))}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">Payroll Analytics</h5>
          </div>
          
          <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
            {/* Bar Chart */}
            <div className="col-span-12 lg:col-span-8 xxxl:col-span-6">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Monthly Payroll Trend</h5>
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
            <div className="col-span-12 lg:col-span-4 xxxl:col-span-3">
              <div className="chart-common mb-[20px]">
                <div className="card__wrapper style_two">
                  <div className="card__title-wrap">
                    <h5 className="card__heading-title">Department Distribution</h5>
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

export default PayrollSummary;