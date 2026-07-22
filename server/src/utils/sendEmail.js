
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Base HTML email wrapper  consistent branding for all emails
 */
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DevBoard</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#7c3aed;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;line-height:36px;">D</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">DevBoard</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1d27;border:1px solid #2a2d3a;border-radius:16px;padding:36px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="color:#4b5563;font-size:12px;margin:0;">
                DevBoard · Project management for dev teams
              </p>
              <p style="color:#374151;font-size:11px;margin:8px 0 0 0;">
                If you didn't expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"DevBoard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailWrapper(html),
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error.message);
  }
};


const sendInviteEmail = async ({ to, inviterName, workspaceName, role, inviteUrl }) => {
  const roleColor = role === "admin" ? "#7c3aed" : role === "member" ? "#3b82f6" : "#6b7280";

  const html = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px 0;">
      You've been invited! 🎉
    </h2>
    <p style="color:#9ca3af;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
      <strong style="color:#e5e7eb;">${inviterName}</strong> has invited you to join
      <strong style="color:#e5e7eb;">${workspaceName}</strong> on DevBoard.
    </p>

    <!-- Role badge -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:${roleColor}20;border:1px solid ${roleColor}40;border-radius:20px;padding:4px 14px;">
          <span style="color:${roleColor};font-size:13px;font-weight:600;text-transform:capitalize;">${role}</span>
        </td>
      </tr>
    </table>

    <!-- What you can do -->
    <div style="background:#111827;border:1px solid #1f2937;border-radius:10px;padding:20px;margin-bottom:28px;">
      <p style="color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px 0;">
        As a ${role} you can
      </p>
      ${role === "admin" ? `
        <p style="color:#d1d5db;font-size:13px;margin:0 0 6px 0;">✓ Manage all projects and tasks</p>
        <p style="color:#d1d5db;font-size:13px;margin:0 0 6px 0;">✓ Invite and manage team members</p>
        <p style="color:#d1d5db;font-size:13px;margin:0;">✓ Access analytics and settings</p>
      ` : role === "member" ? `
        <p style="color:#d1d5db;font-size:13px;margin:0 0 6px 0;">✓ Create and manage tasks</p>
        <p style="color:#d1d5db;font-size:13px;margin:0 0 6px 0;">✓ Move tasks across columns</p>
        <p style="color:#d1d5db;font-size:13px;margin:0;">✓ View analytics dashboard</p>
      ` : `
        <p style="color:#d1d5db;font-size:13px;margin:0 0 6px 0;">✓ View all projects and tasks</p>
        <p style="color:#d1d5db;font-size:13px;margin:0;">✓ View analytics dashboard</p>
      `}
    </div>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${inviteUrl}"
            style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
            Accept Invitation →
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#4b5563;font-size:12px;margin:20px 0 0 0;text-align:center;">
      Or copy this link: <span style="color:#7c3aed;">${inviteUrl}</span>
    </p>
  `;

  await sendEmail({
    to,
    subject: `You've been invited to ${workspaceName} on DevBoard`,
    html,
  });
};

export { sendEmail, sendInviteEmail };