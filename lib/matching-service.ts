// lib/matching-service.ts
import crypto from "crypto";
import {
    listDonors,
    listRecipients,
    upsertMatch,
    markMatchNotified,
    createEmailLog,
    getDonorByUid,
    getRecipientByUid
} from "@/lib/db";
import { decisionLinks, sendEmail } from "@/lib/mailer";

export interface MatchResult {
    success: boolean;
    matchesProcessed: number;
    emailsSent: number;
    errors: string[];
}

export class MatchingService {
    // Very simple compatibility scoring
    static scorePair(donor: any, recipient: any): number {
        let score = 0;

        // Blood type compatibility
        if (donor.bloodType && recipient.bloodType && donor.bloodType === recipient.bloodType) {
            score += 20;
        }

        // Organ match
        const wanted = String(recipient.organNeeded || "").toLowerCase().trim();
        const donorOrgans: string[] = Array.isArray(donor.organs)
            ? donor.organs.map((o: string) => o.toLowerCase().trim())
            : [];

        if (wanted && donorOrgans.includes(wanted)) {
            score += 10;
        }

        // Age proximity (optional)
        if (donor.dateOfBirth && recipient.dateOfBirth) {
            try {
                const d1 = new Date(donor.dateOfBirth).getTime();
                const d2 = new Date(recipient.dateOfBirth).getTime();
                const years = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24 * 365);
                score += Math.max(0, 10 - Math.min(10, years));
            } catch (e) {
                // Ignore date errors
            }
        }

