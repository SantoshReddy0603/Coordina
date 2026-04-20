const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: String,
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true, min: 0 },
  availableSeats: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model("Event", eventSchema);