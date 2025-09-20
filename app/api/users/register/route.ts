import { NextRequest, NextResponse } from "next/server"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const allowedRoles = new Set(["donor", "recipient", "admin"]) as Set<string>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { uid, email, role } = body || {}

    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "uid is required" }, { status: 400 })
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 })
    }
    if (!role || typeof role !== "string" || !allowedRoles.has(role)) {
      return NextResponse.json({ error: "role must be one of donor|recipient|admin" }, { status: 400 })
    }

    const now = Date.now()
    const ref = doc(db, "usersPublic", uid)
    await setDoc(ref, { uid, email, role, createdAt: now, updatedAt: now }, { merge: true })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("/api/users/register error", e)
    return NextResponse.json({ ok: false, error: e?.message || "register failed" }, { status: 500 })
  }
}
