"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Users, Heart, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserPublicRole } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const { user } = useAuth()
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean>(false)
  const [checking, setChecking] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        if (!user) {
          router.replace("/login")
          return
        }
        const role = await getUserPublicRole(user.uid)
        if (!cancelled) {
          if (role === "admin") setAllowed(true)
          else router.replace("/dashboard")
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    check()
    return () => { cancelled = true }
  }, [user, router])

  if (checking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground">Checking admin access…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!allowed) return null

  const systemStats = [
    { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-primary" },
    { label: "Active Donors", value: "8,234", change: "+8%", icon: Heart, color: "text-success" },
    { label: "Recipients Waiting", value: "4,613", change: "-3%", icon: Clock, color: "text-warning" },
    { label: "Successful Matches", value: "2,156", change: "+15%", icon: CheckCircle, color: "text-chart-1" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "match",
      title: "New Match Created",
      description: "Kidney match between Donor #1247 and Recipient #892",
      timestamp: "2 minutes ago",
      priority: "high",
      icon: Heart,
    },
    {
      id: 2,
      type: "registration",
      title: "New Donor Registration",
      description: "John Smith completed donor registration",
      timestamp: "15 minutes ago",
      priority: "medium",
      icon: Users,
    },
    {
      id: 3,
      type: "verification",
      title: "Blockchain Verification",
      description: "Transaction 0x1a2b3c4d verified successfully",
      timestamp: "1 hour ago",
      priority: "low",
      icon: Shield,
    },
    {
      id: 4,
      type: "alert",
      title: "System Alert",
      description: "High waiting list volume for liver transplants",
      timestamp: "2 hours ago",
      priority: "high",
      icon: AlertTriangle,
    },
  ]

  const matchingQueue = [
    {
      id: 1,
      recipient: "Recipient #892",
      organ: "Kidney",
      urgency: "Critical",
      compatibility: 98,
      waitTime: "347 days",
      potentialDonors: 3,
    },
    {
      id: 2,
      recipient: "Recipient #743",
      organ: "Liver",
      urgency: "High",
      compatibility: 94,
      waitTime: "156 days",
      potentialDonors: 2,
    },
    {
      id: 3,
      recipient: "Recipient #621",
      organ: "Heart",
      urgency: "Critical",
      compatibility: 91,
      waitTime: "89 days",
      potentialDonors: 1,
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "critical",
      title: "Server Performance",
      description: "High CPU usage detected on matching algorithm server",
      timestamp: "5 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Waiting List Alert",
      description: "Liver waiting list has exceeded capacity threshold",
      timestamp: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      title: "Scheduled Maintenance",
      description: "Blockchain sync maintenance scheduled for tonight",
      timestamp: "3 hours ago",
    },
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-destructive text-destructive"
      case "warning":
        return "border-warning text-warning"
      case "info":
        return "border-primary text-primary"
      default:
        return "border-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      case "low":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="outline" className="text-success border-success">
              <Activity className="h-3 w-3 mr-1" />
              System Healthy
            </Badge>
            <Button variant="outline" size="sm" className="bg-transparent">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.filter((alert) => alert.type === "critical").length > 0 && (
          <Alert className="mb-8 border-destructive">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>Critical system alerts require immediate attention.</strong> Please review the alerts section.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon
            const isPositive = stat.change.startsWith("+")
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-xs ${isPositive ? "text-success" : "text-destructive"} flex items-center mt-1`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="matching" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="matching">Matching Queue</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="matching" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Matching Queue</CardTitle>
                    <CardDescription>Recipients requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {matchingQueue.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Heart className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.recipient}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.organ} • {item.waitTime} waiting
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{item.compatibility}% Match</p>
                              <p className="text-xs text-muted-foreground">{item.potentialDonors} donors</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                item.urgency === "Critical"
                                  ? "text-destructive border-destructive"
                                  : "text-warning border-warning"
                              }
                            >
                              {item.urgency}
                            </Badge>
                            <Button size="sm">Review</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>Real-time system events and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const Icon = activity.icon
                        return (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted/10`}>
                              <Icon className={`h-4 w-4 ${getPriorityColor(activity.priority)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(activity.priority)} border-current`}
                            >
                              {activity.priority}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Match Success Rate</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Rate</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                        <p className="text-xs text-muted-foreground">+5% from previous month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Average Wait Time</CardTitle>
                      <CardDescription>By organ type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Kidney</span>
                          <span>156 days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Liver</span>
                          <span>89 days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Heart</span>
                          <span>234 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>User distribution by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>North America</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Europe</span>
                          <span>32%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Asia</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Other</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Alerts & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Critical system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <Badge variant="outline" className={getAlertColor(alert.type)}>
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-90">{alert.description}</p>
                      <p className="text-xs opacity-70 mt-1">{alert.timestamp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Review Matches
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Blockchain Audit
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Server Uptime</span>
                    <span className="text-success">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span className="text-success">Optimal</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Blockchain Sync</span>
                    <span className="text-success">Synced</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
