"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import LeaveTable from "./LeaveTable";
import { ILeave } from "./LeaveTypes";
import AddLeaveModal from "./AddLeaveModal";
import UpdateLeaveModal from "./UpdateLeaveModal";

const LeaveMainArea: React.FC = () => {
  const [leaves, setLeaves] = useState<ILeave[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<ILeave | null>(null);

  useEffect(() => {
    setLeaves([
      {
        id: 1,
        leaveId: "LV-001",
        employeeName: "Rahul Sharma",
        leaveType: "Casual Leave",
        fromDate: "2024-01-10",
        toDate: "2024-01-12",
        reason: "Family function",
        appliedOn: "2024-01-05",
        status: "Approved",
      },
      {
        id: 2,
        leaveId: "LV-002",
        employeeName: "Priya Verma",
        leaveType: "Sick Leave",
        fromDate: "2024-02-02",
        toDate: "2024-02-03",
        reason: "Medical",
        appliedOn: "2024-02-01",
        status: "Pending",
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingLeave(null);
    setModalOpen(true);
  };

  const handleSaveLeave = (payload: Partial<ILeave>) => {
    if (payload.id) {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === payload.id ? { ...l, ...(payload as ILeave) } : l
        )
      );
    } else {
      const newId =
        leaves.length > 0 ? Math.max(...leaves.map((l) => l.id)) + 1 : 1;

      setLeaves((prev) => [{ ...(payload as ILeave), id: newId }, ...prev]);
    }

    setModalOpen(false);
    setEditingLeave(null);
  };

  const handleDeleteLeave = (id: number) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

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
            <li className="breadcrumb-item active">All Leaves</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={openAddModal}>
            Apply Leave
          </button>
        </div>
      </div>

      <LeaveTable
        key={leaves.length}
        data={leaves}
        onEdit={(l) => {
          setEditingLeave(l);
          setModalOpen(true);
        }}
        onDelete={handleDeleteLeave}
      />

      {modalOpen &&
        (!editingLeave ? (
          <AddLeaveModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSave={handleSaveLeave}
          />
        ) : (
          <UpdateLeaveModal
            open={modalOpen}
            setOpen={setModalOpen}
            editData={editingLeave}
            onSave={handleSaveLeave}
          />
        ))}
    </div>
  );
};

export default LeaveMainArea;
