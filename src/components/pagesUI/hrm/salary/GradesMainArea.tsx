"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import GradeTable from "./GradeTable";
import Link from "next/link";

const GradeMainArea = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://payroll-baas.onrender.com/api/grades"
        );

        const transformed = (response.data?.data || []).map((item: any) => ({
          id: Number(item.id),
          grade_name: item.grade_name || "",
          ctc_range_min: item.ctc_range_min || 0,
          ctc_range_max: item.ctc_range_max || 0,
        }));

        setGrades(transformed);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch grade data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);




  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="app__slide-wrapper">
      <Breadcrumb breadTitle="Grade Management" subTitle="Home" />

      <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
        <GradeTable grades={grades} />

      </div>

    </div>
  );
};

export default GradeMainArea;
