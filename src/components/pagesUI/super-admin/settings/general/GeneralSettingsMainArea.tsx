"use client";
import React from "react";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import GeneralSettingsTabs from "./GeneralSettingsTabs";

const GeneralSettingsMainArea = () => {
  return (
    <>
      <div className="app__slide-wrapper">
        <Breadcrumb breadTitle="Platform Settings" subTitle="Super Admin" />
        <GeneralSettingsTabs/>





      </div>
    </>
  );
};

export default GeneralSettingsMainArea;
