import { NextRequest, NextResponse } from "next/server"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import crypto from "crypto"
import { db } from "@/lib/firebase"
import { upsertMatch, createEmailLog, markMatchNotified } from "@/lib/db"
import { decisionLinks, sendEmail } from "@/lib/mailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function scorePair(donor: any, recipient: any): number {
  let score = 0
  if (donor.bloodType && recipient.bloodType && donor.bloodType === recipient.bloodType) score += 20
  const wanted = String(recipient.organNeeded || "").toLowerCase()
  const donorOrgans: string[] = Array.isArray(donor.organs) ? donor.organs : []
  if (wanted && donorOrgans.includes(wanted)) score += 10
  if (donor.dateOfBirth && recipient.dateOfBirth) {
    try {
      const d1 = new Date(donor.dateOfBirth).getTime()
      const d2 = new Date(recipient.dateOfBirth).getTime()
      const years = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24 * 365)
      score += Math.max(0, 10 - Math.min(10, years))
    } catch {}
  }
  return score
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const uid: string | undefined = body?.uid
    if (!uid) return NextResponse.json({ error: "uid is required" }, { status: 400 })

    // Determine role by checking public projections
    const donorPubRef = doc(db, "donorsPublic", uid)
    const recipPubRef = doc(db, "recipientsPublic", uid)
    const [donorSnap, recipSnap] = await Promise.all([getDoc(donorPubRef), getDoc(recipPubRef)])

    const isDonor = donorSnap.exists()
    const isRecipient = recipSnap.exists()

    if (!isDonor && !isRecipient) {
      return NextResponse.json({ ok: false, error: "No public profile found" }, { status: 404 })
    }

    const tasks: Array<Promise<any>> = []
    const subjectBase = "Potential Match Found"

    if (isDonor) {
      const donor = { uid, ...(donorSnap.data() as any) }
      const recipients = (await getDocs(collection(db, "recipientsPublic"))).docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
      for (const recipient of recipients) {
        const wanted = String(recipient.organNeeded || "").toLowerCase()
        const donorOrgans: string[] = Array.isArray(donor.organs) ? donor.organs : []
        if (!wanted || !donorOrgans.includes(wanted)) continue
        const score = scorePair(donor, recipient)
        if (score < 20) continue

        const matchId = await upsertMatch(donor.uid, recipient.uid, score)
        const tokenDonor = crypto.randomBytes(16).toString("hex")
        const tokenRecipient = crypto.randomBytes(16).toString("hex")
        const donorLinks = decisionLinks(tokenDonor)
        const recipientLinks = decisionLinks(tokenRecipient)
        const subject = `${subjectBase}: ${wanted.toUpperCase()}`

        const donorHtml = `
          <h2>Potential Recipient Match</h2>
          <p>We found a recipient who needs: <b>${wanted}</b>.</p>
          <ul>
            <li><a href="${donorLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${donorLinks.remind}">Remind me later</a></li>
            <li><a href="${donorLinks.ignore}">Ignore</a></li>
          </ul>
        `
        const recipientHtml = `
          <h2>Potential Donor Match</h2>
          <p>We found a donor who can donate: <b>${wanted}</b>.</p>
          <ul>
            <li><a href="${recipientLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${recipientLinks.remind}">Remind me later</a></li>
            <li><a href="${recipientLinks.ignore}">Ignore</a></li>
          </ul>
        `

        if (donor.email) {
          tasks.push(
            (async () => {
              try {
                await sendEmail({ to: donor.email, subject, html: donorHtml })
                await createEmailLog({ token: tokenDonor, matchId, to: donor.email, role: "donor", type: "initial", status: "sent", createdAt: Date.now(), updatedAt: Date.now() })
              } catch (err) {
                console.error("Donor email/log error", { to: donor.email, matchId, err })
              }
            })()
          )
        }

        if (recipient.email) {
          tasks.push(
            (async () => {
              try {
                await sendEmail({ to: recipient.email, subject, html: recipientHtml })
                await createEmailLog({ token: tokenRecipient, matchId, to: recipient.email, role: "recipient", type: "initial", status: "sent", createdAt: Date.now(), updatedAt: Date.now() })
              } catch (err) {
                console.error("Recipient email/log error", { to: recipient.email, matchId, err })
              }
            })()
          )
        }

        tasks.push(
          (async () => {
            try { await markMatchNotified(matchId) } catch (err) { console.error("markMatchNotified error", { matchId, err }) }
          })()
        )
      }
    }

    if (isRecipient) {
      const recipient = { uid, ...(recipSnap.data() as any) }
      const donors = (await getDocs(collection(db, "donorsPublic"))).docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
      for (const donor of donors) {
        const wanted = String(recipient.organNeeded || "").toLowerCase()
        const donorOrgans: string[] = Array.isArray(donor.organs) ? donor.organs : []
        if (!wanted || !donorOrgans.includes(wanted)) continue
        const score = scorePair(donor, recipient)
        if (score < 20) continue

        const matchId = await upsertMatch(donor.uid, recipient.uid, score)
        const tokenDonor = crypto.randomBytes(16).toString("hex")
        const tokenRecipient = crypto.randomBytes(16).toString("hex")
        const donorLinks = decisionLinks(tokenDonor)
        const recipientLinks = decisionLinks(tokenRecipient)
        const subject = `${subjectBase}: ${wanted.toUpperCase()}`

        const donorHtml = `
          <h2>Potential Recipient Match</h2>
          <p>We found a recipient who needs: <b>${wanted}</b>.</p>
          <ul>
            <li><a href="${donorLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${donorLinks.remind}">Remind me later</a></li>
            <li><a href="${donorLinks.ignore}">Ignore</a></li>
          </ul>
        `
        const recipientHtml = `
          <h2>Potential Donor Match</h2>
          <p>We found a donor who can donate: <b>${wanted}</b>.</p>
          <ul>
            <li><a href="${recipientLinks.block}">Block</a> further emails for this match</li>
            <li><a href="${recipientLinks.remind}">Remind me later</a></li>
            <li><a href="${recipientLinks.ignore}">Ignore</a></li>
          </ul>
        `

        if (donor.email) {
          tasks.push(
            (async () => {
              try {
                await sendEmail({ to: donor.email, subject, html: donorHtml })
                await createEmailLog({ token: tokenDonor, matchId, to: donor.email, role: "donor", type: "initial", status: "sent", createdAt: Date.now(), updatedAt: Date.now() })
              } catch (err) {
                console.error("Donor email/log error", { to: donor.email, matchId, err })
              }
            })()
          )
        }

        if (recipient.email) {
          tasks.push(
            (async () => {
              try {
                await sendEmail({ to: recipient.email, subject, html: recipientHtml })
                await createEmailLog({ token: tokenRecipient, matchId, to: recipient.email, role: "recipient", type: "initial", status: "sent", createdAt: Date.now(), updatedAt: Date.now() })
              } catch (err) {
                console.error("Recipient email/log error", { to: recipient.email, matchId, err })
              }
            })()
          )
        }

        tasks.push(
          (async () => {
            try { await markMatchNotified(matchId) } catch (err) { console.error("markMatchNotified error", { matchId, err }) }
          })()
        )
      }
    }

    const results = await Promise.allSettled(tasks)
    const summary = results.reduce(
      (acc, r) => {
        if (r.status === "fulfilled") acc.fulfilled += 1
        else acc.rejected += 1
        return acc
      },
      { fulfilled: 0, rejected: 0 }
    )

    return NextResponse.json({ ok: true, ...summary, tasks: tasks.length, role: isDonor ? "donor" : isRecipient ? "recipient" : "none" })
  } catch (e: any) {
    console.error("/api/match/for-user error", e)
    return NextResponse.json({ ok: false, error: e?.message || "match failed" }, { status: 500 })
  }
}
