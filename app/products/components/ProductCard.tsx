"use client";

import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden block"
    >
      <div className="relative w-full h-48 bg-gray-100">
        <picture className="w-full h-full">
          <source srcSet={product.image} type="image/webp" />
          <source srcSet={product.image} type="image/jpeg" />
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
      </div>

      {/* 상품 정보 */}
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

          <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            상세보기
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
