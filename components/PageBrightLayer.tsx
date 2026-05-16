/** GNB 아래 영역 전체에 밝은 레이어만 깔음 (레이아웃·폰트·크기 변경 없음) */
export function PageBrightLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 top-12 z-[1] bg-white/65 sm:top-14"
      aria-hidden
    />
  );
}
