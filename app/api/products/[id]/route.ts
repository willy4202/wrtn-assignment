import { products } from "@/app/mock/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = products.find((product) => product.id === id);

    if (!product) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "상품을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// // PUT 메서드 - 상품 수정
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const body = await request.json();

//     console.log("🔄 상품 수정 요청:", id, body);

//     // 실제 환경에서는 데이터베이스 업데이트
//     return NextResponse.json(
//       { message: "상품이 수정되었습니다.", id },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "상품 수정에 실패했습니다." },
//       { status: 500 }
//     );
//   }
// }

// // DELETE 메서드 - 상품 삭제
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     console.log("🗑️ 상품 삭제 요청:", id);

//     // 실제 환경에서는 데이터베이스에서 삭제
//     return NextResponse.json(
//       { message: "상품이 삭제되었습니다.", id },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "상품 삭제에 실패했습니다." },
//       { status: 500 }
//     );
//   }
// }
