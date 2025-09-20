// api/algorithm/run

import { NextResponse } from "next/server"
import crypto from "crypto"
import { listDonors, listRecipients, upsertMatch, markMatchNotified, createEmailLog, getMatchId } from "@/lib/db"
import { decisionLinks, sendEmail } from "@/lib/mailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Very simple compatibility scoring (placeholder):
// +20 for same blood type, +10 if organ requested is in donor organs, +small factors for age proximity (if present)
function scorePair(donor: any, recipient: any): number {
  let score = 0
  if (donor.bloodType && recipient.bloodType && donor.bloodType === recipient.bloodType) score += 20
  const wanted = String(recipient.organNeeded || "").toLowerCase()
  const donorOrgans: string[] = Array.isArray(donor.organs) ? donor.organs : []
  if (wanted && donorOrgans.includes(wanted)) score += 10
  // optional: age proximity
  if (donor.dateOfBirth && recipient.dateOfBirth) {
    try {
      const d1 = new Date(donor.dateOfBirth).getTime()
      const d2 = new Date(recipient.dateOfBirth).getTime()
      const years = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24 * 365)
      score += Math.max(0, 10 - Math.min(10, years)) // up to +10 for closer age
    } catch { }
  }
  return score
}

export async function POST() {
  try {
    const donors = await listDonors()
    const recipients = await listRecipients()

    const actions: Array<Promise<any>> = []

    for (const donor of donors) {
      for (const recipient of recipients) {
        // Skip if donor doesn't offer what recipient needs
        const wanted = String(recipient.organNeeded || "").toLowerCase()
        const donorOrgans: string[] = Array.isArray(donor.organs) ? donor.organs : []
        if (!wanted || donorOrgans.length === 0 || !donorOrgans.includes(wanted)) continue

        const score = scorePair(donor, recipient)
        if (score < 20) continue // threshold

        const matchId = await upsertMatch(donor.uid, recipient.uid, score)

        // Build tokens and emails (one-time initial email)
        const tokenDonor = crypto.randomBytes(16).toString("hex")
        const tokenRecipient = crypto.randomBytes(16).toString("hex")
        const donorLinks = decisionLinks(tokenDonor)
        const recipientLinks = decisionLinks(tokenRecipient)

        const subject = `Potential Match Found: ${wanted.toUpperCase()}`
        const donorHtml = `
          <h2>Potential Recipient Match</h2>
          <p>We found a recipient who needs: <b>${wanted}</b>.</p>
          <p>If you do not want to receive further mails for this match:</p>
          <ul>
            <li><a href="${donorLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${donorLinks.remind}">Remind me later</a></li>
            <li><a href="${donorLinks.ignore}">Ignore</a></li>
          </ul>
          <p>Thank you for being part of BlockOrgan.</p>
        `
        const recipientHtml = `
          <h2>Potential Donor Match</h2>
          <p>We found a donor who can donate: <b>${wanted}</b>.</p>
          <p>If you do not want to receive further mails for this match:</p>
          <ul>
            <li><a href="${recipientLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${recipientLinks.remind}">Remind me later</a></li>
            <li><a href="${recipientLinks.ignore}">Ignore</a></li>
          </ul>
          <p>Thank you for being part of BlockOrgan.</p>
        `

        // Queue emails
        if (donor.email) {
          actions.push(
            (async () => {
              try {
                await sendEmail({ to: donor.email, subject, html: donorHtml })
                await createEmailLog({
                  token: tokenDonor,
                  matchId,
                  to: donor.email,
                  role: "donor",
                  type: "initial",
                  status: "sent",
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                })
              } catch (err) {
                console.error("Donor email/log error", { to: donor.email, matchId, err })
              }
            })()
          )
        }

        if (recipient.email) {
          actions.push(
            (async () => {
              try {
                await sendEmail({ to: recipient.email, subject, html: recipientHtml })
                await createEmailLog({
                  token: tokenRecipient,
                  matchId,
                  to: recipient.email,
                  role: "recipient",
                  type: "initial",
                  status: "sent",
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                })
              } catch (err) {
                console.error("Recipient email/log error", { to: recipient.email, matchId, err })
              }
            })()
          )
        }

        actions.push(
          (async () => {
            try {
              await markMatchNotified(matchId)
            } catch (err) {
              console.error("markMatchNotified error", { matchId, err })
            }
          })()
        )
      }
    }

    const results = await Promise.allSettled(actions)
    const summary = results.reduce(
      (acc, r) => {
        if (r.status === "fulfilled") acc.fulfilled += 1
        else acc.rejected += 1
        return acc
      },
      { fulfilled: 0, rejected: 0 }
    )

    return NextResponse.json({ ok: true, tasks: actions.length, ...summary })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "algorithm failed" }, { status: 500 })
  }
}
