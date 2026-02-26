const nodemailer = require("nodemailer");
require("dotenv").config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// 1. Send OTP for email verification
const sendOtp = async (email, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Stem Cell Registry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP - Stem Cell Registry",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2c3e50;">Verify Your Email</h2>
        <p>Thank you for registering as a donor. Use the OTP below to verify your email address:</p>
        <h1 style="color: #e74c3c; letter-spacing: 5px;">${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
        <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  });
};

// 2. Send contact email TO DONOR (with Accept / Decline buttons)
const sendContactEmail = async (donorEmail, recipientDetails, requestId) => {
  const transporter = createTransporter();

  // Build the response URLs pointing to the backend
  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const acceptUrl = `${baseUrl}/api/donor/respond/${requestId}/accept`;
  const declineUrl = `${baseUrl}/api/donor/respond/${requestId}/decline`;

  await transporter.sendMail({
    from: `"Stem Cell Registry" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: "Urgent: A Patient Matches Your Profile!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto; background-color: #fafafa;">
        <h2 style="color: #c0392b; margin-bottom: 5px;">You Could Be a Lifesaver!</h2>
        <hr style="border: none; border-top: 2px solid #e74c3c; margin-bottom: 20px;"/>
        
        <p>Hello,</p>
        <p>A patient in <strong>urgent need</strong> of a bone marrow transplant has been matched with your HLA profile.</p>
        
        <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #2c3e50;">Patient Details (Confidential):</p>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 4px 0; color: #666;">Age:</td><td style="padding: 4px 0; font-weight: bold;">${recipientDetails.age}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Blood Group:</td><td style="padding: 4px 0; font-weight: bold; color: #e74c3c;">${recipientDetails.bloodGroup}</td></tr>
          </table>
        </div>

        <p>Someone's life depends on your help. Please respond below:</p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${acceptUrl}" 
             style="background-color: #27ae60; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block; margin-right: 10px;">
            ✅ I Am Willing to Donate
          </a>
        </div>
        
        <div style="text-align: center; margin: 15px 0;">
          <a href="${declineUrl}" 
             style="background-color: #e74c3c; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
            ❌ I Am Not Able to Donate
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">Thank you for being a registered donor. Your response will be forwarded to the patient's medical team.</p>
      </div>
    `
  });
};

// 3. Send response email TO RECIPIENT (donor's decision)
const sendResponseToRecipient = async (recipientEmail, recipientName, donorName, response) => {
  const transporter = createTransporter();

  const isAccepted = response === "accept";

  const subject = isAccepted
    ? "Great News! A Donor Has Agreed to Help!"
    : "Donor Response Update";

  const html = isAccepted
    ? `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto; background-color: #fafafa;">
        <h2 style="color: #27ae60;">🎉 Great News!</h2>
        <hr style="border: none; border-top: 2px solid #27ae60; margin-bottom: 20px;"/>
        <p>Dear ${recipientName || "Patient"},</p>
        <p>We are happy to inform you that a matching donor (<strong>${donorName}</strong>) has responded and is <strong style="color: #27ae60;">willing to donate</strong>.</p>
        <p>Our medical team will contact you shortly to proceed with further compatibility testing and schedule the next steps.</p>
        <div style="background: #eafaf1; border: 1px solid #27ae60; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #27ae60;">Donor Status: WILLING TO DONATE ✅</p>
        </div>
        <p>Please keep your phone and email accessible. The medical team will reach out soon.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">This is a confidential message from the Stem Cell Registry.</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto; background-color: #fafafa;">
        <h2 style="color: #e67e22;">Donor Response Update</h2>
        <hr style="border: none; border-top: 2px solid #e67e22; margin-bottom: 20px;"/>
        <p>Dear ${recipientName || "Patient"},</p>
        <p>Unfortunately, the matched donor (<strong>${donorName}</strong>) is <strong style="color: #e74c3c;">not able to donate</strong> at this time.</p>
        <p>Please don't lose hope. Our system is continuously searching for other compatible donors. We will notify you as soon as another match is found.</p>
        <div style="background: #fdf2e9; border: 1px solid #e67e22; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #e74c3c;">Donor Status: NOT ABLE TO DONATE ❌</p>
        </div>
        <p>We encourage you to continue your search. There are many generous donors in our registry.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">This is a confidential message from the Stem Cell Registry.</p>
      </div>
    `;

  await transporter.sendMail({
    from: `"Stem Cell Registry" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject,
    html
  });
};

module.exports = { sendOtp, sendContactEmail, sendResponseToRecipient };
