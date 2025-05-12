import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Call our refresh token API route
        await axios.get("/api/auth/refresh", { withCredentials: true })

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Authentication endpoints
export const login = (credentials: { username: string; password: string }) => api.post("/auth/login", credentials)
export const refreshToken = () => api.get("/auth/refresh")
export const logout = () => api.post("/auth/logout")

// User endpoints
export const getCurrentUser = () => api.get("/users/me")
export const getUsers = () => api.get("/users")

// Process/Form Template endpoints
export const getProcesses = () => api.get("/processes/processes/")
export const getProcessById = (id: string | number) => api.get(`/processes/processes/${id}/`)

// Task endpoints
export const getSentTasks = () => api.get("/tasks/sent/")
export const getReceivedTasks = () => api.get("/tasks/received/")
export const getTaskById = (id: string | number) => api.get(`/tasks/${id}/`)
export const createTask = (data: any) => api.post("/tasks/", data)
export const performTaskAction = (
  id: string | number,
  actionData: { action: string; comment?: string; metadata?: any },
) => api.post(`/tasks/${id}/actions/`, actionData)
export const getTaskHistory = (id: string | number) => api.get(`/tasks/${id}/history/`)

export default api