        return score;
    }

    // Check if donor and recipient are compatible
    static areCompatible(donor: any, recipient: any): boolean {
        const wanted = String(recipient.organNeeded || "").toLowerCase().trim();
        if (!wanted) return false;

        const donorOrgans: string[] = Array.isArray(donor.organs)
            ? donor.organs.map((o: string) => o.toLowerCase().trim())
            : [];

        return donorOrgans.includes(wanted);
    }

    // Send match notification to both parties
    static async notifyMatch(donor: any, recipient: any, organType: string): Promise<boolean> {
        try {
            const matchId = await upsertMatch(donor.uid, recipient.uid, this.scorePair(donor, recipient));

            // Generate unique tokens for each party
            const tokenDonor = crypto.randomBytes(16).toString("hex");
            const tokenRecipient = crypto.randomBytes(16).toString("hex");

            const donorLinks = decisionLinks(tokenDonor);
            const recipientLinks = decisionLinks(tokenRecipient);

            const subject = `Potential Match Found: ${organType.toUpperCase()}`;

            // Personalized email templates
            const donorHtml = `
        <h2>Potential Recipient Match</h2>
        <p>We found a recipient who needs a <b>${organType}</b> donation.</p>
        <p>If you're interested in proceeding with this match, please contact our coordinator.</p>
        <p>If you do not want to receive further emails about this match:</p>
        <ul>
          <li><a href="${donorLinks.block}">Block</a> further emails for this match</li>
          <li><a href="${donorLinks.remind}">Remind me later</a></li>
          <li><a href="${donorLinks.ignore}">Ignore</a> for now</li>
        </ul>
        <p>Thank you for being part of BlockOrgan.</p>
      `;

            const recipientHtml = `
        <h2>Potential Donor Match</h2>
        <p>We found a donor who can provide a <b>${organType}</b>.</p>
        <p>If you're interested in proceeding with this match, please contact our coordinator.</p>
        <p>If you do not want to receive further emails about this match:</p>
        <ul>
          <li><a href="${recipientLinks.block}">Block</a> further emails for this match</li>
          <li><a href="${recipientLinks.remind}">Remind me later</a></li>
          <li><a href="${recipientLinks.ignore}">Ignore</a> for now</li>
        </ul>
        <p>Thank you for being part of BlockOrgan.</p>
      `;

            const emailPromises = [];

            // Send email to donor
            if (donor.email) {
                emailPromises.push(
                    sendEmail({
                        to: donor.email,
                        subject,
                        html: donorHtml
                    }).then(() =>
                        createEmailLog({
                            token: tokenDonor,
                            matchId,
                            to: donor.email,
                            role: "donor",
                            type: "initial",
                            status: "sent",
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        })
                    ).catch(err => {
                        console.error("Donor email error", { to: donor.email, matchId, err });
                        return createEmailLog({
                            token: tokenDonor,
                            matchId,
                            to: donor.email,
                            role: "donor",
                            type: "initial",
                            status: "failed",
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            error: err.message
                        });
                    })
                );
            }

            // Send email to recipient
            if (recipient.email) {
                emailPromises.push(
                    sendEmail({
                        to: recipient.email,
                        subject,
                        html: recipientHtml
                    }).then(() =>
                        createEmailLog({
                            token: tokenRecipient,
                            matchId,
                            to: recipient.email,
                            role: "recipient",
                            type: "initial",
                            status: "sent",
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        })
                    ).catch(err => {
                        console.error("Recipient email error", { to: recipient.email, matchId, err });
                        return createEmailLog({
                            token: tokenRecipient,
                            matchId,
                            to: recipient.email,
                            role: "recipient",
                            type: "initial",
                            status: "failed",
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            error: err.message
                        });
                    })
                );
            }

            // Wait for all emails to be sent
            await Promise.allSettled(emailPromises);
            await markMatchNotified(matchId);

            return true;
        } catch (error) {
            console.error("Error notifying match", { donor: donor.uid, recipient: recipient.uid, error });
            return false;
        }
    }

    // Find and notify all compatible matches
    static async findAndNotifyAllMatches(): Promise<MatchResult> {
        const result: MatchResult = {
            success: true,
            matchesProcessed: 0,
            emailsSent: 0,
            errors: []
        };

        try {
            const donors = await listDonors();
            const recipients = await listRecipients();

            const matchPromises = [];

            for (const donor of donors) {
                for (const recipient of recipients) {
                    // Check if donor offers what recipient needs
                    if (this.areCompatible(donor, recipient)) {
                        const wanted = String(recipient.organNeeded || "").toLowerCase().trim();
                        const score = this.scorePair(donor, recipient);

                        if (score >= 20) { // Threshold
                            result.matchesProcessed++;
                            matchPromises.push(
                                this.notifyMatch(donor, recipient, wanted)
                                    .then(success => {
                                        if (success) result.emailsSent += 2; // Count both emails
                                    })
                                    .catch(error => {
                                        result.errors.push(`Match failed: ${error.message}`);
                                    })
                            );
                        }
                    }
                }
            }

            await Promise.allSettled(matchPromises);
            return result;
        } catch (error: any) {
            result.success = false;
            result.errors.push(`Algorithm failed: ${error.message}`);
            return result;
        }
    }

    // Find and notify matches for a specific user
    static async findAndNotifyUserMatches(uid: string): Promise<MatchResult> {
        const result: MatchResult = {
            success: true,
            matchesProcessed: 0,
            emailsSent: 0,
            errors: []
        };

        try {
            // Check if user is a donor or recipient
            const [donor, recipient] = await Promise.all([
                getDonorByUid(uid),
                getRecipientByUid(uid)
            ]);

            const isDonor = !!donor;
            const isRecipient = !!recipient;

            if (!isDonor && !isRecipient) {
                result.success = false;
                result.errors.push("No public profile found");
                return result;
            }

            const matchPromises = [];

            if (isDonor) {
                // This user is a donor, find compatible recipients
                const recipients = await listRecipients();

                for (const recip of recipients) {
                    if (this.areCompatible(donor, recip)) {
                        const wanted = String(recip.organNeeded || "").toLowerCase().trim();
                        const score = this.scorePair(donor, recip);

                        if (score >= 20) {
                            result.matchesProcessed++;
                            matchPromises.push(
                                this.notifyMatch(donor, recip, wanted)
                                    .then(success => {
                                        if (success) result.emailsSent += 2;
                                    })
                                    .catch(error => {
                                        result.errors.push(`Match failed: ${error.message}`);
                                    })
                            );
                        }
                    }
                }
            }

            if (isRecipient) {
                // This user is a recipient, find compatible donors
                const donors = await listDonors();

                for (const don of donors) {
                    if (this.areCompatible(don, recipient)) {
                        const wanted = String(recipient.organNeeded || "").toLowerCase().trim();
                        const score = this.scorePair(don, recipient);

                        if (score >= 20) {
                            result.matchesProcessed++;
                            matchPromises.push(
                                this.notifyMatch(don, recipient, wanted)
                                    .then(success => {
                                        if (success) result.emailsSent += 2;
                                    })
                                    .catch(error => {
                                        result.errors.push(`Match failed: ${error.message}`);
                                    })
                            );
                        }
                    }
                }
            }

            await Promise.allSettled(matchPromises);
            return result;
        } catch (error: any) {
            result.success = false;
            result.errors.push(`User match failed: ${error.message}`);
            return result;
        }
    }
}