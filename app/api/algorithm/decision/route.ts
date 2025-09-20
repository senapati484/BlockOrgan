// api/algorithm/decision

import { NextRequest, NextResponse } from "next/server"
import { getEmailLogByToken, suppressMatch, updateEmailLogStatus } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token") || ""
    const action = (searchParams.get("action") || "").toLowerCase()
    if (!token || !action) {
      return NextResponse.json({ ok: false, error: "missing token or action" }, { status: 400 })
    }

    const log = await getEmailLogByToken(token)
    if (!log) return NextResponse.json({ ok: false, error: "invalid token" }, { status: 404 })

    switch (action) {
      case "block":
        await suppressMatch(log.matchId, log.role)
        await updateEmailLogStatus(token, "blocked")
        return NextResponse.json({ ok: true, message: "We will no longer email you about this match." })
      case "remind":
        await updateEmailLogStatus(token, "remind")
        return NextResponse.json({ ok: true, message: "We will remind you later about this match." })
      case "ignore":
        await updateEmailLogStatus(token, "ignored")
        return NextResponse.json({ ok: true, message: "We will temporarily stop emails about this match." })
      default:
        return NextResponse.json({ ok: false, error: "invalid action" }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "decision failed" }, { status: 500 })
  }
}
