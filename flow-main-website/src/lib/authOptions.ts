import { prisma } from "@/lib/db/prisma";
import { AddressAllDetails } from "@/types/types";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        signInType: { label: "Sign In Type", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error("Email and password required");
          }

          let user;

          if (credentials.signInType === "admin") {
            user = await prisma.user.findFirst({
              where: { email: credentials.email, isAdmin: true },
              omit: {
                createdAt: true,
                updatedAt: true,
              },
              include: {
                address: true,
              },
            });
          } else if (credentials.signInType === "guest") {
            user = await prisma.user.findFirst({
              where: {
                email: credentials.email,
                // phone: credentials.phone,
                buyingAsGuest: true,
              },
              omit: {
                createdAt: true,
                updatedAt: true,
              },
              include: {
                address: true,
              },
            });
          } else {
            user = await prisma.user.findUnique({
              where: {
                email: credentials.email,
              },
              select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                password: true,
                isAdmin: true,
                age: true,
                address: true,
                buyingAsGuest: true,
                favourites: true,
              },
            });
          }

          if (credentials.signInType === "admin" && !user) {
            await prisma.logs.create({
              data: {
                action: "Admin_Login_Attempt",
                log: `Failed admin login attempt for email: ${credentials.email} - User not found or not admin`,
              },
            });
            throw new Error("No admin user found.");
          }

          if (!user) {
            throw new Error(
              `No user found. ${
                credentials.signInType === "admin" ? "No admin user found." : ""
              }`
            );
          }

          if (credentials.signInType === "guest") {
            return {
              id: user.id,
              email: user.email ?? null,
              name: user.name ?? null,
              phone: user.phone ?? null,
              isAdmin: user.isAdmin, // Default to false
              age: user.age ?? null,
              address: user.address ?? null,
              buyingAsGuest: user.buyingAsGuest,
              favourites: user.favourites,
            };
          }

          if (!user.password) {
            await prisma.logs.create({
              data: {
                action: "User_Login",
                log: `Login attempt failed for email: ${credentials.email} - No password set`,
              },
            });
            throw new Error("No password set for this user.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            await prisma.logs.create({
              data: {
                action: "User_Login",
                log: `Login attempt failed for email: ${credentials.email} - Invalid password`,
              },
            });
            throw new Error("Invalid password.");
          }

          if (credentials.signInType === "admin" && isPasswordValid) {
            await prisma.logs.create({
              data: {
                action: "Admin_Login_Success",
                log: `Admin user ${user.email} logged in successfully`,
              },
            });
          }

          return {
            id: user.id,
            email: user.email ?? null,
            name: user.name ?? null,
            phone: user.phone ?? null,
            isAdmin: user.isAdmin, // Default to false
            age: user.age ?? null,
            address: user.address ?? null,
            buyingAsGuest: user.buyingAsGuest,
            favourites: user.favourites,
          };
        } catch (error) {
          throw new Error(
            `Error while logging in: ${error}. Error Message: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 15 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  pages: {
    // Since NextAuth expects a string, we'll use the admin path for admin-specific routes
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user info to JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.isAdmin = user.isAdmin; // Default to false
        token.age = user.age ?? null;
        token.address = user.address ?? null;
        token.buyingAsGuest = user.buyingAsGuest ?? false;
        token.favourites = user.favourites ?? [];
      }

      // If session is being updated, fetch fresh user data from database
      if (trigger === "update" && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            isAdmin: true,
          },
        });

        if (freshUser) {
          token.id = freshUser.id;
          token.email = freshUser.email;
          token.name = freshUser.name;
          token.phone = freshUser.phone;
          token.isAdmin = freshUser.isAdmin; // Default to false
          token.age = user.age ?? null;
          token.address = user.address ?? null;
          token.buyingAsGuest = user.buyingAsGuest ?? false;
          token.favourites = user.favourites ?? [];
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add user info to session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.phone = token.phone as string;
        session.user.isAdmin = token.isAdmin as boolean; // Default to false
        session.user.age = token.age as number | null;
        session.user.address = token.address as AddressAllDetails[] | null;
        session.user.buyingAsGuest = token.buyingAsGuest as boolean;
        session.user.favourites = token.favourites as string[];
      }
      return session;
    },
  },
};
