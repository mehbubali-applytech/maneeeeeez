"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import SalaryComponentsTable from "./SalaryComponentsTable";

interface SalaryComponent {
  id: number;
  name: string;
  calculation_type: string;
  component_type: string;
  description: string;
}

const SalaryComponentsMainArea = () => {
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://payroll-baas.onrender.com/api/salary/master"
        );

        const transformed = (response.data?.data || []).map((item: any) => ({
          id: Number(item.component_id),
          name: item.component_name || "",
          calculation_type: item.calculation_type || "",
          component_type: item.component_type || "",
          description: item.description || "",
        }));

        setSalaryComponents(transformed);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch salary component data.");
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="app__slide-wrapper">
      <Breadcrumb breadTitle="Salary Components Management" subTitle="Home" />

      <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
        <SalaryComponentsTable salaryComponents={salaryComponents} />
      </div>
    </div>
  );
};

export default SalaryComponentsMainArea;
