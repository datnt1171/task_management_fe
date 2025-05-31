import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Track if a token refresh is in progress
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
          originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/logout')
        ) {
          return Promise.reject(error)
        }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await api.get("/auth/refresh")
        if (!refreshResponse.data.success) {
          throw new Error("Refresh failed")
        }
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem("user")
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
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
export const getUsers = () => api.get("/users/")
export const changePassword = (data: {
  current_password: string
  new_password: string
  re_new_password: string
}) => api.post("/users/set_password", data)

// Process/Form Template endpoints
export const getProcesses = () => api.get("/processes/")
export const getProcessById = (id: string | number) => api.get(`/processes/${id}/`)

// Task endpoints
export const getSentTasks = () => api.get("/tasks/sent/")
export const getReceivedTasks = () => api.get("/tasks/received/")
export const getTaskById = (id: string | number) => api.get(`/tasks/${id}/`)
export const createTask = (data: any) => api.post("/tasks/", data)
export const performTaskAction = (
  id: string | number,
  actionData: { action_id: number; comment?: string }
) => api.post(`/tasks/${id}/actions/`, actionData)

export default api
