"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Users,
  Heart,
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity,
  Bell,
  Settings,
  ExternalLink,
} from "lucide-react"

export default function RecipientStatusPage() {
  const [waitingListPosition] = useState(47)
  const [estimatedWaitTime] = useState("6-12 months")
  const [urgencyLevel] = useState("High")
  const [organNeeded] = useState("Kidney")

  const statusStats = [
    { label: "Waiting List Position", value: `#${waitingListPosition}`, icon: Users, color: "text-primary" },
    { label: "Estimated Wait Time", value: estimatedWaitTime, icon: Clock, color: "text-warning" },
    { label: "Urgency Level", value: urgencyLevel, icon: AlertCircle, color: "text-destructive" },
    { label: "Days on List", value: "45", icon: Calendar, color: "text-chart-1" },
  ]

  const recentNotifications = [
    {
      id: 1,
      type: "status",
      title: "Position Updated",
      description: "You've moved up 3 positions on the waiting list",
      time: "2 hours ago",
      icon: Users,
      color: "text-success",
    },
    {
      id: 2,
      type: "medical",
      title: "Medical Review Scheduled",
      description: "Routine medical evaluation scheduled for next week",
      time: "1 day ago",
      icon: Calendar,
      color: "text-primary",
    },
    {
      id: 3,
      type: "system",
      title: "Profile Verified",
      description: "Your medical information has been verified on blockchain",
      time: "3 days ago",
      icon: CheckCircle,
      color: "text-success",
    },
  ]

  const compatibilityFactors = [
    { factor: "Blood Type", status: "Compatible", score: 100 },
    { factor: "Tissue Match", status: "Good", score: 85 },
    { factor: "Size Match", status: "Excellent", score: 95 },
    { factor: "Geographic", status: "Regional", score: 70 },
  ]

  const waitingListProgress = (waitingListPosition / 100) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="text-lg">JS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Jane Smith</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">Recipient</Badge>
                <Badge variant="outline" className="text-warning border-warning">
                  <Clock className="h-3 w-3 mr-1" />
                  Waiting
                </Badge>
                <Badge variant="outline" className="text-destructive border-destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {urgencyLevel} Priority
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Alert */}
        <Alert className="mb-8">
          <Heart className="h-4 w-4" />
          <AlertDescription>
            <strong>Active on waiting list</strong> - You are currently position #{waitingListPosition} for{" "}
            {organNeeded.toLowerCase()} transplant. We'll notify you immediately when a compatible match is found.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statusStats.map((stat, index) => {
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Status & Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Waiting List Status</CardTitle>
                <CardDescription>Your current position and estimated timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Position #{waitingListPosition} of ~150</span>
                    <span>{Math.round(100 - waitingListProgress)}% ahead of you</span>
                  </div>
                  <Progress value={100 - waitingListProgress} className="h-3" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="font-medium">Estimated Wait</span>
                    </div>
                    <p className="text-2xl font-bold text-warning">{estimatedWaitTime}</p>
                    <p className="text-sm text-muted-foreground">Based on current position and organ availability</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="font-medium">Organ Needed</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{organNeeded}</p>
                    <p className="text-sm text-muted-foreground">Primary organ for transplantation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compatibility Factors</CardTitle>
                <CardDescription>Factors affecting your match probability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compatibilityFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{factor.factor}</p>
                        <p className="text-sm text-muted-foreground">{factor.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${factor.score}%` }} />
                        </div>
                        <span className="text-sm font-medium">{factor.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Waiting List Timeline</CardTitle>
                    <CardDescription>Your journey on the waiting list</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Added to Waiting List</p>
                          <p className="text-sm text-muted-foreground">January 15, 2024</p>
                          <p className="text-sm text-muted-foreground">Successfully registered and verified</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Medical Evaluation Completed</p>
                          <p className="text-sm text-muted-foreground">January 20, 2024</p>
                          <p className="text-sm text-muted-foreground">Comprehensive medical assessment completed</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                          <Clock className="h-5 w-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Position Updated</p>
                          <p className="text-sm text-muted-foreground">Today</p>
                          <p className="text-sm text-muted-foreground">
                            Moved up 3 positions to #{waitingListPosition}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                    <CardDescription>Your current medical status and requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Blood Type</p>
                          <p className="font-medium">O+</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Urgency Level</p>
                          <Badge variant="outline" className="text-destructive border-destructive">
                            {urgencyLevel}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Primary Diagnosis</p>
                        <p className="font-medium">End-stage renal disease requiring kidney transplant</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Primary Care Team</p>
                        <p className="font-medium">Dr. Johnson - City General Hospital</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Notifications & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates about your status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotifications.map((notification) => {
                    const Icon = notification.icon
                    return (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon className={`h-4 w-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Medical Info
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Blockchain Record
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Patient Support Groups
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Financial Assistance
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Transplant Education
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Contact Care Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
