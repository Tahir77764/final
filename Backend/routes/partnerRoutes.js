const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");
const Ngo = require("../models/Ngo");
const { sendOtp } = require("../utils/sendOtp");

// Temporary OTP Store for partners
const partnerOtpStore = new Map();

// ==========================================
// SEND OTP (for both Hospital & NGO)
// ==========================================
router.post("/send-otp", async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email) return res.status(400).json({ error: "Email is required" });

        // Check if already registered
        if (type === "hospital") {
            const existing = await Hospital.findOne({ email });
            if (existing) {
                return res.status(400).json({ error: "This email is already registered as a hospital partner." });
            }
        } else if (type === "ngo") {
            const existing = await Ngo.findOne({ email });
            if (existing) {
                return res.status(400).json({ error: "This email is already registered as an NGO partner." });
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5 min expiry
        partnerOtpStore.set(email, {
            otp,
            type,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // Send OTP email
        await sendOtp(email, otp);

        console.log(`OTP sent to ${email} for ${type} registration`);
        res.json({ message: "OTP sent successfully to your email." });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
});

// ==========================================
// VERIFY OTP
// ==========================================
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedData = partnerOtpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
        }

        if (Date.now() > storedData.expiresAt) {
            partnerOtpStore.delete(email);
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // OTP verified — mark as verified
        partnerOtpStore.set(email, { ...storedData, verified: true });

        res.json({ message: "Email verified successfully!" });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ error: "Verification failed. Please try again." });
    }
});

// ==========================================
// REGISTER HOSPITAL PARTNER
// ==========================================
router.post("/hospital", async (req, res) => {
    try {
        const { email } = req.body;

        // Check OTP verification
        const otpData = partnerOtpStore.get(email);
        if (!otpData || !otpData.verified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email with OTP first." });
        }

        const existing = await Hospital.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "A hospital with this email is already registered." });
        }

        const hospital = new Hospital(req.body);
        await hospital.save();

        // Clean up OTP store
        partnerOtpStore.delete(email);

        res.status(201).json({ message: "Hospital partnership request submitted successfully!" });
    } catch (error) {
        console.error("Hospital Registration Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// REGISTER NGO PARTNER
// ==========================================
router.post("/ngo", async (req, res) => {
    try {
        const { email } = req.body;

        // Check OTP verification
        const otpData = partnerOtpStore.get(email);
        if (!otpData || !otpData.verified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email with OTP first." });
        }

        const existing = await Ngo.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "An NGO with this email is already registered." });
        }

        const ngo = new Ngo(req.body);
        await ngo.save();

        // Clean up OTP store
        partnerOtpStore.delete(email);

        res.status(201).json({ message: "NGO partnership request submitted successfully!" });
    } catch (error) {
        console.error("NGO Registration Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get all registered hospitals
router.get("/hospitals", async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ createdAt: -1 });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all registered NGOs
router.get("/ngos", async (req, res) => {
    try {
        const ngos = await Ngo.find().sort({ createdAt: -1 });
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
