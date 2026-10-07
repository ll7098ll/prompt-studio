import Image from "next/image";
import { Plus } from "lucide-react";

export default function TemplateThumbnail({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  if (id === "blank" || id === "free-canvas")
    return (
      <div className="mini-blank">
        <Plus size={28} strokeWidth={1} />
      </div>
    );
  return (
    <Image
      className="b-template-thumbnail"
      src={`/template-previews/${id}.png`}
      alt={`${name} 화면 예시`}
      width={960}
      height={640}
      unoptimized
    />
  );
}
