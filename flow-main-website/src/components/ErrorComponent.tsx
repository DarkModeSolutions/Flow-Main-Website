import Link from "next/link";
import { toast } from "react-toastify";

const ErrorComponent = ({ error }: { error: unknown }) => {
  toast.warning(
    <>
      <p>
        Please go through the error <br /> If you have any queries please{" "}
      </p>
      <Link
        className="hover:underline"
        href={"mailto:support@flowhydration.in"}
      >
        write to us here
      </Link>
    </>
  );

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{`${error}`}</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
