import React from "react";

const ErrorComponent = ({ error }: { error: unknown }) => {
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
