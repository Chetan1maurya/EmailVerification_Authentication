import dotenv from 'dotenv'
dotenv.config()
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendVerificationEmail = async (
  email,
  username,
  verificationLink,
) => {
  try {
    console.log("SendVerificationEmail me problem hai ", email);
    console.log(process.env.SENDER_EMAIL)
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `
            <h2>Hello ${username},</h2>
            
            <p>
            Thank you for registering.
            </p>
            
            <p>
        Click the button below to verify your email:
        </p>

      <a
      href="${verificationLink}"
      style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
        </a>

      <p>
      If you did not create this account, you can ignore this email.
      </p>
      `,
    });
    console.log(response);
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({
        message: "Unable to send verification email",
    });
  }
};


