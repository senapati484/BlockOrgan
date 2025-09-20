"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Heart,
  Users,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { getExistingRole } from "@/lib/db";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<
    "donor" | "recipient" | null
  >(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInWithGoogle, signUpWithEmail } = useAuth();

  const handleRoleSelect = (role: "donor" | "recipient") => {
    setSelectedRole(role);
    setError("");
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      if (!selectedRole) throw new Error("Please choose a role first");
      await signInWithGoogle();
      // After auth, block re-registration if user already has a profile
      // We rely on server state via getExistingRole (client reads Firestore)
      // If already registered, show message and go to dashboard
      const existing = await getExistingRole((await import("firebase/auth")).getAuth().currentUser!.uid);
      if (existing) {
        setError(`You are already registered as ${existing}. Please continue from your dashboard.`);
        router.push("/dashboard");
        return;
      }
      router.push(`/${selectedRole}/register`);
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (!selectedRole) throw new Error("Please choose a role first");
      if (!name) throw new Error("Please enter your name");
      await signUpWithEmail(name, email, password);
      const existing = await getExistingRole((await import("firebase/auth")).getAuth().currentUser!.uid);
      if (existing) {
        setError(`You are already registered as ${existing}. Please continue from your dashboard.`);
        router.push("/dashboard");
        return;
      }
      router.push(`/${selectedRole}/register`);
    } catch (e: any) {
      setError(e?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Join BlockOrgan</h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Choose your role to get started with the world's most transparent
              organ donation registry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Donor Registration */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedRole === "donor" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleRoleSelect("donor")}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Become a Donor</CardTitle>
                <CardDescription className="text-base">
                  Save lives by registering as an organ donor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">
                      Blockchain-verified registration
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">
                      Secure biometric verification
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">Real-time donation tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">Impact analytics dashboard</span>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg" onClick={() => handleRoleSelect("donor")}
                  aria-label="Register as Donor">
                  Register as Donor
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recipient Registration */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedRole === "recipient" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleRoleSelect("recipient")}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  Register as Recipient
                </CardTitle>
                <CardDescription className="text-base">
                  Join the waiting list for organ transplantation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">Priority-based matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">
                      Real-time match notifications
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">
                      Transparent waiting list status
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Shield className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">Medical history management</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-transparent"
                  size="lg"
                  variant="outline"
                  onClick={() => handleRoleSelect("recipient")}
                  aria-label="Register as Recipient"
                >
                  Register as Recipient
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Error */}
          {error && (
            <div className="max-w-3xl mx-auto mt-10">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Continue Registration Methods */}
          <div className="max-w-3xl mx-auto mt-10">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Continue Registration</CardTitle>
                <CardDescription>
                  {selectedRole
                    ? `You selected: ${selectedRole}. Choose a sign up method.`
                    : "Choose a role above to continue."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGoogle}
                  disabled={loading || !selectedRole}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        disabled={loading}
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !selectedRole}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in to your account</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
