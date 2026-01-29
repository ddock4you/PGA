import { Badge } from "@/components/ui/badge";
import { TYPE_COLORS, getKoreanTypeName } from "@/utils/dataTransforms";

interface TypeBadgeProps {
  typeNameEn: string;
  className?: string;
}

export function TypeBadge({ typeNameEn, className }: TypeBadgeProps) {
  const korean = getKoreanTypeName(typeNameEn);
  const colorClass = TYPE_COLORS[typeNameEn] ?? "bg-gray-400 text-white";

  return (
    <Badge className={`${colorClass} ${className ?? ""}`.trim()}>
      {korean}
    </Badge>
  );
}
