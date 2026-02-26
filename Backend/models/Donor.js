const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: String,
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
  HLA_DQ2: String,
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional, as Auth is handled by User model
  phone: String,
  weight: { type: Number, required: true, min: 50 },
  noChronicIllness: { type: Boolean, required: true },
  noInfectiousDisease: { type: Boolean, required: true },
  noHighRiskLifestyle: { type: Boolean, required: true },
  notPregnant: { type: Boolean, required: true },
  hlaConsent: { type: Boolean, required: true },
  informedConsent: { type: Boolean, required: true },
  willingness: { type: Boolean, required: true },
  governmentId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Donor", donorSchema);
