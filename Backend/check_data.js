const mongoose = require("mongoose");
const Donor = require("./models/Donor");
require("dotenv").config();

async function check() {
    try {
        console.log("URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const donor = await Donor.findOne();
        if (donor) {
            console.log(`Sample Donor BloodGroup: '${donor.bloodGroup}' (Length: ${donor.bloodGroup.length})`);
            const allBloodGroups = await Donor.distinct("bloodGroup");
            console.log("Distinct bloodGroups in DB:", allBloodGroups);
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
