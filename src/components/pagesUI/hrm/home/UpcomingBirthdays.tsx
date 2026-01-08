"use client";
import { Tab, Tabs } from "@mui/material";
import React, { useState, useMemo } from "react";
import BirthdayList from "./BirthdayList";
import { createMockBirthdayEmployees } from "../../owner/employees/EmployeeTypes";

const UpcomingBirthdays = () => {
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoize data for each period
  const weekEmployees = useMemo(
    () => createMockBirthdayEmployees(10, "week"),
    []
  );

  const monthEmployees = useMemo(
    () => createMockBirthdayEmployees(10, "month"),
    []
  );

  const nextMonthEmployees = useMemo(
    () => createMockBirthdayEmployees(10, "nextMonth"),
    []
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsLoading(true);
    setValue(newValue);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      <div className="col-span-12 lg:col-span-6 xl:col-span-12 xxl:col-span-5">
        <div className="card__wrapper card-tab-wrapper">
          <div className="card__title-wrap flex flex-wrap gap-[10px] items-center justify-between mb-[25px]">
            <h5 className="card__heading-title">Upcoming Birthdays</h5>
            <div className="card__tab">
              <Tabs value={value} onChange={handleChange}>
                <Tab label="This Week" />
                <Tab label="This Month" />
                <Tab label="Next Month" />
              </Tabs>
            </div>
          </div>
          <div className="card__content">
            <div className="tab-content" id="pills-tabContent">
              {isLoading ? (
                <div className="loading-spinner">
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div hidden={value !== 0}>
                    {value === 0 && (
                      <BirthdayList period="week" employees={weekEmployees} />
                    )}
                  </div>
                  <div hidden={value !== 1}>
                    {value === 1 && (
                      <BirthdayList period="month" employees={monthEmployees} />
                    )}
                  </div>
                  <div hidden={value !== 2}>
                    {value === 2 && (
                      <BirthdayList
                        period="nextMonth"
                        employees={nextMonthEmployees}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpcomingBirthdays;
