import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            상품을 찾을 수 없습니다
          </h2>
          <p className="text-gray-500 mb-8">
            요청하신 상품이 존재하지 않거나 삭제되었습니다.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            상품 목록으로 돌아가기
          </Link>

          <br />

          <Link
            href="/"
            className="inline-block text-gray-500 hover:text-gray-700 transition-colors"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
