"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import DesignationTable from "./DesignationTable";
import { IDesignation } from "./DesignationTypes";
import AddDesignationModal from "./AddDesignationModal";
import UpdateDesignationModal from "./UpdateDesignationModal";

const DesignationMainArea: React.FC = () => {
  const [designations, setDesignations] = useState<IDesignation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] =
    useState<IDesignation | null>(null);

  useEffect(() => {
    setDesignations([
      {
        id: 1,
        designationId: "DES-001",
        name: "Software Engineer",
        description: "Responsible for application development",
        created_at: "2023-01-10",
        status: "Active",
      },
      {
        id: 2,
        designationId: "DES-002",
        name: "HR Manager",
        description: "Handles recruitment and employee relations",
        created_at: "2022-11-05",
        status: "Inactive",
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingDesignation(null);
    setModalOpen(true);
  };

  const handleSaveDesignation = (payload: Partial<IDesignation>) => {
    if (payload.id) {
      setDesignations((prev) =>
        prev.map((d) =>
          d.id === payload.id ? { ...d, ...(payload as IDesignation) } : d
        )
      );
    } else {
      const newId =
        designations.length > 0
          ? Math.max(...designations.map((d) => d.id)) + 1
          : 1;

      setDesignations((prev) => [
        { ...(payload as IDesignation), id: newId },
        ...prev,
      ]);
    }

    setModalOpen(false);
    setEditingDesignation(null);
  };

  const handleDeleteDesignation = (id: number) => {
    setDesignations((prev) => prev.filter((d) => d.id !== id));
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
            <li className="breadcrumb-item active">All Designations</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Designation
          </button>
        </div>
      </div>

      <DesignationTable
        key={designations.length}
        data={designations}
        onEdit={(d) => {
          setEditingDesignation(d);
          setModalOpen(true);
        }}
        onDelete={handleDeleteDesignation}
      />

      {modalOpen &&
        (!editingDesignation ? (
          <AddDesignationModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSave={handleSaveDesignation}
          />
        ) : (
          <UpdateDesignationModal
            open={modalOpen}
            setOpen={setModalOpen}
            editData={editingDesignation}
            onSave={handleSaveDesignation}
          />
        ))}
    </div>
  );
};

export default DesignationMainArea;
