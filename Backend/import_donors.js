/**
 * 🧬 Donor Import Script
 * Imports donors from CSV (/dataset/synthetic_bone_marrow_donors_500.csv) 
 * into MongoDB Atlas.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Donor = require("./models/Donor");

const CSV_PATH = path.join(__dirname, "..", "dataset", "synthetic_bone_marrow_donors_500.csv");

async function importDonors() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // Reading CSV
        const csvData = fs.readFileSync(CSV_PATH, "utf-8");
        const lines = csvData.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim());

        console.log(`Parsing ${lines.length - 1} donors...`);

        const donorsToInsert = [];

        for (let i = 1; i < lines.length; i++) {
            const currentline = lines[i].split(",");
            const d = {};
            headers.forEach((header, index) => {
                d[header] = currentline[index] ? currentline[index].trim() : "";
            });

            // Mapping CSV fields to MongoDB Schema
            const donor = {
                name: d.name,
                age: parseInt(d.age) || 30,
                gender: d.gender,
                bloodGroup: d.blood_group,
                HLA_A1: d.HLA_A1,
                HLA_A2: d.HLA_A2,
                HLA_B1: d.HLA_B1,
                HLA_B2: d.HLA_B2,
                HLA_C1: d.HLA_C1,
                HLA_C2: d.HLA_C2,
                HLA_DRB1_1: d.HLA_DRB1_1,
                HLA_DRB1_2: d.HLA_DRB1_2,
                HLA_DQ1: d.HLA_DQB1_1, // Mapping DQB1 to DQ1
                HLA_DQ2: d.HLA_DQB1_2, // Mapping DQB1 to DQ2
                email: d.email || `donor${i}@example.com`,
                phone: d.phone,

                // Default required fields for demo
                weight: d.weight ? parseInt(d.weight) : 65,
                noChronicIllness: true,
                noInfectiousDisease: true,
                noHighRiskLifestyle: true,
                notPregnant: true,
                hlaConsent: true,
                informedConsent: true,
                willingness: true,
                governmentId: d.donor_id || `DNR${1000 + i}`
            };

            donorsToInsert.push(donor);
        }

        console.log("Inserting donors into database...");

        console.log("Clearing existing donors...");
        await Donor.deleteMany({});

        // Using insertMany with ordered: false to skip duplicates if any
        await Donor.insertMany(donorsToInsert, { ordered: false }).catch(err => {
            console.log(`Warning: Some records were skipped (likely duplicates). Total successful: ${donorsToInsert.length - (err.writeErrors ? err.writeErrors.length : 0)}`);
        });

        console.log("✅ Import Successful!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Import Failed:", err);
        process.exit(1);
    }
}

importDonors();
