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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, User, FileText, Shield, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { assertNoExistingRegistration, saveRecipientProfile } from "@/lib/db"
import { useRouter } from "next/navigation"

interface RecipientFormData {
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
  diagnosis: string
  urgencyLevel: string
  organNeeded: string
  medicalHistory: string
  currentMedications: string
  allergies: string
  doctorName: string
  hospitalName: string

  // Emergency Contact
  emergencyContact: string
  emergencyPhone: string
  emergencyRelation: string

  // Consent
  consentTerms: boolean
  consentMedical: boolean
  consentBlockchain: boolean
  consentDataSharing: boolean
}

export default function RecipientRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<RecipientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodType: "",
    height: "",
    weight: "",
    diagnosis: "",
    urgencyLevel: "",
    organNeeded: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    doctorName: "",
    hospitalName: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelation: "",
    consentTerms: false,
    consentMedical: false,
    consentBlockchain: false,
    consentDataSharing: false,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const urgencyLevels = [
    { value: "critical", label: "Critical (1-7 days)" },
    { value: "urgent", label: "Urgent (1-30 days)" },
    { value: "high", label: "High (1-6 months)" },
    { value: "standard", label: "Standard (6+ months)" },
  ]
  const organOptions = ["Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Intestines", "Cornea", "Bone Marrow"]

  const handleInputChange = (field: keyof RecipientFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      const payload = { ...formData, role: "recipient", uid: user.uid, email: formData.email || user.email }
      await saveRecipientProfile(user.uid, payload)
      router.push("/recipient/profile")
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
        return (
          formData.height &&
          formData.weight &&
          formData.diagnosis &&
          formData.urgencyLevel &&
          formData.organNeeded &&
          formData.doctorName &&
          formData.hospitalName
        )
      case 3:
        return formData.emergencyContact && formData.emergencyPhone && formData.emergencyRelation
      case 4:
        return (
          formData.consentTerms && formData.consentMedical && formData.consentBlockchain && formData.consentDataSharing
        )
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
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Register as Recipient</h1>
            <p className="text-muted-foreground">Join the waiting list for organ transplantation</p>
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
                    <Users className="h-5 w-5" />
                    <span>Emergency Contact</span>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Consent & Privacy</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Please provide your basic personal information"}
                {currentStep === 2 && "Help us understand your medical needs and urgency"}
                {currentStep === 3 && "Provide emergency contact information"}
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
                    <Label htmlFor="organNeeded">Organ Needed *</Label>
                    <Select
                      value={formData.organNeeded}
                      onValueChange={(value) => handleInputChange("organNeeded", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organ needed" />
                      </SelectTrigger>
                      <SelectContent>
                        {organOptions.map((organ) => (
                          <SelectItem key={organ} value={organ.toLowerCase()}>
                            {organ}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                    <Select
                      value={formData.urgencyLevel}
                      onValueChange={(value) => handleInputChange("urgencyLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                      placeholder="Describe your primary medical condition requiring transplantation"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Primary Doctor *</Label>
                      <Input
                        id="doctorName"
                        value={formData.doctorName}
                        onChange={(e) => handleInputChange("doctorName", e.target.value)}
                        placeholder="Dr. Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital/Clinic *</Label>
                      <Input
                        id="hospitalName"
                        value={formData.hospitalName}
                        onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                        placeholder="City General Hospital"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      placeholder="Previous surgeries, conditions, or relevant medical history"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                      placeholder="List all current medications and dosages"
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
                </div>
              )}

              {/* Step 3: Emergency Contact */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Full name of emergency contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="Phone number of emergency contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Relationship *</Label>
                    <Select
                      value={formData.emergencyRelation}
                      onValueChange={(value) => handleInputChange("emergencyRelation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This contact will be notified about match opportunities and medical procedures.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 4: Consent & Privacy */}
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
                          I consent to medical evaluation and transplant procedures *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          This allows medical professionals to evaluate your eligibility for transplantation.
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
                          Your medical information will be securely recorded on the blockchain.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consentDataSharing"
                        checked={formData.consentDataSharing}
                        onCheckedChange={(checked) => handleInputChange("consentDataSharing", checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="consentDataSharing" className="text-sm font-normal">
                          I consent to sharing my medical data with matching algorithms *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          This enables the system to find compatible organ matches for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your registration will be verified and you'll be added to the waiting list based on medical
                      urgency and compatibility factors.
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
