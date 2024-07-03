import nodemailer from "nodemailer";
import dotenv from "dotenv";
import interviewScheduleMail from '../mails/interviewMail.js'
import { winstonLogger } from "../middleware/logger.js";
import { otpMail } from "../mails/otpMail.js";
dotenv.config();



const transporter = nodemailer.createTransport({
  service: "gmail",
  host:"smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER_ID,
    pass: process.env.MAIL_USER_PASS,
  },
});

const sendInterviewNotification = (from:string,to:string,studentName:string, interviewerName:string, interviewLink:string, interviewDate:string, interviewTime:string) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: 'Interview Schedule Notification',
        html: interviewScheduleMail(studentName, interviewerName, interviewLink, interviewDate, interviewTime)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return winstonLogger.error(error.message);
      }
      winstonLogger.info("Email sent: "+ info.response);
  });
};

export const sendOtpNotification = (from:string,to:string,otp:string) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: 'One Time Password',
        html: otpMail(otp)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return winstonLogger.error(error.message);
        }
        winstonLogger.info("Email sent: "+ info.response);
    });
};

export default sendInterviewNotification;
