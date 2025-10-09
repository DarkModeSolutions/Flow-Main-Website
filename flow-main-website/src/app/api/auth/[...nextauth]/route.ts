import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
