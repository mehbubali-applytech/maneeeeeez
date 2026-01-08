"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import EmployeeFilter from "./EmployeeFilter";
import EmployeeSingleCard from "@/components/common/EmployeeSingleCard";
import EmployeesTable from "./EmployeesTable";
import AddNewEmployeeModal from "./AddNewEmployeeModal";
import Link from "next/link";


const EmployeeMainArea = () => {
  const [employees, setEmployees] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://payroll-baas.onrender.com/api/employee/list"
        );
        setEmployees(response.data?.data);
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
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__wrapper mb-[25px]">
          <nav>
            <ol className="breadcrumb flex items-center mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Employee
              </li>
            </ol>
          </nav>
          <div className="breadcrumb__btn">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Add Employee
            </button>
          </div>
        </div>
        <EmployeesTable employee={employees}/>
 
        {modalOpen && (
          <AddNewEmployeeModal open={modalOpen} setOpen={setModalOpen} />
        )}
      </div>
    </>
  );
};

export default EmployeeMainArea;
