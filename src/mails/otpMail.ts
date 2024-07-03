export const otpMail=(otp:string)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .otp {
                font-size: 32px;
                color: #4CAF50;
                margin: 20px 0;
            }
            .footer {
                background-color: #f7f7f7;
                color: #333333;
                text-align: center;
                padding: 10px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                OTP Verification
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) for verification is:</p>
                <p class="otp">${otp}</p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                &copy; 2024 Your Company. All rights reserved.
            </div>
        </div>
    </body>
    </html>
`
}
