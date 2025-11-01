import ProductCard from "@/components/admin/ProductCard";
import ErrorComponent from "@/components/ErrorComponent";
import { Spinner } from "@/components/ui/spinner";
import useGetAllProducts from "@/hooks/useGetAllProducts";
import { AllProductDetails } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminProductsPage = () => {
  const router = useRouter();

  const [products, setProducts] = useState<
    AllProductDetails[] | null | undefined
  >();

  const { error, getAllProducts, loading } = useGetAllProducts();

  useEffect(() => {
    async function fetchProducts() {
      const prods = await getAllProducts();

      if (prods === null || prods === undefined) {
        setProducts(null);
        return;
      }

      setProducts(prods);
    }

    fetchProducts();
  }, [getAllProducts]);

  return (
    <div className="min-h-screen w-full">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner className="size-10" />
        </div>
      ) : error ? (
        <ErrorComponent error={error} />
      ) : (
        <div className="w-full h-full">
          <h2>Products in Database: {products ? products?.length : 0}</h2>
          <div>
            {products?.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/admin/product/${product.id}`)}
              >
                <ProductCard
                  img={product.imageUrl}
                  name={product.name}
                  key={product.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
