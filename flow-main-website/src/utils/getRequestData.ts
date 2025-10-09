import { RequestType } from "@/types/types";

const getRequestData = async ({
  requestData,
}: {
  requestData: RequestType;
}) => {
  const { url, method, body } = requestData;

  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
};

export default getRequestData;
