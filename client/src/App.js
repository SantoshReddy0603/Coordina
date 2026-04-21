import React from "react";

function App() {

  const handlePayment = async () => {
  try {

    let bookingId = null;

    // STEP 1: Create booking
    const bookingRes = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTY2ZWRjYWVlZDA5YjJiYjc0ODIzMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjcwOTQ3NiwiZXhwIjoxNzc3MzE0Mjc2fQ.x_rTyAgec-SjI59jNbhV5Znd05mEyLlCh-vgdoh4g1c"
      },
      body: JSON.stringify({
        eventId: "69e666c3f0404b959a58c1f2",
        tickets: 1
      })
    });
    console.log("Booking status:", bookingRes.status);
    const bookingData = await bookingRes.json();
    console.log("Booking:", bookingData);

    if (!bookingData.booking) {
      return alert("Booking failed");
    }

    bookingId = bookingData.booking._id;

    // STEP 2: Create order
      const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: 500
        })
      });
      console.log("Order status:", orderRes.status);
      const order = await orderRes.json();
      console.log("Order:", order);

      // STEP 3: Razorpay popup
      const options = {
        key: "rzp_test_SgE93aIpvIXrDH",
        amount: order.amount,
        currency: order.currency,
        name: "Event Booking",
        description: "Ticket Payment",
        order_id: order.id,

        prefill: {
          name: "Test User",
          email: "test@razorpay.com",
          contact: "9999999999"
        },

        method: {
          card: true,
          upi: true,
          netbanking: true,
          wallet: false
        },

        theme: {
          color: "#3399cc"
        },

        handler: async function (response) {
          console.log("Payment response:", response);

          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId
            })
          });

          const result = await verifyRes.json();
          console.log("Verify result:", result);

          if (result.success) {
            alert("Payment successful 🎉");
          } else {
            alert("Payment failed ❌");
          }
        }
      };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("ERROR:", err);
    alert("Error occurred");
  }
};

  return (
    <div style={{ padding: "50px" }}>
      <h1>Event Payment</h1>
      <button onClick={handlePayment}>
        Pay ₹500
      </button>
    </div>
  );
}

export default App;