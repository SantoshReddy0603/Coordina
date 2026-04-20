const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminMiddleware");


const protect = require("../middleware/authMiddleware");
const { bookEvent,getAllBookings,getMyBookings,deleteBooking } = require("../controllers/bookingController");

router.post("/", protect, bookEvent);
router.get("/",protect,adminOnly,getAllBookings);
router.get("/my",protect,getMyBookings);
router.delete("/:id",protect,deleteBooking);
module.exports = router;