"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interviewScheduleMail = (studentName, interviewerName, interviewLink, interviewDate, interviewTime) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Schedule Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #dddddd;
            }
            .content {
                padding: 20px 0;
            }
            .content p {
                margin: 10px 0;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #dddddd;
                color: #777777;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Interview Schedule Notification</h2>
            </div>
            <div class="content">
                <p>Dear <strong>${studentName}</strong>,</p>
                <p>We are pleased to inform you that an interview has been scheduled for you.</p>
                <p><strong>Interviewer Assigned:</strong> ${interviewerName}</p>
                <p><strong>Interview Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
                <p><strong>Date:</strong> ${interviewDate}</p>
                <p><strong>Time:</strong> ${interviewTime}</p>
                <p>Best regards,</p>
                <p>The Admin Team</p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
`;
};
exports.default = interviewScheduleMail;
//# sourceMappingURL=interviewMail.js.map