const axios = require("axios");

async function testMatch() {
    console.log("--- Test 1: HLA Match exists ---");
    try {
        const res1 = await axios.post("http://localhost:5000/api/donor/match", {
            bloodGroup: "B+",
            HLA_A1: "21:02" // Match for Navya Kapoor
        });
        console.log(`Found ${res1.data.length} donors. (Expected: > 0)`);
    } catch (e) {
        console.error("Test 1 failed:", e.message);
    }

    console.log("\n--- Test 2: No HLA Match (Zero MatchScore) ---");
    try {
        const res2 = await axios.post("http://localhost:5000/api/donor/match", {
            bloodGroup: "B+",
            HLA_A1: "99:99" // Should not match anything
        });
        console.log(`Found ${res2.data.length} donors. (Expected: 0)`);
    } catch (e) {
        console.error("Test 2 failed:", e.message);
    }
}

testMatch();
