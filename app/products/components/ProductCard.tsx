"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-lg border border-gray-200 shadow-md cursor-pointer overflow-hidden block"
    >
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {product.price.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
