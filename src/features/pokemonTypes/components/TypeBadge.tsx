import { Badge } from "@/components/ui/badge";
import { getKoreanTypeName } from "@/utils/pokemonTypes";
import { getTypeBadgeClass } from "@/utils/typeBadge";

interface TypeBadgeProps {
  typeNameEn: string;
  className?: string;
}

export function TypeBadge({ typeNameEn, className }: TypeBadgeProps) {
  const korean = getKoreanTypeName(typeNameEn);
  const colorClass = getTypeBadgeClass(typeNameEn);

  return (
    <Badge className={`${colorClass} ${className ?? ""}`.trim()}>
      {korean}
    </Badge>
  );
}
