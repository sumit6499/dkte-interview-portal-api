"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const interviewMail_js_1 = __importDefault(require("../mails/interviewMail.js"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_USER_ID,
        pass: process.env.MAIL_USER_PASS,
    },
});
const sendInterviewNotification = (from, to, studentName, interviewerName, interviewLink, interviewDate, interviewTime) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: 'Interview Schedule Notification',
        html: (0, interviewMail_js_1.default)(studentName, interviewerName, interviewLink, interviewDate, interviewTime)
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};
exports.default = sendInterviewNotification;
//# sourceMappingURL=mail.js.map