"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useRegisterUser from "@/hooks/useRegisterUser";
import { Loader2Icon } from "lucide-react";
import { getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const AuthComponent = ({
  isAdmin = false,
  isSignUp = false,
}: {
  isAdmin?: boolean;
  isSignUp?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  // console.log("This is the redirect: ", redirect);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");

  const {
    error: registerError,
    loading: registerLoading,
    registerUser,
  } = useRegisterUser();

  const handleSignin = async (
    email: string,
    password: string,
    signInType: string
  ) => {
    try {
      const res = await signIn("credentials", {
        email,
        password,
        signInType,
        redirect: false,
      });

      if (res?.error) {
        setError(
          signInType === "admin"
            ? "Invalid admin credentials"
            : "Invalid email or password"
        );
        setLoading(false);
      } else if (res?.ok) {
        // For admin login, double-check session
        if (signInType === "admin") {
          const session = await getSession();
          if (session?.user?.isAdmin) {
            debugger;
            // console.log("User: ", session?.user);
            router.push("/admin");
          } else {
            await signOut({ redirect: false });
            setError("Access denied. Admin privileges required.");
            setLoading(false);
            return;
          }
        } else {
          router.push(redirect);
        }
        router.refresh();
      }
    } catch (error) {
      setError(`Login failed. Please try again. ${error}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission

    if (isAdmin) {
      // Admin-specific submission logic
      setLoading(true);
      await handleSignin(email, password, "admin");
    } else if (isSignUp) {
      // Sign-up specific submission logic
      const result = await registerUser(email, password);
      // console.log(result);

      if (result?.success === "tagged") {
        if (result?.tag === "set-password") {
          setTag("set-password");
          setError("User exists without password. Please set a password.");
        }
      } else if (result?.success === false) {
        setError(result.error || "Registration failed");
      } else {
        await handleSignin(email, password, "user");
      }
    } else {
      setLoading(true);
      await handleSignin(email, password, "user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="rounded-2xl shadow-lg bg-[#121212] max-w-[80vw] p-12">
        <div>
          <h2 className="text-3xl manrope-semibold mb-4">
            {isAdmin
              ? "Admin Auth Component"
              : isSignUp
              ? "Create an Account"
              : "Welcome Back!"}
          </h2>
          <p className="text-gray-400 manrope-regular">
            {isAdmin
              ? "Please manage your settings here."
              : isSignUp
              ? "Please fill in the details to create an account."
              : "Please log in to continue."}
          </p>
        </div>
        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              {/* <Button>Sign In</Button> */}
              <Button
                size="sm"
                disabled={loading || registerLoading}
                type="submit"
              >
                {loading || registerLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              {error || (registerError && <div>{error || registerError}</div>)}
            </div>
          </form>
          {!isAdmin && (
            <div>
              <Separator className="my-4" />
              {tag === "set-password" ? (
                <div>
                  <p>
                    Please click on the{" "}
                    <Button variant="link">
                      <Link href={"#"}>link</Link>
                    </Button>{" "}
                    to set your password.
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 manrope-regular">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account?"}
                  </p>
                  <Button variant="link">
                    <Link
                      href={isSignUp ? "/auth/login" : "/auth/register"}
                      className="text-center"
                    >
                      {isSignUp ? "Log in" : "Create an account"}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
