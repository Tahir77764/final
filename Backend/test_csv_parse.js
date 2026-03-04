const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "..", "dataset", "synthetic_bone_marrow_donors_500.csv");
const csvData = fs.readFileSync(CSV_PATH, "utf-8");
const lines = csvData.trim().split("\n");
const headers = lines[0].split(",").map(h => h.trim());

console.log("Headers:", JSON.stringify(headers));
const firstRow = lines[1].split(",");
const d = {};
headers.forEach((header, index) => {
    d[header] = firstRow[index] ? firstRow[index].trim() : "MISSING";
});
console.log("Parsed Object for Row 1:", JSON.stringify(d, null, 2));
