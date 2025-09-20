"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Heart, Clock, MoreHorizontal, Eye, Edit, AlertCircle } from "lucide-react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      role: "donor",
      status: "verified",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      organsRegistered: 5,
      matches: 2,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      role: "recipient",
      status: "verified",
      joinDate: "2024-01-10",
      lastActive: "1 day ago",
      organNeeded: "Kidney",
      waitingDays: 45,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Dr. Michael Johnson",
      email: "m.johnson@hospital.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-01",
      lastActive: "30 minutes ago",
      permissions: "Full Access",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      role: "donor",
      status: "pending",
      joinDate: "2024-01-20",
      lastActive: "5 hours ago",
      organsRegistered: 3,
      matches: 0,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert.brown@email.com",
      role: "recipient",
      status: "suspended",
      joinDate: "2023-11-15",
      lastActive: "1 week ago",
      organNeeded: "Liver",
      waitingDays: 120,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const userStats = [
    { label: "Total Users", value: "12,847", icon: Users, color: "text-primary" },
    { label: "Active Donors", value: "8,234", icon: Heart, color: "text-success" },
    { label: "Recipients Waiting", value: "4,613", icon: Clock, color: "text-warning" },
    { label: "Pending Verification", value: "156", icon: AlertCircle, color: "text-destructive" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="text-success border-success">
            Verified
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="text-primary border-primary">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-warning border-warning">
            Pending
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="text-destructive border-destructive">
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "donor":
        return <Badge variant="secondary">Donor</Badge>
      case "recipient":
        return <Badge variant="secondary">Recipient</Badge>
      case "admin":
        return <Badge variant="secondary">Admin</Badge>
      default:
        return <Badge variant="secondary">User</Badge>
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage donors, recipients, and system administrators</p>
          </div>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="donor">Donors</SelectItem>
                  <SelectItem value="recipient">Recipients</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.role === "donor" && (
                          <div className="text-sm">
                            <p>{user.organsRegistered} organs registered</p>
                            <p className="text-muted-foreground">{user.matches} matches</p>
                          </div>
                        )}
                        {user.role === "recipient" && (
                          <div className="text-sm">
                            <p>Needs: {user.organNeeded}</p>
                            <p className="text-muted-foreground">{user.waitingDays} days waiting</p>
                          </div>
                        )}
                        {user.role === "admin" && (
                          <div className="text-sm">
                            <p>{user.permissions}</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{user.lastActive}</p>
                          <p className="text-muted-foreground">Joined {user.joinDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
