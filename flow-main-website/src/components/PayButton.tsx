"use client";

import { useState } from "react";

export default function PayButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: "100.5",
          currency_code: "INR",
          payments_session_id: "2000000012001",
          currency_symbol: "₹",
          business: "Zylker",
          description: "Purchase of Zylker electronics.",
          invoice_number: "INV-12345",
          reference_number: "REF-12345",
          address: {
            name: "Canon",
            email: "canonbolt@zylker.com",
            phone: "98XXXXXXXX",
          },
        }),
      });

      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert("Payment creation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      {loading ? "Redirecting..." : "Pay ₹500"}
    </button>
  );
}
