// app/api/match/for-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MatchingService } from "@/lib/matching-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const uid: string | undefined = body?.uid;

        if (!uid) {
            return NextResponse.json({ error: "uid is required" }, { status: 400 });
        }

        const result = await MatchingService.findAndNotifyUserMatches(uid);

        if (result.success) {
            return NextResponse.json({
                ok: true,
                matchesProcessed: result.matchesProcessed,
                emailsSent: result.emailsSent,
                errors: result.errors
            });
        } else {
            return NextResponse.json({
                ok: false,
                error: result.errors.join(", ")
            }, { status: 500 });
        }
    } catch (e: any) {
        console.error("/api/match/for-user error", e);
        return NextResponse.json({
            ok: false,
            error: e?.message || "Match failed"
        }, { status: 500 });
    }
}