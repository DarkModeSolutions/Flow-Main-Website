-- CreateTable
CREATE TABLE "public"."order_items_holder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_items_holder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."order_items_holder" ADD CONSTRAINT "order_items_holder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items_holder" ADD CONSTRAINT "order_items_holder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
