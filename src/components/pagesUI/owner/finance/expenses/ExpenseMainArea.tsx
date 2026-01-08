"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExpenseTable from "./ExpenseTable";
import { IExpense } from "./ExpenseTypes";
import AddExpenseModal from "./AddExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";

const ExpenseMainArea: React.FC = () => {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);

  useEffect(() => {
    setExpenses([
      {
        id: 1,
        expenseTitle: "Office Rent",
        expenseCategory: "Rent",
        amount: 45000,
        expenseDate: "2024-11-01",
        paymentMode: "Bank",
        status: "Approved",
      },
      {
        id: 2,
        expenseTitle: "Internet Bill",
        expenseCategory: "Utilities",
        amount: 3200,
        expenseDate: "2024-11-05",
        paymentMode: "UPI",
        status: "Pending",
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleSaveExpense = (payload: Partial<IExpense>) => {
    if (payload.id) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === payload.id ? { ...e, ...(payload as IExpense) } : e))
      );
    } else {
      const newId = expenses.length
        ? Math.max(...expenses.map((e) => e.id)) + 1
        : 1;
      setExpenses((prev) => [{ ...(payload as IExpense), id: newId }, ...prev]);
    }
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">Expenses</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Expense
          </button>
        </div>
      </div>

      <ExpenseTable
        data={expenses}
        onEdit={(e) => {
          setEditingExpense(e);
          setModalOpen(true);
        }}
        onDelete={handleDeleteExpense}
      />

      {modalOpen &&
        (!editingExpense ? (
          <AddExpenseModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSave={handleSaveExpense}
          />
        ) : (
          <UpdateExpenseModal
            open={modalOpen}
            setOpen={setModalOpen}
            editData={editingExpense}
            onSave={handleSaveExpense}
          />
        ))}
    </div>
  );
};

export default ExpenseMainArea;
