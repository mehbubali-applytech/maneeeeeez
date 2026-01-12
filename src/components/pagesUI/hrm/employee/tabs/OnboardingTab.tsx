// OnboardingTasks.tsx - Fixed with proper prop handling
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
  Divider
} from "@mui/material";
import {
  Checklist,
  Person,
  Assignment,
  Computer,
  School,
  Description,
  CalendarToday,
  MoreVert,
  CheckCircle,
  Pending,
  AccessTime,
  Error,
  Add
} from "@mui/icons-material";
import { IHREmployee } from "../HREmployeeTypes";

interface OnboardingTasksProps {
  employees: IHREmployee[]; // ✅ Properly define the prop
}

interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  task: string;
  category: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  assignedTo: string;
  daysLeft: number;
}

const OnboardingTasks: React.FC<OnboardingTasksProps> = ({ employees }) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Filter employees with pending onboarding
  const pendingOnboarding = employees.filter(emp => 
    emp.onboardingStatus === "Pending" || emp.onboardingStatus === "In Progress"
  );

  // Sample onboarding tasks - you can also generate these from employees data
  const onboardingTasks: OnboardingTask[] = [
    {
      id: "task1",
      employeeId: "EMP001",
      employeeName: "Rajesh Kumar",
      task: "Complete Background Verification",
      category: "Compliance",
      dueDate: "2024-01-15",
      status: "Pending",
      priority: "High",
      assignedTo: "HR Executive",
      daysLeft: 2
    },
    {
      id: "task2",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      task: "System Access Setup",
      category: "IT",
      dueDate: "2024-01-10",
      status: "In Progress",
      priority: "High",
      assignedTo: "IT Admin",
      daysLeft: -1
    },
    {
      id: "task3",
      employeeId: "EMP003",
      employeeName: "Amit Patel",
      task: "Orientation Session",
      category: "Training",
      dueDate: "2024-01-12",
      status: "Completed",
      priority: "Medium",
      assignedTo: "HR Manager",
      daysLeft: 0
    },
    {
      id: "task4",
      employeeId: "EMP004",
      employeeName: "Sneha Reddy",
      task: "Document Collection",
      category: "Documentation",
      dueDate: "2024-01-18",
      status: "Pending",
      priority: "Medium",
      assignedTo: "HR Executive",
      daysLeft: 5
    }
  ];

  // You can also generate tasks dynamically from employees
  const generateTasksFromEmployees = () => {
    return employees
      .filter(emp => emp.onboardingStatus !== "Completed")
      .map((emp, index) => ({
        id: `emp-task-${emp.employeeId}`,
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        task: "Complete Onboarding Process",
        category: "Onboarding",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        status: emp.onboardingStatus as "Pending" | "In Progress" | "Completed",
        priority: "High" as const,
        assignedTo: "HR Team",
        daysLeft: 7
      }));
  };

  // Use either static tasks or generate from employees
  const tasks = onboardingTasks; // Or use generateTasksFromEmployees()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle color="success" />;
      case "In Progress": return <AccessTime color="warning" />;
      case "Pending": return <Pending color="error" />;
      default: return <Error />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "info";
      default: return "default";
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setOpenDialog(true);
  };

  const handleCompleteTask = (taskId: string) => {
    console.log(`Completing task ${taskId}`);
    setOpenDialog(false);
  };

  // Calculate completion percentage
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checklist color="primary" />
            <Typography variant="h6" component="h2">
              Onboarding Tasks
            </Typography>
            <Chip 
              label={`${pendingOnboarding.length} Pending`} 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ width: 100, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {Math.round(completionPercentage)}% Complete
            </Typography>
          </Box>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItemButton
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              sx={{
                borderLeft: `4px solid ${
                  task.priority === "High" ? "#f44336" :
                  task.priority === "Medium" ? "#ff9800" : "#2196f3"
                }`,
                mb: 1,
                borderRadius: 1
              }}
            >
              <ListItemIcon>
                {getStatusIcon(task.status)}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {task.task}
                    </Typography>
                    <Chip
                      label={task.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority) as any}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person fontSize="small" />
                      <Typography variant="caption">
                        {task.employeeName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="caption" color={task.daysLeft < 0 ? "error" : "text.secondary"}>
                        Due: {new Date(task.dueDate).toLocaleDateString()} 
                        {task.daysLeft < 0 ? ` (Overdue by ${Math.abs(task.daysLeft)} days)` : 
                         task.daysLeft > 0 ? ` (${task.daysLeft} days left)` : ' (Today)'}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {task.assignedTo}
                  </Typography>
                  <IconButton size="small" edge="end">
                    <MoreVert />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>

        {tasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Checklist sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              All onboarding tasks are completed!
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => console.log("View all tasks")}
          >
            View All Tasks
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => console.log("Create new task")}
            className="!text-white"
          >
            Create Task
          </Button>
        </Box>
      </CardContent>

      {/* Task Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Onboarding Task Details
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Task details will appear here with options to update status, assign to different person, or add comments.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Task ID: {selectedTask}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedTask && handleCompleteTask(selectedTask)}
            className="!text-white"
          >
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OnboardingTasks;