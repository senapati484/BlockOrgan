"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Shield, Bell, Settings, BarChart3, Users, Activity, Calendar, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getDonorProfile, getRecipientProfile, countOrgansRegistered, countActiveMatchesForUser, listActiveMatchesForUser } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"donor" | "recipient" | "admin" | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [organsCount, setOrgansCount] = useState<number>(0)
  const [activeMatches, setActiveMatches] = useState<number>(0)
  const [statsLoading, setStatsLoading] = useState<boolean>(true)
  const [matching, setMatching] = useState<boolean>(false)
  const [donorProfile, setDonorProfile] = useState<any | null>(null)
  const [recipientProfile, setRecipientProfile] = useState<any | null>(null)
  const [activeMatchList, setActiveMatchList] = useState<any[]>([])
  const [verified, setVerified] = useState<boolean | null>(null)
  const [verifyTx, setVerifyTx] = useState<string | null>(null)
  const explorerBase = process.env.NEXT_PUBLIC_AVALANCHE_EXPLORER_BASE as string | undefined

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        if (!user) {
          router.push("/login")
          return
        }
        // Try donor then recipient
        let roleDetected: "donor" | "recipient" | "admin" = "admin"
        const donor = await getDonorProfile(user.uid)
        if (donor) {
          if (!cancelled) {
            setUserRole("donor")
            setDisplayName(`${donor.firstName || ""} ${donor.lastName || ""}`.trim() || (user.displayName || ""))
            setDonorProfile(donor)
            roleDetected = "donor"
          }
        } else {
          const recipient = await getRecipientProfile(user.uid)
          if (recipient) {
            if (!cancelled) {
              setUserRole("recipient")
              setDisplayName(`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || (user.displayName || ""))
              setRecipientProfile(recipient)
              roleDetected = "recipient"
            }
          } else {
            if (!cancelled) {
              setUserRole("admin")
              setDisplayName(user.displayName || user.email || "User")
              roleDetected = "admin"
            }
          }
        }
        // Register/update minimal user record
        try {
          const res = await fetch('/api/users/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid, email: user.email, role: roleDetected }) })
          const data = await res.json().catch(() => ({} as any))
          if (!cancelled) {
            if (data && typeof data.onChain === 'boolean') setVerified(data.onChain)
            if (data && typeof data.txHash === 'string') setVerifyTx(data.txHash)
          }
        } catch (e) {
          console.warn('user register failed', e)
        }
        // Fallback: verify via API if unknown
        if (!cancelled && verified === null) {
          try {
            const vres = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid }) })
            const vdata = await vres.json().catch(() => ({} as any))
            if (typeof vdata.exists === 'boolean') setVerified(vdata.exists)
          } catch (e) {
            console.warn('verify failed', e)
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

  // Fetch dashboard stats once we know the user
  useEffect(() => {
    let cancelled = false
    async function loadStats() {
      if (!user) return
      try {
        setStatsLoading(true)
        const [orgCount, matchCount, matchList] = await Promise.all([
          countOrgansRegistered(user.uid),
          countActiveMatchesForUser(user.uid),
          listActiveMatchesForUser(user.uid),
        ])
        if (!cancelled) {
          setOrgansCount(orgCount)
          setActiveMatches(matchCount)
          setActiveMatchList(matchList)
        }
      } catch (e) {
        console.error("Dashboard stats error", e)
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    }
    loadStats()
    return () => {
      cancelled = true
    }
  }, [user])

  // Trigger per-user matching on load
  useEffect(() => {
    let cancelled = false
    async function triggerMatch() {
      if (!user) return
      try {
        setMatching(true)
        await fetch("/api/match/for-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        })
        // Refresh stats after matching
        const [orgCount, matchCount, matchList] = await Promise.all([
          countOrgansRegistered(user.uid),
          countActiveMatchesForUser(user.uid),
          listActiveMatchesForUser(user.uid),
        ])
        if (!cancelled) {
          setOrgansCount(orgCount)
          setActiveMatches(matchCount)
          setActiveMatchList(matchList)
        }
      } catch (e) {
        console.error("trigger match error", e)
      } finally {
        if (!cancelled) setMatching(false)
      }
    }
    triggerMatch()
    return () => { cancelled = true }
  }, [user])

  const stats = [
    { label: "Organs Registered", value: statsLoading ? "—" : String(organsCount), icon: Heart, color: "text-primary" },
    { label: "Verification Status", value: verified === null ? "Checking…" : verified ? "Verified" : "Not Verified", icon: Shield, color: verified ? "text-success" : "text-destructive" },
    { label: "Active Matches", value: statsLoading ? "—" : String(activeMatches), icon: Users, color: "text-warning" },
    { label: "Lives Impacted", value: statsLoading ? "—" : String(activeMatches), icon: Activity, color: "text-chart-1" },
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
                <Badge variant={verified ? "outline" : "destructive"} className={verified ? "text-success border-success" : ""}>
                  <Shield className="h-3 w-3 mr-1" />
                  {verified === null ? "Checking…" : verified ? "Verified" : "Not Verified"}
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
            <Button variant="default" size="sm" onClick={async () => {
              if (!user) return
              setMatching(true)
              try {
                await fetch("/api/match/for-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid: user.uid }) })
                const [orgCount, matchCount, matchList] = await Promise.all([
                  countOrgansRegistered(user.uid),
                  countActiveMatchesForUser(user.uid),
                  listActiveMatchesForUser(user.uid),
                ])
                setOrgansCount(orgCount)
                setActiveMatches(matchCount)
                setActiveMatchList(matchList)
              } finally {
                setMatching(false)
              }
            }} title="Find Matches">
              {matching ? "Matching..." : "Find Matches"}
            </Button>
            <Button variant="outline" size="icon" onClick={signOut} title="Logout">
              <LogOut className="h-4 w-4" />
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
                      {userRole === "donor" && Array.isArray(donorProfile?.organs) && donorProfile.organs.length > 0 && (
                        donorProfile.organs.map((org: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                                <Heart className="h-4 w-4 text-success" />
                              </div>
                              <div>
                                <p className="font-medium">{String(org).charAt(0).toUpperCase() + String(org).slice(1)}</p>
                                <p className="text-sm text-muted-foreground">Available for donation</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-success border-success">Active</Badge>
                          </div>
                        ))
                      )}

                      {userRole === "recipient" && (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                              <Heart className="h-4 w-4 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{recipientProfile?.organNeeded ? String(recipientProfile.organNeeded).charAt(0).toUpperCase() + String(recipientProfile.organNeeded).slice(1) : "—"}</p>
                              <p className="text-sm text-muted-foreground">Requested organ</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-success border-success">Active</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Matches</CardTitle>
                    <CardDescription>Matches found for your registration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeMatchList.length === 0 && <p className="text-sm text-muted-foreground">No active matches yet.</p>}
                      {activeMatchList.map((m: any) => (
                        <div key={`${m.donorUid}__${m.recipientUid}`} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="text-sm">
                            <div className="font-medium">Match</div>
                            <div className="text-muted-foreground">Donor: {m.donorUid} • Recipient: {m.recipientUid}</div>
                          </div>
                          <Badge variant="outline">Score: {m.score}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Verification</CardTitle>
                    <CardDescription>Your donation registration is secured on the blockchain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {verified === null ? (
                      <div className="flex items-center space-x-3 p-4 bg-muted/5 border border-muted/20 rounded-lg">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10">
                          <Shield className="h-5 w-5 text-muted" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-muted">Checking...</p>
                          <p className="text-sm text-muted-foreground">Verifying your registration on the blockchain...</p>
                        </div>
                      </div>
                    ) : verified ? (
                      <div className="flex items-center space-x-3 p-4 bg-success/5 border border-success/20 rounded-lg">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <Shield className="h-5 w-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-success">Verified on-chain</p>
                          <p className="text-sm text-muted-foreground truncate">{verifyTx ? `Tx: ${verifyTx}` : "Registered (tx pending or unknown)"}</p>
                        </div>
                        {verifyTx && explorerBase ? (
                          <Button asChild variant="outline" size="sm" title="Open in explorer">
                            <a href={`${explorerBase.replace(/\/$/, '')}/tx/${verifyTx}`} target="_blank" rel="noreferrer">View on Chain</a>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled title={verifyTx ? "Set NEXT_PUBLIC_AVALANCHE_EXPLORER_BASE to enable link" : "No transaction hash available"}>
                            View on Chain
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                          <Shield className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-destructive">Not verified on-chain</p>
                          <p className="text-sm text-muted-foreground">Your UID has not been found on the blockchain yet.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={async () => {
                          if (!user) return
                          try {
                            const vres = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid }) })
                            const vdata = await vres.json().catch(() => ({} as any))
                            if (typeof vdata.exists === 'boolean') setVerified(vdata.exists)
                          } catch (e) {
                            console.warn('manual verify failed', e)
                          }
                        }}>
                          Verify Now
                        </Button>
                      </div>
                    )}
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
