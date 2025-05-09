"use client"

import { useState, useCallback } from "react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const request = useCallback(async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<T | null> => {
    setLoading(true);
  setError(null)

  try {
    const response = await api[method](url, data)
    return response.data as T
  } catch (err: any) {
    console.error(`API ${method} request failed:`, err)

    // Handle different error scenarios
    if (err.response) {
      // Server responded with an error status
      if (err.response.status === 401) {
        // Unauthorized - will be handled by axios interceptor
        setError("Session expired. Please log in again.")
      } else {
        setError(err.response.data?.detail || err.response.data?.error || "An error occurred")
      }
    } else if (err.request) {
      // Request was made but no response received
      setError("No response from server. Please check your connection.")
    } else {
      // Something else happened
      setError(err.message || "An unexpected error occurred")
    }

    return null
  } finally {
    setLoading(false)
  }
}
, [router])

return {
    loading,
    error,
    get: <T>(url: string) => request<T>('get', url),
    post: <T>(url: string, data: any) => request<T>('post', url, data),
    put: <T>(url: string, data: any) => request<T>('put', url, data),
    delete: <T>(url: string) => request<T>('delete', url),
  };
}
