import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const Google_NODE_MAILER_PASS = process.env.Google_NODE_MAILER_PASS;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    pass: Google_NODE_MAILER_PASS,
    user: "zencommunity.dev@gmail.com",
  },
});


export {transport}
