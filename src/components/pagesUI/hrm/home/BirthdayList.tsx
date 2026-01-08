import React from "react";
import Image from "next/image";
import {
  IEmployee,
  IEmployeeBirthday,
  calculateAge,
  getNextBirthday,
} from "../../owner/employees/EmployeeTypes";

interface BirthdayListProps {
  period: "week" | "month" | "nextMonth";
  employees: IEmployee[];
}

const BirthdayList: React.FC<BirthdayListProps> = ({ period, employees }) => {
  // Helper function FIRST (hoisting clarity)
  const isBirthdayInPeriod = (dateOfBirth: string, period: string): boolean => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const nextBirthday = getNextBirthday(dateOfBirth);

    switch (period) {
      case "week":
        return nextBirthday.daysUntil <= 7;
      case "month":
        return birthDate.getMonth() === today.getMonth();
      case "nextMonth":
        const nextMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
        return birthDate.getMonth() === nextMonth;
      default:
        return false;
    }
  };

  // ✅ Now properly typed
  const filteredEmployees: IEmployeeBirthday[] = employees
    .filter(
      (emp): emp is IEmployee =>
        !!emp.dateOfBirth && emp.employmentStatus === "Active"
    )
    .filter((emp) => isBirthdayInPeriod(emp.dateOfBirth!, period))
    .map((emp) => ({
      ...emp,
      fullName: `${emp.firstName} ${emp.lastName}`,
      age: calculateAge(emp.dateOfBirth!),
      nextBirthday: getNextBirthday(emp.dateOfBirth!),
    }))
    .sort((a, b) => a.nextBirthday.daysUntil - b.nextBirthday.daysUntil);

  // ---- rest of your component stays SAME ----

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Check if birthday is today
  const isBirthdayToday = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate()
    );
  };

  const getPeriodTitle = () => {
    switch (period) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "nextMonth":
        return "Next Month";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h6 className="font-medium">{getPeriodTitle()}</h6>
        <span className="bd-badge bg-primary">
          {filteredEmployees.length} Birthdays
        </span>
      </div>

      {filteredEmployees.length > 0 ? (
        <>
          {filteredEmployees.map((employee) => {
            const isToday = isBirthdayToday(employee.dateOfBirth!);

            return (
              <div
                key={employee.employeeId}
                className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                  isToday
                    ? "bg-primary-light border-primary"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {employee.profilePhoto ? (
                      <Image
                        src={employee.profilePhoto}
                        alt={employee.fullName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-700">
                        {employee.firstName.charAt(0)}
                        {employee.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-danger rounded-full flex items-center justify-center animate-pulse">
                      <i className="fa-regular fa-cake-candles text-white text-xs"></i>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h6 className="font-medium mb-0">{employee.fullName}</h6>
                      {isToday && (
                        <span className="badge bg-danger text-white text-xs">
                          Today!
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary">
                        {formatDate(employee.dateOfBirth!)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.nextBirthday.daysUntil === 0
                          ? "Today"
                          : `in ${employee.nextBirthday.daysUntil} days`}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    {employee.roleName} • {employee.departmentName}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-cake-candles"></i>
                      Turning {employee.age + 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-id-badge"></i>
                      {employee.employeeCode}
                    </span>
                    {employee.workLocationName && (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-location-dot"></i>
                        {employee.workLocationName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    className="btn btn-outline-success btn-xs whitespace-nowrap"
                    onClick={() =>
                      console.log("Send gift to:", employee.employeeId)
                    }
                  >
                    <i className="fa-regular fa-gift mr-1"></i>
                    Gift
                  </button>
                  <button
                    className="btn btn-outline-primary btn-xs whitespace-nowrap"
                    onClick={() =>
                      console.log("Send wish to:", employee.employeeId)
                    }
                  >
                    <i className="fa-regular fa-envelope mr-1"></i>
                    Wish
                  </button>
                  {isToday && (
                    <button
                      className="btn btn-danger btn-xs whitespace-nowrap mt-1"
                      onClick={() =>
                        console.log("Celebrate:", employee.employeeId)
                      }
                    >
                      <i className="fa-regular fa-party-horn mr-1"></i>
                      Celebrate
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="mt-4 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <i className="fa-regular fa-calendar mr-2"></i>
                View Calendar
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="fa-regular fa-bell mr-2"></i>
                Set Reminder
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <i className="fa-regular fa-cake-candles text-2xl text-gray-300"></i>
          </div>
          <h6 className="font-medium text-gray-700">
            No birthdays {getPeriodTitle().toLowerCase()}
          </h6>
          <p className="text-gray-500 text-sm mt-1">
            {period === "week"
              ? "Check back next week for upcoming birthdays"
              : "Check next month for upcoming birthdays"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BirthdayList;
