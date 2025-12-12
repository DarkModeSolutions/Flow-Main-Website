"use client";

import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCreateNewAddress from "@/hooks/useCreateNewAddress";
import useDeleteUserAddress from "@/hooks/useDeleteUserAddress";
import useGetOrderDetails from "@/hooks/useGetOrderDetails";
import useGetUserAddressDetails from "@/hooks/useGetUserAddressDetails";
import useGetUserDetails from "@/hooks/useGetUserDetails";
import useUpdateUserAddress from "@/hooks/useUpdateUserAddress";
import useUpdateUserDetails from "@/hooks/useUpdateUserDetails";
import {
  AddressAllDetails,
  OrderDetailsWiithIncludes,
  SessionUser,
  UserDetails,
} from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ProfileClient = ({ user }: { user: SessionUser | undefined }) => {
  // console.log("Entering Profile client");

  const router = useRouter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [myUserDetails, setMyUserDetails] = useState<
    UserDetails | null | undefined
  >(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState<{
    name: string | null | undefined;
    email: string | undefined;
    phone: string | null | undefined;
    age: number | undefined | null;
  }>({
    name: "",
    email: "",
    phone: "",
    age: undefined,
  });
  const [updatedUserAddressDetails, setUpdatedUserAddressDetails] = useState<
    AddressAllDetails[] | null
  >(null);
  const [newUserAddressDetails, setNewUserAddressDetails] =
    useState<AddressAllDetails | null>(null);
  const [myOrderHistory, setMyOrderHistory] = useState<
    OrderDetailsWiithIncludes[] | [] | undefined
  >();

  // console.log("User details in profile section: ", user);
  // console.log("Updated User details in profile section: ", updatedUserDetails);

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

  const {
    error: getUserAddressDetailsError,
    loading: getUserAddressDetailsLoading,
    getUserAddressDetails,
  } = useGetUserAddressDetails();

  const {
    error: updateUserAddressError,
    loading: updateUserAddressLoading,
    updateUserAddress,
  } = useUpdateUserAddress();

  const {
    error: createNewAddressError,
    loading: createNewAddressLoading,
    createNewAddress,
  } = useCreateNewAddress();

  const {
    error: deleteUserAddressError,
    loading: deleteUserAddressLoading,
    deleteUserAddress,
  } = useDeleteUserAddress();

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function fetchUserDetails() {
      if (user?.id) {
        const userDetails = await getUserDetails(user.id);
        const orderHistory = await getOrderDetails(user.id);
        const userAddressDetails = await getUserAddressDetails(user.id);
        // console.log("Fetched user details: ", userDetails);
        // console.log("Fetched order history: ", orderHistory);
        // console.log("Fetched user address details: ", userAddressDetails);
        setMyUserDetails(userDetails);
        // console.log(updatedUserDetails);
        setMyOrderHistory(orderHistory);
        setUpdatedUserAddressDetails(userAddressDetails);
      } else {
        // console.log("redirecting from use effect");
        router.push("/auth/login");
      }
    }

    fetchUserDetails();
  }, [getUserDetails, router, user, getOrderDetails, getUserAddressDetails]);

  useEffect(() => {
    // console.log("My user details inside use effect: ", myUserDetails);
    if (myUserDetails) {
      // console.log("Entering if in use effect");
      setUpdatedUserDetails({
        name: myUserDetails.user?.name,
        email: myUserDetails.user?.email,
        phone: myUserDetails.user?.phone,
        age: myUserDetails.user?.age,
      });
    }
  }, [myUserDetails]);

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || user.buyingAsGuest) {
      router.push("/auth/login");
    }

    await updateUserDetails({
      userId: user!.id,
      // updatedAddress: updatedUserDetails.address,
      updatedAge: updatedUserDetails.age,
      updatedEmail: updatedUserDetails.email,
      updatedName: updatedUserDetails.name,
      updatedPhone: updatedUserDetails.phone,
    });

    // console.log("Updated user details response: ", updateDetails);
  };

  const addressOnChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: string,
    field: string
  ) => {
    if (!updatedUserAddressDetails) return;
    const updatedAddresses = updatedUserAddressDetails.map((address) => {
      if (address.id === index) {
        return {
          ...address,
          [field]: e.target.value,
        };
      }
      return address;
    });
    setUpdatedUserAddressDetails(updatedAddresses);
  };

  const handleUpdateUserAddressSubmit = async (
    e: React.FormEvent,
    addressId: string
  ) => {
    if (!user || !user?.id) {
      router.push("/auth/login");
    }

    const addressToUpdate = updatedUserAddressDetails?.find(
      (address) => address.id === addressId
    );

    if (addressToUpdate) {
      await updateUserAddress({
        userId: user!.id,
        addressId: addressToUpdate.id,
        updatedAddressLine1: addressToUpdate.addressLine1,
        updatedAddressLine2: addressToUpdate.addressLine2 || "",
        updatedCity: addressToUpdate.city,
        updatedState: addressToUpdate.state,
        updatedPincode: addressToUpdate.pincode,
        updatedCountry: addressToUpdate.country,
        updatedAddressName: addressToUpdate.addressName,
      });

      // console.log("Updated address response: ", updateAddressResponse);
      return;
    }

    return;
  };

  const handleCreateNewAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user?.id) {
      router.push("/auth/login");
    }

    const createAddressResponse = await createNewAddress({
      userId: user!.id,
      addressLine1: newUserAddressDetails?.addressLine1,
      addressLine2: newUserAddressDetails?.addressLine2,
      city: newUserAddressDetails?.city,
      state: newUserAddressDetails?.state,
      pincode: newUserAddressDetails?.pincode,
      country: newUserAddressDetails?.country,
      addressName: newUserAddressDetails?.addressName,
    });

    // console.log("Create new address response: ", createAddressResponse);

    if (createAddressResponse && createAddressResponse.success) {
      const updatedAddresses = await getUserAddressDetails(user!.id);
      setUpdatedUserAddressDetails(updatedAddresses);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !user?.id) {
      router.push("/auth/login");
    }

    const deleteAddressResponse = await deleteUserAddress(user!.id, addressId);

    // console.log("Delete address response: ", deleteAddressResponse);

    if (deleteAddressResponse && deleteAddressResponse.success) {
      const updatedAddresses = await getUserAddressDetails(user!.id);
      setUpdatedUserAddressDetails(updatedAddresses);
    }
  };

  if (getUserLoading || orderDetailsLoading || getUserAddressDetailsLoading) {
    return (
      <>
        <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
      </>
    );
  }

  if (
    updateUserError ||
    orderDetailsError ||
    updateUserAddressError ||
    createNewAddressError ||
    deleteUserAddressError ||
    getUserAddressDetailsError
  ) {
    return (
      <ErrorComponent
        error={
          updateUserError ||
          orderDetailsError ||
          updateUserAddressError ||
          createNewAddressError ||
          deleteUserAddressError ||
          getUserAddressDetailsError
        }
      />
    );
  }

  return (
    <div>
      <Tabs defaultValue="user-details">
        <TabsList className="mb-10">
          <TabsTrigger
            className="data-[state=active]:bg-white data-[state=active]:text-black"
            value="user-details"
          >
            User Details
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-white data-[state=active]:text-black"
            value="user-addresses"
          >
            User Addresses
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-white data-[state=active]:text-black"
            value="order-history"
          >
            Order History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-details">
          <h2 className="text-2xl font-bold mb-4">My User Profile</h2>
          <form
            className="w-[30%] not-md:w-full mx-auto flex flex-col gap-y-4"
            onSubmit={(e) => handleUpdateUserSubmit(e)}
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
                value={myUserDetails?.user?.password || ""}
                // className="pr-6"
                disabled
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
        <TabsContent value="user-addresses">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold mb-4">My Addresses</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#24bfcf] rounded-4xl p-4 text-black w-[20%] hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-black p-10">
                <DialogTitle>Create an Address</DialogTitle>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleCreateNewAddressSubmit(e);
                    setIsCreateDialogOpen(false); // ✅ close dialog
                  }}
                  className="w-full flex flex-col gap-y-4"
                >
                  <Input
                    name="addressName"
                    id="addressName"
                    placeholder="Address Name"
                    value={newUserAddressDetails?.addressName || "Other"}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        addressName: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="addressLine1"
                    id="addressLine1"
                    placeholder="Address Line 1"
                    value={newUserAddressDetails?.addressLine1}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        addressLine1: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="addressLine2"
                    id="addressLine2"
                    placeholder="Address Line 2"
                    value={newUserAddressDetails?.addressLine2 || ""}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        addressLine2: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="pincode"
                    id="pincode"
                    placeholder="Pincode"
                    value={newUserAddressDetails?.pincode}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        pincode: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="city"
                    id="city"
                    placeholder="City"
                    value={newUserAddressDetails?.city}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        city: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="state"
                    id="state"
                    placeholder="State"
                    value={newUserAddressDetails?.state}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        state: e.target.value,
                      })
                    }
                  />
                  <Input
                    name="country"
                    id="country"
                    placeholder="Country"
                    value={newUserAddressDetails?.country}
                    onChange={(e) =>
                      setNewUserAddressDetails({
                        ...newUserAddressDetails!,
                        country: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-end">
                    <FlowButton
                      submitType={true}
                      isDisabled={createNewAddressLoading}
                      className="w-[50%] flex justify-center items-center"
                    >
                      {createNewAddressLoading ? (
                        <>
                          <Spinner />
                          <span>Updating</span>
                        </>
                      ) : (
                        "Create Address"
                      )}
                    </FlowButton>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-y-3.5">
            {updatedUserAddressDetails && updatedUserAddressDetails.length > 0
              ? updatedUserAddressDetails.map((address) => (
                  <div
                    className="w-[30%] not-md:w-full mx-auto border rounded-lg p-4"
                    key={address.id}
                  >
                    <h3 className="mb-2 text-lg font-semibold">
                      {address.addressName || "No Name Given"}
                    </h3>
                    <form
                      onSubmit={(e) =>
                        handleUpdateUserAddressSubmit(e, address.id)
                      }
                      className="w-full flex flex-col gap-y-4"
                    >
                      <Input
                        name="addressName"
                        id="addressName"
                        placeholder="Address Name"
                        value={address.addressName || "Other"}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "addressName")
                        }
                      />
                      <Input
                        name="addressLine1"
                        id="addressLine1"
                        placeholder="Address Line 1"
                        value={address.addressLine1}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "addressLine1")
                        }
                      />
                      <Input
                        name="addressLine2"
                        id="addressLine2"
                        placeholder="Address Line 2"
                        value={address.addressLine2 || ""}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "addressLine2")
                        }
                      />
                      <Input
                        name="pincode"
                        id="pincode"
                        placeholder="Pincode"
                        value={address.pincode}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "pincode")
                        }
                      />
                      <Input
                        name="city"
                        id="city"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "city")
                        }
                      />
                      <Input
                        name="state"
                        id="state"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "state")
                        }
                      />
                      <Input
                        name="country"
                        id="country"
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) =>
                          addressOnChangeHandler(e, address.id, "country")
                        }
                      />
                      <div className="flex justify-between items-center">
                        <Dialog
                          open={deleteDialogOpen === address.id}
                          onOpenChange={(isOpen) =>
                            setDeleteDialogOpen(isOpen ? address.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button className="bg-[#ce0f0f] rounded-4xl p-4 text-white w-[30%] hover:bg-[#ce0f0f] hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-black p-10">
                            <DialogTitle>
                              {`Are you sure you want to delete this "${address.addressName}" permanently?`}
                            </DialogTitle>
                            <Button
                              onClick={async () => {
                                await handleDeleteAddress(address.id);
                                setDeleteDialogOpen(null); // ✅ close after success
                              }}
                              disabled={deleteUserAddressLoading}
                              className="bg-[#ce0f0f] rounded-4xl p-4 text-white w-[30%] hover:bg-[#ce0f0f] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                            >
                              {deleteUserAddressLoading ? (
                                <>
                                  <Spinner />
                                  <span>Deleting..</span>
                                </>
                              ) : (
                                "Yes"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(null)}
                            >
                              No
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <FlowButton
                          submitType={true}
                          isDisabled={updateUserAddressLoading}
                          className="w-[50%] flex justify-center items-center"
                        >
                          {updateUserAddressLoading ? (
                            <>
                              <Spinner />
                              <span>Updating</span>
                            </>
                          ) : (
                            "Update Address"
                          )}
                        </FlowButton>
                      </div>
                    </form>
                  </div>
                ))
              : "No addresses added yet."}
          </div>
        </TabsContent>
        <TabsContent value="order-history">
          <h2 className="text-2xl font-bold mb-4">My Order History</h2>
          {myOrderHistory && myOrderHistory.length > 0
            ? myOrderHistory.map((order) => (
                <div className="border p-4 rounded-lg" key={order.id}>
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
