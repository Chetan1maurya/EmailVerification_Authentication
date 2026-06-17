import dotenv from 'dotenv'
dotenv.config()
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (
  email,
  username,
  resetLink
) => {
  await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `
      <h2>Hello ${username}</h2>

      <p>Click the button below to reset your password.</p>

      <a
        href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Reset Password
      </a>

      <p>This link will expire in 15 minutes.</p>
    `,
  });
};