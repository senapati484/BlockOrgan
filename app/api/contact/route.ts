import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { saveContactMessage } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Received request body:", body) // Debug log
    
    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten())
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    console.log("Saving contact message:", data) // Debug log

    try {
      const id = await saveContactMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
      console.log("Message saved with ID:", id) // Debug log
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue even if database save fails, try to send email anyway
    }

    // Send confirmation email to the user
    try {
      const html = `
        <div>
          <p>Hi ${data.name},</p>
          <p>Thanks for contacting BlockOrgan. We have received your message and will get back to you shortly.</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;font-family:inherit">${data.message}</pre>
          <p>— BlockOrgan Team</p>
        </div>
      `

      await sendEmail({
        to: data.email,
        subject: `We received your message: ${data.subject}`,
        html,
        text: `Hi ${data.name},\n\nThanks for contacting BlockOrgan. We have received your message and will get back to you shortly.\n\nSubject: ${data.subject}\n\n${data.message}\n\n— BlockOrgan Team`,
      })
      console.log("Confirmation email sent to:", data.email) // Debug log
    } catch (emailError) {
      console.error("Email error:", emailError)
      return NextResponse.json(
        { error: "Message received but failed to send confirmation email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Unexpected error in /api/contact:", err)
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
