import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="bg-background">
      <Navigation />
      <section className="container mx-auto px-4 py-16 h-screen">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">
              Please read these terms carefully before using LifeChain.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Use of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                LifeChain provides organ donation registry and matching
                services. You agree to use the platform lawfully and
                responsibly.
              </p>
              <p>
                Medical decisions should always be made with licensed healthcare
                professionals.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data & Blockchain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                We record non-sensitive proofs on-chain for transparency.
                On-chain data may be immutable.
              </p>
              <p>
                By using LifeChain you consent to this form of record keeping.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Questions? Email legal@lifechain.org
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
