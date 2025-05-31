"use client"

import { createContext } from "react"

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  department?: {
    id: number
    name: string
  }
  role?: {
    id: number
    name: string
  }
  supervisor?: {
    id: number
    username: string
    first_name: string
    last_name: string
  }
}

export const UserContext = createContext<User | null>(null)