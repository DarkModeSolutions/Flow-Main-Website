-- CreateTable
CREATE TABLE "public"."shadowfax_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "awb_number" TEXT NOT NULL,
    "shipment_status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shadowfax_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shadowfax_orders_orderId_key" ON "public"."shadowfax_orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "shadowfax_orders_awb_number_key" ON "public"."shadowfax_orders"("awb_number");
