export const useAttendanceHook = (tag: any) => {
  switch (tag) {
    case "Holiday":
      return "fa fa-star text-primary";
    case "Day Off":
      return "fa fa-calendar-week text-secondary";
    case "Present":
      return "fa fa-check text-success";
    case "Half Day":
      return "fa fa-star-half-alt text-info";
    case "Late":
      return "fa fa-exclamation-circle text-warning";
    case "Absent":
      return "fa fa-times text-danger";
    case "On Leave":
      return "fa fa-plane-departure text-link";
    default:
      return "";
  }
};
// "Paid" | "Unpaid" | "Cancel" | "Refund";
// hooks/getTableStatusClass.ts
export const getTableStatusClass = (status?: string) => {
  if (!status) return "";

  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "paid":
    case "complete":
    case "won":
      return "bg-success";

    case "pending":
    case "partial":
    case "upcoming":
    case "in progress":
      return "bg-yellow-600";

    case "inactive":
    case "rejected":
    case "reject":
    case "lost":
    case "cancel":
    case "expired":
    case "returned":
    case "failed":
      return "bg-danger";

    case "open":
      return "bg-blue-800";

    case "closed":
      return "bg-red-800";

    case "contacted":
      return "bg-info";

    case "unpaid":
      return "bg-secondary";

    default:
      return "";
  }
};



export const useTablePrirotyHook = (tag: any) => {
  switch (tag) {
    case "Low":
      return "bg-cyan-600";
    case "Medium":
      return "bg-amber-600";
    case "High":
      return "bg-red-600/70";
    default:
      return "";
  }
};

export const useTablePhaseHook = (tag: any) => {
  switch (tag) {
    case "Active":
      return "bg-info";
    case "Planned":
      return "bg-primary";
    case "Completed":
      return "bg-success";
    default:
      return "";
  }
};

export const useTableActivityStatusHook = (tag: any) => {
  switch (tag) {
    case "Training":
      return "bg-primary";
    case "Email":
      return "bg-link";
    case "Development":
      return "bg-primary";
    case "Call":
      return "bg-success";
    case "Support":
      return "bg-primary";
    case "Marketing":
      return "bg-primary";
    case "Task":
      return "bg-danger";
    case "Meeting":
      return "bg-warning";
    default:
      return "";
  }
};
export const useLocaitonStatusHook = (tag: any) => {
  switch (tag) {
    case "United States":
      return "bg-success";
    case "United Kingdom":
      return "bg-secondary";
    case "Germany":
      return "bg-primary";
    case "Canada":
      return "bg-danger";
    case "Australia":
      return "bg-info";
    default:
      return "";
  }
};

export const useScheduleStatusHook = (tag: any) => {
  switch (tag) {
    case "All Day Out":
      return "warning-bg";
    case "9 am - 6 pm":
      return "success-bg";
    case "Absent":
      return "danger-bg";
    case "8:30 am - 6 pm":
      return "theme-sec-bg";
    case "All Day":
      return "info-bg";
    case "Weekly Holiday":
      return "link-bg";
    default:
      return "";
  }
};

export const getAttendanceClass = (tag: any) => {
  switch (tag) {
    case "Holiday": return "fa fa-star text-primary";
    case "Day Off": return "fa fa-calendar-week text-secondary";
    case "Present": return "fa fa-check text-success";
    case "Half Day": return "fa fa-star-half-alt text-info";
    case "Late": return "fa fa-exclamation-circle text-warning";
    case "Absent": return "fa fa-times text-danger";
    case "On Leave": return "fa fa-plane-departure text-link";
    default: return "";
  }
};


// hooks/use-condition-class.ts
export const getSubscriptionStatusHook = (status?: string) => {
  if (!status) return "info";

  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "expired":
      return "danger";
    default:
      return "info";
  }
};



