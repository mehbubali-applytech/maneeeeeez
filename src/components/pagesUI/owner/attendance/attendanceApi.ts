import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get corrected attendance requests
export const getCorrectedAttendance = async (status?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/owner/attendance/getCorrectedAttendance`, {
      params: { status },
      headers: {
        'Content-Type': 'application/json',
      }
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
      headers: {
        'Content-Type': 'application/json',
      }
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
      headers: {
        'Content-Type': 'application/json',
      }
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
      headers: {
        'Content-Type': 'application/json',
      }
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
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving absent correction:', error);
    throw error;
  }
};