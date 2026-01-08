// components/finance/dashboard/UpcomingDeadlines.tsx
"use client";
import React from "react";
import { upcomingDeadlinesData } from "./finance-data";

const UpcomingDeadlines = () => {
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="card__wrapper height-equal not-height">
        <div className="card__title-wrap mb-5">
          <h5 className="card__heading-title">Upcoming Deadlines</h5>
          <p className="text-sm text-gray-600 mt-1">Statutory compliance due dates</p>
        </div>
        <ul className="timeline">
          {upcomingDeadlinesData.map((deadline, index) => (
            <li key={index} className="timeline__item flex gap-[10px]">
              <div className="timeline__icon">
                <span>
                  <i className={`fa-light ${deadline.icon}`}></i>
                </span>
              </div>
              <div className="timeline__content w-full">
                <div className="flex flex-wrap gap-[10px] items-center justify-between">
                  <h5 className="small">{deadline.title}</h5>
                  <span className={`bd-badge ${deadline.priority === 'high' ? 'bg-danger' : deadline.priority === 'medium' ? 'bg-warning' : 'bg-info'}`}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
                <p className="text-sm text-gray-600">{deadline.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Due: {deadline.dueDate}</span>
                  <button className="btn btn-xs btn-outline-primary">Set Reminder</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t">
          <button className="w-full btn btn-outline-primary">View All Deadlines</button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlines;