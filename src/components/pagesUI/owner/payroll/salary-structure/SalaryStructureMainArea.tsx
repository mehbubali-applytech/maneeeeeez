"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SalaryStructureTable from "./SalaryStructureTable";

const SalaryStructureMainArea: React.FC = () => {
  const [salaryFields, setSalaryFields] = useState<any[]>([]);

  useEffect(() => {
    setSalaryFields([
      { key: "basic", label: "Basic Salary", value: 100000 },
      { key: "hra", label: "HRA", value: 12000 },
      { key: "conveyance", label: "Conveyance", value: 3000 },
      { key: "medical", label: "Medical Allowance", value: 2000 },
      { key: "special", label: "Special Allowance", value: 5000 },
    ]);
  }, []);

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">Salary Structure</li>
          </ol>
        </nav>
      </div>

      <SalaryStructureTable fields={salaryFields} />
    </div>
  );
};

export default SalaryStructureMainArea;
