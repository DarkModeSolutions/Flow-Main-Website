import { images } from "@/utils/constants";
import Image from "next/image";
import React from "react";

const ProductCard = ({ img, name }: { img: string | null; name: string }) => {
  const prodImage = img ? images[img as keyof typeof images] : null; // Fallback image

  return (
    <div>
      {prodImage !== null ? (
        <Image src={prodImage} alt={name} fill />
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
