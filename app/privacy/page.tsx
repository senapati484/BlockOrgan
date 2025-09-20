import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <Navigation />
      <section className="container mx-auto px-4 py-16 h-screen">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Your trust matters. We protect your data and respect your privacy.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>We collect only the data necessary to provide organ donation matching and related services. Sensitive medical data is processed securely and access is restricted.</p>
              <p>Blockchain records store cryptographic proofs and non-sensitive metadata. We do not store full medical details on-chain.</p>
              <p>You can request data export or deletion subject to legal and medical obligations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data We Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-6 space-y-1">
                <li>Account and contact information</li>
                <li>Medical compatibility attributes and history (stored securely off-chain)</li>
                <li>Operational logs and blockchain transaction references</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Questions? Email privacy@lifechain.org
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  )
}
