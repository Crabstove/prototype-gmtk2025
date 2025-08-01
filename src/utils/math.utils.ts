export function lerp(start: number, end: number, t: number): number {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));
  return start + (end - start) * t;
}

export function moveTowards(current: number, target: number, maxDelta: number): number {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }
  return current + Math.sign(target - current) * maxDelta;
}