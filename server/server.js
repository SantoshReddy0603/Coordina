const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

require("dotenv").config();

const app=express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/events", require("./routes/eventRoutes"));
app.use("/api/auth", authRoutes);

app.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});