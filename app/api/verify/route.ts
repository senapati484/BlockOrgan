import { NextRequest, NextResponse } from "next/server"
import { verifyUserOnChain } from "@/lib/chain"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { uid } = body || {}
    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "uid is required" }, { status: 400 })
    }
    const exists = await verifyUserOnChain(uid)
    return NextResponse.json({ ok: true, exists })
  } catch (e: any) {
    console.error("/api/verify error", e)
    return NextResponse.json({ ok: false, error: e?.message || "verify failed" }, { status: 500 })
  }
}
