import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { products } from "./data";

// Zod 스키마 정의
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
});

export async function GET() {
  try {
    const parsed = ProductSchema.parse(products);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "상품을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod로 데이터 검증
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
