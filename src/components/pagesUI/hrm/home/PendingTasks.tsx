"use client";
import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import TaskList from "./TaskList";

const PendingTasks = () => {
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsLoading(true);
    setValue(newValue);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-12 xxl:col-span-3">
      <div className="card__wrapper card-tab-wrapper h-full flex flex-col">
        {/* Card Header */}
        <div className="card__title-wrap flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-[10px] items-start sm:items-center justify-between mb-5 sm:mb-[25px]">
          <h5 className="card__heading-title text-lg sm:text-xl font-semibold">
            Pending Tasks
          </h5>

          {/* Responsive Tabs */}
          <div className="card__tab w-full sm:w-auto">
            <div className="overflow-x-auto">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                className="min-w-max"
                sx={{
                  minHeight: "40px",
                  "& .MuiTab-root": {
                    padding: "8px 12px",
                    minHeight: "36px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "@media (max-width: 640px)": {
                      padding: "6px 10px",
                      fontSize: "0.8125rem",
                    },
                  },
                  "& .MuiTabs-flexContainer": {
                    gap: "8px",
                  },
                  "& .MuiTabs-scroller": {
                    overflow: "visible !important",
                  },
                }}
              >
                <Tab label="High" />
                <Tab label="Medium" />
                <Tab label="Low" />
              </Tabs>
            </div>
          </div>
        </div>

        {/* Card Content - Responsive height */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="tab-content flex-1 flex flex-col min-h-0">
            {isLoading ? (
              <div className="loading-spinner flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`flex-1 flex flex-col min-h-0 ${
                    value !== 0 ? "hidden" : ""
                  }`}
                >
                  {value === 0 && <TaskList priority="high" />}
                </div>
                <div
                  className={`flex-1 flex flex-col min-h-0 ${
                    value !== 1 ? "hidden" : ""
                  }`}
                >
                  {value === 1 && <TaskList priority="medium" />}
                </div>
                <div
                  className={`flex-1 flex flex-col min-h-0 ${
                    value !== 2 ? "hidden" : ""
                  }`}
                >
                  {value === 2 && <TaskList priority="low" />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTasks;
