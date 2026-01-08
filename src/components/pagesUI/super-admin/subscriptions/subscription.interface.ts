export interface ISubscription {
  id: number;
  subscriptionName: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  users: number;
  modules: string[];
  owner: string;
  email: string;
  description?: string;
  [key: string]: any; // Index signature for RowObject compatibility
}

// For form submission
export interface ISubscriptionForm {
  subscriptionName: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  users: number;
  modules: string[];
  owner: string;
  email: string;
  description: string;
  [key: string]: any;
}