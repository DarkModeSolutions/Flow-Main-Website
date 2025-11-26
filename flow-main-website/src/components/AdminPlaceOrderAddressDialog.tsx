"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useGlobalCancelOrder from "@/hooks/useGlobalCancelOrder";
import usePlaceOrderForAdmin from "@/hooks/usePlaceOrderForAdmin";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

const AdminPlaceCancelOrderDialog = ({
  orderId,
  action,
}: {
  orderId: string;
  action: "approve" | "reject" | "cancel";
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
  const [cancelReason, setCancelReason] = useState("");
  const [open, setOpen] = useState(false);

  const {
    error: placeOrderError,
    loading: placeOrderLoading,
    placeOrderForAdmin,
  } = usePlaceOrderForAdmin();

  const {
    error: globalCancelOrderError,
    globalCancelOrder,
    loading: globalCancelOrderLoading,
  } = useGlobalCancelOrder();

  const handleApprove = async () => {
    await placeOrderForAdmin(orderId, Number(selectedAddressId), true);
    setOpen(false); // Close after completion
  };

  const handleReject = async () => {
    await placeOrderForAdmin(orderId, Number(selectedAddressId), false);
    setOpen(false); // Close after completion
  };

  const handleCancel = async () => {
    await globalCancelOrder(orderId, cancelReason);
    setOpen(false); // Close after completion
  };

  if (placeOrderError || globalCancelOrderError) {
    return <ErrorComponent error={placeOrderError || globalCancelOrderError} />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            action === "approve"
              ? "bg-[#0d6e00] hover:bg-[#0d6e00] w-[40%]"
              : action === "reject"
              ? "bg-[#8f0000] hover:bg-[#8f0000] w-[40%]"
              : "bg-red-700 hover:bg-red-700 text-white"
          } rounded-4xl p-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer`}
        >
          {action === "approve" ? (
            <TiTick className="text-black" />
          ) : action === "reject" ? (
            <ImCross className="text-black" />
          ) : (
            "Cancel Order"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black p-10">
        {action === "approve" ? (
          <>
            <DialogTitle>Choose your Pickup Address</DialogTitle>
            <RadioGroup
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem flowRadio value="1" id="r1" />
                <Label htmlFor="r1">Susheel&apos;s Address</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem flowRadio value="2" id="r2" />
                <Label htmlFor="r2">Lehans&apos;s Address</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem flowRadio value="3" id="r3" />
                <Label htmlFor="r3">Swami&apos;s Address</Label>
              </div>
            </RadioGroup>
            <Button
              disabled={placeOrderLoading}
              onClick={handleApprove}
              className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              {placeOrderLoading ? (
                <>
                  <LoadingComponent className="size-5" />
                  {` `} Processing...
                </>
              ) : (
                "Initiate Pickup"
              )}
            </Button>
          </>
        ) : action === "reject" ? (
          <>
            <DialogTitle>Are you sure you want to reject pick up?</DialogTitle>
            <div className="w-ful flex justify-evenly items-center">
              <Button
                disabled={placeOrderLoading}
                onClick={handleReject}
                className="bg-[#d30000] rounded-4xl p-4 text-white hover:bg-[#d30000] hover:opacity-80 transition-opacity duration-200 cursor-pointer w-[45%]"
              >
                {placeOrderLoading ? (
                  <>
                    <LoadingComponent className="size-5" />
                    {` `} Processing...
                  </>
                ) : (
                  "Yes"
                )}
              </Button>
              <DialogClose asChild>
                <Button className="bg-[#f8f8f8] rounded-4xl p-4 text-black hover:bg-[#f8f8f8] hover:opacity-80 transition-opacity duration-200 cursor-pointer w-[45%]">
                  No
                </Button>
              </DialogClose>
            </div>
          </>
        ) : (
          <>
            <DialogTitle>Cancel Order</DialogTitle>
            <div>
              <h2 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
                What is your reason to cancel?
              </h2>
              <Input
                type="text"
                placeholder="Enter your reason here"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-4 bg-transparent border-[#24bfcf] text-white w-full"
              />
            </div>
            <div className="w-ful flex justify-center items-center mt-4">
              <Button
                disabled={globalCancelOrderLoading}
                onClick={handleCancel}
                className="bg-[#d30000] rounded-4xl p-4 text-white hover:bg-[#d30000] hover:opacity-80 transition-opacity duration-200 cursor-pointer w-[45%]"
              >
                {globalCancelOrderLoading ? (
                  <>
                    <LoadingComponent className="size-5" />
                    {` `} Processing...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminPlaceCancelOrderDialog;
