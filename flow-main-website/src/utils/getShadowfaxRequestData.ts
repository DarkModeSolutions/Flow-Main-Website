import { RequestType } from "@/types/types";

const getShadowfaxRequestData = async ({
  requestData,
}: {
  requestData: RequestType;
}) => {
  const { url, method, body, additionalHeaders } = requestData;

  const res = await fetch(`${process.env.SHADOWFAX_PROD_URL}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.SHADOWFAX_PROD_TOKEN}`,
      ...additionalHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
};

export default getShadowfaxRequestData;
