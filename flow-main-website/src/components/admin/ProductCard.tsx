import { images } from "@/utils/constants";
import Image from "next/image";

const ProductCard = ({ img, name }: { img: string | null; name: string }) => {
  const prodImage = img ? images[img as keyof typeof images] : null; // Fallback image

  return (
    <div className="relative w-[400px] h-[400px]">
      {prodImage !== null ? (
        <Image src={prodImage} alt={name} fill className="object-cover" />
      ) : (
        <div>
          No Image Available
          <p>Product Name: {name}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
