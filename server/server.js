const express = require('express');
const cors = require('cors');

const { sendOTP } = require('./emailServices');

const app = express();
const port = 3000;

app.use(cors());//Enable CORS: Allows your browser (frontend) to talk to this server
app.use(express.json());//Enable JSON: Allows the server to read data sent in the request body

app.post('/api/send-otp', async (req, res) => {
    console.log("Received request to send OTP...");
    const { email } = req.body;
    if (!email) { return res.status(400).json({ error: "Email address is required" }); }
    try {
        const otpNumber = await sendOTP(email);
        console.log(`Success! OTP ${otpNumber} sent to ${email}`);
        // Respond to the frontend
        // NOTE: Sending the OTP back is for testing/learning only. 
        // In production, you would save it to a database and just say "Sent".
        res.status(200).json({ message: "OTP sent successfully", otp: otpNumber });
    } catch (error) {
        console.error("Failed to send OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });    
    }
})

app.listen(port, () => console.log('Backend Server running on port 3000'));