import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-semibold text-red-600 mb-4">
        Payment Failed ❌
      </h1>
      <p className="text-gray-700">
        Your payment couldn’t be processed. Please try again.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        Go Home
      </Link>
    </div>
  );
}
