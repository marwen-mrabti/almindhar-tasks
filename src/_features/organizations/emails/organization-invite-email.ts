import { emailColors } from "@/_features/auth/emails/email-colors";
import { validateWithPretty } from "@/lib/helpers";
import { sendEmail } from "@/lib/send-email";
import { z } from "zod";

const organizationInviteSchema = z.object({
  invitation: z.object({
    id: z.string(),
  }),
  inviter: z.object({
    name: z.string(),
  }),
  organization: z.object({
    name: z.string(),
  }),
  email: z.email(),
});

export async function sendOrganizationInviteEmail({
  invitation,
  inviter,
  organization,
  email,
}: {
  invitation: { id: string }
  inviter: { name: string }
  organization: { name: string }
  email: string
}) {
  const validated = validateWithPretty(organizationInviteSchema, {
    invitation,
    inviter,
    organization,
    email,
  });

  await sendEmail({
    to: email,
    subject: `You're invited to join the ${validated.organization.name} organization`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: ${emailColors.background}; color: ${emailColors.foreground};">
        <h2 style="color: #333;">You're invited to join ${validated.organization.name}</h2>
        <p>Hello ${validated.inviter.name},</p>
        <p>${validated.inviter.name} invited you to join the ${validated.organization.name} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${process.env.BASE_URL}/organizations/invites/${validated.invitation.id}" style="background-color: ${emailColors.primary}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `You're invited to join the ${validated.organization.name} organization\n\nHello ${validated.inviter.name},\n\n${validated.inviter.name} invited you to join the ${validated.organization.name} organization. Please click the link below to accept/reject the invitation:\n\n${process.env.BASE_URL}/organizations/invites/${validated.invitation.id}\n\nBest regards,\nYour App Team`,
  })
}
