const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    hospitalId: {
        type: String, // Can be ObjectId or string for default hospitals
    },
    hospitalName: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    donorDetails: {
        email: String,
        phone: String,
        bloodGroup: String,
        age: Number
    },
    recipientDetails: {
        age: String,
        bloodGroup: String,
        HLA_A1: String,
        HLA_A2: String,
        HLA_B1: String,
        HLA_B2: String,
        HLA_C1: String,
        HLA_C2: String,
        HLA_DRB1_1: String,
        HLA_DRB1_2: String,
        HLA_DQ1: String,
        HLA_DQ2: String
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
