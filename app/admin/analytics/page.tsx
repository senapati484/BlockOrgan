"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Heart, Clock, Download } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("overview")

  const overviewStats = [
    { 
      label: "Total Registrations", 
      value: "12,847", 
      change: "+12%", 
      trend: "up",
      icon: Users, 
      color: "text-primary" 
    },
    { 
      label: "Successful Matches", 
      value: "2,156", 
      change: "+15%", 
      trend: "up",
      icon: Heart, 
      color: "text-success" 
    },
    { 
      label: "Average Wait Time", 
      value: "156 days", 
      change: "-8%", 
      trend: "down",
      icon: Clock, 
      color: "text-warning" 
    },
    { 
      label: "Success Rate", 
      value: "87%", 
      change: "+3%", 
      trend: "up",
      icon: TrendingUp, 
      color: "text-chart-1" 
    },
  ]

  const organStats = [
    { organ: "Kidney", waiting: 2847, donated: 1234, successRate: 89, avgWait: 156 },
    { organ: "Liver", waiting: 1456, donated: 678, successRate: 85, avgWait: 89 },
    { organ: "Heart", waiting: 234, donated: 89, successRate: 92, avgWait: 234 },
    { organ: "Lungs", waiting: 156, donated: 45, successRate: 78, avgWait: 298 },
    { organ: "Pancreas", waiting: 89, donated: 23, successRate: 81, avgWait: 187 },
  ]

  const geographicData = [
    { region: "North America", users: 5789, matches: 1234, percentage: 45 },
    { region: "Europe", users: 4123, matches: 892, percentage: 32 },
    { region: "Asia", users: 2314, matches: 456, percentage: 18 },
    { region: "Other", users: 621, matches: 123, percentage: 5 },
  ]

  const monthlyTrends = [
    { month: "Jan", registrations: 1200, matches: 234, successRate: 85 },
    { month: "Feb", registrations: 1350, matches: 267, successRate: 87 },
    { month: "Mar", registrations: 1180, matches: 245, successRate: 86 },
    { month: "Apr", registrations: 1420, matches: 289, successRate: 88 },
    { month: "May", registrations: 1380, matches: 298, successRate: 89 },
    { month: "Jun", registrations: 1450, matches: 312, successRate: 87 },
  ]

  const blockchainMetrics = [
    { metric: "Total Transactions", value: "45,678", change: "+234 today" },
    { metric: "Verification Time", value: "2.3s", change: "avg" },
    { metric: "Network Uptime", value: "99.9%", change: "last 30 days" },
    { metric: "Gas Efficiency", value: "0.02 ETH", change: "avg per tx" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">System performance and usage analytics</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
            const trendColor = stat.trend === 'up' ? 'text-success' : 'text-destructive'
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-xs ${trendColor} flex items-center mt-1`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {stat.change} from last period
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="organs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organs">Organ Analytics</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="organs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organ-Specific Analytics</CardTitle>
                <CardDescription>Performance metrics by organ type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {organStats.map((organ, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{organ.organ}</h3>
                        <Badge variant="secondary">{organ.successRate}% Success Rate</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Waiting List</p>
                          <p className="font-medium">{organ.waiting.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Donated</p>
                          <p className="font-medium">{organ.donated.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{organ.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg. Wait</p>
                          <p className="font-medium">{organ.avgWait} days</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Demand vs Supply</span>
                          <span>{Math.round((organ.donated / organ.waiting) * 100)}% fulfilled</span>
                        </div>
                        <Progress value={(organ.donated / organ.waiting) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Users by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((region, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{region.region}</span>
                          <span className="text-sm text-muted-foreground">{region.users.toLocaleString()} users</span>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{region.percentage}% of total</span>
                          <span>{region.matches.toLocaleString()} matches</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Success rates by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((region, index) => {
                      const successRate = Math.round((region.matches / region.users) * 100 * 4.5) // Simulated success rate
                      return (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{region.region}</p>
                            <p className="text-sm text-muted-foreground">{region.matches} successful matches</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{successRate}%</p>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Registration and matching trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">8,280</p>
                      <p className="text-sm text-muted-foreground">Total Registrations</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">1,645</p>
                      <p className="text-sm text-muted-foreground">Total Matches</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">87%</p>
                      <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {monthlyTrends.map((month, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{month.month}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Registrations</p>
                          <p className="font-medium">{month.registrations.toLocaleString()}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Matches</p>
                          <p className="font-medium">{month.matches.toLocaleString()}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{month.successRate}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Metrics</CardTitle>
                  <CardDescription>Network performance and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blockchainMetrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{metric.metric}</p>
                          <p className="text-sm text-muted-foreground">{metric.change}</p>
                        </div>
                        <p className="text-xl font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Types</CardTitle>
                  <CardDescription>Breakdown of blockchain transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User Registrations</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Match Verifications</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Profile Updates</span>
                        <span>8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>System Operations</span>
                        <span>2%</span>
                      </div>
                      <Progress value={2} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Real-time blockchain network status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-success">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center p-4\
