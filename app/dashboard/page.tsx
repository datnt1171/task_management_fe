"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Send, Inbox, Clock, Loader2 } from "lucide-react"
import { getProcesses, getSentTasks, getReceivedTasks } from "@/lib/api-service"

export default function Dashboard() {
  const [stats, setStats] = useState({
    formTemplatesCount: 0,
    sentTasksCount: 0,
    receivedTasksCount: 0,
    pendingTasksCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        // Fetch data in parallel
        const [processesRes, sentTasksRes, receivedTasksRes] = await Promise.all([
          getProcesses(),
          getSentTasks(),
          getReceivedTasks(),
        ])

        // Calculate counts
        const formTemplatesCount = processesRes.data.count || processesRes.data.results.length
        const sentTasksCount = sentTasksRes.data.count || sentTasksRes.data.results.length
        const receivedTasksCount = receivedTasksRes.data.count || receivedTasksRes.data.results.length

        // Calculate pending tasks (tasks with state name "pending")
        const pendingTasksCount = receivedTasksRes.data.results.filter(
          (task: any) => task.state.name === "pending",
        ).length

        setStats({
          formTemplatesCount,
          sentTasksCount,
          receivedTasksCount,
          pendingTasksCount,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium text-destructive">Error loading dashboard</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your task management dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formTemplatesCount}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Tasks</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentTasksCount}</div>
            <p className="text-xs text-muted-foreground">Tasks you've sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Tasks</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.receivedTasksCount}</div>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Tasks awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/forms">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Browse Form Templates
              </Button>
            </Link>
            <Link href="/dashboard/forms/create">
              <Button className="w-full justify-start" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Create New Task
              </Button>
            </Link>
            <Link href="/dashboard/received">
              <Button className="w-full justify-start" variant="outline">
                <Inbox className="mr-2 h-4 w-4" />
                View Received Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest task interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would ideally be populated from an API endpoint for recent activity */}
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recent activity will appear here</p>
                  <p className="text-xs text-muted-foreground">Connect to your activity feed API</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
