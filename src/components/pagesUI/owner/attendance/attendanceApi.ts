import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get corrected attendance requests
export const getCorrectedAttendance = async (status?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/owner/attendance/getCorrectedAttendance`, {
      params: { status },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching corrected attendance:', error);
    throw error;
  }
};

// Submit correction request
export const submitCorrectionRequest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/owner/attendance/correction/request`, payload, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting correction request:', error);
    throw error;
  }
};

// Submit absent correction
export const submitAbsentCorrection = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/owner/attendance/absent-correction`, payload, {
      withCredentials:true
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting absent correction:', error);
    throw error;
  }
};

// Approve/Reject correction
export const handleCorrectionAction = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/owner/attendance/correction/action`, payload, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error handling correction action:', error);
    throw error;
  }
};

// Approve absent correction
export const approveAbsentCorrection = async (correctedAttendanceId: number, payload: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/owner/attendance/approve-absent-correction/${correctedAttendanceId}`,
      payload,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving absent correction:', error);
    throw error;
  }
};


// attendanceApi.ts - Add these functions



export const getLeaveRequests = async (params?: {
  employee_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaves`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
};

export const getLeaveBalance = async (employee_id?: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaves/balance`, {
      params: employee_id ? { employee_id } : {},
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    throw error;
  }
};

export const createLeaveRequest = async (payload: {
  employee_id: number;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status?: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leaves`, payload, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw error;
  }
};

export const updateLeaveRequest = async (id: number, payload: {
  status?: string;
  // approved_by?: number;
  approved_on?: string;
  reason?: string;
}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/leaves/${id}`, payload, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating leave request:', error);
    throw error;
  }
};

export const deleteLeaveRequest = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/leaves/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting leave request:', error);
    throw error;
  }
};

// Get employees on leave today
export const getEmployeesOnLeaveToday = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${API_BASE_URL}/leaves`, {
      params: {
        status: 'Approved',
        start_date: today,
        end_date: today
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees on leave today:', error);
    throw error;
  }
};