// ShiftMainArea.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ShiftTable from "./ShiftTable";
import ShiftSummary from "./ShiftSummary";
import UpdateShiftModal from "./UpdateShiftModal";
import { IShift, IShiftForm } from "./ShiftTypes";

const ShiftMainArea: React.FC = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<IShift | null>(null);

  useEffect(() => {
    // Mock data
    setShifts([
      {
        shiftId: 1,
        shiftName: "Morning Shift",
        startTime: "09:00",
        endTime: "18:00",
        isNightShift: false,
        gracePeriod: 15,
        breakTimeSlots: [
          { breakStart: "13:00", breakEnd: "13:30" },
          { breakStart: "16:00", breakEnd: "16:15" }
        ],
        applicableLocations: ["Mumbai HQ", "Delhi Corporate Office"],
        activeStatus: true,
        assignedEmployees: 45,
        createdAt: "2024-01-15",
        updatedAt: "2024-10-10",
      },
      {
        shiftId: 2,
        shiftName: "Night Shift A",
        startTime: "21:00",
        endTime: "06:00",
        isNightShift: true,
        gracePeriod: 30,
        breakTimeSlots: [
          { breakStart: "00:00", breakEnd: "00:30" },
          { breakStart: "03:00", breakEnd: "03:15" }
        ],
        applicableLocations: ["Chennai Branch", "Bangalore Branch"],
        activeStatus: true,
        assignedEmployees: 22,
        createdAt: "2024-02-20",
        updatedAt: "2024-09-15",
      },
      {
        shiftId: 3,
        shiftName: "Evening Shift",
        startTime: "14:00",
        endTime: "22:00",
        isNightShift: false,
        gracePeriod: 15,
        breakTimeSlots: [
          { breakStart: "17:00", breakEnd: "17:30" },
          { breakStart: "20:00", breakEnd: "20:15" }
        ],
        applicableLocations: ["Hyderabad Operations", "Pune Support Center"],
        activeStatus: true,
        assignedEmployees: 18,
        createdAt: "2024-03-10",
        updatedAt: "2024-10-05",
      },
    ]);
  }, []);

  const handleAddClick = () => {
    window.location.href = "/owner/shift/add-shift";
  };

  const openEditModal = (shift: IShift) => {
    setEditingShift(shift);
    setUpdateModalOpen(true);
  };

  const handleUpdateShift = async (data: IShiftForm, shiftId: number) => {
    setShifts(prev => 
      prev.map(shift => 
        shift.shiftId === shiftId 
          ? { 
              ...shift, 
              ...data,
              updatedAt: new Date().toISOString()
            } 
          : shift
      )
    );
  };

  const handleDeleteShift = (id: number) => {
    setShifts(prev => prev.filter(shift => shift.shiftId !== id));
  };

  const handleDeleteShiftModal = async (shiftId: number) => {
    handleDeleteShift(shiftId);
  };

  const handleStatusChange = (id: number, status: boolean) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.shiftId === id ? { ...shift, activeStatus: status, updatedAt: new Date().toISOString() } : shift
      )
    );
  };

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