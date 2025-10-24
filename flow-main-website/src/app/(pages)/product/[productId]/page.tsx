import ProductsClient from "@/components/products/ProductsClient";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const ProductPage = async () => {
  const session = await getServerSession(authOptions);

  return <ProductsClient user={session?.user} />;
};

export default ProductPage;
