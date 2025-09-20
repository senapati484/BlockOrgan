import { doc, setDoc, getDoc, collection, getDocs, query, where, setDoc as setDocAlias } from "firebase/firestore"
import { db } from "./firebase"

export type DonorProfile = Record<string, any>
export type RecipientProfile = Record<string, any>
export type ContactMessage = {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: number
}

export async function listActiveMatchesForUser(uid: string): Promise<MatchRecord[]> {
  const col = collection(db, "matches")
  const [byDonorSnap, byRecipientSnap] = await Promise.all([
    getDocs(query(col, where("donorUid", "==", uid))),
    getDocs(query(col, where("recipientUid", "==", uid))),
  ])
  const allowed = new Set(["pending", "notified"]) as Set<MatchRecord["status"]>
  const out: MatchRecord[] = []
  byDonorSnap.forEach((d) => {
    const m = d.data() as MatchRecord
    if (allowed.has(m.status)) out.push(m)
  })
  byRecipientSnap.forEach((d) => {
    const m = d.data() as MatchRecord
    if (allowed.has(m.status)) out.push(m)
  })
  return out
}

export async function saveDonorProfile(uid: string, data: DonorProfile) {
  const now = Date.now()
  const ref = doc(db, "donors", uid)
  await setDoc(ref, { ...data, updatedAt: now, createdAt: data?.createdAt || now }, { merge: true })
  // Mirror minimal public fields for matching
  const publicRef = doc(db, "donorsPublic", uid)
  await setDoc(publicRef, {
    email: data.email || "",
    bloodType: data.bloodType || "",
    organs: Array.isArray(data.organs) ? data.organs : [],
    dateOfBirth: data.dateOfBirth || null,
    updatedAt: now,
    createdAt: data?.createdAt || now,
  }, { merge: true })
}

// List all donors and recipients
export async function listDonors(): Promise<Array<{ uid: string } & DonorProfile>> {
  // Read from public projection to avoid auth requirement in server routes
  const col = collection(db, "donorsPublic")
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
}

export async function listRecipients(): Promise<Array<{ uid: string } & RecipientProfile>> {
  // Read from public projection to avoid auth requirement in server routes
  const col = collection(db, "recipientsPublic")
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
}

// Contact messages
export async function saveContactMessage(data: Omit<ContactMessage, "createdAt">) {
  const now = Date.now()
  // Use email+timestamp as deterministic id to avoid duplicates within the same ms
  const id = `${data.email.replace(/[^a-zA-Z0-9._-]/g, "_")}_${now}`
  const ref = doc(db, "contactMessages", id)
  await setDoc(ref, { ...data, createdAt: now })
  return id
}

// Matches and Email Logs
export type MatchRecord = {
  donorUid: string
  recipientUid: string
  score: number
  status: "pending" | "notified" | "blocked" | "ignored"
  suppressed?: boolean
  suppressedBy?: { donor?: boolean; recipient?: boolean }
  lastEmailSentAt?: number
  createdAt: number
  updatedAt: number
}

export async function getMatchId(donorUid: string, recipientUid: string) {
  return `${donorUid}__${recipientUid}`
}

export async function getMatch(donorUid: string, recipientUid: string): Promise<MatchRecord | null> {
  const id = await getMatchId(donorUid, recipientUid)
  const ref = doc(db, "matches", id)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as MatchRecord) : null
}

export async function upsertMatch(donorUid: string, recipientUid: string, score: number): Promise<string> {
  const id = await getMatchId(donorUid, recipientUid)
  const ref = doc(db, "matches", id)
  const now = Date.now()
  await setDoc(ref, {
    donorUid,
    recipientUid,
    score,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  }, { merge: true })
  return id
}

export async function markMatchNotified(matchId: string) {
  const ref = doc(db, "matches", matchId)
  await setDoc(ref, { status: "notified", lastEmailSentAt: Date.now(), updatedAt: Date.now() }, { merge: true })
}

