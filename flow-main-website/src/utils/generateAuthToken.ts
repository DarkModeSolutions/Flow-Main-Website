import { SessionUser } from "@/types/types";

const generateAuthToken = async (user: SessionUser | undefined) => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/zoho/callback`;
  const scope =
    "ZohoPay.payments.CREATE,ZohoPay.payments.READ,ZohoPay.payments.UPDATE";
  const accountId = process.env.ACCOUNT_ID;

  const authUrl = `https://accounts.zoho.in/oauth/v2/org/auth?scope=${scope}&client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&access_type=offline&state=${user?.id}&soid=zohopay.${accountId}`;

  window.location.href = authUrl;
  return;
};

export default generateAuthToken;
