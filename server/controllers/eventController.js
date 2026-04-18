const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
        console.log("Current Events:",events);
    } catch (err) {
        res.status(500).json({ error: "Error fetching events" });
    }
};

exports.createEvent = async (req, res) => {
    const { title, description, date, location, totalSeats } = req.body;

    if (!title || !date || !location) {
    return res.status(400).json({ error: "Title, date, and location are required" });
    }

    try {
        const newEvent = new Event({
        title,
        description,
        date,
        location,
        totalSeats
    });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: "Error creating event" });
    }
};

exports.updateEvent=async(req,res)=>{
    try{
        const updatedEvent=await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: "Error updating event" });
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting event" });
    }
};