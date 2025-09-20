import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  { q: "Is my data secure?", a: "Yes. Sensitive data is encrypted and key events are recorded on-chain for integrity." },
  { q: "Who can become a donor?", a: "Eligibility varies by jurisdiction; consult your local regulations and physician." },
  { q: "How are matches determined?", a: "Based on medical compatibility and urgency with transparent criteria." },
]

export default function FAQPage() {
  return (
    <div className="bg-background">
      <Navigation />
      <section className="container mx-auto px-4 py-16 h-screen">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Answers to common questions about LifeChain.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem value={`item-${i}`} key={i}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer />
    </div>
  )
}
