const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");
const Request = require("../models/Request");
const Match = require("../models/Match");
const { sendOtp, sendContactEmail, sendResponseToRecipient } = require("../utils/sendOtp");

// Middleware to verify Token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "vtprintz_jwt_secret_key_123");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

// Temporary OTP Store
const otpStore = new Map();

// 1. Send OTP for Registration
// 1. Send OTP for Registration (Deprecated for logged-in users but kept for legacy)
router.post("/send-otp", async (req, res) => {
  // ... existing logic ...
  // (We can keep this or just add the new route. Let's add the new route above/below)
  try {
    const { email } = req.body;
    // ...
    // keeping existing content just for safety, but we will add the new one below
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    await sendOtp(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// NEW: Add Donor (Directly from DonorForm for logged-in users)
router.post("/add", async (req, res) => {
  try {
    const donorData = req.body;

    // Check if donor profile already exists for this email
    const existingDonor = await Donor.findOne({ email: donorData.email });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor profile already exists for this email" });
    }

    const donor = new Donor(donorData);
    await donor.save();

    res.status(201).json({ message: "Donor profile created successfully" });

  } catch (error) {
    console.error("ADD DONOR ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Verify OTP & Register Donor
router.post("/verify-register", async (req, res) => {
  try {
    const { otp, password, ...donorData } = req.body;
    const email = donorData.email;

    const storedData = otpStore.get(email);

    if (!storedData) return res.status(400).json({ error: "OTP expired or not found." });
    if (storedData.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = new Donor({ ...donorData, password: hashedPassword });
    await donor.save();

    otpStore.delete(email);

    res.status(201).json({ message: "Donor registered successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Donor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ error: "Donor not found" });

    const validPass = await bcrypt.compare(password, donor.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ _id: donor._id }, process.env.JWT_SECRET || "vtprintz_jwt_secret_key_123");
    res.header("Authorization", token).json({ token, donorId: donor._id, name: donor.name });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Requests for Donor
router.get("/requests", verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match Donor (Existing Logic)
router.post("/match", async (req, res) => {
  try {
    const { bloodGroup, HLA_A1, HLA_A2, HLA_B1, HLA_B2, HLA_C1, HLA_C2, HLA_DRB1_1, HLA_DRB1_2, HLA_DQ1, HLA_DQ2 } = req.body;

    // 1. Fetch ALL donors of the requested blood group
    // We add a cleanup for the bloodGroup string just in case
    const targetBloodGroup = bloodGroup ? bloodGroup.trim() : "";
    const donors = await Donor.find({ bloodGroup: targetBloodGroup });

    if (!donors.length) return res.json([]);

    // 2. Helper to normalize and compare types (ignore colons/spaces)
    const normalize = (val) => val ? val.toString().trim().replace(/[\s:]/g, "").toUpperCase() : "";

    const userHLA = {
      HLA_A1, HLA_A2, HLA_B1, HLA_B2, HLA_C1, HLA_C2, HLA_DRB1_1, HLA_DRB1_2, HLA_DQ1, HLA_DQ2
    };

    // 3. Score donors based on matches
    const scoredDonors = donors.map(donor => {
      let matchScore = 0;

      // Compare each locus provided in req.body with the donor's record
      Object.keys(userHLA).forEach(locus => {
        const userValue = normalize(userHLA[locus]);
        const donorValue = normalize(donor[locus]);

        if (userValue && userValue === donorValue) {
          matchScore++;
        }
      });

      return { ...donor.toObject(), matchScore };
    });

    // 4. Return results sorted by matchScore
    const results = scoredDonors
      .filter(d => d.matchScore > 0) // Only show donors with at least 1 HLA match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50); // Limit to top 50 to avoid overwhelming the frontend

    res.json(results);

  } catch (error) {
    console.error("Match Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Contact Donor (Save Request & Email)
router.post("/contact", async (req, res) => {
  try {
    const { donorId, recipientDetails, recipientName, recipientEmail, recipientPhone } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    // Save Request to DB
    const newRequest = new Request({
      donorId,
      recipientName: recipientName || "Anonymous Patient",
      recipientEmail: recipientEmail || "Not Provided",
      recipientPhone: recipientPhone || "Not Provided",
      recipientDetails,
      status: "Pending"
    });
    await newRequest.save();

    // Send Email to Donor with Accept/Decline buttons
    if (donor.email) {
      await sendContactEmail(donor.email, recipientDetails, newRequest._id);
    }

    res.json({ message: "Request sent successfully" });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      error: "Failed to process request",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// NEW: Hospital Direct Match (No email request)
router.post("/hospital-match", async (req, res) => {
  try {
    const { donorId, recipientDetails, recipientName, recipientEmail, recipientPhone, hospitalId, hospitalName } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    // 1. Create a Match entry directly
    const newMatch = new Match({
        requestId: new mongoose.Types.ObjectId(),
        donorId: donor._id,
        donorName: donor.name || donor.Name || "Anonymous Donor",
        donorEmail: donor.email || donor.Email || "",
        donorPhone: donor.phone || donor.Mobile || "",
        donorBloodGroup: donor.bloodGroup || donor.Blood_Group || "",
        recipientName: recipientName || "Anonymous Patient",
        recipientEmail: recipientEmail || "Not Provided",
        recipientPhone: recipientPhone || "Not Provided",
        recipientDetails,
        status: "Matched"
    });
    await newMatch.save();

    // Calculate HLA match details for the notification
    const normalize = (val) => val ? val.toString().trim().replace(/[\s:]/g, "").toUpperCase() : "";
    const hlaLoci = ["HLA_A1", "HLA_A2", "HLA_B1", "HLA_B2", "HLA_C1", "HLA_C2", "HLA_DRB1_1", "HLA_DRB1_2", "HLA_DQ1", "HLA_DQ2"];
    let matchCount = 0;
    let matchedLoci = [];

    hlaLoci.forEach(locus => {
      const recipientVal = normalize(recipientDetails[locus]);
      const donorVal = normalize(donor[locus]);
      if (recipientVal && recipientVal === donorVal) {
        matchCount++;
        matchedLoci.push(locus.replace("HLA_", ""));
      }
    });

    const hlaDetails = matchCount > 0 ? `${matchCount}/10 HLA Matches: ${matchedLoci.join(", ")}` : "Match recorded";

    // 2. Create a Message entry for the hospital inbox
    const Message = require("../models/Message");
    const newMessage = new Message({
        hospitalId: hospitalId || "",
        hospitalName: hospitalName || "Partner Hospital",
        recipientName: recipientName || "Anonymous Patient",
        donorName: donor.name || donor.Name || "Anonymous Donor",
        donorDetails: {
            email: donor.email || donor.Email || "",
            phone: donor.phone || donor.Mobile || "",
            bloodGroup: donor.bloodGroup || donor.Blood_Group || "",
            age: parseInt(donor.age || donor.Age) || 0
        },
        recipientDetails: recipientDetails,
        message: `Direct match confirmed for patient ${recipientName}. Score: ${hlaDetails}. Donor: ${donor.name || donor.Name || 'Anonymous'} (${donor.bloodGroup || donor.Blood_Group || 'N/A'})`,
        status: "Unread"
    });
    await newMessage.save();

    res.json({ message: "Direct match recorded successfully", matchId: newMatch._id });

  } catch (error) {
    console.error("Hospital Match Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: NGO Direct Match (For NGO's Inbox)
router.post("/ngo-match", async (req, res) => {
  try {
    const { donorId, recipientDetails, recipientName, recipientEmail, recipientPhone, ngoId, ngoName } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    // 1. Create a Match entry directly
    const newMatch = new Match({
        requestId: new mongoose.Types.ObjectId(),
        donorId: donor._id,
        donorName: donor.name || donor.Name || "Anonymous Donor",
        donorEmail: donor.email || donor.Email || "",
        donorPhone: donor.phone || donor.Mobile || "",
        donorBloodGroup: donor.bloodGroup || donor.Blood_Group || "",
        recipientName: recipientName || "Anonymous Patient",
        recipientEmail: recipientEmail || "Not Provided",
        recipientPhone: recipientPhone || "Not Provided",
        recipientDetails,
        status: "Matched"
    });
    await newMatch.save();

    // Calculate HLA match details
    const normalize = (val) => val ? val.toString().trim().replace(/[\s:]/g, "").toUpperCase() : "";
    const hlaLoci = ["HLA_A1", "HLA_A2", "HLA_B1", "HLA_B2", "HLA_C1", "HLA_C2", "HLA_DRB1_1", "HLA_DRB1_2", "HLA_DQ1", "HLA_DQ2"];
    let matchCount = 0;
    let matchedLoci = [];

    hlaLoci.forEach(locus => {
      const recipientVal = normalize(recipientDetails[locus]);
      const donorVal = normalize(donor[locus]);
      if (recipientVal && recipientVal === donorVal) {
        matchCount++;
        matchedLoci.push(locus.replace("HLA_", ""));
      }
    });

    const hlaDetails = matchCount > 0 ? `${matchCount}/10 HLA Matches: ${matchedLoci.join(", ")}` : "Match recorded";

    // 2. Create a Message entry for the NGO's inbox
    const Message = require("../models/Message");
    const newMessage = new Message({
        hospitalId: ngoId || "", // Reuse hospitalId field for NGO ID to keep schema simple
        hospitalName: ngoName || "NGO Partner",
        recipientName: recipientName || "Anonymous Patient",
        donorName: donor.name || donor.Name || "Anonymous Donor",
        donorDetails: {
            email: donor.email || donor.Email || "",
            phone: donor.phone || donor.Mobile || "",
            bloodGroup: donor.bloodGroup || donor.Blood_Group || "",
            age: parseInt(donor.age || donor.Age) || 0
        },
        recipientDetails: recipientDetails,
        message: `New Compatibility Match Found! ${hlaDetails}. Matching initiated for patient ${recipientName}.`,
        status: "Unread"
    });
    await newMessage.save();

    res.json({ message: "NGO match recorded successfully", matchId: newMatch._id });

  } catch (error) {
    console.error("NGO Match Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Donor Response — Accept or Decline (clicked from email)
router.get("/respond/:requestId/:response", async (req, res) => {
  try {
    const { requestId, response } = req.params;

    // Validate response
    if (response !== "accept" && response !== "decline") {
      return res.status(400).send("<h2>Invalid response.</h2>");
    }

    // Find the request
    const donorRequest = await Request.findById(requestId);
    if (!donorRequest) {
      return res.status(404).send(`
        <div style="font-family: Arial; text-align: center; padding: 50px;">
          <h2 style="color: #e74c3c;">Request Not Found</h2>
          <p>This request may have already been responded to or does not exist.</p>
        </div>
      `);
    }

    // Check if already responded
    if (donorRequest.status !== "Pending") {
      return res.send(`
        <div style="font-family: Arial; text-align: center; padding: 50px;">
          <h2 style="color: #e67e22;">Already Responded</h2>
          <p>You have already responded to this request. Your response was: <strong>${donorRequest.status}</strong></p>
        </div>
      `);
    }

    // Update request status
    donorRequest.status = response === "accept" ? "Accepted" : "Rejected";
    await donorRequest.save();

    // Get donor name for the email
    const donor = await Donor.findById(donorRequest.donorId);
    const donorName = donor ? donor.name : "A Donor";

    // Send response email to recipient
    if (donorRequest.recipientEmail && donorRequest.recipientEmail !== "Not Provided") {
      await sendResponseToRecipient(
        donorRequest.recipientEmail,
        donorRequest.recipientName,
        donorName,
        response
      );
    }

    // Show a confirmation page to the donor
    if (response === "accept") {
      // Save match data to DB
      const newMatch = new Match({
        requestId: donorRequest._id,
        donorId: donorRequest.donorId,
        donorName: donorName,
        donorEmail: donor ? donor.email : "",
        donorPhone: donor ? donor.phone : "",
        donorBloodGroup: donor ? donor.bloodGroup : "",
        recipientName: donorRequest.recipientName,
        recipientEmail: donorRequest.recipientEmail,
        recipientPhone: donorRequest.recipientPhone,
        recipientDetails: donorRequest.recipientDetails,
        status: "Matched"
      });
      await newMatch.save();
      console.log("Match saved to DB:", newMatch._id);

      // Build WhatsApp URL
      let recipientPhone = donorRequest.recipientPhone || "";
      // Clean the phone number (remove spaces, dashes, +)
      recipientPhone = recipientPhone.replace(/[\s\-\+]/g, "");
      // Add 91 prefix if not present and number is 10 digits
      if (recipientPhone.length === 10) recipientPhone = "91" + recipientPhone;

      const whatsappMessage = encodeURIComponent(
        `Hello ${donorRequest.recipientName || "Patient"},\n\n` +
        `Great news! I am *${donorName}*, a registered stem cell donor at StemLife.\n\n` +
        `I have been matched with your HLA profile and I am *willing to donate* bone marrow to help you.\n\n` +
        `Please contact the StemLife medical team so we can proceed with further compatibility testing.\n\n` +
        `Stay strong! \u2764\uFE0F\n- StemLife Donor Registry`
      );
      const whatsappUrl = `https://wa.me/${recipientPhone}?text=${whatsappMessage}`;

      res.send(`
        <div style="font-family: Arial; text-align: center; padding: 50px; background: #eafaf1; min-height: 100vh;">
          <h1 style="color: #27ae60;">\uD83C\uDF89 Thank You!</h1>
          <h2 style="color: #2c3e50;">Your willingness to donate is truly heroic.</h2>
          <p style="font-size: 18px; color: #555;">The patient's medical team has been notified and will contact you soon.</p>
          <div style="background: white; border: 2px solid #27ae60; border-radius: 10px; padding: 20px; margin: 30px auto; max-width: 400px;">
            <p style="font-size: 24px; margin: 0;">Your Response: <strong style="color: #27ae60;">WILLING TO DONATE \u2705</strong></p>
          </div>
          ${recipientPhone && recipientPhone.length >= 10 ? `
            <div style="margin-top: 30px;">
              <p style="font-size: 16px; color: #555; margin-bottom: 15px;">Send a WhatsApp message to the patient:</p>
              <a href="${whatsappUrl}" target="_blank" 
                 style="background-color: #25D366; color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-size: 18px; font-weight: bold; display: inline-block;">
                \uD83D\uDCAC Send WhatsApp Message
              </a>
            </div>
          ` : ''}
          <p style="color: #888; margin-top: 40px;">Match ID: ${newMatch._id}</p>
        </div>
      `);
    } else {
      res.send(`
        <div style="font-family: Arial; text-align: center; padding: 50px; background: #fdf2e9; min-height: 100vh;">
          <h1 style="color: #e67e22;">Response Recorded</h1>
          <h2 style="color: #2c3e50;">We understand, and we appreciate your honesty.</h2>
          <p style="font-size: 18px; color: #555;">The patient has been notified. We hope you'll be able to help in the future.</p>
          <div style="background: white; border: 2px solid #e67e22; border-radius: 10px; padding: 20px; margin: 30px auto; max-width: 400px;">
            <p style="font-size: 24px; margin: 0;">Your Response: <strong style="color: #e74c3c;">NOT ABLE TO DONATE \u274C</strong></p>
          </div>
          <p style="color: #888; margin-top: 40px;">Thank you for being a registered donor. You may close this page now.</p>
        </div>
      `);
    }

  } catch (error) {
    console.error("Respond Error:", error);
    res.status(500).send(`
      <div style="font-family: Arial; text-align: center; padding: 50px;">
        <h2 style="color: #e74c3c;">Something went wrong</h2>
        <p>Please try again or contact support.</p>
      </div>
    `);
  }
});

module.exports = router;
