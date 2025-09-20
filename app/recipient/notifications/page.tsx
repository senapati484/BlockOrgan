"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Bell, Users, CheckCircle, AlertCircle, Calendar, ExternalLink, Trash2 } from "lucide-react"

export default function RecipientNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "match",
      priority: "critical",
      title: "Potential Match Found",
      description: "A compatible kidney has been identified. Please contact your care team immediately.",
      timestamp: "2024-01-25 14:30:00",
      read: false,
      actionRequired: true,
      blockchainTx: "0x1a2b3c4d5e6f7890",
    },
    {
      id: 2,
      type: "position",
      priority: "high",
      title: "Position Updated",
      description: "You've moved up 3 positions on the waiting list to position #47.",
      timestamp: "2024-01-24 09:15:00",
      read: false,
      actionRequired: false,
      blockchainTx: "0x2b3c4d5e6f789012",
    },
    {
      id: 3,
      type: "medical",
      priority: "medium",
      title: "Medical Review Scheduled",
      description: "Your routine medical evaluation is scheduled for February 1st at 10:00 AM.",
      timestamp: "2024-01-23 16:45:00",
      read: true,
      actionRequired: true,
      blockchainTx: null,
    },
    {
      id: 4,
      type: "system",
      priority: "low",
      title: "Profile Verified",
      description: "Your medical information has been successfully verified on the blockchain.",
      timestamp: "2024-01-22 11:20:00",
      read: true,
      actionRequired: false,
      blockchainTx: "0x3c4d5e6f78901234",
    },
    {
      id: 5,
      type: "education",
      priority: "low",
      title: "New Educational Resource",
      description: "A new guide about post-transplant care is now available in your resource library.",
      timestamp: "2024-01-21 13:10:00",
      read: true,
      actionRequired: false,
      blockchainTx: null,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return Heart
      case "position":
        return Users
      case "medical":
        return Calendar
      case "system":
        return CheckCircle
      case "education":
        return Bell
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-destructive border-destructive"
      case "high":
        return "text-warning border-warning"
      case "medium":
        return "text-primary border-primary"
      case "low":
        return "text-muted-foreground border-muted-foreground"
      default:
        return "text-muted-foreground border-muted-foreground"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critical" && !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your transplant journey</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="outline" className="text-primary border-primary">
              {unreadCount} Unread
            </Badge>
            {criticalCount > 0 && (
              <Badge variant="outline" className="text-destructive border-destructive">
                {criticalCount} Critical
              </Badge>
            )}
          </div>
        </div>

        {/* Critical Alert */}
        {criticalCount > 0 && (
          <Alert className="mb-8 border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>Critical notifications require immediate attention.</strong> Please review and take necessary
              actions.
            </AlertDescription>
          </Alert>
        )}

        {/* Notifications */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              return (
                <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon
                            className={`h-5 w-5 ${notification.priority === "critical" ? "text-destructive" : "text-primary"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <CardTitle className="text-lg">{notification.title}</CardTitle>
                            {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                          </div>
                          <CardDescription>{notification.description}</CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark as Read
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-warning border-warning">
                            Action Required
                          </Badge>
                        )}
                        {notification.blockchainTx && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span>Blockchain TX:</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                              <span className="font-mono">{notification.blockchainTx.slice(0, 10)}...</span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {notification.actionRequired && <Button size="sm">Take Action</Button>}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications
              .filter((n) => !n.read)
              .map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <Card key={notification.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted/10`}>
                            <Icon
                              className={`h-5 w-5 ${notification.priority === "critical" ? "text-destructive" : "text-primary"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <CardTitle className="text-lg">{notification.title}</CardTitle>
                              <div className="h-2 w-2 bg-primary rounded-full" />
                            </div>
                            <CardDescription>{notification.description}</CardDescription>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          Mark as Read
                        </Button>
                      </div>
                    </CardHeader>
                    {notification.actionRequired && (
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-warning border-warning">
                            Action Required
                          </Badge>
                          <Button size="sm">Take Action</Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            {notifications.filter((n) => !n.read).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">You have no unread notifications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            {notifications
              .filter((n) => n.type === "match")
              .map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{notification.title}</span>
                            {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                          </CardTitle>
                          <CardDescription>{notification.description}</CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-destructive border-destructive">
                              Critical
                            </Badge>
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-warning border-warning">
                          Action Required
                        </Badge>
                        <Button size="sm">Contact Care Team</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            {notifications
              .filter((n) => n.type === "medical")
              .map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{notification.title}</span>
                            {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                          </CardTitle>
                          <CardDescription>{notification.description}</CardDescription>
                          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            {notifications
              .filter((n) => n.type === "system")
              .map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon className="h-5 w-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{notification.title}</span>
                            {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                          </CardTitle>
                          <CardDescription>{notification.description}</CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            {notification.blockchainTx && (
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <span className="text-xs font-mono">{notification.blockchainTx.slice(0, 10)}...</span>
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
