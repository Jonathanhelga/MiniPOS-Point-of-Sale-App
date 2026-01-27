require('dotenv').config();
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g., 'yourname@gmail.com'
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

const sendOTP = async (userEmail) => {
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true
    });
    const mailOptions = {
        from: `"Mini PoOoS Security" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${otp}. It expires in 5 minutes.`, // Plain text fallback
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Verify Your Email</h2>
                <p>Use the code below to complete your setup for Mini PoOoS:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
                <p>If you didn't request this, ignore this email.</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail}`);
        return otp;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = { sendOTP };