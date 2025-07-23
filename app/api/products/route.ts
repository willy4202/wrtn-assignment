import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { products, Product } from "./data";

// Zod 스키마 정의
const ProductSchema = z.object({
  id: z.string().min(1, "ID는 필수입니다"),
  name: z.string().min(1, "상품명은 필수입니다"),
  price: z.number().positive("가격은 양수여야 합니다"),
  image: z.string().regex(/^https?:\/\/.+$/, "올바른 이미지 URL이 필요합니다"),
  description: z.string().min(1, "설명은 필수입니다"),
});

// GET 메서드 - 모든 상품 조회
export async function GET() {
  return NextResponse.json(products);
}

// POST 메서드 - 새 상품 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod를 사용한 요청 검증
    const validatedData = ProductSchema.parse(body);

    // 중복 ID 체크
    const exists = products.some((p) => p.id === validatedData.id);
    if (exists) {
      return NextResponse.json(
        { message: "이미 존재하는 ID입니다" },
        { status: 409 }
      );
    }

    // 새 상품 추가
    const newProduct: Product = validatedData;
    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    // Zod 검증 에러 처리
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "입력 데이터가 올바르지 않습니다",
          error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
