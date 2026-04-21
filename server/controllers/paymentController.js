const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// ✅ Create order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + bookingId
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: "Error creating order" });
  }
};

// ✅ VERIFY PAYMENT (your code)
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    
    await Booking.findByIdAndUpdate(bookingId, {
      status: "confirmed",
      paymentId: razorpay_payment_id
    });

    res.json({ success: true });

  } else {
    res.status(400).json({ success: false });
  }
};