import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api",
});

// Add a request interceptor to include JWT in headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.url !== "/auth/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

apiClient.getData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error; // Rethrow the error for further handling
  }
};

export default apiClient;
