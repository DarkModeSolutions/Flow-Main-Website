"use client";

import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetOrderDetails from "@/hooks/useGetOrderDetails";
import useGetUserDetails from "@/hooks/useGetUserDetails";
import useUpdateUserDetails from "@/hooks/useUpdateUserDetails";
import {
  OrderDetailsWiithIncludes,
  SessionUser,
  UserAllDetails,
} from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfileClient = ({ user }: { user: SessionUser | undefined }) => {
  console.log("Entering Profile client");

  const router = useRouter();

  const [myUserDetails, setMyUserDetails] = useState<
    UserAllDetails | null | undefined
  >(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    name: myUserDetails?.name,
    email: myUserDetails?.email,
    address: myUserDetails?.address,
    phone: myUserDetails?.phone,
    age: myUserDetails?.age,
  });
  const [myOrderHistory, setMyOrderHistory] = useState<
    OrderDetailsWiithIncludes[] | [] | undefined
  >();

  console.log("User details in profile section: ", user);

  const { getUserDetails, loading: getUserLoading } = useGetUserDetails();

  const {
    error: updateUserError,
    loading: updateUserLoading,
    updateUserDetails,
  } = useUpdateUserDetails();

  const {
    error: orderDetailsError,
    loading: orderDetailsLoading,
    getOrderDetails,
  } = useGetOrderDetails();

  useEffect(() => {
    async function fetchUserDetails() {
      if (user?.id) {
        const userDetails = await getUserDetails(user.id);
        const orderHistory = await getOrderDetails(user.id);
        console.log("Fetched user details: ", userDetails);
        console.log("Fetched order history: ", orderHistory);
        setMyUserDetails(userDetails);
        setUpdatedUserDetails({
          name: userDetails?.name,
          email: userDetails?.email,
          address: userDetails?.address,
          phone: userDetails?.phone,
          age: userDetails?.age,
        });
        setMyOrderHistory(orderHistory);
      } else {
        console.log("redirecting from use effect");
        router.push("/auth/login");
      }
    }

    fetchUserDetails();
  }, [getUserDetails, router, user, getOrderDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      router.push("/auth/login");
    }

    const updateDetails = await updateUserDetails({
      userId: user!.id,
      updatedAddress: updatedUserDetails.address,
      updatedAge: updatedUserDetails.age,
      updatedEmail: updatedUserDetails.email,
      updatedName: updatedUserDetails.name,
      updatedPhone: updatedUserDetails.phone,
    });

    console.log("Updated user details response: ", updateDetails);
  };

  // if (!myUserDetails) {
  //   console.log("redirecting from other if block");
  //   router.push("/auth/login");
  // }

  if (getUserLoading || orderDetailsLoading) {
    return (
      <>
        <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
      </>
    );
  }

  if (updateUserError || orderDetailsError) {
    return <ErrorComponent error={updateUserError} />;
  }

  return (
    <div>
      <Tabs defaultValue="user-details">
        <TabsList className="mb-10">
          <TabsTrigger value="user-details">User Details</TabsTrigger>
          <TabsTrigger value="order-history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="user-details">
          <h2 className="text-2xl font-bold mb-4">My User Profile</h2>
          <form
            className="w-[30%] mx-auto flex flex-col gap-y-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex justify-between gap-5 items-center border border-white rounded-lg p-6">
              <Label htmlFor="name" className="text-lg font-medium">
                Name:
              </Label>
              <Input
                className="w-[50%]"
                name="name"
                type="text"
                placeholder="Enter Name"
                value={updatedUserDetails?.name || ""}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between gap-5 items-center border border-white rounded-lg p-6">
              <Label htmlFor="email" className="text-lg font-medium">
                Email:
              </Label>
              <Input
                className="w-[50%]"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={updatedUserDetails?.email || ""}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between gap-5 items-center border border-gray-400 rounded-lg p-6 relative">
              <Label htmlFor="passwword" className="text-lg font-medium">
                Password:
              </Label>
              <Input
                className="w-[50%]"
                name="passwword"
                type="password"
                placeholder="Enter Password"
                value={myUserDetails?.password || ""}
                // className="pr-6"
                disabled
              />
            </div>
            <div className="flex justify-between gap-5 items-center border border-white rounded-lg p-6">
              <Label htmlFor="address" className="text-lg font-medium">
                Address:
              </Label>
              <Input
                className="w-[50%]"
                name="address"
                type="text"
                placeholder="Enter Address"
                value={updatedUserDetails?.address || ""}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between gap-5 items-center border border-white rounded-lg p-6">
              <Label htmlFor="phone" className="text-lg font-medium">
                Phone Number:
              </Label>
              <Input
                className="w-[50%]"
                name="phone"
                type="text"
                placeholder="Enter Phone Number"
                value={updatedUserDetails?.phone || ""}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between gap-5 items-center border border-white rounded-lg p-6">
              <Label htmlFor="age" className="text-lg font-medium">
                Age:
              </Label>
              <Input
                className="w-[50%]"
                name="age"
                type="number"
                placeholder="Enter Age"
                value={updatedUserDetails?.age || ""}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    age: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="flex justify-end">
              <FlowButton
                submitType={true}
                isDisabled={updateUserLoading}
                className="w-[50%] flex justify-center items-center"
              >
                {updateUserLoading ? (
                  <>
                    <Spinner />
                    <span>Updating</span>
                  </>
                ) : (
                  "Update Details"
                )}
              </FlowButton>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="order-history">
          <h2 className="text-2xl font-bold">My Order History</h2>
          {myOrderHistory && myOrderHistory.length > 0
            ? myOrderHistory.map((order) => (
                <div key={order.id}>
                  <h3 className="text-xl font-semibold mb-2">
                    Order ID: {order.id}
                  </h3>
                  <p className="mb-1">
                    Order Date: {new Date(order.orderedAt).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    Total Amount:{" "}
                    {order.total.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                  <p className="mb-1">Status: {order.status}</p>
                  <p className="mb-1">Order Address: {order.orderAddress}</p>
                </div>
              ))
            : "No orders placed yet."}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileClient;