export async function suppressMatch(matchId: string, role: "donor" | "recipient") {
  const ref = doc(db, "matches", matchId)
  await setDoc(ref, { suppressed: true, suppressedBy: { [role]: true }, status: "blocked", updatedAt: Date.now() }, { merge: true })
}

// Email logs keyed by token for easy lookup via decision links
export type EmailLog = {
  token: string
  matchId: string
  to: string
  role: "donor" | "recipient"
  type: "initial" | "reminder"
  status: "sent" | "blocked" | "ignored" | "remind"
  createdAt: number
  updatedAt: number
}

export async function createEmailLog(log: EmailLog) {
  const ref = doc(db, "emailLogs", log.token)
  await setDoc(ref, log, { merge: true })
}

export async function getEmailLogByToken(token: string): Promise<EmailLog | null> {
  const ref = doc(db, "emailLogs", token)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as EmailLog) : null
}

export async function updateEmailLogStatus(token: string, status: EmailLog["status"]) {
  const ref = doc(db, "emailLogs", token)
  await setDoc(ref, { status, updatedAt: Date.now() }, { merge: true })
}

export async function saveRecipientProfile(uid: string, data: RecipientProfile) {
  const now = Date.now()
  const ref = doc(db, "recipients", uid)
  await setDoc(ref, { ...data, updatedAt: now, createdAt: data?.createdAt || now }, { merge: true })
  // Mirror minimal public fields for matching
  const publicRef = doc(db, "recipientsPublic", uid)
  await setDoc(publicRef, {
    email: data.email || "",
    bloodType: data.bloodType || null,
    organNeeded: data.organNeeded || "",
    dateOfBirth: data.dateOfBirth || null,
    updatedAt: now,
    createdAt: data?.createdAt || now,
  }, { merge: true })
}

export async function getDonorProfile(uid: string) {
  const ref = doc(db, "donors", uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function getRecipientProfile(uid: string) {
  const ref = doc(db, "recipients", uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

// Public user role
export async function getUserPublicRole(uid: string): Promise<"admin" | "donor" | "recipient" | null> {
  const ref = doc(db, "usersPublic", uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as any
  return (data?.role as any) || null
}

// Returns 'donor' | 'recipient' | null depending on existing registration
export async function getExistingRole(uid: string): Promise<"donor" | "recipient" | null> {
  const [donor, recipient] = await Promise.all([getDonorProfile(uid), getRecipientProfile(uid)])
  if (donor) return "donor"
  if (recipient) return "recipient"
  return null
}

// Throws an error if the user already has any registration
export async function assertNoExistingRegistration(uid: string) {
  const role = await getExistingRole(uid)
  if (role) {
    const err = new Error(`You are already registered as ${role}. Please sign in and continue from your dashboard.`)
    // @ts-expect-error attach metadata
    err.code = "already-registered"
    throw err
  }
}

// Dashboard helpers
export async function countOrgansRegistered(uid: string): Promise<number> {
  // For donors: number of organs in their profile 'organs' array
  // For recipients: count as 1 if they specified organNeeded
  const [donor, recipient] = await Promise.all([getDonorProfile(uid), getRecipientProfile(uid)])
  if (donor) {
    const organs: any[] = Array.isArray((donor as any).organs) ? (donor as any).organs : []
    return organs.length
  }
  if (recipient) {
    return (recipient as any).organNeeded ? 1 : 0
  }
  return 0
}

export async function countActiveMatchesForUser(uid: string): Promise<number> {
  // Count matches where user is donor or recipient and status not in ['blocked','ignored']
  const col = collection(db, "matches")
  const [byDonorSnap, byRecipientSnap] = await Promise.all([
    getDocs(query(col, where("donorUid", "==", uid))),
    getDocs(query(col, where("recipientUid", "==", uid))),
  ])
  const allowed = new Set(["pending", "notified"]) as Set<MatchRecord["status"]>
  let count = 0
  byDonorSnap.forEach((d) => {
    const m = d.data() as MatchRecord
    if (allowed.has(m.status)) count += 1
  })
  byRecipientSnap.forEach((d) => {
    const m = d.data() as MatchRecord
    if (allowed.has(m.status)) count += 1
  })
  return count
}
