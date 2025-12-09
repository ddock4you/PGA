import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { SortOrder } from "../types/filterTypes";

interface DexSortOptionsProps {
  // 몸무게 정렬
  sortByWeight: boolean;
  weightOrder: SortOrder;
  onWeightSortChange: (enabled: boolean, order: SortOrder) => void;

  // 키 정렬
  sortByHeight: boolean;
  heightOrder: SortOrder;
  onHeightSortChange: (enabled: boolean, order: SortOrder) => void;

  // 도감번호 정렬
  sortByDexNumber: boolean;
  dexNumberOrder: SortOrder;
  onDexNumberSortChange: (enabled: boolean, order: SortOrder) => void;
}

export function DexSortOptions({
  sortByWeight,
  weightOrder,
  onWeightSortChange,
  sortByHeight,
  heightOrder,
  onHeightSortChange,
  sortByDexNumber,
  dexNumberOrder,
  onDexNumberSortChange,
}: DexSortOptionsProps) {
  return (
    <div className="space-y-4">
      {/* 몸무게 정렬 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sort-weight"
            checked={sortByWeight}
            onCheckedChange={(checked) => onWeightSortChange(checked as boolean, weightOrder)}
            className="h-3 w-3"
          />
          <Label htmlFor="sort-weight" className="text-xs font-medium text-muted-foreground">
            몸무게 정렬
          </Label>
        </div>
        {sortByWeight && (
          <RadioGroup
            value={weightOrder}
            onValueChange={(value) => onWeightSortChange(true, value as SortOrder)}
            className="ml-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="weight-desc" className="h-3 w-3" />
              <Label htmlFor="weight-desc" className="text-xs">
                무거운 순
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="weight-asc" className="h-3 w-3" />
              <Label htmlFor="weight-asc" className="text-xs">
                가벼운 순
              </Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* 키 정렬 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sort-height"
            checked={sortByHeight}
            onCheckedChange={(checked) => onHeightSortChange(checked as boolean, heightOrder)}
            className="h-3 w-3"
          />
          <Label htmlFor="sort-height" className="text-xs font-medium text-muted-foreground">
            키 순서 정렬
          </Label>
        </div>
        {sortByHeight && (
          <RadioGroup
            value={heightOrder}
            onValueChange={(value) => onHeightSortChange(true, value as SortOrder)}
            className="ml-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="height-desc" className="h-3 w-3" />
              <Label htmlFor="height-desc" className="text-xs">
                키 큰 순
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="height-asc" className="h-3 w-3" />
              <Label htmlFor="height-asc" className="text-xs">
                키 작은 순
              </Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* 도감번호 정렬 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sort-dex-number"
            checked={sortByDexNumber}
            onCheckedChange={(checked) => onDexNumberSortChange(checked as boolean, dexNumberOrder)}
            className="h-3 w-3"
          />
          <Label htmlFor="sort-dex-number" className="text-xs font-medium text-muted-foreground">
            도감번호 순
          </Label>
        </div>
        {sortByDexNumber && (
          <RadioGroup
            value={dexNumberOrder}
            onValueChange={(value) => onDexNumberSortChange(true, value as SortOrder)}
            className="ml-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="dex-asc" className="h-3 w-3" />
              <Label htmlFor="dex-asc" className="text-xs">
                번호 낮은 순
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="dex-desc" className="h-3 w-3" />
              <Label htmlFor="dex-desc" className="text-xs">
                번호 높은 순
              </Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
