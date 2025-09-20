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
import { Users, Shield, Edit, Save, X, Activity, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getRecipientProfile, saveRecipientProfile } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function RecipientProfilePage() {
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
        const data = await getRecipientProfile(user.uid)
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
              organNeeded: "",
              urgencyLevel: "",
              doctorName: "",
              hospitalName: "",
              emergencyContact: "",
              emergencyPhone: "",
              emergencyRelation: "",
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

  const handleSave = async () => {
    if (!user || !profileData) return
    try {
      setError("")
      await saveRecipientProfile(user.uid, profileData)
      setIsEditing(false)
    } catch (e: any) {
      setError(e?.message || "Failed to save profile")
    }
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
                <Badge variant="secondary">Recipient</Badge>
                <Badge variant="outline" className="text-success border-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev: any) => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev: any) => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Details relevant to your transplant needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={profileData.bloodType}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, bloodType: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organNeeded">Organ Needed</Label>
                    <Input
                      id="organNeeded"
                      value={profileData.organNeeded}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, organNeeded: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <Input
                      id="urgencyLevel"
                      value={profileData.urgencyLevel}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, urgencyLevel: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Primary Doctor</Label>
                    <Input
                      id="doctorName"
                      value={profileData.doctorName}
                      onChange={(e) => setProfileData((prev: any) => ({ ...prev, doctorName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital/Clinic</Label>
                  <Input
                    id="hospitalName"
                    value={profileData.hospitalName}
                    onChange={(e) => setProfileData((prev: any) => ({ ...prev, hospitalName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Waiting List History</CardTitle>
                <CardDescription>Your recent status changes and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No History Yet</h3>
                  <p className="text-muted-foreground mb-4">Your updates will appear here as your case progresses.</p>
                  <Button variant="outline" className="bg-transparent">Learn More</Button>
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
