"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, CheckCircle, X, AlertTriangle, Clock, Activity, TrendingUp, Shield, ExternalLink } from "lucide-react"

export default function AdminMatchingPage() {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)

  const pendingMatches = [
    {
      id: 1,
      recipient: {
        id: "R-892",
        name: "Anonymous Recipient",
        age: 45,
        bloodType: "O+",
        organ: "Kidney",
        urgency: "Critical",
        waitTime: 347,
        location: "New York, NY",
      },
      donor: {
        id: "D-1247",
        name: "Anonymous Donor",
        age: 38,
        bloodType: "O+",
        location: "New York, NY",
      },
      compatibility: {
        blood: 100,
        tissue: 94,
        size: 98,
        geographic: 95,
        overall: 97,
      },
      riskFactors: ["Age difference: 7 years"],
      estimatedSuccess: 94,
      timeRemaining: "4 hours",
      priority: "critical",
    },
    {
      id: 2,
      recipient: {
        id: "R-743",
        name: "Anonymous Recipient",
        age: 52,
        bloodType: "A+",
        organ: "Liver",
        urgency: "High",
        waitTime: 156,
        location: "Los Angeles, CA",
      },
      donor: {
        id: "D-891",
        name: "Anonymous Donor",
        age: 41,
        bloodType: "A+",
        location: "San Francisco, CA",
      },
      compatibility: {
        blood: 100,
        tissue: 89,
        size: 92,
        geographic: 78,
        overall: 90,
      },
      riskFactors: ["Geographic distance: 380 miles"],
      estimatedSuccess: 87,
      timeRemaining: "12 hours",
      priority: "high",
    },
    {
      id: 3,
      recipient: {
        id: "R-621",
        name: "Anonymous Recipient",
        age: 34,
        bloodType: "B-",
        organ: "Heart",
        urgency: "Critical",
        waitTime: 89,
        location: "Chicago, IL",
      },
      donor: {
        id: "D-456",
        name: "Anonymous Donor",
        age: 29,
        bloodType: "B-",
        location: "Chicago, IL",
      },
      compatibility: {
        blood: 100,
        tissue: 91,
        size: 96,
        geographic: 100,
        overall: 96,
      },
      riskFactors: [],
      estimatedSuccess: 96,
      timeRemaining: "2 hours",
      priority: "critical",
    },
  ]

  const matchingStats = [
    { label: "Pending Matches", value: "12", icon: Clock, color: "text-warning" },
    { label: "Approved Today", value: "8", icon: CheckCircle, color: "text-success" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-primary" },
    { label: "Avg. Match Time", value: "6.2h", icon: Activity, color: "text-chart-1" },
  ]

  const recentDecisions = [
    {
      id: 1,
      matchId: "M-1234",
      recipient: "R-567",
      donor: "D-890",
      organ: "Kidney",
      decision: "approved",
      timestamp: "2 hours ago",
      admin: "Dr. Johnson",
    },
    {
      id: 2,
      matchId: "M-1235",
      recipient: "R-234",
      donor: "D-567",
      organ: "Liver",
      decision: "rejected",
      timestamp: "4 hours ago",
      admin: "Dr. Smith",
      reason: "Geographic distance too high",
    },
    {
      id: 3,
      matchId: "M-1236",
      recipient: "R-789",
      donor: "D-123",
      organ: "Heart",
      decision: "approved",
      timestamp: "6 hours ago",
      admin: "Dr. Johnson",
    },
  ]

  const handleApproveMatch = (matchId: number) => {
    console.log(`Approving match ${matchId}`)
    // Handle approval logic
  }

  const handleRejectMatch = (matchId: number) => {
    console.log(`Rejecting match ${matchId}`)
    // Handle rejection logic
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-destructive border-destructive"
      case "high":
        return "text-warning border-warning"
      case "medium":
        return "text-primary border-primary"
      default:
        return "text-muted-foreground border-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Matching Interface</h1>
            <p className="text-muted-foreground">Review and approve organ matches</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="outline" className="text-warning border-warning">
              <Clock className="h-3 w-3 mr-1" />
              {pendingMatches.length} Pending
            </Badge>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Activity className="h-4 w-4 mr-2" />
              Algorithm Settings
            </Button>
          </div>
        </div>

        {/* Critical Alert */}
        {pendingMatches.filter((m) => m.priority === "critical").length > 0 && (
          <Alert className="mb-8 border-destructive">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>{pendingMatches.filter((m) => m.priority === "critical").length} critical matches</strong> require
              immediate review. Time-sensitive decisions needed.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {matchingStats.map((stat, index) => {
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
          {/* Left Column - Pending Matches */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Matches</CardTitle>
                <CardDescription>Matches requiring administrative review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMatches.map((match) => (
                    <div
                      key={match.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMatch === match.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedMatch(match.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Heart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{match.recipient.organ} Match</p>
                            <p className="text-sm text-muted-foreground">
                              {match.recipient.id} ↔ {match.donor.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPriorityColor(match.priority)}>
                            {match.recipient.urgency}
                          </Badge>
                          <Badge variant="secondary">{match.compatibility.overall}% Match</Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Recipient</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Age: {match.recipient.age} • {match.recipient.bloodType}
                            </p>
                            <p>Waiting: {match.recipient.waitTime} days</p>
                            <p>Location: {match.recipient.location}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Donor</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Age: {match.donor.age} • {match.donor.bloodType}
                            </p>
                            <p>Location: {match.donor.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Success Rate: </span>
                            <span className="font-medium text-success">{match.estimatedSuccess}%</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Time Left: </span>
                            <span className="font-medium text-warning">{match.timeRemaining}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRejectMatch(match.id)
                            }}
                            className="bg-transparent"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApproveMatch(match.id)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Match Details & Recent Decisions */}
          <div className="space-y-6">
            {selectedMatch && (
              <Card>
                <CardHeader>
                  <CardTitle>Match Details</CardTitle>
                  <CardDescription>Detailed compatibility analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const match = pendingMatches.find((m) => m.id === selectedMatch)
                    if (!match) return null

                    return (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Blood Type</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={match.compatibility.blood} className="w-16 h-2" />
                              <span className="text-sm font-medium">{match.compatibility.blood}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Tissue Match</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={match.compatibility.tissue} className="w-16 h-2" />
                              <span className="text-sm font-medium">{match.compatibility.tissue}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Size Match</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={match.compatibility.size} className="w-16 h-2" />
                              <span className="text-sm font-medium">{match.compatibility.size}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Geographic</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={match.compatibility.geographic} className="w-16 h-2" />
                              <span className="text-sm font-medium">{match.compatibility.geographic}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Risk Factors</p>
                          {match.riskFactors.length > 0 ? (
                            <div className="space-y-1">
                              {match.riskFactors.map((risk, index) => (
                                <p key={index} className="text-sm text-warning">
                                  {risk}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-success">No significant risk factors identified</p>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Overall Compatibility</span>
                            <span className="text-2xl font-bold text-primary">{match.compatibility.overall}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Decisions</CardTitle>
                <CardDescription>Latest matching decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDecisions.map((decision) => (
                    <div key={decision.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{decision.organ} Match</p>
                          <p className="text-xs text-muted-foreground">{decision.matchId}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            decision.decision === "approved"
                              ? "text-success border-success"
                              : "text-destructive border-destructive"
                          }
                        >
                          {decision.decision}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>
                          By {decision.admin} • {decision.timestamp}
                        </p>
                        {decision.reason && <p className="mt-1">{decision.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Match on Chain
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Transaction History
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
