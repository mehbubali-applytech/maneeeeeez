"use client";
import React from "react";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";

const SettingsMainArea = () => {
  return (
    <>
      <div className="app__slide-wrapper">
        <Breadcrumb breadTitle="Platform Settings" subTitle="Super Admin" />
        <div className="card">
          <div className="card__header">
            <h5 className="card__title">General Settings</h5>
          </div>
          <div className="card__body">
            <form>
              <div className="mb-3">
                <label className="form-label">Platform Name</label>
                <input type="text" className="form-control" placeholder="Enter platform name" defaultValue="Manez" />
              </div>
              <div className="mb-3">
                <label className="form-label">Support Email</label>
                <input type="email" className="form-control" placeholder="Enter support email" />
              </div>
              <button type="submit" className="btn btn-primary">Save Settings</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsMainArea;
