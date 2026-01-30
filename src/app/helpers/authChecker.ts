import axios from "axios";

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
      { withCredentials: true }
    );

    return response.status === 200;
  } catch (error: any) {
    // 401 / 403 → not authenticated
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }

    // Unexpected error → log & fail closed
    console.error("Auth check failed:", error);
    return false;
  }
};
