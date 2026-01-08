"use client"
import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ColumnChartsWithMarkers = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Define the options for the Apex chart
    const options: ApexOptions = {
       series: [
  {
    name: 'Actual Payroll',
    data: [
      {
        x: 'Jan',
        y: 820,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 800,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Feb',
        y: 790,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 800,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Mar',
        y: 860,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 850,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Apr',
        y: 880,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 870,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'May',
        y: 910,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 900,
            strokeHeight: 8,
            strokeLineCap: 'round',
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Jun',
        y: 895,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 900,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Jul',
        y: 940,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 920,
            strokeHeight: 5,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      },
      {
        x: 'Aug',
        y: 930,
        goals: [
          {
            name: 'Budgeted Payroll',
            value: 950,
            strokeHeight: 2,
            strokeDashArray: 2,
            strokeColor: 'var(--clr-theme-secondary)'
          }
        ]
      }
    ]
  }
]
,
        chart: {
            height: 350,
            type: 'bar',
            foreColor: '#7A7A7A',
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '60%'
            }
        },
        colors: ['#6C5FFC'],
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: [1]
        },
        legend: {
            show: false,
            showForSingleSeries: true,
            customLegendItems: ['Actual', 'Expected'],
            markers: {
                fillColors: ['#6C5FFC', '#1ABC9C']
            }
        }
    };

    if (!isMounted) return <div>Loading...</div>;

    return (
                            <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">

  <div className="col-span-12 xxl:col-span-6">
                                    <div className="chart-common mb-[20px]">
                                        <div className="card__wrapper style_two">
                                     
                                            <div className="card__content">
                                                <div className="card__line-chart">
                                        <Chart options={options} series={options.series} type="bar" height={350} />
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>


    )
};

export default ColumnChartsWithMarkers;
