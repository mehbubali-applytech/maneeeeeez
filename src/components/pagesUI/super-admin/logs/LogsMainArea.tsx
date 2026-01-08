"use client";
import React from "react";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";

const LogsMainArea = () => {
  return (
    <>
      <div className="app__slide-wrapper">
        <Breadcrumb breadTitle="Support & Logs" subTitle="Super Admin" />
        <div className="card">
          <div className="card__header">
            <h5 className="card__title">Activity Logs</h5>
          </div>
          <div className="card__body">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>User</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Company Registered</td>
                  <td>Admin</td>
                  <td>2024-12-08 10:30 AM</td>
                  <td><span className="badge badge-success">Success</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogsMainArea;
