import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const employeeApi = {
  // Get all employees
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/employee`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get employee by ID
  getById: async (employeeId: string) => {
    const response = await axios.get(`${API_BASE_URL}/owner/employee/byId`, {
      params: { employee_id: employeeId },
      withCredentials: true
    });
    return response.data;
  },

  // Create employee
  create: async (employeeData: any) => {
    const response = await axios.post(`${API_BASE_URL}/owner/employee`, employeeData, {
      withCredentials: true
    });
    return response.data;
  },

  // Update employee
  update: async (employeeId: string, employeeData: any) => {
    const response = await axios.put(`${API_BASE_URL}/owner/employee/${employeeId}`, employeeData, {
      withCredentials: true
    });
    return response.data;
  },

  // Delete employee
  delete: async (employeeId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/owner/employee/${employeeId}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Search employees
  search: async (searchParams: any) => {
    const response = await axios.post(`${API_BASE_URL}/owner/employee/search`, searchParams, {
      withCredentials: true
    });
    return response.data;
  },

  // Bulk import
  bulkImport: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/owner/employee/bulk-import`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Export employees
  export: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/employee/export`, {
      withCredentials: true,
      responseType: 'blob'
    });
    return response.data;
  }
};

// Department API
export const departmentApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/department`, {
      withCredentials: true
    });
    return response.data;
  }
};

// Designation API
export const designationApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/designation`, {
      withCredentials: true
    });
    return response.data;
  }
};

// Branch API
export const branchApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/branch`, {
      withCredentials: true
    });
    return response.data;
  }
};

// Role API
export const roleApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/roles`, {
      withCredentials: true
    });
    return response.data;
  }
};