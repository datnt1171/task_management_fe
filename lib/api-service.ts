import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",

  },
  withCredentials: true, // Important for cookies
})

// Function to get current locale from URL or localStorage
const getCurrentLocale = (): string => {
  if (typeof window !== "undefined") {
    // Extract locale from current pathname
    const pathname = window.location.pathname
    const segments = pathname.split('/')
    const potentialLocale = segments[1]

    // Define your supported locales
    const supportedLocales = ['en', 'vi', 'zh-hant']
    
    if (supportedLocales.includes(potentialLocale)) {
      return potentialLocale
    }
    
    // Fallback to stored locale or default
    return localStorage.getItem('locale') || 'en'
  }
  
  return 'en' // Server-side fallback
}

// Function to convert locale to Accept-Language format
const getAcceptLanguage = (locale: string): string => {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US,en;q=0.9',
    'vi': 'vi-VN,vi;q=0.9,en;q=0.8',
    'zh-hant': 'zh-TW,zh;q=0.9,en;q=0.8'
  }

  return localeMap[locale] || 'en-US,en;q=0.9'
}

// Add request interceptor to automatically include Accept-Language
api.interceptors.request.use(
  (config) => {
    const locale = getCurrentLocale()
    const acceptLanguage = getAcceptLanguage(locale)
    
    // Add Accept-Language header to all requests
    config.headers['Accept-Language'] = acceptLanguage
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
  actionData: any,
  isFormData: boolean = false
) => api.post(
  `/tasks/${id}/actions/`,
  actionData,
  isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
)

export default api