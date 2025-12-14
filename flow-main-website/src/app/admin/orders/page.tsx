"use client";

import AdminPlaceCancelOrderDialog from "@/components/AdminPlaceOrderAddressDialog";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
                    .map((order) => (
                      <TableRow key={order.id}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <TableCell className="cursor-pointer hover:bg-gray-600 transition-all duration-300 ease-in-out">
                              {order.id}
                            </TableCell>
                          </DialogTrigger>
                          <DialogContent className="max-h-[75vh] p-6 bg-black">
                            <DialogTitle className="mb-1.5 text-center">
                              Order Details - Order Number {order.id}
                              <ScrollArea className="w-full h-full mt-3">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="border border-[#24bfcf] rounded-md p-4 mb-4 flex justify-between items-center gap-2 text-xs"
                                  >
                                    <p className="flex items-center gap-1 text-gray-300">
                                      Item Name:{" "}
                                      <span className="text-[#24bfcf]">
                                        {item.product.name}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-1 text-gray-300">
                                      Item Price:{" "}
                                      <span className="text-[#24bfcf]">
                                        {item.product.price}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-1 text-gray-300">
                                      Quantity Ordered:{" "}
                                      <span className="text-[#24bfcf]">
                                        {item.quantity}
                                      </span>
                                    </p>
                                  </div>
                                ))}
                              </ScrollArea>
                            </DialogTitle>
                          </DialogContent>
                        </Dialog>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.deliveryStatus}</TableCell>
                        <TableCell>{order.orderEmail}</TableCell>
                        <TableCell>{order.orderPhone}</TableCell>
                        <TableCell>
                          {order.deliveryStatus === "PROCESSING" ? (
                            <div className="flex justify-between items-center p-2">
                              <AdminPlaceCancelOrderDialog
                                orderId={order.id}
                                action="approve"
                              />
                              <AdminPlaceCancelOrderDialog
                                orderId={order.id}
                                action="reject"
                              />
                            </div>
                          ) : order.deliveryStatus === "INITIATED_BY_ADMIN" ? (
                            <AdminPlaceCancelOrderDialog
                              orderId={order.id}
                              action="cancel"
                            />
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
