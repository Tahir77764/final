const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    ngoName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    focusArea: { type: String },
    volunteerCount: { type: String },
    website: { type: String },
    message: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Ngo", ngoSchema);
