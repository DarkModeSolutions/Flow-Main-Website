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
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
  });
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(0);
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

  const handleGoogleAuth = async () => {
    try {
      console.log("Redirect in google: ", redirect);

      await signIn("google", { callbackUrl: redirect });
    } catch (error) {
      setError(`Login failed. Please try again. ${error}`);
      setLoading(false);
      router.refresh();
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
      const result = await registerUser(
        email,
        password,
        name,
        address,
        phone,
        age
      );

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

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-36 pt-6">
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
                required
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div className="flex flex-col gap-4 mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                required
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && password.length > 0 && (
                <div
                  className="absolute right-3 top-9 cursor-pointer hover:bg-gray-500 transition-all ease-in-out duration-300 rounded-full p-1 flex justify-center items-center"
                  onClick={showPasswordHandler}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              )}
            </div>
            {isSignUp && (
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col gap-4 mb-4 order-first">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-4 mb-4">
                  <Label>Address</Label>
                  <Input
                    required
                    type="text"
                    id="address1"
                    name="address1"
                    placeholder="Address Line 1"
                    value={address.addressLine1}
                    onChange={(e) =>
                      setAddress({ ...address, addressLine1: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    id="address2"
                    name="address2"
                    placeholder="Address Line 2"
                    value={address.addressLine2}
                    onChange={(e) =>
                      setAddress({ ...address, addressLine2: e.target.value })
                    }
                  />
                  <Input
                    required
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <Input
                    required
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                  />
                  <Input
                    required
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                  <Input
                    required
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-4 mb-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-4 mb-4">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Age"
                    value={age <= 0 ? "" : age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              {/* <Button>Sign In</Button> */}
              <Button
                size="sm"
                disabled={loading || registerLoading}
                type="submit"
                className="bg-[#24bfcf] rounded-md p-4 px-6 text-black hover:bg-[#24bfcf] hover:opacity-90 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-[0_8px_30px_rgba(36,191,207,0.18)] cursor-pointer disabled:cursor-not-allowed w-[30%]"
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
              {error ||
                (registerError && (
                  <div className="text-red-500">{error || registerError}</div>
                ))}
            </div>
          </form>
          <div className="my-4">
            <div className="flex justify-between items-center gap-3.5 mb-3 w-full">
              <Separator className="flex-1" />
              <span className="">OR</span>
              <Separator className="flex-1" />
            </div>
            <div className="flex justify-center items-center">
              <div
                onClick={handleGoogleAuth}
                className="w-[30%] flex justify-center items-center border-2 border-white hover:border-[#24bfcf] group transition-all ease-in-out duration-300 cursor-pointer p-3 rounded-xl"
              >
                <FaGoogle className="fill-white group-hover:fill-[#24bfcf]! transition-all ease-in-out duration-300 text-2xl" />
              </div>
            </div>
          </div>
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
