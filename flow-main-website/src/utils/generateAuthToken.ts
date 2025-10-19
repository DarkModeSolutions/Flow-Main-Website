import { SessionUser } from "@/types/types";

const generateAuthToken = async (user: SessionUser | undefined) => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/zoho/callback`;
  const scope =
    "ZohoPay.payments.CREATE,ZohoPay.payments.READ,ZohoPay.payments.UPDATE";

  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&access_type=offline&state=${user?.id}&prompt=consent`;

  window.location.href = authUrl;
  return;
};

export default generateAuthToken;
