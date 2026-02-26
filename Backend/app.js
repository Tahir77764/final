const express = require("express");
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
  console.log("REQUEST PATH:", req.originalUrl);
  next();
});


// ✅ SINGLE, CORRECT CORS CONFIG
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// API route
// API route
// Match logic moved to routes/donorRoutes.js -> /api/donor/match


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
