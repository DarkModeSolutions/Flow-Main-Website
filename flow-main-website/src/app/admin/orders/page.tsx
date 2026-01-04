"use client";
import AdminPlaceCancelOrderDialog from "@/components/AdminPlaceOrderAddressDialog";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetOrdersForAdmin from "@/hooks/useGetOrdersForAdmin";
import { OrderDetailsWithAdminIncludes } from "@/types/adminTypes";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orderDetails, setOrderDetails] = useState<
    OrderDetailsWithAdminIncludes[] | []
  >([]);

  const {
    error: getOrdersError,
    getOrdersForAdmin,
    loading: getOrdersLoading,
  } = useGetOrdersForAdmin();

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
    "Order Created Date",
    "Items",
    "Total",
    "Payment Status",
    "Delivery Status",
    "Email",
    "Phone",
    "Actions",
  ];

  if (getOrdersError) {
    return <ErrorComponent error={getOrdersError} />;
  }

  return (
    <div>
      <h1 className="manrope manrope-semibold text-[#24BFCF] text-2xl mb-4">
        Orders Page - Total Orders: {orderDetails.length}
      </h1>
      <div>
        {getOrdersLoading && <LoadingComponent />}
        {!getOrdersLoading && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead
                      className="border-r border-l border-solid"
                      key={index}
                    >
                      {header}
                    </TableHead>
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
                    .map((order) => {
                      const isBundleOrder =
                        order.orderUsername?.startsWith("Bundle Order:");

                      return (
                        <TableRow
                          key={order.id}
                          className={isBundleOrder ? "bg-[#BFFF00]/5" : ""}
                        >
                          <TableCell
                            className="max-w-[150px] truncate"
                            title={order.id}
                          >
                            {order.id.slice(0, 8)}...
                            {isBundleOrder && (
                              <span className="ml-1 px-1.5 py-0.5 bg-[#BFFF00] text-black text-xs rounded font-semibold">
                                Bundle
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  View {order.orderItems.length} item(s)
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px] bg-black/95 border border-gray-700">
                                <DialogTitle className="text-[#24BFCF]">
                                  Order Items
                                </DialogTitle>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                  {isBundleOrder && (
                                    <div className="p-3 bg-[#BFFF00]/10 rounded-lg border border-[#BFFF00]/30 mb-4">
                                      <p className="text-sm text-[#BFFF00] font-semibold">
                                        Bundle Order
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {order.orderUsername?.replace(
                                          "Bundle Order: ",
                                          ""
                                        )}
                                      </p>
                                    </div>
                                  )}
                                  {order.orderItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
                                    >
                                      <div>
                                        <p className="font-medium text-white">
                                          {item.product?.name ||
                                            "Unknown Product"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-400">
                                          ₹
                                          {item.product?.price?.toLocaleString(
                                            "en-IN"
                                          ) || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="border-t border-gray-700 pt-3 mt-3">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-white">
                                      Order Total:
                                    </span>
                                    <span className="font-bold text-[#24BFCF]">
                                      ₹{order.total.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  {order.orderAddress && (
                                    <div className="mt-2 text-sm text-gray-400">
                                      <span className="font-medium">
                                        Address:{" "}
                                      </span>
                                      {order.orderAddress}
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell>
                            ₹{order.total.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                order.status === "COMPLETED"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "PENDING"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                order.deliveryStatus === "INITIATED_BY_ADMIN" ||
                                order.deliveryStatus === "INITIATED_BY_USER"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : order.deliveryStatus === "PROCESSING"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {order.deliveryStatus.replace(/_/g, " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.orderEmail}
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.orderPhone}
                          </TableCell>
                          <TableCell>
                            {order.deliveryStatus === "PROCESSING" ? (
                              <div className="flex gap-2">
                                <AdminPlaceCancelOrderDialog
                                  orderId={order.id}
                                  action="approve"
                                />
                                <AdminPlaceCancelOrderDialog
                                  orderId={order.id}
                                  action="reject"
                                />
                              </div>
                            ) : order.deliveryStatus ===
                              "INITIATED_BY_ADMIN" ? (
                              <AdminPlaceCancelOrderDialog
                                orderId={order.id}
                                action="cancel"
                              />
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No actions
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
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
