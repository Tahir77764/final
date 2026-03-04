const mongoose = require("mongoose");
const Donor = require("./models/Donor");
require("dotenv").config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const donor = await Donor.findOne();
        if (donor) {
            const obj = donor.toObject();
            console.log("Existing Keys in Donor:", Object.keys(obj));
            console.log("Blood Group Value:", obj.bloodGroup);
            console.log("Is bloodGroup in obj?", "bloodGroup" in obj);
            console.log("Raw object:", JSON.stringify(obj, null, 2));
        } else {
            console.log("No donors found");
        }
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err.message);
        process.exit(1);
    }
}
check();
