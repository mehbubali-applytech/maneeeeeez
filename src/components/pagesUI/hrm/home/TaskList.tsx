import React from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignedTo: string;
  status: "pending" | "in-progress" | "completed";
}

interface TaskListProps {
  priority: "high" | "medium" | "low";
}

const TaskList: React.FC<TaskListProps> = ({ priority }) => {
  // Sample data - in real app, this would come from API
  const tasks: Task[] = [
    {
      id: 1,
      title: "Approve Leave Requests",
      description: "Review and approve pending leave applications",
      priority: "high",
      dueDate: "Today",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 2,
      title: "Process Monthly Payroll",
      description: "Run payroll for all employees",
      priority: "high",
      dueDate: "Tomorrow",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 3,
      title: "Update Employee Records",
      description: "Update new employee information in system",
      priority: "medium",
      dueDate: "This Week",
      assignedTo: "HR Manager",
      status: "in-progress",
    },
    {
      id: 4,
      title: "Send Offer Letters",
      description: "Prepare and send offer letters to new hires",
      priority: "medium",
      dueDate: "Tomorrow",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 5,
      title: "Prepare Attendance Report",
      description: "Generate monthly attendance report",
      priority: "medium",
      dueDate: "End of Month",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 6,
      title: "Organize Team Building",
      description: "Plan monthly team building activity",
      priority: "low",
      dueDate: "Next Month",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 7,
      title: "Update Leave Policy",
      description: "Review and update company leave policy",
      priority: "low",
      dueDate: "Next Quarter",
      assignedTo: "HR Manager",
      status: "pending",
    },
    {
      id: 8,
      title: "Backup HR Data",
      description: "Create backup of employee database",
      priority: "low",
      dueDate: "Weekly",
      assignedTo: "HR Manager",
      status: "completed",
    },
  ];

  // Filter tasks based on priority and status
  const filteredTasks = tasks.filter(
    (task) => task.priority === priority && task.status !== "completed"
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-primary";
      case "pending":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="space-y-3 flex-1 flex flex-col min-h-0">
      {/* Task List Container with Scroll */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
        {filteredTasks.length > 0 ? (
          <div className="space-y-3 pb-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h6 className="font-medium mb-0 text-sm sm:text-base truncate">
                        {task.title}
                      </h6>
                      <div className="flex gap-1 flex-shrink-0">
                        <span
                          className={`badge ${getPriorityColor(
                            task.priority
                          )} text-white text-xs px-1.5 py-0.5`}
                        >
                          {task.priority.charAt(0).toUpperCase()}
                        </span>
                        <span
                          className={`badge ${getStatusColor(
                            task.status
                          )} text-white text-xs px-1.5 py-0.5`}
                        >
                          {task.status.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-calendar text-xs"></i>
                          Due: {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-user text-xs"></i>
                          {task.assignedTo}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-xs flex-1">
                          <i className="fa-regular fa-check mr-1"></i>
                          Complete
                        </button>
                        <button className="btn btn-outline-secondary btn-xs">
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:flex-col sm:items-end gap-2">
                    <div className="text-sm text-gray-500 text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <i className="fa-regular fa-calendar"></i>
                        Due: {task.dueDate}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <i className="fa-regular fa-user"></i>
                        {task.assignedTo}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-xs whitespace-nowrap">
                        <i className="fa-regular fa-check mr-1"></i>
                        Complete
                      </button>
                      <button className="btn btn-outline-secondary btn-xs">
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <i className="fa-regular fa-clipboard-check text-2xl text-gray-300"></i>
            </div>
            <h6 className="font-medium text-gray-700">
              No {priority} priority tasks pending
            </h6>
            <p className="text-gray-500 text-sm mt-1">
              All {priority} priority tasks are completed
            </p>
          </div>
        )}
      </div>

      {/* Add New Task Button - Only show if there are tasks */}
      {filteredTasks.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <button className="btn btn-outline-primary btn-sm w-full">
            <i className="fa-regular fa-plus mr-2"></i>
            Add New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
