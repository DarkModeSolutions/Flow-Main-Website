import CartClient from "@/components/cart/CartClient";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const Cart = async () => {
  const session = await getServerSession(authOptions);
  // console.log("Session in Cart:", session);

  return <CartClient user={session?.user} />;
};

export default Cart;
