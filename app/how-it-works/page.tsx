import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Register",
    description:
      "Donor or recipient completes a secure, verified registration.",
  },
  {
    step: "02",
    title: "Match",
    description:
      "Algorithm ranks compatibility and urgency with transparent criteria.",
  },
  {
    step: "03",
    title: "Save Lives",
    description:
      "Hospitals coordinate logistics, and outcomes are tracked on-chain.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      <Navigation />
      <section className="container mx-auto px-4 py-16 h-screen">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            How LifeChain Works
          </h1>
          <p className="text-muted-foreground text-lg">
            A clear, fair, and auditable path from registration to transplant.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((s) => (
            <Card key={s.step}>
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {s.step}
                </div>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground text-center">
                Transparent and accountable at every step.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
