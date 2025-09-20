"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Clock, CheckCircle, Users, Calendar, ExternalLink, Activity } from "lucide-react"

export default function DonorHistoryPage() {
  const donationHistory = [
    {
      id: 1,
      organ: "Kidney",
      recipient: "Anonymous Recipient #1247",
      date: "2024-01-20",
      status: "Completed",
      location: "City General Hospital",
      impact: "Life Saved",
      blockchainTx: "0x1a2b3c4d5e6f7890abcdef",
    },
    {
      id: 2,
      organ: "Liver Segment",
      recipient: "Anonymous Recipient #1156",
      date: "2023-11-15",
      status: "Completed",
      location: "Regional Medical Center",
      impact: "Life Saved",
      blockchainTx: "0x2b3c4d5e6f789012bcdefg",
    },
  ]

  const upcomingMatches = [
    {
      id: 1,
      organ: "Cornea",
      urgency: "High",
      estimatedDate: "2024-02-15",
      status: "Pending Confirmation",
      compatibility: "98%",
    },
  ]

  const impactStats = [
    { label: "Lives Saved", value: "2", icon: Heart },
    { label: "Organs Donated", value: "2", icon: Activity },
    { label: "People Helped", value: "2", icon: Users },
    { label: "Years Active", value: "1.2", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Donation History</h1>
          <p className="text-muted-foreground">Track your donation journey and impact on lives</p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="completed">Completed Donations</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="space-y-6">
            <div className="space-y-4">
              {donationHistory.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-primary" />
                          <span>{donation.organ} Donation</span>
                        </CardTitle>
                        <CardDescription>
                          Donated to {donation.recipient} on {donation.date}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Location:</span>
                          <span className="text-sm font-medium">{donation.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <Badge variant="secondary" className="text-success">
                            {donation.impact}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Blockchain TX:</span>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <span className="text-xs font-mono">{donation.blockchainTx.slice(0, 10)}...</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-warning" />
                          <span>{match.organ} Match</span>
                        </CardTitle>
                        <CardDescription>Estimated date: {match.estimatedDate}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-warning border-warning">
                          {match.urgency} Priority
                        </Badge>
                        <Badge variant="secondary">{match.compatibility} Match</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Status: {match.status}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          View Details
                        </Button>
                        <Button size="sm">Confirm Availability</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {upcomingMatches.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Upcoming Matches</h3>
                    <p className="text-muted-foreground">We'll notify you when potential matches are found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Timeline</CardTitle>
                <CardDescription>Your complete donation journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline items */}
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Kidney Donation Completed</p>
                      <p className="text-sm text-muted-foreground">January 20, 2024</p>
                      <p className="text-sm text-muted-foreground">Successfully donated kidney to save a life</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Liver Segment Donation Completed</p>
                      <p className="text-sm text-muted-foreground">November 15, 2023</p>
                      <p className="text-sm text-muted-foreground">Successfully donated liver segment</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Registered as Donor</p>
                      <p className="text-sm text-muted-foreground">October 1, 2023</p>
                      <p className="text-sm text-muted-foreground">Completed registration and verification process</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
