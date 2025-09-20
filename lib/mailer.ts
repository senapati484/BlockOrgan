// lib/mailer.ts

import nodemailer from "nodemailer"

// Support both private server envs and the provided NEXT_PUBLIC_* fallbacks
const SMTP_HOST = process.env.SMTP_HOST || process.env.NEXT_PUBLIC_SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT || process.env.NEXT_PUBLIC_SMTP_PORT
const SMTP_SECURE = process.env.SMTP_SECURE || process.env.NEXT_PUBLIC_SMTP_SECURE
const SMTP_USER = process.env.SMTP_USER || process.env.NEXT_PUBLIC_SMTP_EMAIL
const SMTP_PASS = process.env.SMTP_PASS || process.env.NEXT_PUBLIC_SMTP_PASS
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER
const APP_BASE_URL = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL

export function ensureMailerEnv() {
    const required: Array<[string, string | undefined]> = [
        ["SMTP_HOST", SMTP_HOST],
        ["SMTP_PORT", SMTP_PORT],
        ["SMTP_USER", SMTP_USER],
        ["SMTP_PASS", SMTP_PASS],
        ["MAIL_FROM", MAIL_FROM],
        ["APP_BASE_URL", APP_BASE_URL],
    ]
    const missing = required.filter(([_, v]) => !v).map(([k]) => k)
    if (missing.length) {
        throw new Error(`Missing mail environment variables: ${missing.join(", ")}`)
    }
}

export function createTransport() {
    ensureMailerEnv()
    const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        // If using Gmail with port 465, secure must be true
        port: Number(SMTP_PORT || 587),
        secure: String(SMTP_SECURE ?? (SMTP_PORT === "465" ? "true" : "false")).toLowerCase() === "true",
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })
    return transport
}

export async function sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
    const transporter = createTransport()
    const info = await transporter.sendMail({
        from: MAIL_FROM,
        ...options,
    })
    return info
}

export function decisionLinks(token: string) {
    const base = APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000"
    const make = (action: string) => `${base}/api/algorithm/decision?token=${encodeURIComponent(token)}&action=${action}`
    return {
        block: make("block"),
        remind: make("remind"),
        ignore: make("ignore"),
    }
}

