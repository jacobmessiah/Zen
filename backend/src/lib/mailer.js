import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_USER = process.env.SMTP_USER;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    pass: SMTP_PASS,
    user: SMTP_USER,
  },
});

export { transport };
