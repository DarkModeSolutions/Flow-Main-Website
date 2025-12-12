-- AddForeignKey
ALTER TABLE "public"."shadowfax_orders" ADD CONSTRAINT "shadowfax_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
