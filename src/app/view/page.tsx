import type { Metadata } from "next";
import SharedViewer from "@/builder/SharedViewer";
import "@/builder/builder.css";
export const metadata: Metadata = {
  title: "공유 디자인 — Prompt Studio",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function ViewPage() {
  return <SharedViewer />;
}
