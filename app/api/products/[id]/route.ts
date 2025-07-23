import { ProductSchema } from "@/app/schema/product";
import { products } from "@/app/mock/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const product = products.find((product) => product.id === id);

    const validatedProduct = ProductSchema.parse(product);

    if (!validatedProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(validatedProduct);
  } catch (error) {
    console.error("상품 데이터 검증 오류:", error);
    return NextResponse.json(
      { error: "상품을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
