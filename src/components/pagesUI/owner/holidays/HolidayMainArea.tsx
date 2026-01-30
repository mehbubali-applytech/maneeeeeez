"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CircularProgress, Alert, Box, Typography } from "@mui/material";
import HolidayTable from "./HolidayTable";
import { IHoliday } from "./HolidayTypes";
import AddHolidayModal from "./AddHolidayModal";
import UpdateHolidayModal from "./UpdateHolidayModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const HolidayMainArea: React.FC = () => {
  const [holidays, setHolidays] = useState<IHoliday[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<IHoliday | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token") || "";
      
      const response = await axios.get(
        `${API_URL}/owner/holiday`,
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.data) {
        // Transform data to match IHoliday interface
        const transformedData = response.data.data.map((holiday: any) => ({
          // Backend fields
          id: holiday.id,
          holiday_id: holiday.holiday_id,
          name: holiday.name,
          holiday_date: holiday.holiday_date,
          description: holiday.description,
          status: holiday.status,
          created_at: holiday.created_at,
          updated_at: holiday.updated_at,
          
          // Frontend display fields (aliases for compatibility)
          date: holiday.holiday_date,
          holidayId: holiday.holiday_id,
        }));
        
        setHolidays(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching holidays:", error);
      setError(error.response?.data?.message || "Failed to load holidays");
      toast.error(error.response?.data?.message || "Failed to load holidays");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const openAddModal = () => {
    setEditingHoliday(null);
    setModalOpen(true);
  };

  const handleSaveHoliday = async (payload: Partial<IHoliday>) => {
    try {
      const token = localStorage.getItem("token") || "";
      
      if (payload.id) {
        // Update existing holiday
        const updatePayload = {
          name: payload.name,
          holiday_date: payload.holiday_date || payload.date,
          description: payload.description,
          status: payload.status,
        };

        const response = await axios.put(
          `${API_URL}/owner/holiday/${payload.id}`,
          updatePayload,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        if (response.data) {
          await fetchHolidays(); // Refresh data
          toast.success("Holiday updated successfully!");
        }
      } else {
        // Create new holiday
        const createPayload = {
          holiday_id: payload.holiday_id || payload.holidayId,
          name: payload.name,
          holiday_date: payload.holiday_date || payload.date,
          description: payload.description,
          status: payload.status || "Active",
        };

        const response = await axios.post(
          `${API_URL}/owner/holiday`,
          createPayload,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        if (response.status === 200 || response.status === 201) {
          await fetchHolidays(); // Refresh data
          toast.success("Holiday created successfully!");
        }
      }

      setModalOpen(false);
      setEditingHoliday(null);
    } catch (error: any) {
      console.error("Error saving holiday:", error);
      
      let errorMessage = "Failed to save holiday";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        const token = localStorage.getItem("token") || "";
        
        await axios.delete(
          `${API_URL}/owner/holiday/${id}`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        await fetchHolidays(); // Refresh data
        toast.success("Holiday deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting holiday:", error);
        toast.error(error.response?.data?.message || "Failed to delete holiday");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <CircularProgress />
            <p className="mt-2 text-gray-600">Loading holidays...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app__slide-wrapper">
        <Alert severity="error" className="mb-4">
          <Typography variant="h6">Error loading holidays</Typography>
          <Typography>{error}</Typography>
          <button
            onClick={fetchHolidays}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

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
            <li className="breadcrumb-item active">All Holidays</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Holiday
          </button>
        </div>
      </div>

      <HolidayTable
        data={holidays}
        onEdit={(h) => {
          setEditingHoliday(h);
          setModalOpen(true);
        }}
        onDelete={handleDeleteHoliday}
      />

      {modalOpen &&
        (!editingHoliday ? (
          <AddHolidayModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSave={handleSaveHoliday}
          />
        ) : (
          <UpdateHolidayModal
            open={modalOpen}
            setOpen={setModalOpen}
            editData={editingHoliday}
            onSave={handleSaveHoliday}
          />
        ))}
    </div>
  );
};

export default HolidayMainArea;