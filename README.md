# Product Management App

Next.js 14 App Router와 ISR(Incremental Static Regeneration)을 활용한 상품 관리 애플리케이션

## 🎯 프로젝트 개요

이 프로젝트는 **ISR과 React Query를 조합**하여 최적의 성능과 사용자 경험을 제공하는 상품 관리 시스템입니다. 특히 **ISR의 revalidation 전략**과 **404 에러 처리**에 중점을 두어 개발되었습니다.

## 🏗️ 아키텍처 설계

### 1. ISR vs CSR 적용 전략

#### 📄 **상품 목록 페이지 (`/products`) - ISR 적용**

```typescript
// app/products/page.tsx
const ProductsPage = async () => {
  // ISR로 빌드 시점에 정적 생성, 60초마다 revalidate
  const products = await fetchProducts();
  return <ProductListClient initialProducts={products} />;
};
```

**ISR 적용 이유:**

- ✅ **SEO 최적화**: 상품 목록은 검색엔진 노출이 중요
- ✅ **초기 로딩 성능**: 빌드 시점에 정적 생성으로 빠른 FCP
- ✅ **데이터 일관성**: 60초 간격으로 최신 데이터 보장
- ✅ **서버 부하 감소**: 캐시된 정적 페이지 제공

#### 🔍 **상품 상세 페이지 (`/products/[id]`) - ISR + 동적 라우팅**

