import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // allow cookies if server sets them
});

// Intercept all requests
axiosInstance.interceptors.request.use(
  (config: any) => {
    // sessionStorage.getItem can return string | null
    const token = sessionStorage.getItem("accessToken");
    const accessToken: string = token ? JSON.parse(token) : "";

    if (accessToken && config.headers) {
      // Ensure headers is a Record<string, string>
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to provide clearer errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize common network/CORS errors for easier debugging
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      // Attach details to help track down baseURL / CORS issues
      error.message = `Network Error reaching ${baseURL}. Check that the API server is running and CORS is configured.`;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
