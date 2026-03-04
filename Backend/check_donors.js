require("dotenv").config({ path: "c:/Users/tahir/OneDrive/Desktop/MY MAIN FINAL/Backend/.env" });
const mongoose = require("mongoose");
const Donor = require("c:/Users/tahir/OneDrive/Desktop/MY MAIN FINAL/Backend/models/Donor");

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Donor.countDocuments();
        console.log(`Donors in DB: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
