import axios from "axios"

// Create an axios instance WITHOUT a default Content-Type header
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true, // Important for cookies
})

// Function to get current locale from URL or localStorage
const getCurrentLocale = (): string => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname
    const segments = pathname.split('/')
    const potentialLocale = segments[1]
    const supportedLocales = ['en', 'vi', 'zh-hant']
    if (supportedLocales.includes(potentialLocale)) {
      return potentialLocale
    }
    return localStorage.getItem('locale') || 'en'
  }
  return 'en'
}

const getAcceptLanguage = (locale: string): string => {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US,en;q=0.9',
    'vi': 'vi-VN,vi;q=0.9,en;q=0.8',
    'zh-hant': 'zh-TW,zh;q=0.9,en;q=0.8'
  }
  return localeMap[locale] || 'en-US,en;q=0.9'
}

// Request interceptor for Accept-Language
api.interceptors.request.use(
  (config) => {
    const locale = getCurrentLocale()
    config.headers['Accept-Language'] = getAcceptLanguage(locale)

    // Set JSON Content-Type ONLY if not sending FormData
    if (
      !(config.data instanceof FormData) &&
      !config.headers['Content-Type'] // allow custom override
    ) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Token refresh logic
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

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
  }
)


// === Exported API functions ===

// Auth
export const login = (credentials: { username: string; password: string }) =>
  api.post("/auth/login", credentials)

export const refreshToken = () => api.get("/auth/refresh")

export const logout = () => api.post("/auth/logout")

// User
export const getCurrentUser = () => api.get("/users/me")

export const getUsers = () => api.get("/users/")

export const changePassword = (data: {
  current_password: string
  new_password: string
  re_new_password: string
}) => api.post("/users/set_password", data)

// Process
export const getProcesses = () => api.get("/processes/")

export const getProcessById = (id: string | number) => api.get(`/processes/${id}/`)

// Tasks
export const getSentTasks = () => api.get("/tasks/sent/")

export const getReceivedTasks = () => api.get("/tasks/received/")

export const getTaskById = (id: string | number) => api.get(`/tasks/${id}/`)

// This accepts FormData directly and relies on Axios to set headers
export const createTask = (data: any) =>
  api.post("/tasks/", data) // pass FormData directly

// If you really need to force multipart header manually (usually unnecessary):
export const performTaskAction = (
  id: string | number,
  actionData: any,
  isFormData: boolean = false
) =>
  api.post(
    `/tasks/${id}/actions/`,
    actionData,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  )

export default api
