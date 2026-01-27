import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

type QuizPlayScaffoldProps = {
  title: string;
  description?: string;
  isLoading: boolean;
  error: string | null;
  hasQuestion: boolean;
  loadingText?: string;
  emptyText?: string;
  children: ReactNode;
};

export function QuizPlayScaffold({
  title,
  description,
  isLoading,
  error,
  hasQuestion,
  loadingText = "문제를 준비하는 중입니다...",
  emptyText = "다음 문제를 준비하는 중입니다...",
  children,
}: QuizPlayScaffoldProps) {
  if (isLoading && !hasQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
          {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{loadingText}</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
          {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
          {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        </CardHeader>
      </Card>

      {children}
    </div>
  );
}
