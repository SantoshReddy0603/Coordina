const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

const { bookEvent,getBookings,deleteBooking,updateBooking } = require("../controllers/bookingController");

router.post("/", protect, bookEvent);
router.get("/",protect,getBookings);
router.put("/:id",protect,updateBooking);
router.delete("/:id",protect,deleteBooking);
module.exports = router;