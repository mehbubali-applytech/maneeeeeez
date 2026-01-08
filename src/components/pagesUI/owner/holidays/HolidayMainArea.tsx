"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import HolidayTable from "./HolidayTable";
import { IHoliday } from "./HolidayTypes";
import AddHolidayModal from "./AddHolidayModal";
import UpdateHolidayModal from "./UpdateHolidayModal";

const HolidayMainArea: React.FC = () => {
  const [holidays, setHolidays] = useState<IHoliday[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<IHoliday | null>(null);

  useEffect(() => {
    setHolidays([
      {
        id: 1,
        holidayId: "HOL-001",
        name: "New Year",
        date: "2024-01-01",
        description: "New Year Celebration",
        created_at: "2023-12-01",
        status: "Active",
      },
      {
        id: 2,
        holidayId: "HOL-002",
        name: "Independence Day",
        date: "2024-08-15",
        description: "National Holiday",
        created_at: "2023-12-01",
        status: "Active",
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingHoliday(null);
    setModalOpen(true);
  };

  const handleSaveHoliday = (payload: Partial<IHoliday>) => {
    if (payload.id) {
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === payload.id ? { ...h, ...(payload as IHoliday) } : h
        )
      );
    } else {
      const newId =
        holidays.length > 0 ? Math.max(...holidays.map((h) => h.id)) + 1 : 1;

      setHolidays((prev) => [{ ...(payload as IHoliday), id: newId }, ...prev]);
    }

    setModalOpen(false);
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = (id: number) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
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
        key={holidays.length}
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
