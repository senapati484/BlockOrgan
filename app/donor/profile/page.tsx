"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Shield, Edit, Save, X, CheckCircle, Users, Activity, Calendar, ExternalLink } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getDonorProfile, saveDonorProfile } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function DonorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<any | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        if (!user) {
          router.push("/login")
          return
        }
        const data = await getDonorProfile(user.uid)
        if (!cancelled) {
          setProfileData(
            data || {
              firstName: user.displayName?.split(" ")[0] || "",
              lastName: user.displayName?.split(" ")[1] || "",
              email: user.email || "",
              phone: "",
              bloodType: "",
              height: "",
              weight: "",
              emergencyContact: "",
              emergencyPhone: "",
              organs: [],
            }
          )
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load profile")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user, router])

  const donorStats = [
    { label: "Organs Registered", value: "5", icon: Heart, color: "text-primary" },
    { label: "Verification Status", value: "Verified", icon: Shield, color: "text-success" },
    { label: "Potential Matches", value: "12", icon: Users, color: "text-warning" },
    { label: "Days Active", value: "45", icon: Calendar, color: "text-chart-1" },
  ]

  const registeredOrgans = [
    { name: "Heart", status: "Active", compatibility: "High", lastUpdated: "2024-01-15" },
    { name: "Liver", status: "Active", compatibility: "High", lastUpdated: "2024-01-15" },
    { name: "Kidneys", status: "Active", compatibility: "Medium", lastUpdated: "2024-01-15" },
    { name: "Corneas", status: "Active", compatibility: "High", lastUpdated: "2024-01-15" },
    { name: "Tissue", status: "Active", compatibility: "High", lastUpdated: "2024-01-15" },
  ]

  const blockchainTransactions = [
    {
      id: "0x1a2b3c4d5e6f7890",
      type: "Registration",
      description: "Initial donor registration",
      timestamp: "2024-01-15 10:30:00",
      status: "Confirmed",
    },
    {
      id: "0x2b3c4d5e6f789012",
      type: "Verification",
      description: "Biometric verification completed",
      timestamp: "2024-01-15 11:45:00",
      status: "Confirmed",
    },
    {
      id: "0x3c4d5e6f78901234",
      type: "Update",
      description: "Medical information updated",
      timestamp: "2024-01-20 14:20:00",
      status: "Confirmed",
    },
  ]

  const handleSave = async () => {
    if (!user || !profileData) return
    try {
      setError("")
      await saveDonorProfile(user.uid, profileData)
      setIsEditing(false)
    } catch (e: any) {
      setError(e?.message || "Failed to save profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Profile not found."}</AlertDescription>
          </Alert>
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
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="text-lg">
                {(profileData.firstName?.[0] || "U").toUpperCase()}
                {(profileData.lastName?.[0] || "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">Donor</Badge>
                <Badge variant="outline" className="text-success border-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  <Heart className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {donorStats.map((stat, index) => {
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
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organs">Organs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic personal details</CardDescription>
                  <CardDescription>Contact information for emergencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, emergencyContact: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, emergencyPhone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      This contact will be notified in case of medical emergencies or donation procedures.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Organs</CardTitle>
                <CardDescription>Organs you've registered for donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registeredOrgans.map((organ, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{organ.name}</p>
                          <p className="text-sm text-muted-foreground">Last updated: {organ.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-success border-success">
                          {organ.status}
                        </Badge>
                        <Badge variant="secondary">{organ.compatibility} Compatibility</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Your donation activities and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Donations Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your donation history will appear here once you complete a donation.
                  </p>
                  <Button variant="outline" className="bg-transparent">
                    Learn About the Process
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification</CardTitle>
                <CardDescription>All your registration activities recorded on the blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blockchainTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-success border-success">
                          {transaction.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All transactions are permanently recorded on the blockchain for complete transparency and cannot be
                    altered.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
