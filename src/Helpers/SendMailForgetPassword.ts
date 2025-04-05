import nodemailer from 'nodemailer'

export const sendForgetPasswordMail = async (email: any, token: any) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process?.env.EMAIL_USER,
            pass: process?.env.EMAIL_PASSWORD
        }
    });

    const ui = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff !important;
            background: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .btn:hover {
            background: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to proceed.</p>
        <a href="${process?.env?.UI_BASE_URL}?token=${token}" class="btn">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
            <p>&copy; 2025 Global Health Center. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
    var mailOptions = {
        from: process?.env.EMAIL_USER,
        to: email,
        subject: 'Forget Password',
        html: ui
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

export const createRandomString = (length = 25) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}