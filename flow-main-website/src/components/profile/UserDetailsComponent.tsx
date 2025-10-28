"use client";

import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import useGetUserDetails from "@/hooks/useGetUserDetails";
import useUpdateUserDetails from "@/hooks/useUpdateUserDetails";
import { SessionUser, UserDetails } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetailsComponent = ({ user }: { user: SessionUser | undefined }) => {
  const router = useRouter();

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

  const { getUserDetails, loading: getUserLoading } = useGetUserDetails();
  const {
    error: updateUserError,
    loading: updateUserLoading,
    updateUserDetails,
  } = useUpdateUserDetails();

  useEffect(() => {
    async function fetchUserDetails() {
      if (user?.id) {
        const userDetails = await getUserDetails(user.id);
        console.log("Fetched user details: ", userDetails);
        setMyUserDetails(userDetails);
        setUpdatedUserDetails({
          name: userDetails?.user?.name,
          email: userDetails?.user?.email,
          phone: userDetails?.user?.phone,
          age: userDetails?.user?.age,
        });
      } else {
        console.log("redirecting from use effect");
        router.push("/auth/login");
      }
    }

    fetchUserDetails();
  }, [getUserDetails, router, user?.id]);

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      router.push("/auth/login");
    }

    const updateDetails = await updateUserDetails({
      userId: user!.id,
      // updatedAddress: updatedUserDetails.address,
      updatedAge: updatedUserDetails.age,
      updatedEmail: updatedUserDetails.email,
      updatedName: updatedUserDetails.name,
      updatedPhone: updatedUserDetails.phone,
    });

    console.log("Updated user details response: ", updateDetails);
  };

  if (getUserLoading) {
    return (
      <>
        <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
      </>
    );
  }

  if (updateUserError) {
    return <ErrorComponent error={updateUserError} />;
  }

  return (
    <div>
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
    </div>
  );
};

export default UserDetailsComponent;
