"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PayrollTable from "./PayrollTable";
import AddPayrollModal from "./AddPayrollModal";
import UpdatePayrollModal from "./UpdatePayrollModal";

import { IPayroll } from "./PayrollTypes";

const PayrollMainArea: React.FC = () => {
  const [payrolls, setPayrolls] = useState<IPayroll[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<IPayroll | null>(null);

  useEffect(() => {
    setPayrolls([
      {
        id: 1,
        employeeName: "Rahul Sharma",
        month: "January 2025",
        basic: 50000,
        hra: 20000,
        allowances: 5000,
        deductions: 14000,
        netSalary: 61000,
        status: "Paid",
      },
      {
        id: 2,
        employeeName: "Priya Verma",
        month: "January 2025",
        basic: 40000,
        hra: 15000,
        allowances: 3000,
        deductions: 10000,
        netSalary: 48000,
        status: "Pending",
      },
    ]);
  }, []);

const openAddModal = () => {
  setEditingPayroll(null);
  setModalOpen(true);
};


  const handleSavePayroll = (payload: Partial<IPayroll>) => {
    if (payload.id) {
      setPayrolls((prev) =>
        prev.map((p) => (p.id === payload.id ? { ...p, ...(payload as IPayroll) } : p))
      );
    } else {
      const newId = payrolls.length > 0 ? Math.max(...payrolls.map((p) => p.id)) + 1 : 1;
      setPayrolls((prev) => [{ ...(payload as IPayroll), id: newId }, ...prev]);
    }

    setModalOpen(false);
    setEditingPayroll(null);
  };

  const handleDeletePayroll = (id: number) => {
    setPayrolls((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/owner">Owner</Link></li>
            <li className="breadcrumb-item active">Payroll</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
        <button className="btn btn-primary" onClick={openAddModal}>
  Add Payroll
</button>

        </div>
      </div>

<PayrollTable
  key={payrolls.length}
  data={payrolls}
  onEdit={(p) => {
    setEditingPayroll(p);
    setModalOpen(true);
  }}
  onDelete={handleDeletePayroll}
/>


    {modalOpen &&
  (!editingPayroll ? (
    <AddPayrollModal
      open={modalOpen}
      setOpen={setModalOpen}
      onSave={handleSavePayroll}
    />
  ) : (
    <UpdatePayrollModal
      open={modalOpen}
      setOpen={setModalOpen}
      editData={editingPayroll}
      onSave={handleSavePayroll}
    />
  ))}

    </div>
  );
};

export default PayrollMainArea;
