import type { Collection } from "./catalog";
export const GALLERY_ITEMS: Collection = {
  label: "사진과 작품",
  defaults: { title: "새 작품", category: "", src: "", alt: "", caption: "" },
  fields: [
    { key: "title", label: "제목", type: "text" },
    { key: "category", label: "분류", type: "text" },
    { key: "src", label: "이미지", type: "asset", assetKinds: ["image"] },
    { key: "alt", label: "대체 설명", type: "text" },
    { key: "caption", label: "캡션", type: "textarea" },
  ],
  initial: [
    { title: "시선의 시작", category: "Visual" },
    { title: "새로운 균형", category: "Design" },
    { title: "일상의 장면", category: "Editorial" },
  ],
};
export const HOTSPOT_ITEMS: Collection = {
  label: "이미지 설명 지점",
  defaults: {
    title: "살펴보기",
    body: "이 위치의 특징을 소개하세요.",
    x: 50,
    y: 50,
  },
  fields: [
    { key: "title", label: "이름", type: "text" },
    { key: "body", label: "설명", type: "textarea" },
    { key: "x", label: "가로 위치 · %", type: "number", min: 0, max: 100 },
    { key: "y", label: "세로 위치 · %", type: "number", min: 0, max: 100 },
  ],
  initial: [
    { title: "재료의 질감", x: 30, y: 40 },
    { title: "작은 디테일", x: 70, y: 65 },
  ],
};
