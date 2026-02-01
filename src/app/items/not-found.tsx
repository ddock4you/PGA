export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-semibold">도구를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">요청하신 도구가 존재하지 않거나 삭제되었습니다.</p>
      </div>
    </div>
  );
}
