const mongoose = require("mongoose");
require("dotenv").config({ path: "c:/Users/tahir/OneDrive/Desktop/MY MAIN FINAL/Backend/.env" });

async function testConnection() {
    console.log("Connecting to:", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to MongoDB");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Could not connect to MongoDB");
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
