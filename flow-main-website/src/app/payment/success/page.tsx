import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-gray-700">
        Thank you! Your payment has been received.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
