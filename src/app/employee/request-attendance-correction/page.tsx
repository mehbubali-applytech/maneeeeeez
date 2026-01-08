// app/employee/attendance/correction/page.tsx
"use client";

import ManualCorrectionForm from "@/components/pagesUI/employee/request-attendance-correction/ManualCorrectionForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
  },
});

export default function CorrectionRequestPage() {
  const handleSubmit = async (data: any): Promise<void> => {
    console.log("Correction request submitted:", data);
    
    // In a real app, you would make an API call here
    try {
      // Example API call:
      /*
      const response = await fetch('/api/attendance/correction-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      const result = await response.json();
      */
      
      // For demo purposes, simulate a successful API call
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      
    } catch (error) {
      console.error("Error submitting request:", error);
      throw error;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-50">
          <ManualCorrectionForm onSubmit={handleSubmit} />
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}