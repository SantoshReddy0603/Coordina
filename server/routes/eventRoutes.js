const express=require("express");
const manager= require("../middleware/eventManagerMiddleware");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


const { getEvents, createEvent,updateEvent,deleteEvent } = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", protect, manager, createEvent);
router.put("/:id", protect, manager, updateEvent);
router.delete("/:id", protect, manager, deleteEvent);

module.exports = router;