import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TYPE_COLORS, TYPE_ID_TO_KOREAN_NAME, getEnglishTypeName } from "@/utils/dataTransforms";

interface DexTypeFilterProps {
  selectedTypes: number[];
  onTypesChange: (types: number[]) => void;
}

export function DexTypeFilter({ selectedTypes, onTypesChange }: DexTypeFilterProps) {
  const handleTypeToggle = (typeId: number) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter((id) => id !== typeId));
    } else {
      onTypesChange([...selectedTypes, typeId]);
    }
  };

  // 타입 ID 순서대로 정렬 (1: normal, 2: fighting, ...)
  const typeIds = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">타입</label>
      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
        {typeIds.map((typeId) => {
          const typeNameKorean = TYPE_ID_TO_KOREAN_NAME[typeId];
          const isSelected = selectedTypes.includes(typeId);

          return (
            <div key={typeId} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${typeId}`}
                checked={isSelected}
                onCheckedChange={() => handleTypeToggle(typeId)}
                className="h-3 w-3"
              />
              <Badge
                variant="secondary"
                className={`text-xs px-2 py-0.5 cursor-pointer hover:opacity-80 ${
                  TYPE_COLORS[getEnglishTypeName(typeNameKorean)]
                }`}
                onClick={() => handleTypeToggle(typeId)}
              >
                {typeNameKorean}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
