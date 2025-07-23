import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { products } from "./data";

// 단일 상품 스키마 정의
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  date: z.date(),
});

// 상품 배열 스키마 정의
const ProductsArraySchema = z.array(ProductSchema);

export async function GET() {
  try {
    // 배열 스키마로 검증
    const validatedProducts = ProductsArraySchema.parse(products);
    return NextResponse.json(validatedProducts);
  } catch (error) {
    console.error("상품 데이터 검증 오류:", error);
    return NextResponse.json(
      { error: "상품을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 단일 상품 스키마로 검증
    const validatedData = ProductSchema.parse(body);

    // 실제 환경에서는 데이터베이스에 저장
    console.log("새 상품 생성:", validatedData);

    return NextResponse.json(
      { message: "상품이 성공적으로 생성되었습니다.", product: validatedData },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "잘못된 데이터 형식입니다.", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "상품 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
