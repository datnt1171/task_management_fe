"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Clock } from "lucide-react"

// Mock data for received tasks
const receivedTasks = [
  {
    id: 101,
    title: "Monthly Team Report",
    sender: "Sarah Williams",
    receivedDate: "2023-05-08",
    dueDate: "2023-05-15",
    status: "Pending",
    formType: "Team Report",
  },
  {
    id: 102,
    title: "Client Onboarding - XYZ Corp",
    sender: "Michael Brown",
    receivedDate: "2023-05-06",
    dueDate: "2023-05-12",
    status: "In Progress",
    formType: "Client Onboarding",
  },
  {
    id: 103,
    title: "Software Requirements Review",
    sender: "John Doe",
    receivedDate: "2023-05-04",
    dueDate: "2023-05-10",
    status: "Pending",
    formType: "Requirements Review",
  },
  {
    id: 104,
    title: "Marketing Campaign Feedback",
    sender: "Jane Smith",
    receivedDate: "2023-04-30",
    dueDate: "2023-05-05",
    status: "Overdue",
    formType: "Feedback Form",
  },
  {
    id: 105,
    title: "Weekly Status Update",
    sender: "Alex Johnson",
    receivedDate: "2023-04-28",
    dueDate: "2023-04-30",
    status: "Completed",
    formType: "Status Update",
  },
]

export default function ReceivedTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = receivedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      case "Overdue":
        return "bg-red-100 text-red-800"
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
                <TableHead>Due Date</TableHead>
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
                  <TableCell>{task.sender}</TableCell>
                  <TableCell>{task.formType}</TableCell>
                  <TableCell className="flex items-center">
                    {task.status === "Overdue" ? (
                      <>
                        <Clock className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500">{new Date(task.dueDate).toLocaleDateString()}</span>
                      </>
                    ) : (
                      new Date(task.dueDate).toLocaleDateString()
                    )}
                  </TableCell>
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
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                        <DropdownMenuItem>Request Extension</DropdownMenuItem>
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
              <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
