const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app=express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/events", require("./routes/eventRoutes"));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});