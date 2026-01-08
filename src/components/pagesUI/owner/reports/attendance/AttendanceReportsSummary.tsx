"use client";
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AttendanceReportsSummary: React.FC = () => {
    const attendanceData = [
        {
            iconClass: "fa-light fa-users",
            title: "Total Employees",
            value: "1,245",
            description: "",
            percentageChange: "+5%",
            isIncrease: true,
        },
        {
            iconClass: "fa-light fa-user-check",
            title: "Present Today",
            value: "1,180",
            description: "94.8%",
            percentageChange: "+2%",
            isIncrease: true,
        },
        {
            iconClass: "fa-light fa-user-clock",
            title: "Average Hours",
            value: "8.2h",
            description: "Per day",
            percentageChange: "-0.5%",
            isIncrease: false,
        },
        {
            iconClass: "fa-light fa-calendar-xmark",
            title: "Absent Today",
            value: "45",
            description: "3.6%",
            percentageChange: "-12%",
            isIncrease: false,
        },
    ];

    const donutOptions: ApexOptions = {
        series: [94.8, 3.6, 1.2, 0.4],
        chart: {
            type: 'donut',
            foreColor: '#7A7A7A',
        },
        labels: ['Present', 'Absent', 'Late', 'Early Leave'],
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
                            label: 'Attendance',
                            color: '#7A7A7A',
                            formatter: function (w) {
                                return 'Today'
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
        colors: ['#3B93A5', '#EC3C65', '#F7B844', '#ADD8C7'],
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

    // Line Chart Options for Attendance Trend
    const lineOptions: ApexOptions = {
        series: [{
            name: 'Attendance Rate',
            data: [92.5, 93.2, 94.1, 93.8, 94.5, 94.8, 95.2, 94.9, 95.5, 95.8, 96.2, 96.5]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            min: 90,
            max: 100,
            labels: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        },
        colors: ['#3B93A5'],
        title: {
            text: 'Monthly Attendance Rate Trend',
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        }
    };

    // Bar Chart Options for Department Attendance
    const barOptions: ApexOptions = {
        series: [
            {
                name: 'Attendance Rate',
                data: [97.2, 95.8, 96.5, 94.3, 93.8, 95.1, 92.4, 96.8]
            }
        ],
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
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'IT', 'HR', 'Support'],
        },
        yaxis: {
            title: {
                text: 'Attendance Rate (%)'
            },
            min: 90,
            max: 100,
        },
        fill: {
            opacity: 1
        },
        colors: ['#3B93A5'],
        title: {
            text: 'Department-wise Attendance Rate',
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        }
    };

    return (
        <>
            {/* Summary Cards */}
            {attendanceData.map((item, index) => (
                <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={`card-${index}`}>
                    <SummarySingleCard {...item} />
                </div>
            ))}

            {/* Charts Section */}
            <div className="col-span-12 mt-6">
                <div className="card__wrapper style_two">
                    <div className="card__title-wrap mb-[25px]">
                        <h5 className="card__heading-title">Attendance Overview</h5>
                    </div>

                    <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
                        {/* Donut Chart */}
                        <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
                            <div className="chart-common mb-[20px]">
                                <div className="card__wrapper style_two">
                                    <div className="card__title-wrap">
                                        <h5 className="card__heading-title">
                                            {"Today's Attendance Distribution"}
                                        </h5>


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

                        {/* Line Chart */}
                        <div className="col-span-12 lg:col-span-6 xxxl:col-span-4">
                            <div className="chart-common mb-[20px]">
                                <div className="card__wrapper style_two">
                                    <div className="card__title-wrap">
                                        <h5 className="card__heading-title">Monthly Trend</h5>
                                    </div>
                                    <div className="card__content">
                                        <div className="card__line-chart">
                                            <Chart
                                                options={lineOptions}
                                                series={lineOptions.series}
                                                type="line"
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
                                        <h5 className="card__heading-title">Department Performance</h5>
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

export default AttendanceReportsSummary;