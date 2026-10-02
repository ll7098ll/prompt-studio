import type { Metadata } from "next";
import Workspace from "@/builder/Workspace";
import "@/builder/builder.css";

export const metadata: Metadata = {
  title: "Prompt Studio — 아이디어를 화면으로",
  description:
    "로그인 없이 UI를 조립하고, 테마를 디자인하고, AI 구현 프롬프트로 전달하세요.",
};
export default function StudioPage() {
  return <Workspace />;
}
