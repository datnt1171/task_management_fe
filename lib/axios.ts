import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.API_URL,
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Call our refresh token API route
        await axios.get("auth/refresh", { withCredentials: true })

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

export default api
