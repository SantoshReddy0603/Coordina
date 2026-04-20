const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.bookEvent = async (req, res) => {
    try {
        const { eventId, tickets } = req.body;

        // 🔥 CONCURRENCY SAFE CODE (REPLACE OLD LOGIC WITH THIS)
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gte: tickets }
            },
            {
                $inc: { availableSeats: -tickets }
            },
            { new: true }
        );

        if (!event) {
            return res.status(400).json({
                message: "Not enough seats or event not found"
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            event: eventId,
            tickets
        });

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error"+err});
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")   // user details
            .populate("event", "title date location"); // event details

        res.status(200).json(bookings);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("event", "title date location");

        res.status(200).json(bookings);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // 🔥 AUTHORIZATION LOGIC
        if (
            req.user.role !== "admin" &&
            booking.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to delete this booking"
            });
        }

        // 🔥 RESTORE SEATS (IMPORTANT)
        const event = await Event.findById(booking.event);

        if (event) {
            event.availableSeats += booking.tickets;
            await event.save();
        }

        await booking.deleteOne();

        res.status(200).json({
            message: "Booking deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};