import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getKoreanTypeName } from "@/utils/pokemonTypes";
import { getTypeBadgeClass } from "@/utils/typeBadge";
import type { QuizQuestion } from "../contexts/types";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  currentQuestion: number;
  totalQuestions: number;
  showPokemonTypes?: boolean;
}

export function QuizQuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  showPokemonTypes = true,
}: QuizQuestionCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* 진행 상황 */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              문제 {currentQuestion} / {totalQuestions}
            </div>
          </div>

          {/* 포켓몬 정보 (있는 경우) */}
          {question.pokemonData && (
            <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
              {question.pokemonData.sprite ? (
                <Image
                  src={question.pokemonData.sprite}
                  alt={question.pokemonData.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-20 h-20 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">이미지 없음</span>
                </div>
              )}

              <div className="text-center">
                <h3 className="font-semibold text-lg capitalize">
                  {question.pokemonData.name.replace(/-/g, " ")}
                </h3>
                {showPokemonTypes && question.pokemonData.types.length > 0 && (
                  <div className="flex gap-1 justify-center mt-2">
                    {question.pokemonData.types.map((type) => {
                      const koreanType = getKoreanTypeName(type);
                      return (
                        <Badge
                          key={type}
                          className={`capitalize text-xs ${getTypeBadgeClass(type)}`}
                        >
                          {koreanType}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 공격 타입 정보 (있는 경우) */}
          {question.attackType && (
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">공격 타입</div>
              <Badge variant="outline" className="capitalize">
                {question.attackType}
              </Badge>
            </div>
          )}

          {/* 문제 텍스트 */}
          <div className="text-center">
            <p className="text-lg font-medium">{question.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
