// ExpenseTypes.ts
export interface IExpense {
  [key: string]: any;
  id: number;
  expenseTitle: string;
  expenseCategory?: string;
  amount: number;
  expenseDate: string;
  paymentMode?: "Cash" | "Bank" | "UPI" | "Card";
  referenceNo?: string;
  description?: string;
  status?: "Pending" | "Approved" | "Rejected";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
