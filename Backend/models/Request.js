const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true
    },
    recipientName: String,
    recipientEmail: String,
    recipientPhone: String,
    recipientDetails: {
        age: String,
        bloodGroup: String,
        message: String
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
