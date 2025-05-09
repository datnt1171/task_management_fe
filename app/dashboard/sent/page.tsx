"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Plus } from "lucide-react"

// Mock data for sent tasks
const sentTasks = [
  {
    id: 1,
    title: "Weekly Project Update",
    recipient: "John Doe",
    sentDate: "2023-05-08",
    status: "Completed",
    formType: "Project Update",
  },
  {
    id: 2,
    title: "Q1 Expense Report",
    recipient: "Jane Smith",
    sentDate: "2023-05-05",
    status: "Pending",
    formType: "Expense Report",
  },
  {
    id: 3,
    title: "Bug Report #1242",
    recipient: "Alex Johnson",
    sentDate: "2023-05-03",
    status: "In Progress",
    formType: "Bug Report",
  },
  {
    id: 4,
    title: "Client Feedback - Acme Corp",
    recipient: "Sarah Williams",
    sentDate: "2023-04-28",
    status: "Completed",
    formType: "Client Feedback",
  },
  {
    id: 5,
    title: "Performance Review - Q1",
    recipient: "Michael Brown",
    sentDate: "2023-04-15",
    status: "Completed",
    formType: "Performance Review",
  },
]

export default function SentTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = sentTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.formType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sent Tasks</h1>
          <p className="text-muted-foreground mt-2">View and manage tasks you've sent to others</p>
        </div>
        <Link href="/dashboard/forms">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
          </Button>
        </Link>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Sent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Form Type</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>{task.recipient}</TableCell>
                  <TableCell>{task.formType}</TableCell>
                  <TableCell>{new Date(task.sentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
              <p className="text-muted-foreground mt-2">Try adjusting your search or create a new task.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
