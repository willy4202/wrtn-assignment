export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "coffee-mug",
    name: "심플 머그컵",
    price: 7900,
    image: "https://picsum.photos/seed/coffee-mug/600/600",
    description: "아침 커피에 어울리는 350 ml 세라믹 머그컵",
  },
  {
    id: "notebook-a5",
    name: "A5 하드커버 노트",
    price: 5900,
    image: "https://picsum.photos/seed/notebook/600/600",
    description: "160페이지 도트 그리드, 데일리 플래너로도 활용 가능",
  },
  {
    id: "gel-pen-set",
    name: "젤 펜 3색 세트",
    price: 4500,
    image: "https://picsum.photos/seed/gel-pen/600/600",
    description: "0.38 mm · 블랙/블루/레드, 부드러운 필기감",
  },
  {
    id: "canvas-tote",
    name: "캔버스 토트백",
    price: 12900,
    image: "https://picsum.photos/seed/tote-bag/600/600",
    description: "무지 디자인 · 14 두툼한 원단 · 내부 포켓 포함",
  },
  {
    id: "desk-lamp",
    name: "LED 데스크 램프",
    price: 24900,
    image: "https://picsum.photos/seed/desk-lamp/600/600",
    description: "3단 밝기 조절 · USB‑C 충전 · 최대 8시간 사용",
  },
  {
    id: "wireless-mouse",
    name: "무선 블루투스 마우스",
    price: 18900,
    image: "https://picsum.photos/seed/mouse/600/600",
    description: "저소음 클릭 · 오토슬립 기능 · 2.4 GHz & Bluetooth 5.0",
  },
];
