"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ShiftTable from "./ShiftTable";
import ShiftSummary from "./ShiftSummary";
import UpdateShiftModal from "./UpdateShiftModal";
import { IShift, IShiftForm } from "./ShiftTypes";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ShiftMainAreaProps {
  clientId: number;
}

const ShiftMainArea: React.FC<ShiftMainAreaProps> = ({ clientId }) => {
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<IShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch shifts from API
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/shift/client`,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.data) {
          // Transform data to match IShift interface
          const transformedData = response.data.data.map((shift: any) => ({
            // Backend fields
            shift_id: shift.shift_id,
            client_id: shift.client_id,
            shift_name: shift.shift_name,
            start_time: shift.start_time,
            end_time: shift.end_time,
            is_night_shift: shift.is_night_shift,
            grace_period: shift.grace_period,
            break_time_slots: shift.break_time_slots || [],
            active_status: shift.active_status,
            assigned_employees: shift.assigned_employees || 0,
            created_at: shift.created_at,
            updated_at: shift.updated_at,
            Branches: shift.Branches || [],
          }));

          setShifts(transformedData);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/");
          return;
        }
        console.error("Error fetching shifts:", error);
        setError(error.response?.data?.message || "Failed to load shifts");
        toast.error(error.response?.data?.message || "Failed to load shifts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();

  }, []);

  const handleAddClick = () => {
    window.location.href = "/owner/shift/add-shift";
  };

  const openEditModal = (shift: IShift) => {
    setEditingShift(shift);
    setUpdateModalOpen(true);
  };

  const handleUpdateShift = async (data: IShiftForm, shiftId: number) => {
    try {
      const payload = {
        ...data,
        break_time_slots: data.break_time_slots || [],
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/shift/${shiftId}`,
        payload,
        {
          withCredentials: true
        }
      );

      if (response.status === 200) {
        // Update local state
        setShifts(prev =>
          prev.map(shift =>
            shift.shift_id === shiftId
              ? {
                ...shift,
                ...response.data.data,
                updated_at: new Date().toISOString()
              }
              : shift
          )
        );
        toast.success("Shift updated successfully!");
        setUpdateModalOpen(false);
        setEditingShift(null);
      }
    } catch (error: any) {
      console.error("Error updating shift:", error);
      toast.error(error.response?.data?.message || "Failed to update shift");
    }
  };

  const handleDeleteShift = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/shift/${id}`,
        {
          withCredentials: true,
        }
      );

      // Update local state
      setShifts(prev => prev.filter(shift => shift.shift_id !== id));
      toast.success("Shift deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting shift:", error);
      toast.error(error.response?.data?.message || "Failed to delete shift");
    }
  };

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/shift/${id}`,
        { active_status: newStatus },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setShifts(prev =>
          prev.map(shift =>
            shift.shift_id === id
              ? {
                ...shift,
                active_status: newStatus,
                updated_at: new Date().toISOString()
              }
              : shift
          )
        );
        toast.success("Shift status updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating shift status:", error);
      toast.error(error.response?.data?.message || "Failed to update shift status");
    }
  };

  if (isLoading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-600">Loading shifts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app__slide-wrapper">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Error loading shifts</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <li className="breadcrumb-item active">Shift Management</li>
            </ol>
          </nav>

          <div className="breadcrumb__btn">
            <button
              type="button"
              onClick={handleAddClick}
              className="btn btn-primary"
            >
              Add New Shift
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0 mb-6">
          <ShiftSummary shifts={shifts} />
        </div>

        <ShiftTable
          data={shifts}
          onEdit={openEditModal}
          onDelete={handleDeleteShift}
          onStatusChange={handleStatusChange}
          key={shifts.length}
        />
      </div>

      {editingShift && (
        <UpdateShiftModal
          open={updateModalOpen}
          setOpen={setUpdateModalOpen}
          editData={editingShift}
          onSave={handleUpdateShift}
        />
      )}
    </>
  );
};

export default ShiftMainArea;