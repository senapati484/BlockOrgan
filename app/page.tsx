import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, BarChart3, CheckCircle, Clock, Globe, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const stats = [
    { label: "Lives Saved", value: "12,847", icon: Heart },
    { label: "Active Donors", value: "89,234", icon: Users },
    { label: "Successful Matches", value: "8,956", icon: CheckCircle },
    { label: "Countries", value: "23", icon: Globe },
  ]

  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description:
        "Every donation and match is recorded on an immutable blockchain for complete transparency and trust.",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Our AI-powered algorithm instantly matches donors with recipients based on medical compatibility.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications about your donation status, matches, and important updates.",
    },
    {
      icon: BarChart3,
      title: "Complete Analytics",
      description: "Track your impact with detailed analytics and see how your donation saves lives.",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Register",
      description: "Sign up as a donor or recipient with secure biometric verification.",
    },
    {
      step: "02",
      title: "Match",
      description: "Our algorithm finds the best matches based on medical compatibility and urgency.",
    },
    {
      step: "03",
      title: "Save Lives",
      description: "Complete the donation process and help save lives with blockchain transparency.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Blockchain-Powered Transparency
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
              Save Lives Through
              <span className="text-primary block">Transparent Organ Donation</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Join the world's first blockchain-based organ donation registry. Every match is verified, every donation
              is transparent, every life matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/donor/register">
                  <Heart className="h-5 w-5 mr-2" />
                  Register as Donor
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                <Link href="/recipient/register">
                  <Users className="h-5 w-5 mr-2" />
                  Register as Recipient
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">How LifeChain Works</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Three simple steps to join the most transparent organ donation network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-balance">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Trust & Transparency</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Built on blockchain technology for complete transparency and fairness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-balance">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Ready to Make a Difference?</h2>
            <p className="text-xl text-muted-foreground text-balance">
              Join thousands of donors and recipients who trust LifeChain for transparent, secure organ donation
              matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
