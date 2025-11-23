import Link from "next/link";

const ErrorComponent = ({
  error,
  redirectToLogin,
}: {
  error: unknown;
  redirectToLogin?: boolean;
}) => {
  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{`${error}`}</p>
      </div>
      {redirectToLogin && (
        <Link href={"/auth/login"} className="mt-4 text-blue-500 underline">
          Please login to continue.
        </Link>
      )}
    </div>
  );
};

export default ErrorComponent;