```typescript
// remote/products.api.ts
export const getProduct = async (id: string) => {
  const response = await fetch(`http://localhost:3002/api/products/${id}`, {
    next: {
      revalidate: 60,
      tags: ["products", `product-${id}`],
    },
  });
  // 404 처리 로직
};
```

**ISR 적용 이유:**

- ✅ **개별 상품 캐싱**: 각 상품별로 독립적인 revalidation
- ✅ **404 처리**: 존재하지 않는 상품에 대한 적절한 에러 페이지
- ✅ **태그 기반 무효화**: 특정 상품 변경 시 해당 페이지만 갱신

### 2. Revalidation 전략

#### 🔄 **Server Actions를 통한 On-Demand Revalidation**

```typescript
// app/actions/product-actions.ts
export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    // ISR 캐시 무효화 - 핵심!
    revalidateTag("products");
    revalidateTag(`product-${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}
```

**설계 의도:**

- ✅ **즉시 반영**: 상품 추가/삭제 시 즉시 캐시 무효화
- ✅ **선택적 갱신**: 전체가 아닌 관련 태그만 revalidate
- ✅ **사용자 경험**: 액션 후 최신 데이터 즉시 확인 가능

## 🛠️ 기술적 도전과 해결 과정

### 1. ISR vs React Query 선택 딜레마

#### 🤔 **초기 문제**

- React Query와 ISR을 동시에 사용하여 **중복 캐싱** 발생
- 클라이언트/서버 캐시 불일치로 예측 불가능한 동작

#### 💡 **해결 과정**

```typescript
// Before: 혼재된 접근
const ProductsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getProductsQuery); // React Query
  // + ISR도 동시에 사용
};

// After: ISR 중심으로 통일
const ProductsPage = async () => {
  const products = await fetchProducts(); // ISR만 사용
  return <ProductListClient initialProducts={products} />;
};
```

#### 📚 **학습한 점**

- **ISR은 SWR 전략**: "빌드 시점 정적 생성 + 주기적 갱신" 요구사항에 적합
- **React Query는 CSR**: 클라이언트 중심의 실시간 상태 관리에 적합
- **혼합 사용의 복잡성**: 두 기술의 캐싱 전략이 충돌할 수 있음

### 2. 404 에러 처리의 복잡성

#### 🤔 **초기 문제**

```typescript
// 잘못된 접근: response.ok 체크 없이 진행
export const getProduct = async (id: string) => {
  const response = await fetch(`/api/products/${id}`);
  const data = await response.json(); // ❌ 404여도 실행됨
  return data; // { error: "상품을 찾을 수 없습니다." } 반환
};
```

#### 💡 **해결 과정**

```typescript
// 1단계: 에러 상태 체크 추가
if (!response.ok) {
  if (response.status === 404) {
    throw new Error(`404`);
  }
  throw new Error(`HTTP error! status: ${response.status}`);
}

// 2단계: 페이지에서 타입 안전한 에러 처리
try {
  await getProduct(params.id);
} catch (error) {
  if (error instanceof Error && error.message.includes("404")) {
    notFound(); // Next.js 404 페이지 표시
  }
  throw error;
}
```

#### 📚 **학습한 점**

- **서버 컴포넌트에서의 에러 처리**: try-catch로 404를 먼저 검증
- **notFound() 함수**: Next.js App Router의 선언적 404 처리
- **타입 안전성**: `unknown` 타입부터 시작하여 점진적 타입 좁히기

### 3. ISR 태그 전략 설계

#### 🤔 **초기 문제**

- 상품 추가/삭제 후 목록이 자동으로 업데이트되지 않음
- 전체 캐시를 무효화하면 성능 저하

#### 💡 **해결 과정**

```typescript
// 계층적 태그 구조 설계
export const getProducts = async () => {
  const response = await fetch("/api/products", {
    next: {
      tags: ["products"], // 전체 상품 목록
    },
  });
};

export const getProduct = async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    next: {
      tags: ["products", `product-${id}`], // 특정 상품 + 전체 목록
    },
  });
};

// 선택적 revalidation
revalidateTag("products"); // 목록 갱신
revalidateTag(`product-${id}`); // 특정 상품 갱신
```

#### 📚 **학습한 점**

- **태그 계층화**: 전체(`products`) + 개별(`product-${id}`) 구조
- **최소 무효화 원칙**: 변경된 데이터와 관련된 캐시만 갱신
- **성능 최적화**: 불필요한 재생성 방지

## 📁 코드 구조 및 설계 원칙

### 1. 디렉토리 구조

```
app/
├── products/
│   ├── [id]/
│   │   ├── page.tsx          # ISR 상품 상세 페이지
│   │   └── not-found.tsx     # 커스텀 404 페이지
│   ├── components/
│   │   ├── ProductCard.tsx   # 재사용 가능한 상품 카드
│   │   └── ProductListClient.tsx # 클라이언트 컴포넌트
│   └── page.tsx              # ISR 상품 목록 페이지
├── actions/
│   └── product-actions.ts    # Server Actions (revalidation)
└── api/
    └── products/
        ├── route.ts          # 상품 목록 API
        └── [id]/route.ts     # 상품 상세 API

remote/
├── products.api.ts           # API 호출 함수
└── products.query.ts         # 쿼리 설정

types/
└── product.ts               # 타입 정의
```

### 2. 컴포넌트 분리 원칙

#### 🎯 **서버/클라이언트 컴포넌트 분리**

```typescript
// 서버 컴포넌트 (ISR)
const ProductsPage = async () => {
  const products = await fetchProducts(); // 서버에서 데이터 fetch
  return <ProductListClient initialProducts={products} />;
};

// 클라이언트 컴포넌트 (인터랙션)
const ProductListClient = ({ initialProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // 검색, 필터링 등 상태 관리
};
```

**설계 의도:**

- ✅ **서버**: 데이터 페칭, SEO, 초기 렌더링
- ✅ **클라이언트**: 사용자 인터랙션, 상태 관리
- ✅ **하이드레이션**: 서버 데이터를 클라이언트로 전달

### 3. 에러 처리 계층화

```typescript
// 1. API 레벨 에러 처리
export const getProduct = async (id: string) => {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`404`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// 2. 페이지 레벨 에러 처리
const ProductPage = async ({ params }) => {
  try {
    await getProduct(params.id);
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound(); // 선언적 404 처리
    }
    throw error; // 기타 에러는 Error Boundary로
  }
};

// 3. UI 레벨 에러 처리
const ProductDetail = ({ id }) => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductContent />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## 🎓 핵심 학습 내용

### 1. ISR의 본질 이해

- **정적 생성 + 점진적 갱신**: 빌드 타임의 이점과 런타임의 유연성 결합
- **태그 기반 무효화**: 세밀한 캐시 제어 가능
- **SWR 패턴**: Stale-While-Revalidate로 사용자 경험과 성능 양립

### 2. Next.js App Router 패턴

- **서버 컴포넌트 우선**: 기본적으로 서버에서 렌더링
- **선택적 클라이언트 컴포넌트**: 상태 관리가 필요한 부분만
- **Streaming과 Suspense**: 점진적 페이지 로딩

### 3. 에러 처리 전략

- **계층적 에러 처리**: API → 페이지 → UI 레벨
- **타입 안전성**: `unknown`에서 시작하여 점진적 타입 좁히기
- **사용자 중심**: 기술적 에러를 사용자 친화적 메시지로 변환

## 🚀 향후 개선 방향

1. **성능 모니터링**: Web Vitals 측정 및 최적화
2. **캐시 전략 고도화**: Edge 캐싱, CDN 활용
3. **타입 시스템 강화**: Zod를 활용한 런타임 검증
4. **테스트 코드**: 단위/통합/E2E 테스트 추가
5. **접근성**: ARIA 라벨, 키보드 네비게이션 개선

---

**개발 기간**: 3시간  
**주요 기술**: Next.js 14, ISR, TypeScript, Tailwind CSS  
**핵심 성과**: ISR 기반 상품 관리 시스템 구축 및 404 처리 완성
