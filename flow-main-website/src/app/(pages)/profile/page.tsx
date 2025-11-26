import ProfileClient from "@/components/profile/ProfileClient";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  // console.log("Session User: ", session?.user);
  return <ProfileClient user={session?.user} />;
};

export default ProfilePage;
