"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Loader2 } from "lucide-react"
import { getReceivedTasks } from "@/lib/api-service"
import { formatDateToUTC7 } from "@/lib/utils"

interface Task {
  id: number
  title: string
  process: {
    name: string
  }
  state: string
  state_type: string
  created_at: string
  created_by: string
  action?: string
}

export default function ReceivedTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReceivedTasks()
  }, [])

  const fetchReceivedTasks = async () => {
    setIsLoading(true)
    try {
      const response = await getReceivedTasks()
      setTasks(response.data.results)
    } catch (err: any) {
      console.error("Error fetching received tasks:", err)
      setError(err.response?.data?.error || "Failed to load received tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.created_by.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (stateType: string) => {
    switch (stateType) {
      case "pending approve":
        return "bg-yellow-100 text-yellow-800"
      case "analyze":
        return "bg-blue-100 text-blue-800"
      case "working":
        return "bg-indigo-100 text-indigo-800"
      case "pending review":
        return "bg-purple-100 text-purple-800"
      case "start":
        return "bg-gray-100 text-gray-800"
      case "denied":
        return "bg-red-100 text-red-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Received Tasks</h1>
        <p className="text-muted-foreground mt-2">View and complete tasks assigned to you</p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading received tasks...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-destructive">Error loading tasks</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchReceivedTasks}>
            Try Again
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Form Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/task/${task.id}`} className="hover:underline">
                        {task.title}
                      </Link>
                    </TableCell>
                    <TableCell>{task.created_by}</TableCell>
                    <TableCell>{task.process.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.state_type)}>
                        {task.state}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateToUTC7(task.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/dashboard/task/${task.id}`}>View Details</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground mt-2">You don't have any tasks assigned to you.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
