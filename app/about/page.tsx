import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <Navigation />
      <section className="container mx-auto px-4 py-16 h-screen">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">About LifeChain</h1>
          <p className="text-muted-foreground text-lg">
            Our mission is to bring transparency, fairness, and trust to organ
            donation using blockchain technology.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 text-primary mr-2" />
                Mission
              </CardTitle>
              <CardDescription>
                Save lives by increasing trust and participation in organ
                donation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We empower donors and recipients with verifiable, transparent
              processes.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                Trust
              </CardTitle>
              <CardDescription>
                Immutable verification of registrations and matches.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Every key event is recorded on-chain for auditable fairness.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                Community
              </CardTitle>
              <CardDescription>
                Global network of donors, recipients, and administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We build with doctors, regulators, and patient advocates.
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
