"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ColumnChartsWithMarkers from "./ColumnChartsWithMarkers";


const ReportsMainArea: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
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
            <li className="breadcrumb-item active">Payroll Reports</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" >
            Add Employee
          </button>
        </div>
      </div>


<ColumnChartsWithMarkers/>
    </div>
  );
};

export default ReportsMainArea;
