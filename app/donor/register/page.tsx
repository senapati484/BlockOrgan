"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, User, FileText, Shield, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { assertNoExistingRegistration, saveDonorProfile } from "@/lib/db"
import { useRouter } from "next/navigation"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  bloodType: string

  // Medical Information
  height: string
  weight: string
  medicalHistory: string
  medications: string
  allergies: string

  // Donation Preferences
  organs: string[]
  emergencyContact: string
  emergencyPhone: string

  // Consent
  consentTerms: boolean
  consentMedical: boolean
  consentBlockchain: boolean
}

export default function DonorRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodType: "",
    height: "",
    weight: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
    organs: [],
    emergencyContact: "",
    emergencyPhone: "",
    consentTerms: false,
    consentMedical: false,
    consentBlockchain: false,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const organOptions = [
    { id: "heart", label: "Heart" },
    { id: "liver", label: "Liver" },
    { id: "kidneys", label: "Kidneys" },
    { id: "lungs", label: "Lungs" },
    { id: "pancreas", label: "Pancreas" },
    { id: "intestines", label: "Intestines" },
    { id: "corneas", label: "Corneas" },
    { id: "tissue", label: "Tissue" },
  ]

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOrganToggle = (organId: string) => {
    setFormData((prev) => ({
      ...prev,
      organs: prev.organs.includes(organId) ? prev.organs.filter((id) => id !== organId) : [...prev.organs, organId],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError("")
      if (!user) {
        router.push("/login")
        return
      }
      // Prevent duplicate registration across roles
      await assertNoExistingRegistration(user.uid)
      const payload = { ...formData, role: "donor", uid: user.uid, email: formData.email || user.email }
      await saveDonorProfile(user.uid, payload)
      router.push("/donor/profile")
    } catch (e: any) {
      if (e?.code === "already-registered") {
        setError(e.message)
      } else {
        setError(e?.message || "Failed to save registration")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth &&
          formData.bloodType
        )
      case 2:
        return formData.height && formData.weight
      case 3:
        return formData.organs.length > 0 && formData.emergencyContact && formData.emergencyPhone
      case 4:
        return formData.consentTerms && formData.consentMedical && formData.consentBlockchain
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Become a Donor</h1>
            <p className="text-muted-foreground">Join the LifeChain registry and help save lives</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep === 1 && (
                  <>
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Medical Information</span>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Donation Preferences</span>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Consent & Verification</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Please provide your basic personal information"}
                {currentStep === 2 && "Help us understand your medical background"}
                {currentStep === 3 && "Choose which organs you'd like to donate"}
                {currentStep === 4 && "Review and provide your consent for registration"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type *</Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) => handleInputChange("bloodType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Medical Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm) *</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="Enter your height"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Enter your weight"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      placeholder="Please describe any significant medical conditions or surgeries"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      placeholder="List any medications you are currently taking"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      placeholder="List any known allergies"
                      rows={2}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This information will be used for medical compatibility assessment and will be kept confidential.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 3: Donation Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Organs Available for Donation *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {organOptions.map((organ) => (
                        <div key={organ.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={organ.id}
                            checked={formData.organs.includes(organ.id)}
                            onCheckedChange={() => handleOrganToggle(organ.id)}
                          />
                          <Label htmlFor={organ.id} className="text-sm font-normal">
                            {organ.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.organs.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.organs.map((organId) => {
                          const organ = organOptions.find((o) => o.id === organId)
                          return (
                            <Badge key={organId} variant="secondary">
                              {organ?.label}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Emergency Contact Information *</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Emergency contact name"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      />
                      <Input
                        placeholder="Emergency contact phone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Consent & Verification */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consentTerms"
                        checked={formData.consentTerms}
                        onCheckedChange={(checked) => handleInputChange("consentTerms", checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="consentTerms" className="text-sm font-normal">
                          I agree to the Terms of Service and Privacy Policy *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          By checking this box, you agree to our terms and conditions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consentMedical"
                        checked={formData.consentMedical}
                        onCheckedChange={(checked) => handleInputChange("consentMedical", checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="consentMedical" className="text-sm font-normal">
                          I consent to medical evaluation and organ donation procedures *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          This allows medical professionals to evaluate your organs for donation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consentBlockchain"
                        checked={formData.consentBlockchain}
                        onCheckedChange={(checked) => handleInputChange("consentBlockchain", checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="consentBlockchain" className="text-sm font-normal">
                          I consent to blockchain verification and transparent record keeping *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Your donation information will be recorded on the blockchain for transparency.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your registration will be verified using biometric data and recorded on the blockchain for
                      complete transparency and security.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} disabled={!isStepValid()}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!isStepValid() || isLoading}>
                    {isLoading ? "Registering..." : "Complete Registration"}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
