import nodemailer from 'nodemailer';
import 'dotenv/config';
const { MAIL, MAIL_PASS } = process.env;

interface MailOptions {
  name: string;
  email: string;
  resetToken: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: MAIL,
    pass: MAIL_PASS,
  },
});

export const sendMail = async function ({ name, email, resetToken }: MailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address
      to: MAIL,
      subject: 'Password Reset Request 🔒',
      html: `
        <p>Hello ${name},</p>

        <p>We received a request to reset your password. To proceed with resetting your password, please follow the link below:</p>

        <p><a href="https://localhost:3000/reset-password/?resetToken=${resetToken}" target="_blank">Reset Password</a></p>

        <p>If you didn't request a password reset, you can safely ignore this email.</p>

        <p>Best regards,<br>The ShopEazy Team</p>`, // html body
    });

    return true;
  } catch (error) {
    console.log('Error occurred while sending the mail', error);
    return false;
  }
};
