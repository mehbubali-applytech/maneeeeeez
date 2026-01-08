"use client";

import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import { idType } from "@/interface/common.interface";
import React, { useEffect, useState } from "react";
import PersonalInformation from "./PersonalInformation";
import EmergencyContact from "./EmergencyContact";

import EducationQualification from "./EducationQualification";
import ExperienceDetails from "./ExperienceDetails";
import BankAccount from "./BankAccount";

import SocialProfile from "./SocialProfile";
import Passport from "./Passport";
import employeeData from "@/data/hrm/employee-data";
import axios from "axios";

const EmployeeProfileMainArea = ({ id }: idType) => {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://payroll-baas.onrender.com/api/employee/list"
        );
        setEmployee(response.data?.data[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="app__slide-wrapper">
      <Breadcrumb breadTitle="Employee Profile" subTitle="Home" />
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
        <PersonalInformation data={employee} />
        <EmergencyContact data={employee} />
        <EducationQualification />
        <ExperienceDetails />
        <BankAccount />
        <Passport />
        <SocialProfile />
      </div>
    </div>
  );
};

export default EmployeeProfileMainArea;
