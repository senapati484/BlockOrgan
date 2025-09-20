"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Shield, Bell, Settings, BarChart3, Users, Activity, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getDonorProfile, getRecipientProfile } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"donor" | "recipient" | "admin" | null>(null)
  const [displayName, setDisplayName] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        if (!user) {
          router.push("/login")
          return
        }
        // Try donor then recipient
        const donor = await getDonorProfile(user.uid)
        if (donor) {
          if (!cancelled) {
            setUserRole("donor")
            setDisplayName(`${donor.firstName || ""} ${donor.lastName || ""}`.trim() || (user.displayName || ""))
          }
        } else {
          const recipient = await getRecipientProfile(user.uid)
          if (recipient) {
            if (!cancelled) {
              setUserRole("recipient")
              setDisplayName(`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || (user.displayName || ""))
            }
          } else {
            if (!cancelled) {
              setUserRole("admin")
              setDisplayName(user.displayName || user.email || "User")
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user, router])

  const stats = [
    { label: "Organs Registered", value: "5", icon: Heart, color: "text-primary" },
    { label: "Verification Status", value: "Verified", icon: Shield, color: "text-success" },
    { label: "Active Matches", value: "2", icon: Users, color: "text-warning" },
    { label: "Lives Impacted", value: "12", icon: Activity, color: "text-chart-1" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "verification",
      title: "Biometric verification completed",
      description: "Your identity has been verified on the blockchain",
      time: "2 hours ago",
      icon: Shield,
      color: "text-success",
    },
    {
      id: 2,
      type: "match",
      title: "Potential match found",
      description: "A recipient has been matched for kidney donation",
      time: "1 day ago",
      icon: Heart,
      color: "text-primary",
    },
    {
      id: 3,
      type: "update",
      title: "Profile updated",
      description: "Medical information has been updated",
      time: "3 days ago",
      icon: Settings,
      color: "text-muted-foreground",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>
                {(displayName?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {displayName || "User"}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="capitalize">
                  {userRole || "user"}
                </Badge>
                <Badge variant="outline" className="text-success border-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation Status</CardTitle>
                    <CardDescription>Current status of your organ donation registration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                            <Heart className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">Kidney</p>
                            <p className="text-sm text-muted-foreground">Available for donation</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-success border-success">
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                            <Heart className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">Liver</p>
                            <p className="text-sm text-muted-foreground">Available for donation</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-success border-success">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Verification</CardTitle>
                    <CardDescription>Your donation registration is secured on the blockchain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                        <Shield className="h-5 w-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-success">Fully Verified</p>
                        <p className="text-sm text-muted-foreground">Transaction ID: 0x1a2b3c4d5e6f7890abcdef</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View on Chain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>Track your donation journey and impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No donation history yet</p>
                      <p className="text-sm text-muted-foreground">Your donation activities will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Analytics</CardTitle>
                    <CardDescription>See the impact of your donation registration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Analytics coming soon</p>
                      <p className="text-sm text-muted-foreground">Detailed impact metrics will be available here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted/10`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Manage Donations
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
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
