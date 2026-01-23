"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-center">
        <h1 className="text-2xl font-semibold">문제가 발생했습니다.</h1>
        <p className="text-sm text-muted-foreground">
          예기치 않은 오류로 인해 페이지를 표시할 수 없습니다. 화면을 다시 로드해 주세요.
        </p>
        <Button variant="outline" onClick={this.handleReload}>
          다시 시도
        </Button>
      </div>
    );
  }
}
