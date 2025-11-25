import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import LoadingComponent from "@/components/LoadingComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetOrdersForAdmin from "@/hooks/useGetOrdersForAdmin";
import useGlobalCancelOrder from "@/hooks/useGlobalCancelOrder";
import usePlaceOrderForAdmin from "@/hooks/usePlaceOrderForAdmin";
import { OrderDetailsWithAdminIncludes } from "@/types/adminTypes";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

const OrdersPage = () => {
  const [orderDetails, setOrderDetails] = useState<
    OrderDetailsWithAdminIncludes[] | []
  >([]);
  const [buttonLoadingState, setButtonLoadingState] = useState<{
    orderId: string | null;
    action: "approve" | "reject" | null;
  }>({ orderId: null, action: null });

  const {
    error: placeOrderError,
    loading: placeOrderLoading,
    placeOrderForAdmin,
  } = usePlaceOrderForAdmin();

  const {
    error: getOrdersError,
    getOrdersForAdmin,
    loading: getOrdersLoading,
  } = useGetOrdersForAdmin();

  const {
    error: globalCancelOrderError,
    globalCancelOrder,
    loading: globalCancelOrderLoading,
  } = useGlobalCancelOrder();

  const handleApproveReject = async (
    orderId: string,
    action: "approve" | "reject"
  ) => {
    setButtonLoadingState({ orderId, action });
    const pickupAddressId = 1;
    const acceptOrderRequest = action === "approve" ? true : false;
    await placeOrderForAdmin(orderId, pickupAddressId, acceptOrderRequest);
    setButtonLoadingState({ orderId: null, action: null });
    const updatedOrders = await getOrdersForAdmin();
    if (updatedOrders.length > 0) {
      setOrderDetails(updatedOrders);
    } else {
      setOrderDetails([]);
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      const ordersResponse = await getOrdersForAdmin();
      if (ordersResponse.length > 0) {
        setOrderDetails(ordersResponse);
      } else {
        setOrderDetails([]);
      }
    }

    fetchOrders();
  }, [getOrdersForAdmin]);

  const tableHeaders = [
    "Order Id",
    "Total",
    "Payment Status",
    "Delivery Status",
    "Email",
    "Phone",
    "Actions",
  ];

  if (getOrdersError || placeOrderError || globalCancelOrderError) {
    return (
      <ErrorComponent
        error={getOrdersError || placeOrderError || globalCancelOrderError}
      />
    );
  }

  return (
    <div>
      <h1 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
        Orders Page - Total Orders: {orderDetails.length}
      </h1>
      <div>
        {getOrdersLoading && <LoadingComponent />}
        {!getOrdersLoading && (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.length > 0 ? (
                  orderDetails
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.deliveryStatus}</TableCell>
                        <TableCell>{order.orderEmail}</TableCell>
                        <TableCell>{order.orderPhone}</TableCell>
                        <TableCell>
                          {order.deliveryStatus === "PROCESSING" ? (
                            <div className="w-full flex justify-between items-center gap-4 p-2">
                              <FlowButton
                                isDisabled={placeOrderLoading}
                                className="bg-[#8f0000] hover:bg-[#8f0000]"
                                onClickHandler={() =>
                                  handleApproveReject(order.id, "reject")
                                }
                              >
                                {buttonLoadingState.orderId === order.id &&
                                buttonLoadingState.action === "reject" ? (
                                  <LoadingComponent className="size-5" />
                                ) : (
                                  <ImCross className="text-black" />
                                )}
                              </FlowButton>
                              <FlowButton
                                isDisabled={placeOrderLoading}
                                className="bg-[#0d6e00] hover:bg-[#0d6e00]"
                                onClickHandler={() =>
                                  handleApproveReject(order.id, "approve")
                                }
                              >
                                {buttonLoadingState.orderId === order.id &&
                                buttonLoadingState.action === "approve" ? (
                                  <LoadingComponent className="size-5" />
                                ) : (
                                  <TiTick className="text-black" />
                                )}
                              </FlowButton>
                            </div>
                          ) : order.deliveryStatus === "INITIATED_BY_ADMIN" ? (
                            <FlowButton
                              onClickHandler={() =>
                                globalCancelOrder(order.id, "Reason to cancel")
                              }
                              isDisabled={globalCancelOrderLoading}
                              className="bg-red-700 hover:bg-red-700"
                            >
                              {globalCancelOrderLoading && (
                                <>
                                  <LoadingComponent className="size-5" />
                                  {` `}
                                </>
                              )}
                              Cancel Order
                            </FlowButton>
                          ) : (
                            <p className="text-gray-500">
                              No actions available
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
