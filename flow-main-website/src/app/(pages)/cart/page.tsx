import CartClient from "@/components/cart/CartClient";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const CartPage = async () => {
  const session = await getServerSession(authOptions);

  return <CartClient user={session?.user} />;
};

export default CartPage;
