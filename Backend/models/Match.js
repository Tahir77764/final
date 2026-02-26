const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true
    },
    donorName: String,
    donorEmail: String,
    donorPhone: String,
    donorBloodGroup: String,
    recipientName: String,
    recipientEmail: String,
    recipientPhone: String,
    recipientDetails: {
        age: String,
        bloodGroup: String
    },
    status: {
        type: String,
        enum: ["Matched", "In Progress", "Completed"],
        default: "Matched"
    }
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);
